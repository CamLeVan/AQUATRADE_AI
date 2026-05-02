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
from .schemas import AiResultPayload
from .settings import Settings, get_settings
from .storage import upload_annotated_video
from .store import get_store
from .webhook import WebhookDeliveryError, send_webhook

logger = get_logger(__name__)


class VideoValidationError(ValueError):
    """Raised khi videoUrl/Content-Type/size không hợp lệ."""


def _validate_url_host(url: str, settings: Settings) -> None:
    """Sprint 5: nếu allowed_video_hosts được cấu hình -> chỉ cho phép các host này."""
    if not settings.allowed_video_hosts:
        return  # dev: cho phép mọi host
    if url.startswith("file://"):
        return  # file:// không có host concept
    host = urlparse(url).hostname or ""
    allowed = {h.lower() for h in settings.allowed_video_hosts}
    if host.lower() not in allowed:
        raise VideoValidationError(
            f"videoUrl host '{host}' không nằm trong allowed_video_hosts"
        )


def _validate_content_type(content_type: str | None, settings: Settings) -> None:
    if not content_type:
        return  # nhiều CDN không trả Content-Type, đành cho qua
    ct = content_type.split(";", 1)[0].strip().lower()
    for prefix in settings.allowed_video_mime_prefixes:
        if ct.startswith(prefix.lower()):
            return
    raise VideoValidationError(f"Content-Type '{ct}' không phải video hợp lệ")


