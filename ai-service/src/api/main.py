"""FastAPI app cho AquaTrade AI service.

Chạy dev:
    uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000

Chạy prod (ví dụ):
    uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 2

Sprint 2 giới hạn: job chạy qua FastAPI BackgroundTasks (trong cùng
process). Khi concurrent nhiều request → block nhau. Sprint 3 sẽ thay
bằng Arq worker + Redis để scale ngang.
"""
from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncIterator

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .deps import require_internal_secret
from .queue import enqueue_job
from .schemas import (
    ApiResponse,
    ErrorResponse,
    HealthResponse,
    JobAcceptedResponse,
    JobRequest,
    JobStatus,
    JobStatusResponse,
    ModelInfo,
    ModelListResponse,
)
from .service import process_job
from .settings import Settings, get_settings
from .store import get_store

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

START_TIME = time.monotonic()
# Chỉ lưu trạng thái runtime (đã load model chưa). `version` lấy từ settings
# ở request-time để tránh phụ thuộc lifespan (TestClient đôi khi skip lifespan).
_MODEL_STATE: dict[str, object] = {"loaded": False}


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    logger.info(
        "Starting %s %s (env=%s)",
        settings.app_name, settings.app_version, settings.environment,
    )

    # Warm-up model nếu có. Fail-soft: service vẫn chạy, health = DEGRADED.
    try:
        await _warmup_model(settings)
        _MODEL_STATE["loaded"] = True
        logger.info("Model loaded: %s", settings.model_path)
    except Exception as e:  # noqa: BLE001
        _MODEL_STATE["loaded"] = False
        logger.warning("Model not loaded at startup (will still accept jobs): %s", e)

    yield
    logger.info("Shutting down %s", settings.app_name)


async def _warmup_model(settings: Settings) -> None:
    """Load YOLO model để tránh cold-start khi có request đầu tiên."""
    import asyncio
    import os

    if not os.path.isfile(settings.model_path):
        raise FileNotFoundError(f"Model not found: {settings.model_path}")

    def _load() -> None:
        from ultralytics import YOLO  # noqa: F401 - warmup only
        _ = YOLO(settings.model_path)

    await asyncio.to_thread(_load)


# ---------------------------------------------------------------------------
# Exception handlers - trả format khớp §1 Global Error Schema của BE
# ---------------------------------------------------------------------------

def _register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def _http_exc(request: Request, exc: HTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(message=str(exc.detail)).model_dump(),
        )

    @app.exception_handler(RequestValidationError)
    async def _validation_exc(request: Request, exc: RequestValidationError) -> JSONResponse:
        msg = "; ".join(
            f"{'.'.join(str(p) for p in e['loc'])}: {e['msg']}" for e in exc.errors()
        )
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=ErrorResponse(message=f"Validation error: {msg}").model_dump(),
        )

    @app.exception_handler(Exception)
    async def _generic_exc(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception on %s", request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ErrorResponse(message=f"Internal error: {type(exc).__name__}").model_dump(),
        )


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI service cho AquaTrade. Nhận video → đếm cá → webhook về BE.",
        lifespan=lifespan,
    )
    _register_exception_handlers(app)

    # ---- Health (public) ----
    @app.get(
        "/ai/v1/health",
        response_model=ApiResponse[HealthResponse],
        response_model_by_alias=True,
        tags=["health"],
    )
    async def health(
        settings: Settings = Depends(get_settings),
    ) -> ApiResponse[HealthResponse]:
        store = get_store()
        pending = await store.count_pending()
        data = HealthResponse(
            status="UP" if _MODEL_STATE["loaded"] else "DEGRADED",
            app_name=settings.app_name,
            app_version=settings.app_version,
            model_loaded=bool(_MODEL_STATE["loaded"]),
            model_version=settings.model_version,
            uptime_seconds=time.monotonic() - START_TIME,
            pending_jobs=pending,
        )
        return ApiResponse(data=data)

    # ---- Models list (internal) ----
    @app.get(
        "/ai/v1/models",
        response_model=ApiResponse[ModelListResponse],
        response_model_by_alias=True,
        tags=["models"],
        dependencies=[Depends(require_internal_secret)],
    )
    async def list_models(
        settings: Settings = Depends(get_settings),
    ) -> ApiResponse[ModelListResponse]:
        active = settings.model_version
        loaded_at = datetime.now(timezone.utc) if _MODEL_STATE["loaded"] else None
        info = ModelInfo(
            version=active, path=settings.model_path,
            active=True, loaded_at=loaded_at,
        )
        return ApiResponse(data=ModelListResponse(
            active_version=active, models=[info],
        ))

    # ---- Submit job (internal) ----
    @app.post(
        "/ai/v1/jobs",
        response_model=ApiResponse[JobAcceptedResponse],
        response_model_by_alias=True,
        status_code=status.HTTP_202_ACCEPTED,
        tags=["jobs"],
        dependencies=[Depends(require_internal_secret)],
    )
    async def submit_job(
        request: JobRequest,
        background: BackgroundTasks,
        settings: Settings = Depends(get_settings),
    ) -> ApiResponse[JobAcceptedResponse]:
        store = get_store()
        record, is_new = await store.create_or_get_active(
            order_id=request.order_id,
            video_url=request.video_url,
            callback_url=request.callback_url,
            fish_profile=request.fish_profile,
            expected_count=request.expected_count,
        )

        if is_new:
            mode = await enqueue_job(record.ticket_id, settings)
            if mode == "background":
                # giữ tương thích cũ khi queue_backend=background
                background.add_task(process_job, record.ticket_id)
            logger.info(
                "Job queued: ticket=%s order=%s mode=%s",
                record.ticket_id,
                record.order_id,
                mode,
            )
        else:
            logger.info(
                "Job idempotent hit: orderId=%s already has ticket=%s status=%s",
                record.order_id, record.ticket_id, record.status.value,
            )

        data = JobAcceptedResponse(
            ticket_id=record.ticket_id,
            status=record.status,
            accepted_at=record.created_at,
            estimated_seconds=settings.max_video_duration_seconds,
        )
        return ApiResponse(
            message="Job accepted" if is_new else "Job already in progress",
            data=data,
        )

    # ---- Get job status (internal) ----
    @app.get(
        "/ai/v1/jobs/{ticket_id}",
        response_model=ApiResponse[JobStatusResponse],
        response_model_by_alias=True,
        tags=["jobs"],
        dependencies=[Depends(require_internal_secret)],
    )
    async def get_job(ticket_id: str) -> ApiResponse[JobStatusResponse]:
        store = get_store()
        job = await store.get(ticket_id)
        if job is None:
            raise HTTPException(status_code=404, detail=f"Ticket not found: {ticket_id}")

        data = JobStatusResponse(
            ticket_id=job.ticket_id,
            order_id=job.order_id,
            status=JobStatus(job.status),
            progress=job.progress,
            created_at=job.created_at,
            started_at=job.started_at,
            completed_at=job.completed_at,
            result=job.result,
            error=job.error,
        )
        return ApiResponse(data=data)

    # ---- Root redirect ----
    @app.get("/", include_in_schema=False)
    async def root() -> dict[str, str]:
        return {"service": settings.app_name, "version": settings.app_version, "docs": "/docs"}

    return app


app = create_app()
