"""End-to-end test: AI service <-> mock BE webhook, KHÔNG cần YOLO thật.

Mô phỏng flow thực tế:
    1. Chạy 1 mock HTTP server giả làm core-backend, listen /api/v1/internal/ai-webhook
    2. Start AI FastAPI server (uvicorn)
    3. Submit job qua POST /ai/v1/jobs
    4. Patch analyze_video + download_video để bỏ qua YOLO/network (không cần best.pt, video thật)
    5. Verify:
       * AI gọi webhook với đúng X-Internal-Secret
       * Payload webhook khớp §3 EXHAUSTIVE_API_CONTRACT.md
       * Mock BE trả 200 → AI mark job DONE
       * AI job status = DONE với result đầy đủ

Chạy: python smoke_test_e2e.py
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from unittest.mock import patch

os.environ["INTERNAL_SECRET"] = "e2e-shared-secret"
os.environ["BACKEND_BASE_URL"] = "http://127.0.0.1:18080"
os.environ["MODEL_VERSION"] = "v1.0.0-mock"
os.environ["WEBHOOK_MAX_RETRIES"] = "2"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.api.settings import get_settings
get_settings.cache_clear()

import httpx

from src.api import store as store_mod
from src.api.main import app
from src.core.types import AnalysisResult, UniformityStats


# ---------------------------------------------------------------------------
# Mock core-backend: receive webhook, verify secret, store payload
# ---------------------------------------------------------------------------

received_webhooks: list[dict] = []
received_headers: list[dict] = []


class MockBackendHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):  # tắt log rác
        pass

    def do_POST(self):
        if self.path != "/api/v1/internal/ai-webhook":
            self.send_response(404)
            self.end_headers()
            return
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length).decode("utf-8")
        received_headers.append(dict(self.headers))
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            return
        received_webhooks.append(payload)

        # Kiểm tra secret (BE thật sẽ làm qua filter)
        secret = self.headers.get("X-Internal-Secret")
        if secret != "e2e-shared-secret":
            self.send_response(401)
            self.end_headers()
            self.wfile.write(b'{"status":"error","message":"bad secret"}')
            return

        # Trả 200 như contract §2.6
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "success",
            "message": "Webhook processed",
            "data": {"orderId": payload.get("orderId")},
        }).encode("utf-8"))


def start_mock_backend() -> HTTPServer:
    server = HTTPServer(("127.0.0.1", 18080), MockBackendHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server


# ---------------------------------------------------------------------------
# Mock pipeline (để khỏi cần ultralytics + best.pt + video thật)
# ---------------------------------------------------------------------------

FAKE_RESULT = AnalysisResult(
    fish_count=157,
    health_score=82.5,
    total_biomass_g=2350.4,
    avg_weight_g=14.97,
    uniformity=UniformityStats(
        mean_g=14.97, std_g=2.1, cv=0.14,
        oversize_ratio=0.08, undersize_ratio=0.06,
    ),
    dead_fish_count=1,
    processed_frames=450,
    duration_seconds=23.4,
    model_version="v1.0.0-mock",
    annotated_video_path="/tmp/fake_annotated.mp4",
)


async def fake_download_video(url, dest_path, settings):
    # Không tải gì cả, chỉ chạm đến hàm
    os.makedirs(os.path.dirname(os.path.abspath(dest_path)) or ".", exist_ok=True)
    with open(dest_path, "wb") as f:
        f.write(b"FAKE VIDEO CONTENT")
    return 18


def fake_run_pipeline(**kwargs):
    # Giả lập thời gian YOLO chạy
    time.sleep(0.3)
    return FAKE_RESULT


# ---------------------------------------------------------------------------
# Test driver
# ---------------------------------------------------------------------------

async def run_e2e():
    print("=== E2E test: AI service <-> mock BE ===\n")

    # 1. Start mock BE
    mock_be = start_mock_backend()
    print("[1] Mock BE listening on http://127.0.0.1:18080")

    # 2. Start AI server (in-process via uvicorn)
    import uvicorn
    store_mod.reset_store_for_tests()
    config = uvicorn.Config(
        app, host="127.0.0.1", port=18000,
        log_level="warning", loop="asyncio",
    )
    server = uvicorn.Server(config)

    server_task = asyncio.create_task(server.serve())
    # Đợi server lên
    for _ in range(20):
        try:
            async with httpx.AsyncClient() as c:
                r = await c.get("http://127.0.0.1:18000/ai/v1/health", timeout=1.0)
                if r.status_code == 200:
                    break
        except Exception:
            await asyncio.sleep(0.2)
    print("[2] AI service listening on http://127.0.0.1:18000")

    # 3. Patch analyze_video + download_video
    with patch("src.api.service.download_video", side_effect=fake_download_video), \
         patch("src.api.service._run_pipeline", side_effect=fake_run_pipeline):

        # Submit job
        async with httpx.AsyncClient(base_url="http://127.0.0.1:18000") as client:
            r = await client.post(
                "/ai/v1/jobs",
                headers={"X-Internal-Secret": "e2e-shared-secret"},
                json={
                    "orderId": "e2e-order-001",
                    "videoUrl": "https://example.com/fake.mp4",
                    "fishProfile": "normal",
                    "expectedCount": 150,
                },
                timeout=5.0,
            )
            assert r.status_code == 202, f"submit failed: {r.status_code} {r.text}"
            ticket_id = r.json()["data"]["ticketId"]
            print(f"[3] Submitted job: ticket={ticket_id[:8]}... → 202 QUEUED")

            # Poll job đến khi DONE
            deadline = time.monotonic() + 10
            final_status = None
            while time.monotonic() < deadline:
                r = await client.get(
                    f"/ai/v1/jobs/{ticket_id}",
                    headers={"X-Internal-Secret": "e2e-shared-secret"},
                )
                final_status = r.json()["data"]
                if final_status["status"] in ("DONE", "FAILED"):
                    break
                await asyncio.sleep(0.2)

            assert final_status is not None
            print(f"[4] Final job status: {final_status['status']}")

    # 4. Assertions
    assert final_status["status"] == "DONE", f"Expected DONE, got {final_status}"
    assert final_status["result"]["fishCount"] == 157
    assert final_status["result"]["healthScore"] == 82.5
    print(f"[5] Job result: fishCount={final_status['result']['fishCount']} "
          f"health={final_status['result']['healthScore']}")

    assert len(received_webhooks) >= 1, "Mock BE chưa nhận webhook nào!"
    webhook = received_webhooks[-1]
    headers = received_headers[-1]
    print(f"[6] Mock BE nhận {len(received_webhooks)} webhook")
    print(f"    X-Internal-Secret header: {headers.get('X-Internal-Secret')}")
    print(f"    Payload: {json.dumps(webhook, indent=6, ensure_ascii=False)}")

    # Verify webhook khớp §3 contract
    expected_keys = {"ticketId", "orderId", "fishCount", "healthScore",
                     "resultVideoUrl", "timestamp"}
    assert set(webhook.keys()) == expected_keys, \
        f"Payload keys sai: {set(webhook.keys())} vs {expected_keys}"
    assert webhook["orderId"] == "e2e-order-001"
    assert webhook["fishCount"] == 157
    assert webhook["healthScore"] == 82.5
    assert webhook["ticketId"] == ticket_id
    assert webhook["timestamp"].endswith("Z"), "Timestamp phải ISO-8601 UTC Z"
    assert headers["X-Internal-Secret"] == "e2e-shared-secret"
    print("\n[OK] Webhook payload khớp CHÍNH XÁC §3 EXHAUSTIVE_API_CONTRACT.md")

    # 5. Clean up
    server.should_exit = True
    await asyncio.wait_for(server_task, timeout=5.0)
    mock_be.shutdown()
    print("\n=== E2E test PASSED ===")


if __name__ == "__main__":
    try:
        asyncio.run(run_e2e())
    except AssertionError as e:
        print(f"\n[FAIL] {e}")
        sys.exit(1)
