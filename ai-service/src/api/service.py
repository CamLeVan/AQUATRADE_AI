"""Orchestration: 1 job từ lúc nhận đến khi gửi webhook.

Flow (Sprint 2 - sync tạm thời, Sprint 3 sẽ wrap bằng Arq worker):
    1. Download video từ videoUrl → file tạm
    2. Gọi pipeline.analyze_video() (blocking) qua asyncio.to_thread
       để không block event loop của FastAPI
    3. (TODO Sprint 3) Upload annotated video lên S3/MinIO, lấy URL
    4. Build WebhookPayload → gửi về BE qua webhook.send_webhook
    5. Lưu kết quả vào JobStore

Mọi lỗi trung gian đều được catch và mark job FAILED với error message.
"""
from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timezone
from urllib.parse import urlparse

import httpx

from .schemas import JobStatus, WebhookPayload
from .settings import Settings, get_settings
from .store import JobStore, get_store
from .webhook import WebhookDeliveryError, send_webhook

logger = logging.getLogger(__name__)


async def download_video(url: str, dest_path: str, settings: Settings) -> int:
    """Stream download video về `dest_path`, trả về số byte đã ghi."""
    os.makedirs(os.path.dirname(os.path.abspath(dest_path)) or ".", exist_ok=True)
    max_bytes = settings.max_video_size_mb * 1024 * 1024
    written = 0

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
                fw.write(chunk)
        return written

    async with httpx.AsyncClient(timeout=settings.video_download_timeout_seconds) as client:
        async with client.stream("GET", url) as resp:
            resp.raise_for_status()
            with open(dest_path, "wb") as fw:
                async for chunk in resp.aiter_bytes(chunk_size=1024 * 1024):
                    written += len(chunk)
                    if written > max_bytes:
                        raise ValueError(f"Video vượt {settings.max_video_size_mb}MB")
                    fw.write(chunk)
    return written


def _suggested_filename(url: str, ticket_id: str) -> str:
    base = os.path.basename(urlparse(url).path) or f"{ticket_id}.mp4"
    if not base.lower().endswith((".mp4", ".mov", ".avi", ".mkv")):
        base = f"{ticket_id}.mp4"
    return f"{ticket_id}_{base}"


async def process_job(ticket_id: str) -> None:
    """Chạy 1 job end-to-end. KHÔNG raise ra ngoài (dùng trong BackgroundTasks).

    Mọi exception đều được catch và lưu thành error trong store.
    """
    settings = get_settings()
    store = get_store()
    job = await store.get(ticket_id)
    if job is None:
        logger.error("process_job: ticket not found: %s", ticket_id)
        return

    await store.mark_processing(ticket_id)
    logger.info("Job start: ticket=%s order=%s url=%s", ticket_id, job.order_id, job.video_url)

    incoming_path = os.path.join(
        settings.video_download_dir, _suggested_filename(job.video_url, ticket_id),
    )
    annotated_path = os.path.join(
        settings.annotated_output_dir, f"{ticket_id}_annotated.mp4",
    )

    try:
        await download_video(job.video_url, incoming_path, settings)
        logger.info("Video downloaded: %s", incoming_path)

        # Gọi analyze_video blocking trong thread khác để không chặn event loop
        result = await asyncio.to_thread(
            _run_pipeline,
            video_path=incoming_path,
            annotated_output=annotated_path,
            fish_profile=job.fish_profile or settings.default_fish_profile,
            settings=settings,
        )

        # TODO Sprint 3: upload annotated_path lên S3/MinIO → lấy URL thật
        result_video_url = f"file://{os.path.abspath(annotated_path)}"

        payload = WebhookPayload(
            ticket_id=ticket_id,
            order_id=job.order_id,
            fish_count=int(result.fish_count),
            health_score=float(result.health_score),
            result_video_url=result_video_url,
            timestamp=datetime.now(timezone.utc),
        )

        try:
            ack = await send_webhook(
                payload, callback_url=job.callback_url, settings=settings,
            )
            logger.info("Webhook ack: ticket=%s ack=%s", ticket_id, ack)
        except WebhookDeliveryError as e:
            # Job đã xử lý xong nhưng BE không nhận được. Lưu lại để BE polling.
            logger.warning("Webhook failed, storing result for polling: %s", e)

        await store.mark_done(ticket_id, result.to_dict())
        logger.info("Job done: ticket=%s fishCount=%d", ticket_id, result.fish_count)

    except Exception as exc:  # noqa: BLE001 - muốn bắt mọi lỗi để mark fail
        logger.exception("Job failed: ticket=%s", ticket_id)
        await store.mark_failed(ticket_id, f"{type(exc).__name__}: {exc}")
    finally:
        if os.path.isfile(incoming_path):
            try:
                os.remove(incoming_path)
            except OSError:
                pass


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
    "JobStore",
]