async def download_video(
    url: str,
    dest_path: str,
    settings: Settings,
) -> tuple[int, str]:
    """Stream download video về `dest_path`, đồng thời tính SHA-256.

    Returns:
        (bytes_written, hex_sha256). Hash dùng cho `originalVideoHash` webhook.

    Raises:
        VideoValidationError: URL host / MIME / size không hợp lệ.
    """
    _validate_url_host(url, settings)

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
                    raise VideoValidationError(
                        f"Video vượt {settings.max_video_size_mb}MB"
                    )
                hasher.update(chunk)
                fw.write(chunk)
        return written, hasher.hexdigest()

    async with httpx.AsyncClient(timeout=settings.video_download_timeout_seconds) as client:
        async with client.stream("GET", url) as resp:
            resp.raise_for_status()
            # Sprint 5: validate Content-Type sớm trước khi stream toàn bộ.
            _validate_content_type(resp.headers.get("content-type"), settings)
            # Validate Content-Length nếu server có trả - reject sớm khi quá lớn.
            cl = resp.headers.get("content-length")
            if cl and cl.isdigit() and int(cl) > max_bytes:
                raise VideoValidationError(
                    f"Content-Length {cl} vượt {settings.max_video_size_mb}MB"
                )
            with open(dest_path, "wb") as fw:
                async for chunk in resp.aiter_bytes(chunk_size=1024 * 1024):
                    written += len(chunk)
                    if written > max_bytes:
                        raise VideoValidationError(
                            f"Video vượt {settings.max_video_size_mb}MB"
                        )
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

    bind_context(ticket_id=ticket_id, order_id=job.order_id, proof_id=job.proof_id)
    log = logger.bind(
        ticket_id=ticket_id, order_id=job.order_id, proof_id=job.proof_id,
    )

    await store.mark_processing(ticket_id)
    log.info("job_start", video_url=job.video_url, fish_profile=job.fish_profile)
    job_start_ts = time.perf_counter()

    incoming_path = os.path.join(
        settings.video_download_dir, _suggested_filename(job.video_url, ticket_id),
    )
    annotated_path = os.path.join(
        settings.annotated_output_dir, f"{ticket_id}_annotated.mp4",
    )
    best_frame_path = os.path.join(
        settings.annotated_output_dir, f"{ticket_id}_best_frame.jpg",
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
            best_frame_output=best_frame_path,
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

        # ----- Bước 3: upload "best frame" image lên Cloudinary -----
        # BE develop dùng `aiImageUrl` (1 ảnh có bounding box) làm bằng chứng public.
        # Annotated video cũng được upload song song nếu MinIO enabled.
        ai_image_url = await _upload_best_frame(
            best_frame_path, ticket_id, settings, log,
        )

        # ----- Bước 4: build AiResultPayload theo BE schema -----
        smart_stop_triggered = bool(
            getattr(result, "extras", {}).get("smartStopTriggered", True)
        )
        quality_status: str = (
            "NORMAL" if smart_stop_triggered and bytes_written > 0 else "LOW"
        )
        ai_notes_parts: list[str] = []
        if not smart_stop_triggered:
            ai_notes_parts.append("smart_stop_not_triggered")
        if int(getattr(result, "dead_fish_count", 0)) > 0:
            ai_notes_parts.append(
                f"dead_fish_detected={result.dead_fish_count}"
            )
        # Sprint 7-LITE: ghi model_version + sha256 (8 ký tự đầu) cho audit dispute.
        # Dispute: query DigitalProof.aiNotes -> biết model nào đã đếm đơn này.
        model_sha = _get_model_sha256()
        model_tag = f"model={settings.model_version}"
        if model_sha:
            model_tag += f",sha={model_sha[:16]}"
        ai_notes_parts.append(model_tag)
        ai_notes = "; ".join(ai_notes_parts) or None

        payload = AiResultPayload(
            status="DONE",
            order_id=job.order_id,
            ai_fish_count=int(result.fish_count),
            health_score=int(round(float(result.health_score))),
            quality_status=quality_status,
            ai_image_url=ai_image_url,
            proof_hash=video_hash,
            ai_notes=ai_notes,
            created_at=datetime.now(timezone.utc),
        )

        if not job.callback_url:
            log.error("missing_callback_url")
            raise ValueError("BE phải cung cấp callbackUrl khi gọi /ai/v1/jobs")

        try:
            ack = await send_webhook(
                payload, callback_url=job.callback_url, settings=settings,
            )
            metrics.webhook_delivery.labels(outcome="success").inc()
            log.info("webhook_ack", ack=ack)
        except WebhookDeliveryError as e:
            # Job đã xử lý xong nhưng BE không nhận được. BE có cleanup task
            # 10 phút sẽ tự mark FAILED nên không dead-letter ngay.
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

    except Exception as exc:  # noqa: BLE001 - bắt mọi lỗi để mark fail / retry
        await _handle_job_failure(
            store=store,
            settings=settings,
            ticket_id=ticket_id,
            order_id=job.order_id,
            callback_url=job.callback_url,
            exc=exc,
            log=log,
        )
    finally:
        # Xóa video gốc để tiết kiệm disk (theo nghiệp vụ Bước 5).
        if os.path.isfile(incoming_path):
            try:
                os.remove(incoming_path)
            except OSError:
                pass
        clear_context()


# ---------------------------------------------------------------------------
# Sprint 5: retry policy + dead-letter
# ---------------------------------------------------------------------------

# Các lỗi rõ ràng do payload sai -> không retry, fail ngay (terminal).
_TERMINAL_EXCEPTIONS = (VideoValidationError, FileNotFoundError, ValueError)


def _is_retryable_pipeline_error(exc: BaseException) -> bool:
    if isinstance(exc, _TERMINAL_EXCEPTIONS):
        return False
    return True


async def _handle_job_failure(
    *,
    store,
    settings: Settings,
    ticket_id: str,
    order_id: str,
    callback_url: str | None,
    exc: BaseException,
    log,
) -> None:
    attempts = await store.increment_attempts(ticket_id)
    error_msg = f"{type(exc).__name__}: {exc}"
    log.exception(
        "job_failed",
        error=error_msg,
        error_type=type(exc).__name__,
        attempts=attempts,
        max_attempts=settings.job_max_attempts,
    )

    retryable = _is_retryable_pipeline_error(exc)
    if retryable and attempts < settings.job_max_attempts:
        # Schedule re-run sau delay. Background task: tạo task asyncio mới.
        delay = settings.job_retry_delay_seconds
        log.warning("job_retry_scheduled", delay_seconds=delay, attempt=attempts + 1)
        metrics.jobs_processed.labels(outcome="retry").inc()
        asyncio.create_task(_retry_after_delay(ticket_id, delay))
        return

    # Hết retries hoặc lỗi terminal -> mark FAILED + dead-letter + callback BE.
    metrics.jobs_processed.labels(outcome="failed").inc()
    await store.mark_failed(ticket_id, error_msg)

    # Gửi callback FAILED cho BE (BE develop expect status="FAILED" + errorMessage).
    if callback_url:
        try:
            fail_payload = AiResultPayload(
                status="FAILED",
                order_id=order_id,
                error_message=error_msg,
                created_at=datetime.now(timezone.utc),
            )
            await send_webhook(
                fail_payload, callback_url=callback_url, settings=settings,
            )
            log.info("failed_callback_sent")
        except WebhookDeliveryError as wdx:
            log.warning("failed_callback_delivery_failed", error=str(wdx))

    if settings.dead_letter_enabled:
        try:
            await store.push_dead_letter(ticket_id, error_msg)
            log.error("job_dead_lettered", reason=error_msg)
        except Exception as dl_exc:  # noqa: BLE001
            log.error("dead_letter_push_failed", error=str(dl_exc))


async def _retry_after_delay(ticket_id: str, delay: float) -> None:
    """Sleep rồi gọi lại process_job. Dùng cho queue_backend=background."""
    try:
        await asyncio.sleep(max(0.0, float(delay)))
        await process_job(ticket_id)
    except Exception:  # noqa: BLE001
        # Lỗi đã được catch trong process_job rồi.
        pass


def _run_pipeline(
    *,
    video_path: str,
    annotated_output: str,
    best_frame_output: str,
    fish_profile: str,
    settings: Settings,
):
    """Wrap pipeline.analyze_video. Import trễ để TestClient không cần ultralytics.

    `best_frame_output` là path file JPG (1 frame "đẹp nhất" + bounding box)
    để upload Cloudinary làm `aiImageUrl` cho BE.
    """
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
    # PipelineConfig optional field; pipeline.py sẽ tự lưu best frame nếu attr exists.
    setattr(config, "best_frame_output_path", best_frame_output)
    return analyze_video(video_path, config)


async def _upload_best_frame(
    local_path: str,
    ticket_id: str,
    settings: Settings,
    log,
) -> str:
    """Upload best-frame JPG lên Cloudinary và trả secure_url.

    Nếu Cloudinary chưa enable → trả file:// local URL (dev mode).
    """
    if not settings.cloudinary_enabled:
        if not os.path.isfile(local_path):
            return ""
        return f"file://{os.path.abspath(local_path)}"

    if not os.path.isfile(local_path):
        log.warning("best_frame_missing_skip_upload", path=local_path)
        return ""

    from .cloudinary_uploader import upload_image_public

    try:
        url = await asyncio.to_thread(
            upload_image_public, local_path, ticket_id, settings,
        )
        log.info("cloudinary_image_uploaded", url=url)
        return url
    except Exception as exc:  # noqa: BLE001
        log.error("cloudinary_upload_failed", error=str(exc))
        # Fallback: trả file path local. BE thấy URL local sẽ biết Cloudinary fail.
        return f"file://{os.path.abspath(local_path)}"


def _get_model_sha256() -> str | None:
    """Sprint 7-LITE: lấy SHA-256 model đã compute lúc startup từ main module.

    Lazy import để tránh circular import.
    """
    try:
        from . import main as main_module
        return main_module._MODEL_STATE.get("sha256")  # type: ignore[no-any-return]
    except Exception:  # noqa: BLE001
        return None


__all__ = [
    "download_video",
    "process_job",
]
