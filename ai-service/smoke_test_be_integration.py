"""End-to-end smoke test với BE develop contract (Sprint 6).

Mock BE Java tại endpoint động:
    POST {callbackUrl} = http://127.0.0.1:18080/api/v1/internal/orders/{orderId}/proofs/{proofId}/ai-result
    Header: X-Internal-Secret
    Body: AIDetectionDto.DonePayload

Verify:
  1. AI submit job với proofId -> 202 + ticketId ở ROOT (BE develop check thế).
  2. Idempotency theo proofId: cùng proofId + cùng videoUrl => 202 same ticket.
  3. Idempotency conflict: cùng proofId + khác videoUrl => 409.
  4. AI gọi callback BE với schema khớp DonePayload (status, aiFishCount,
     healthScore, qualityStatus, aiImageUrl, proofHash, createdAt).
  5. AI gửi status="FAILED" callback khi pipeline lỗi terminal.

Chạy: python smoke_test_be_integration.py (KHÔNG cần ultralytics + best.pt).
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

os.environ["INTERNAL_SECRET"] = "AquaTrade-AI-Secret-Key-2026"
os.environ["MODEL_VERSION"] = "v1.0.0-mock"
os.environ["JOB_MAX_ATTEMPTS"] = "1"
# Cloudinary tắt (sẽ fallback file://)
os.environ["CLOUDINARY_ENABLED"] = "false"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.api.settings import get_settings
get_settings.cache_clear()

import httpx

from src.api import store as store_mod
from src.api.main import app
from src.core.types import AnalysisResult, UniformityStats


received_callbacks: list[dict] = []
received_headers: list[dict] = []
received_paths: list[str] = []


class MockBackendHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):  # tắt log rác
        pass

    def do_POST(self):
        # BE develop endpoint động: /api/v1/internal/orders/{orderId}/proofs/{proofId}/ai-result
        if "/proofs/" not in self.path or not self.path.endswith("/ai-result"):
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length).decode("utf-8")
        received_paths.append(self.path)
        received_headers.append(dict(self.headers))
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            return
        received_callbacks.append(payload)

        secret = self.headers.get("X-Internal-Secret")
        if secret != "AquaTrade-AI-Secret-Key-2026":
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'{"status":"error","message":"bad secret"}')
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "success",
            "data": "AI Result updated and broadcasted",
        }).encode("utf-8"))


def start_mock_backend() -> HTTPServer:
    server = HTTPServer(("127.0.0.1", 18080), MockBackendHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server


# Fake pipeline
FAKE_RESULT = AnalysisResult(
    fish_count=157,
    health_score=82.5,
    total_biomass_g=2350.4,
    avg_weight_g=14.97,
    uniformity=UniformityStats(
        mean_g=14.97, std_g=2.1, cv=0.14,
        oversize_ratio=0.08, undersize_ratio=0.06,
    ),
    dead_fish_count=0,
    processed_frames=450,
    duration_seconds=23.4,
    model_version="v1.0.0-mock",
    annotated_video_path="/tmp/fake_annotated.mp4",
    extras={"smartStopTriggered": True},
)


async def fake_download_video(url, dest_path, settings):
    import hashlib
    os.makedirs(os.path.dirname(os.path.abspath(dest_path)) or ".", exist_ok=True)
    payload = b"FAKE VIDEO CONTENT BE INTEGRATION"
    with open(dest_path, "wb") as f:
        f.write(payload)
    return len(payload), hashlib.sha256(payload).hexdigest()


def fake_run_pipeline(**kwargs):
    time.sleep(0.2)
    # Tạo file giả ở best_frame_output_path để _upload_best_frame pass
    best = kwargs.get("best_frame_output")
    if best:
        os.makedirs(os.path.dirname(os.path.abspath(best)) or ".", exist_ok=True)
        with open(best, "wb") as f:
            f.write(b"FAKE_JPEG_HEADER")
    return FAKE_RESULT


def fake_run_pipeline_terminal(**kwargs):
    """Mô phỏng lỗi terminal -> AI gửi callback FAILED."""
    raise FileNotFoundError("simulated: video corrupted")


PASS = "[OK]"
FAIL = "[FAIL]"


async def run() -> None:
    print("=== Sprint 6 smoke test: AI <-> BE develop contract ===\n")

    mock_be = start_mock_backend()
    print("[1] Mock BE listening at http://127.0.0.1:18080")

    import uvicorn
    store_mod.reset_store_for_tests()
    config = uvicorn.Config(
        app, host="127.0.0.1", port=18000,
        log_level="warning", loop="asyncio",
    )
    server = uvicorn.Server(config)
    server_task = asyncio.create_task(server.serve())

    for _ in range(20):
        try:
            async with httpx.AsyncClient() as c:
                r = await c.get("http://127.0.0.1:18000/ai/v1/health", timeout=1.0)
                if r.status_code == 200:
                    break
        except Exception:
            await asyncio.sleep(0.2)
    print("[2] AI service listening at http://127.0.0.1:18000\n")

    try:
        # ---- Test 1: submit thành công + callback DONE đúng schema ----
        order_id = "550e8400-e29b-41d4-a716-446655440001"
        proof_id = "550e8400-e29b-41d4-a716-446655440002"
        callback_url = f"http://127.0.0.1:18080/api/v1/internal/orders/{order_id}/proofs/{proof_id}/ai-result"

        with patch("src.api.service.download_video", side_effect=fake_download_video), \
             patch("src.api.service._run_pipeline", side_effect=fake_run_pipeline):
            async with httpx.AsyncClient(base_url="http://127.0.0.1:18000") as c:
                r = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    json={
                        "orderId": order_id,
                        "proofId": proof_id,
                        "videoUrl": "https://res.cloudinary.com/.../v1.mp4",
                        "callbackUrl": callback_url,
                        "fishProfile": "normal",
                    },
                    timeout=5.0,
                )
                assert r.status_code == 202, f"submit failed: {r.status_code} {r.text}"
                resp_json = r.json()

                # BE develop: response.containsKey("ticketId") ở ROOT
                assert "ticketId" in resp_json, f"missing root ticketId: {resp_json}"
                ticket_id = resp_json["ticketId"]
                # Wrapper vẫn có data
                assert resp_json.get("data", {}).get("ticketId") == ticket_id
                assert resp_json.get("data", {}).get("proofId") == proof_id
                print(f"{PASS} 1.1 Submit 202 + ticketId ở root + proofId trong data")

                # Đợi job DONE
                final_status = None
                deadline = time.monotonic() + 8
                while time.monotonic() < deadline:
                    s = await c.get(
                        f"/ai/v1/jobs/{ticket_id}",
                        headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    )
                    final_status = s.json()["data"]
                    if final_status["status"] in ("DONE", "FAILED"):
                        break
                    await asyncio.sleep(0.1)
                assert final_status and final_status["status"] == "DONE", final_status

        # Verify callback BE nhận
        assert len(received_callbacks) >= 1, "BE chưa nhận callback nào"
        callback = received_callbacks[-1]
        path = received_paths[-1]
        headers = received_headers[-1]

        assert path == f"/api/v1/internal/orders/{order_id}/proofs/{proof_id}/ai-result"
        assert headers["X-Internal-Secret"] == "AquaTrade-AI-Secret-Key-2026"
        print(f"{PASS} 1.2 Callback POST đúng URL động + secret header")

        required = {"status", "orderId", "aiFishCount", "healthScore",
                    "qualityStatus", "aiImageUrl", "proofHash", "createdAt"}
        missing = required - set(callback.keys())
        assert not missing, f"missing fields: {missing} in {callback}"
        assert callback["status"] == "DONE"
        assert callback["orderId"] == order_id
        assert callback["aiFishCount"] == 157
        # Python banker's rounding: round(82.5) = 82
        assert callback["healthScore"] in (82, 83), f"healthScore: {callback['healthScore']}"
        assert callback["qualityStatus"] == "NORMAL"
        assert isinstance(callback["proofHash"], str) and len(callback["proofHash"]) == 64
        assert callback["createdAt"].endswith("Z")
        print(f"{PASS} 1.3 Callback body khớp AIDetectionDto.DonePayload")

        # ---- Test 2: idempotency cùng proofId+videoUrl => 202 same ticket ----
        store_mod.reset_store_for_tests()
        with patch("src.api.service.download_video", side_effect=fake_download_video), \
             patch("src.api.service._run_pipeline", side_effect=fake_run_pipeline):
            async with httpx.AsyncClient(base_url="http://127.0.0.1:18000") as c:
                payload = {
                    "orderId": order_id,
                    "proofId": "660e8400-e29b-41d4-a716-446655440003",
                    "videoUrl": "https://res.cloudinary.com/.../same.mp4",
                    "callbackUrl": callback_url,
                }
                r1 = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    json=payload,
                )
                r2 = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    json=payload,
                )
                assert r1.status_code == 202 and r2.status_code == 202
                assert r1.json()["ticketId"] == r2.json()["ticketId"]
                print(f"{PASS} 2. Idempotency cùng proofId+videoUrl => same ticket")

        # ---- Test 3: idempotency conflict (cùng proofId, khác videoUrl) ----
        store_mod.reset_store_for_tests()
        # Slow pipeline để job giữ trạng thái PROCESSING khi POST lần 2.
        def _slow_pipeline(**kwargs):
            time.sleep(1.0)
            return FAKE_RESULT

        with patch("src.api.service.download_video", side_effect=fake_download_video), \
             patch("src.api.service._run_pipeline", side_effect=_slow_pipeline):
            async with httpx.AsyncClient(base_url="http://127.0.0.1:18000") as c:
                base = {
                    "orderId": order_id,
                    "proofId": "770e8400-e29b-41d4-a716-446655440004",
                    "callbackUrl": callback_url,
                }
                r1 = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    json={**base, "videoUrl": "https://res.cloudinary.com/.../A.mp4"},
                )
                assert r1.status_code == 202
                r2 = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    json={**base, "videoUrl": "https://res.cloudinary.com/.../B.mp4"},
                )
                assert r2.status_code == 409, f"expected 409, got {r2.status_code} {r2.text}"
                print(f"{PASS} 3. Idempotency conflict cùng proofId khác videoUrl => 409")

        # ---- Test 4: pipeline lỗi terminal => AI gửi FAILED callback ----
        # Đợi slow_pipeline test 3 finish + callback của nó arrive trước.
        await asyncio.sleep(1.5)
        store_mod.reset_store_for_tests()

        with patch("src.api.service.download_video", side_effect=fake_download_video), \
             patch("src.api.service._run_pipeline", side_effect=fake_run_pipeline_terminal):
            async with httpx.AsyncClient(base_url="http://127.0.0.1:18000") as c:
                proof_failed = "880e8400-e29b-41d4-a716-446655440005"
                cb_failed = f"http://127.0.0.1:18080/api/v1/internal/orders/{order_id}/proofs/{proof_failed}/ai-result"
                r = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    json={
                        "orderId": order_id,
                        "proofId": proof_failed,
                        "videoUrl": "https://res.cloudinary.com/.../bad.mp4",
                        "callbackUrl": cb_failed,
                    },
                )
                assert r.status_code == 202
                tid_f = r.json()["ticketId"]

                # Đợi job FAILED
                deadline = time.monotonic() + 5
                while time.monotonic() < deadline:
                    s = await c.get(
                        f"/ai/v1/jobs/{tid_f}",
                        headers={"X-Internal-Secret": "AquaTrade-AI-Secret-Key-2026"},
                    )
                    if s.json()["data"]["status"] == "FAILED":
                        break
                    await asyncio.sleep(0.1)

        # BE phải nhận callback status="FAILED" + errorMessage.
        # Filter để loại trừ DONE callback của test trước.
        await asyncio.sleep(1.0)
        failed_cbs = [cb for cb in received_callbacks if cb.get("status") == "FAILED"]
        assert failed_cbs, f"BE chưa nhận FAILED callback. Got: {received_callbacks}"
        failed = failed_cbs[-1]
        assert "errorMessage" in failed and failed["errorMessage"]
        print(f"{PASS} 4. Pipeline lỗi terminal => callback status=FAILED + errorMessage")

    finally:
        server.should_exit = True
        await asyncio.wait_for(server_task, timeout=5.0)
        mock_be.shutdown()

    print("\n=== Sprint 6 BE-integration PASSED ===")


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except AssertionError as e:
        print(f"\n{FAIL} {e}")
        sys.exit(1)
