"""FastAPI app cho AquaTrade AI service.

Chạy dev:
    uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000

Chạy prod (ví dụ):
    uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 2

Sprint 4 thêm:
    * Structured logging (structlog JSON ở prod, console ở dev)
    * Prometheus /metrics endpoint
    * Health check chi tiết (Redis ping, MinIO ping, model loaded)
"""
from __future__ import annotations

import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncIterator

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response

from . import metrics
from .deps import require_internal_secret
from .logging_config import configure_logging, get_logger
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

configure_logging()
logger = get_logger(__name__)


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
        "service_starting",
        app=settings.app_name,
        version=settings.app_version,
        env=settings.environment,
        queue_backend=settings.queue_backend,
        store_backend=settings.job_store_backend,
        storage_enabled=settings.object_storage_enabled,
    )

    # Warm-up model nếu có. Fail-soft: service vẫn chạy, health = DEGRADED.
    try:
        await _warmup_model(settings)
        _MODEL_STATE["loaded"] = True
        logger.info("model_loaded", path=settings.model_path,
                    version=settings.model_version)
    except Exception as e:  # noqa: BLE001
        _MODEL_STATE["loaded"] = False
        logger.warning("model_not_loaded", error=str(e), path=settings.model_path)

    yield
    logger.info("service_shutting_down", app=settings.app_name)


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
# Health checks (Sprint 4)
# ---------------------------------------------------------------------------

async def _check_redis(settings: Settings) -> tuple[str, str | None]:
    """Ping Redis. Trả ('UP'|'DOWN', error_msg)."""
    if settings.job_store_backend != "redis" and settings.queue_backend != "arq":
        return "DISABLED", None
    try:
        from redis.asyncio import Redis
        r = Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            db=settings.redis_db,
            password=settings.redis_password,
            ssl=settings.redis_ssl,
        )
        await r.ping()
        await r.close()
        return "UP", None
    except Exception as e:  # noqa: BLE001
        return "DOWN", f"{type(e).__name__}: {e}"


def _check_minio(settings: Settings) -> tuple[str, str | None]:
    """Check MinIO connectivity (sync). Trả ('UP'|'DOWN'|'DISABLED')."""
    if not settings.object_storage_enabled:
        return "DISABLED", None
    try:
        from minio import Minio
        client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_secure,
        )
        # bucket_exists ép connect tới MinIO server
        client.bucket_exists(settings.minio_bucket)
        return "UP", None
    except Exception as e:  # noqa: BLE001
        return "DOWN", f"{type(e).__name__}: {e}"


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
    app.add_middleware(metrics.PrometheusMiddleware)

    # ---- Metrics (public, prometheus scrape) ----
    @app.get("/metrics", include_in_schema=False)
    async def metrics_endpoint() -> Response:
        body, content_type = metrics.render_metrics()
        return Response(content=body, media_type=content_type)

    # ---- Health (public, chi tiết) ----
    @app.get(
        "/ai/v1/health",
        response_model=ApiResponse[HealthResponse],
        response_model_by_alias=True,
        tags=["health"],
    )
    async def health(
        settings: Settings = Depends(get_settings),
    ) -> ApiResponse[HealthResponse]:
        from .schemas import DependencyStatus

        store = get_store()
        pending = await store.count_pending()

        # Reflect pending count vào Prometheus gauge mỗi lần health check.
        metrics.jobs_pending.set(pending)

        # Check deps song song
        redis_status, redis_err = await _check_redis(settings)
        # MinIO sync, chạy thread
        import asyncio
        minio_status, minio_err = await asyncio.to_thread(_check_minio, settings)

        deps = {
            "model": DependencyStatus(
                status="UP" if _MODEL_STATE["loaded"] else "DOWN",
                error=None if _MODEL_STATE["loaded"] else "model not loaded",
            ),
            "redis": DependencyStatus(status=redis_status, error=redis_err),
            "minio": DependencyStatus(status=minio_status, error=minio_err),
        }

        # Overall status:
        #   DOWN     - infra critical (Redis/MinIO) UP-required nhưng đang DOWN
        #   DEGRADED - infra OK nhưng model chưa load (không thể inference)
        #   UP       - mọi thứ sẵn sàng
        infra_down = any(
            deps[name].status == "DOWN" for name in ("redis", "minio")
        )
        if infra_down:
            overall = "DOWN"
        elif not _MODEL_STATE["loaded"]:
            overall = "DEGRADED"
        else:
            overall = "UP"

        data = HealthResponse(
            status=overall,
            app_name=settings.app_name,
            app_version=settings.app_version,
            model_loaded=bool(_MODEL_STATE["loaded"]),
            model_version=settings.model_version,
            uptime_seconds=time.monotonic() - START_TIME,
            pending_jobs=pending,
            dependencies=deps,
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
            metrics.jobs_submitted.labels(status="new").inc()
            logger.info(
                "job_queued",
                ticket_id=record.ticket_id,
                order_id=record.order_id,
                mode=mode,
            )
        else:
            metrics.jobs_submitted.labels(status="idempotent_hit").inc()
            logger.info(
                "job_idempotent_hit",
                order_id=record.order_id,
                ticket_id=record.ticket_id,
                existing_status=record.status.value,
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
