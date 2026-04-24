"""Smoke test FastAPI app (Sprint 2) - KHÔNG cần ultralytics.

Test:
  1. Health endpoint
  2. Auth: X-Internal-Secret thiếu → 401, sai → 401, đúng → 200
  3. POST /ai/v1/jobs: request đúng → 202 trả ticketId; idempotency cùng orderId
  4. GET /ai/v1/jobs/{id}: trả status, 404 nếu không có
  5. Validation: videoUrl sai format → 400
  6. Webhook payload schema khớp §3 contract (field camelCase)

Chạy: python smoke_test_sprint2.py
"""
from __future__ import annotations

import os
import sys
from datetime import datetime, timezone

os.environ["INTERNAL_SECRET"] = "test-secret-123"
os.environ["BACKEND_BASE_URL"] = "http://backend-mock:8080"
os.environ["MODEL_VERSION"] = "v1.0.0-test"
os.environ["MAX_VIDEO_SIZE_MB"] = "10"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

# Reset lru_cache của get_settings để env var mới có hiệu lực
from src.api.settings import get_settings
get_settings.cache_clear()

from src.api import store as store_mod
from src.api.main import app
from src.api.schemas import WebhookPayload


HEADERS_OK = {"X-Internal-Secret": "test-secret-123"}
HEADERS_WRONG = {"X-Internal-Secret": "wrong"}


def _fresh_client() -> TestClient:
    store_mod.reset_store_for_tests()
    return TestClient(app)


def test_health_public_no_auth():
    client = _fresh_client()
    r = client.get("/ai/v1/health")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "success"
    data = body["data"]
    assert data["appName"]
    assert data["appVersion"]
    assert "pendingJobs" in data
    assert "modelLoaded" in data
    print("  health endpoint OK")


def test_auth_missing_secret():
    client = _fresh_client()
    r = client.post("/ai/v1/jobs", json={
        "orderId": "o1", "videoUrl": "https://example.com/v.mp4",
    })
    assert r.status_code == 401, r.text
    assert r.json()["status"] == "error"
    print("  auth missing → 401 OK")


def test_auth_wrong_secret():
    client = _fresh_client()
    r = client.post(
        "/ai/v1/jobs",
        headers=HEADERS_WRONG,
        json={"orderId": "o1", "videoUrl": "https://example.com/v.mp4"},
    )
    assert r.status_code == 401, r.text
    print("  auth wrong → 401 OK")


def test_submit_job_accepted():
    client = _fresh_client()
    # Không để background task chạy thật (sẽ download video, không test được)
    with patch("src.api.main.process_job", new=AsyncMock()):
        r = client.post(
            "/ai/v1/jobs",
            headers=HEADERS_OK,
            json={
                "orderId": "order-xyz-1",
                "videoUrl": "https://example.com/v.mp4",
                "fishProfile": "normal",
            },
        )
    assert r.status_code == 202, r.text
    body = r.json()
    assert body["status"] == "success"
    data = body["data"]
    assert data["status"] == "QUEUED"
    assert len(data["ticketId"]) > 10
    assert data["estimatedSeconds"] > 0
    print(f"  submit job OK: ticket={data['ticketId'][:8]}... estimated={data['estimatedSeconds']}s")


def test_submit_job_idempotency():
    client = _fresh_client()
    with patch("src.api.main.process_job", new=AsyncMock()):
        payload = {"orderId": "order-dup", "videoUrl": "https://example.com/v.mp4"}
        r1 = client.post("/ai/v1/jobs", headers=HEADERS_OK, json=payload)
        r2 = client.post("/ai/v1/jobs", headers=HEADERS_OK, json=payload)
    assert r1.status_code == 202 and r2.status_code == 202
    t1 = r1.json()["data"]["ticketId"]
    t2 = r2.json()["data"]["ticketId"]
    assert t1 == t2, "Cùng orderId phải trả cùng ticketId"
    assert r2.json()["message"] == "Job already in progress"
    print("  idempotency OK (cùng orderId → cùng ticketId)")


def test_get_job_status():
    client = _fresh_client()
    with patch("src.api.main.process_job", new=AsyncMock()):
        submit = client.post(
            "/ai/v1/jobs", headers=HEADERS_OK,
            json={"orderId": "order-q1", "videoUrl": "https://example.com/v.mp4"},
        )
    ticket_id = submit.json()["data"]["ticketId"]

    r = client.get(f"/ai/v1/jobs/{ticket_id}", headers=HEADERS_OK)
    assert r.status_code == 200, r.text
    data = r.json()["data"]
    assert data["ticketId"] == ticket_id
    assert data["orderId"] == "order-q1"
    assert data["status"] == "QUEUED"
    print("  get job status OK")


def test_get_job_not_found():
    client = _fresh_client()
    r = client.get("/ai/v1/jobs/nonexistent", headers=HEADERS_OK)
    assert r.status_code == 404
    print("  get job 404 OK")


def test_validation_error_bad_url():
    client = _fresh_client()
    r = client.post(
        "/ai/v1/jobs", headers=HEADERS_OK,
        json={"orderId": "o1", "videoUrl": "not-a-url"},
    )
    assert r.status_code == 400, r.text
    body = r.json()
    assert body["status"] == "error"
    assert "videoUrl" in body["message"] or "video_url" in body["message"].lower()
    print("  validation 400 OK")


def test_models_list_requires_auth():
    client = _fresh_client()
    r = client.get("/ai/v1/models")
    assert r.status_code == 401

    r = client.get("/ai/v1/models", headers=HEADERS_OK)
    assert r.status_code == 200, r.text
    data = r.json()["data"]
    assert data["activeVersion"] == "v1.0.0-test"
    assert len(data["models"]) >= 1
    print("  models list OK")


def test_webhook_payload_schema_matches_contract():
    """§3 contract: field phải camelCase, timestamp ISO-8601 UTC Z suffix."""
    payload = WebhookPayload(
        ticket_id="ticket-1",
        order_id="order-1",
        fish_count=29,
        health_score=85.4,
        result_video_url="https://storage/result.mp4",
        timestamp=datetime(2026, 4, 18, 10, 0, 0, tzinfo=timezone.utc),
    )
    wire = payload.to_wire()
    # Tên field phải CHÍNH XÁC như contract §3
    assert set(wire.keys()) == {
        "ticketId", "orderId", "fishCount", "healthScore",
        "resultVideoUrl", "timestamp",
    }
    assert wire["ticketId"] == "ticket-1"
    assert wire["orderId"] == "order-1"
    assert wire["fishCount"] == 29
    assert wire["healthScore"] == 85.4
    assert wire["resultVideoUrl"] == "https://storage/result.mp4"
    assert wire["timestamp"] == "2026-04-18T10:00:00Z"
    print("  webhook payload khớp §3 contract OK")


def main():
    print("=== Sprint 2 FastAPI smoke tests ===")
    test_health_public_no_auth()
    test_auth_missing_secret()
    test_auth_wrong_secret()
    test_submit_job_accepted()
    test_submit_job_idempotency()
    test_get_job_status()
    test_get_job_not_found()
    test_validation_error_bad_url()
    test_models_list_requires_auth()
    test_webhook_payload_schema_matches_contract()
    print("\nAll Sprint 2 tests passed.")


if __name__ == "__main__":
    main()
