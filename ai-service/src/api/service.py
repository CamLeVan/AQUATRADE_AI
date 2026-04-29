"""Orchestration: 1 job từ lúc nhận đến khi gửi webhook.

Flow hiện tại (Sprint 3.1):
    1. Download video từ videoUrl -> file tạm + tính SHA-256 (audit/dispute)
    2. Lưu hash vào JobStore + log
    3. Gọi pipeline.analyze_video() (blocking) qua asyncio.to_thread
    4. (optional) Upload annotated video lên MinIO -> presigned URL
    5. Build WebhookPayload (kèm originalVideoHash) -> gửi BE qua webhook
    6. Lưu kết quả vào JobStore (DONE/FAILED)
    7. Xóa file gốc data/incoming/ để tiết kiệm disk

Mọi lỗi trung gian đều được catch và mark job FAILED với error message.

Sprint 4 thêm: structured logging với context ticket_id/order_id, và
Prometheus metrics counters/histograms.
"""
from __future__ import annotations

import asyncio
import hashlib
import os
import time
from datetime import datetime, timezone
from urllib.parse import urlparse

import httpx

from . import metrics
from .logging_config import bind_context, clear_context, get_logger
from .schemas import WebhookPayload
from .settings import Settings, get_settings
from .storage import upload_annotated_video
from .store import get_store
from .webhook import WebhookDeliveryError, send_webhook

logger = get_logger(__name__)


async def download_video(
    url: str,
    dest_path: str,
    settings: Settings,
) -> tuple[int, str]:
    """Stream download video về `dest_path`, đồng thời tính SHA-256.

    Returns:
        (bytes_written, hex_sha256). Hash dùng cho `originalVideoHash` webhook.
    """
    os.makedirs(os.path.dirname(os.path.abspath(dest_path)) or ".", exist_ok=True)
    max_bytes = settings.max_video_size_mb * 1024 * 1024
    written = 0
    hasher = hashlib.sha256()

    if url.startswith("file://"):
        src = url[len("file://"):]
        if not os.path.isfile(src):
            raise FileNotFoundError(f"Local video not found: {src}")
        with open(src, "rb") as fr, open(dest_path, "wb") as fw:
            while True:
                chunk = fr.read(1024 * 1024)
                if not chunk:
                    break
                written += len(chunk)
                if written > max_bytes:
                    raise ValueError(f"Video vượt {settings.max_video_size_mb}MB")
                hasher.update(chunk)
                fw.write(chunk)
        return written, hasher.hexdigest()

    async with httpx.AsyncClient(timeout=settings.video_download_timeout_seconds) as client:
        async with client.stream("GET", url) as resp:
            resp.raise_for_status()
            with open(dest_path, "wb") as fw:
                async for chunk in resp.aiter_bytes(chunk_size=1024 * 1024):
                    written += len(chunk)
                    if written > max_bytes:
                        raise ValueError(f"Video vượt {settings.max_video_size_mb}MB")
                    hasher.update(chunk)
                    fw.write(chunk)
    return written, hasher.hexdigest()


def _suggested_filename(url: str, ticket_id: str) -> str:
    base = os.path.basename(urlparse(url).path) or f"{ticket_id}.mp4"
    if not base.lower().endswith((".mp4", ".mov", ".avi", ".mkv")):
        base = f"{ticket_id}.mp4"
    return f"{ticket_id}_{base}"


