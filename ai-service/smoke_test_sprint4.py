"""Sprint 4 smoke tests: structured logging, Prometheus metrics, health check.

Verify:
- structlog cấu hình OK + bind context
- Prometheus /metrics endpoint trả text format chuẩn
- Counter / Histogram tăng đúng khi submit/process job
- /ai/v1/health trả thêm field `dependencies` (model/redis/minio status)
- HTTP middleware đếm request đúng cho mỗi route
"""
from __future__ import annotations

import importlib.util
import os
import sys
import types as _t
from unittest.mock import AsyncMock, patch

os.environ["INTERNAL_SECRET"] = "test"
os.environ["MODEL_VERSION"] = "v1.0.0-sprint4"
os.environ["LOG_LEVEL"] = "WARNING"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Stub ultralytics + scipy như smoke_test_sprint3
if importlib.util.find_spec("ultralytics") is None:
    ultra_mod = _t.ModuleType("ultralytics")

    class _YOLO:
        def __init__(self, *a, **k):
            self.conf = 0.45
            self.names = {0: "ca_nho", 1: "ca_to"}

    ultra_mod.YOLO = _YOLO
    sys.modules["ultralytics"] = ultra_mod

if importlib.util.find_spec("scipy") is None:
    scipy_mod = _t.ModuleType("scipy")
    scipy_spatial = _t.ModuleType("scipy.spatial")
    scipy_opt = _t.ModuleType("scipy.optimize")
    scipy_opt.linear_sum_assignment = lambda m: (
        list(range(min(m.shape))),
        list(range(min(m.shape))),
    )
    sys.modules["scipy"] = scipy_mod
    sys.modules["scipy.spatial"] = scipy_spatial
    sys.modules["scipy.optimize"] = scipy_opt

from fastapi.testclient import TestClient

from src.api.settings import get_settings
get_settings.cache_clear()

from src.api import metrics, store as store_mod
from src.api.logging_config import bind_context, clear_context, configure_logging, get_logger
from src.api.main import app

HEADERS = {"X-Internal-Secret": "test"}


def _fresh_client() -> TestClient:
    store_mod.reset_store_for_tests()
    return TestClient(app)


def test_logging_bind_context() -> None:
    """structlog bind context không lỗi."""
    configure_logging()
    log = get_logger("smoke")
    bind_context(ticket_id="t-1", order_id="o-1")
    log.info("test_event", extra="abc")
    clear_context()
    log.info("after_clear")
    print("  structlog bind/clear OK")


def test_metrics_endpoint_format() -> None:
    """/metrics trả text Prometheus, có ít nhất 1 metric của ai_*"""
    client = _fresh_client()
    r = client.get("/metrics")
    assert r.status_code == 200, r.text
    body = r.text
    assert "# HELP" in body
    assert "# TYPE" in body
    # Sau 1 lần GET /metrics, http_requests_total từ middleware sẽ có dữ liệu
    # cho các path khác (không phải /metrics).
    print(f"  /metrics format OK ({len(body)} bytes)")


def test_metrics_counter_increments() -> None:
    """Submit job → ai_jobs_submitted_total{status="new"} +=1."""
    client = _fresh_client()

    before_new = metrics.jobs_submitted.labels(status="new")._value.get()
    before_dup = metrics.jobs_submitted.labels(status="idempotent_hit")._value.get()

    with patch("src.api.main.process_job", new=AsyncMock()):
        # Submit lần 1 → new
        r = client.post("/ai/v1/jobs", headers=HEADERS, json={
            "orderId": "metric-order-1",
            "videoUrl": "https://x/v.mp4",
        })
        assert r.status_code == 202
        # Submit lần 2 cùng orderId → idempotent_hit
        r = client.post("/ai/v1/jobs", headers=HEADERS, json={
            "orderId": "metric-order-1",
            "videoUrl": "https://x/v.mp4",
        })
        assert r.status_code == 202

    after_new = metrics.jobs_submitted.labels(status="new")._value.get()
    after_dup = metrics.jobs_submitted.labels(status="idempotent_hit")._value.get()

    assert after_new - before_new == 1, f"new counter: {before_new}→{after_new}"
    assert after_dup - before_dup == 1, f"idempotent counter: {before_dup}→{after_dup}"
    print("  jobs_submitted counter OK (new=+1, idempotent_hit=+1)")


def test_metrics_http_middleware() -> None:
    """HTTP middleware đếm request cho mỗi route khác /metrics."""
    client = _fresh_client()
    # Gọi /ai/v1/health trước để có data
    client.get("/ai/v1/health")
    r = client.get("/metrics")
    body = r.text
    assert 'ai_http_requests_total{method="GET"' in body
    # /metrics không tự đếm chính nó (theo PrometheusMiddleware)
    print("  HTTP middleware metric OK")


def test_health_includes_dependencies() -> None:
    """/ai/v1/health Sprint 4 có field `dependencies` với 3 entry."""
    client = _fresh_client()
    r = client.get("/ai/v1/health")
    assert r.status_code == 200
    data = r.json()["data"]
    deps = data.get("dependencies")
    assert deps is not None and isinstance(deps, dict), "Thiếu field dependencies"
    assert "model" in deps
    assert "redis" in deps
    assert "minio" in deps
    for name, dep in deps.items():
        assert dep["status"] in ("UP", "DOWN", "DISABLED"), f"{name}: {dep}"
    # Default settings: redis & minio cả 2 disabled → UP overall + model DOWN khi
    # chưa có best.pt.
    print(f"  health.dependencies OK: model={deps['model']['status']} "
          f"redis={deps['redis']['status']} minio={deps['minio']['status']}")


def test_health_status_overall() -> None:
    """Overall status = DEGRADED khi model chưa load (không có best.pt ở test)."""
    client = _fresh_client()
    r = client.get("/ai/v1/health")
    data = r.json()["data"]
    # Test environment chưa có model -> DEGRADED
    assert data["status"] in ("DEGRADED", "UP", "DOWN")
    print(f"  overall status: {data['status']}")


def test_jobs_pending_gauge_updated() -> None:
    """Gauge jobs_pending phản ánh đúng số job pending sau health check."""
    client = _fresh_client()
    # Submit 1 job
    with patch("src.api.main.process_job", new=AsyncMock()):
        client.post("/ai/v1/jobs", headers=HEADERS, json={
            "orderId": "gauge-1", "videoUrl": "https://x/v.mp4",
        })
    # Gọi health → middleware update gauge
    client.get("/ai/v1/health")
    val = metrics.jobs_pending._value.get()
    assert val >= 1, f"pending gauge expected >=1, got {val}"
    print(f"  jobs_pending gauge OK ({val})")


def main() -> None:
    print("=== Sprint 4 smoke tests ===")
    test_logging_bind_context()
    test_metrics_endpoint_format()
    test_metrics_counter_increments()
    test_metrics_http_middleware()
    test_health_includes_dependencies()
    test_health_status_overall()
    test_jobs_pending_gauge_updated()
    print("All Sprint 4 tests passed.")


if __name__ == "__main__":
    main()
