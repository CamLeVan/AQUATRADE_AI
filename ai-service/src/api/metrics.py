"""Prometheus metrics cho AI service (Sprint 4).

Endpoint /metrics expose ở dạng text format chuẩn Prometheus.

Metrics theo dõi:
  * jobs_submitted_total{status}  - Counter: số job đã nhận (new vs idempotent_hit)
  * jobs_processed_total{outcome} - Counter: số job xử lý xong (done|failed)
  * jobs_pending                  - Gauge: số job đang QUEUED + PROCESSING
  * job_processing_seconds        - Histogram: thời gian xử lý 1 job (download → webhook)
  * job_fish_count                - Histogram: phân phối fishCount qua các job
  * job_health_score              - Histogram: phân phối healthScore qua các job
  * webhook_delivery_total{outcome} - Counter: webhook delivery (success|retry|failed)
  * http_requests_total{path,method,status} - Counter: HTTP request count
  * http_request_seconds{path,method}       - Histogram: HTTP request duration
"""
from __future__ import annotations

import time
from typing import Callable

from fastapi import Request, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
    Counter,
    Gauge,
    Histogram,
    generate_latest,
)
from starlette.middleware.base import BaseHTTPMiddleware

REGISTRY = CollectorRegistry(auto_describe=True)


jobs_submitted = Counter(
    "ai_jobs_submitted_total",
    "Total jobs submitted via POST /ai/v1/jobs",
    ["status"],  # new | idempotent_hit
    registry=REGISTRY,
)

jobs_processed = Counter(
    "ai_jobs_processed_total",
    "Total jobs reaching a terminal state",
    ["outcome"],  # done | failed
    registry=REGISTRY,
)

jobs_pending = Gauge(
    "ai_jobs_pending",
    "Number of jobs in QUEUED or PROCESSING state",
    registry=REGISTRY,
)

job_processing_seconds = Histogram(
    "ai_job_processing_seconds",
    "End-to-end job processing time (download -> webhook ack)",
    buckets=(1, 5, 10, 30, 60, 90, 120, 180, 300, 600),
    registry=REGISTRY,
)

job_fish_count = Histogram(
    "ai_job_fish_count",
    "Distribution of detected fishCount per job",
    buckets=(0, 5, 10, 25, 50, 100, 200, 500, 1000, 5000),
    registry=REGISTRY,
)

job_health_score = Histogram(
    "ai_job_health_score",
    "Distribution of computed healthScore per job",
    buckets=(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100),
    registry=REGISTRY,
)

webhook_delivery = Counter(
    "ai_webhook_delivery_total",
    "Outcome of POST /api/v1/internal/ai-webhook calls to BE",
    ["outcome"],  # success | retry | failed
    registry=REGISTRY,
)

http_requests = Counter(
    "ai_http_requests_total",
    "HTTP requests served by ai-service",
    ["method", "path", "status"],
    registry=REGISTRY,
)

http_request_seconds = Histogram(
    "ai_http_request_seconds",
    "HTTP request duration in seconds",
    ["method", "path"],
    buckets=(0.005, 0.01, 0.05, 0.1, 0.5, 1.0, 5.0),
    registry=REGISTRY,
)


def render_metrics() -> tuple[bytes, str]:
    """Render Prometheus text format. Trả về (body, content_type)."""
    return generate_latest(REGISTRY), CONTENT_TYPE_LATEST


class PrometheusMiddleware(BaseHTTPMiddleware):
    """Đo HTTP request count + duration cho mỗi route.

    Path được normalize từ route template (ví dụ /ai/v1/jobs/{ticket_id})
    để không tạo cardinality bùng nổ với mỗi UUID.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Bỏ qua /metrics khỏi chính metrics để không tự ăn nhau.
        if request.url.path == "/metrics":
            return await call_next(request)

        start = time.perf_counter()
        try:
            response = await call_next(request)
            status = response.status_code
        except Exception:
            status = 500
            raise
        finally:
            elapsed = time.perf_counter() - start
            route_path = _route_path(request)
            http_requests.labels(
                method=request.method, path=route_path, status=str(status)
            ).inc()
            http_request_seconds.labels(
                method=request.method, path=route_path
            ).observe(elapsed)
        return response


def _route_path(request: Request) -> str:
    """Lấy path template của route (e.g. '/ai/v1/jobs/{ticket_id}')."""
    route = request.scope.get("route")
    if route is not None and hasattr(route, "path"):
        return route.path
    return request.url.path or "unknown"