async def process_job(ticket_id: str) -> None:
    """Chạy 1 job end-to-end. KHÔNG raise ra ngoài (dùng cho BackgroundTasks/Arq).

    Mọi exception đều được catch và lưu thành error trong store.
    """
    settings = get_settings()
    store = get_store()
    job = await store.get(ticket_id)
    if job is None:
        logger.error("ticket_not_found", ticket_id=ticket_id)
        return

    bind_context(ticket_id=ticket_id, order_id=job.order_id)
    log = logger.bind(ticket_id=ticket_id, order_id=job.order_id)

    await store.mark_processing(ticket_id)
    log.info("job_start", video_url=job.video_url, fish_profile=job.fish_profile)
    job_start_ts = time.perf_counter()

    incoming_path = os.path.join(
        settings.video_download_dir, _suggested_filename(job.video_url, ticket_id),
    )
    annotated_path = os.path.join(
        settings.annotated_output_dir, f"{ticket_id}_annotated.mp4",
    )

    try:
        # ----- Bước 1: download + hash -----
        bytes_written, video_hash = await download_video(
            job.video_url, incoming_path, settings,
        )
        await store.update_video_hash(ticket_id, video_hash)
        await store.update_progress(ticket_id, 0.15)
        log.info("video_downloaded", bytes=bytes_written, sha256=video_hash)

        # ----- Bước 2: chạy pipeline (blocking trong thread) -----
        result = await asyncio.to_thread(
            _run_pipeline,
            video_path=incoming_path,
            annotated_output=annotated_path,
            fish_profile=job.fish_profile or settings.default_fish_profile,
            settings=settings,
        )
        await store.update_progress(ticket_id, 0.85)
        log.info(
            "pipeline_done",
            fish_count=int(result.fish_count),
            health_score=float(result.health_score),
            processed_frames=int(getattr(result, "processed_frames", 0)),
        )

        # ----- Bước 3: upload annotated lên MinIO nếu bật -----
        if settings.object_storage_enabled:
            result_video_url = await asyncio.to_thread(
                upload_annotated_video, annotated_path, ticket_id, settings,
            )
            log.info("storage_upload_ok", url=result_video_url)
        else:
            result_video_url = f"file://{os.path.abspath(annotated_path)}"

        # ----- Bước 4: webhook về BE -----
        payload = WebhookPayload(
            ticket_id=ticket_id,
            order_id=job.order_id,
            fish_count=int(result.fish_count),
            health_score=float(result.health_score),
            result_video_url=result_video_url,
            timestamp=datetime.now(timezone.utc),
            original_video_hash=video_hash,
        )

        try:
            ack = await send_webhook(
                payload, callback_url=job.callback_url, settings=settings,
            )
            metrics.webhook_delivery.labels(outcome="success").inc()
            log.info("webhook_ack", ack=ack)
        except WebhookDeliveryError as e:
            # Job đã xử lý xong nhưng BE không nhận được -> BE polling fallback.
            metrics.webhook_delivery.labels(outcome="failed").inc()
            log.warning("webhook_failed_storing_for_polling", error=str(e))

        # ----- Bước 5: chốt DONE -----
        await store.mark_done(ticket_id, result.to_dict())
        elapsed = time.perf_counter() - job_start_ts
        metrics.jobs_processed.labels(outcome="done").inc()
        metrics.job_processing_seconds.observe(elapsed)
        metrics.job_fish_count.observe(float(result.fish_count))
        metrics.job_health_score.observe(float(result.health_score))
        log.info(
            "job_done",
            fish_count=int(result.fish_count),
            health_score=round(float(result.health_score), 1),
            elapsed_seconds=round(elapsed, 2),
        )

    except Exception as exc:  # noqa: BLE001 - bắt mọi lỗi để mark fail
        metrics.jobs_processed.labels(outcome="failed").inc()
        log.exception("job_failed", error=str(exc), error_type=type(exc).__name__)
        await store.mark_failed(ticket_id, f"{type(exc).__name__}: {exc}")
    finally:
        # Xóa video gốc để tiết kiệm disk (theo nghiệp vụ Bước 5).
        if os.path.isfile(incoming_path):
            try:
                os.remove(incoming_path)
            except OSError:
                pass
        clear_context()


def _run_pipeline(
    *,
    video_path: str,
    annotated_output: str,
    fish_profile: str,
    settings: Settings,
):
    """Wrap pipeline.analyze_video. Import trễ để TestClient không cần ultralytics."""
    from ..core.pipeline import analyze_video
    from ..core.types import PipelineConfig

    config = PipelineConfig(
        fish_profile=fish_profile,
        max_duration_seconds=settings.max_video_duration_seconds,
        min_duration_seconds=settings.min_video_duration_seconds,
        patience_seconds=settings.smart_stop_patience_seconds,
        write_annotated_video=True,
        annotated_output_path=annotated_output,
        model_path=settings.model_path,
        model_version=settings.model_version,
    )
    return analyze_video(video_path, config)


__all__ = [
    "download_video",
    "process_job",
]
