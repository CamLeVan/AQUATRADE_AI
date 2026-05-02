"""Demo end-to-end: video thật → AI service (YOLOv8) → callback BE giả lập.

Mô phỏng đầy đủ luồng "Seller upload video → AI đếm cá → trả result về BE":
  1. Khởi động Mock BE (Python HTTP server) thay cho core-backend Java.
  2. Khởi động AI service thật (uvicorn + best.pt + pipeline YOLOv8).
  3. Submit job với videoUrl = file:// đến video local của bạn.
  4. AI: tải video → YOLO inference → đếm 95th percentile → vẽ best frame.
  5. AI POST callback về Mock BE (đúng schema AIDetectionDto.DonePayload).
  6. In JSON callback + tự động mở best-frame image trong Preview.

Chạy:
    cd ai-service
    source .venv/bin/activate
    python demo_be_integration_real.py
"""
from __future__ import annotations

import asyncio
import json
import os
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer


# === Config ===
VIDEO_PATH = "/Users/ttcenter/AQUATRADE_AI/ai-service/test_videos/videofish.mp4"
ORDER_ID = "demo-order-001"
PROOF_ID = "demo-proof-001"
SECRET = "AquaTrade-AI-Secret-Key-2026"

# Set env trước khi import settings
os.environ["INTERNAL_SECRET"] = SECRET
os.environ["MODEL_VERSION"] = "v1.0.0-demo"
os.environ["CLOUDINARY_ENABLED"] = "false"  # fallback file://
os.environ["MAX_VIDEO_DURATION_SECONDS"] = "60"
os.environ["MIN_VIDEO_DURATION_SECONDS"] = "5"
os.environ["SMART_STOP_PATIENCE_SECONDS"] = "8"
os.environ["JOB_MAX_ATTEMPTS"] = "1"
os.environ["RATE_LIMIT_JOBS_PER_MINUTE"] = "0"  # tắt rate limit cho demo

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.api.settings import get_settings  # noqa: E402

get_settings.cache_clear()

import httpx  # noqa: E402

from src.api import store as store_mod  # noqa: E402
from src.api.main import app  # noqa: E402


received_callbacks: list[dict] = []


class MockBackend(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):  # tắt log rác
        pass

    def do_POST(self):
        if not self.path.endswith("/ai-result"):
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length).decode("utf-8")

        secret = self.headers.get("X-Internal-Secret")
        if secret != SECRET:
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b'{"status":"error","message":"bad secret"}')
            return

        try:
            payload = json.loads(body)
            received_callbacks.append(payload)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status":"success","message":"AI Result updated and broadcasted"}')


def start_mock_backend() -> HTTPServer:
    server = HTTPServer(("127.0.0.1", 18080), MockBackend)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def open_image(path: str) -> None:
    """Open image with the OS default viewer."""
    if sys.platform == "darwin":
        subprocess.run(["open", path], check=False)
    elif sys.platform == "linux":
        subprocess.run(["xdg-open", path], check=False)
    elif sys.platform.startswith("win"):
        os.startfile(path)  # type: ignore[attr-defined]


async def run() -> None:
    print("\n" + "=" * 64)
    print("  Demo AI ↔ Mock BE (real pipeline + real video)")
    print("=" * 64)
    print(f"\nVideo:    {VIDEO_PATH}")
    print(f"OrderID:  {ORDER_ID}")
    print(f"ProofID:  {PROOF_ID}")

    if not os.path.isfile(VIDEO_PATH):
        print(f"\n[FAIL] Video file không tồn tại: {VIDEO_PATH}")
        sys.exit(1)

    mock_be = start_mock_backend()
    print("\n[1] Mock BE listening at http://127.0.0.1:18080")

    import uvicorn

    store_mod.reset_store_for_tests()
    config = uvicorn.Config(
        app, host="127.0.0.1", port=18000,
        log_level="warning", loop="asyncio",
    )
    server = uvicorn.Server(config)
    server_task = asyncio.create_task(server.serve())

    for _ in range(40):
        try:
            async with httpx.AsyncClient() as c:
                r = await c.get("http://127.0.0.1:18000/ai/v1/health", timeout=1.0)
                if r.status_code == 200:
                    break
        except Exception:
            await asyncio.sleep(0.3)
    print("[2] AI service started at http://127.0.0.1:18000")

    callback_url = (
        f"http://127.0.0.1:18080/api/v1/internal/orders/{ORDER_ID}"
        f"/proofs/{PROOF_ID}/ai-result"
    )

    try:
        print(f"\n[3] Submitting job tới AI service...")
        print(f"    callbackUrl = {callback_url}")
        async with httpx.AsyncClient(base_url="http://127.0.0.1:18000") as c:
            r = await c.post(
                "/ai/v1/jobs",
                headers={"X-Internal-Secret": SECRET},
                json={
                    "orderId": ORDER_ID,
                    "proofId": PROOF_ID,
                    "videoUrl": f"file://{VIDEO_PATH}",
                    "callbackUrl": callback_url,
                    "fishProfile": "normal",
                },
                timeout=10.0,
            )
            if r.status_code != 202:
                print(f"[FAIL] Submit failed: {r.status_code} {r.text}")
                return
            ticket_id = r.json()["ticketId"]
            print(f"[4] AI accepted: ticketId={ticket_id}")
            print(f"\n[5] AI processing... (YOLOv8 inference - có thể mất 20-60s)")

            t0 = time.time()
            final = None
            last_progress_log = 0.0
            for _ in range(600):  # 120s max
                s = await c.get(
                    f"/ai/v1/jobs/{ticket_id}",
                    headers={"X-Internal-Secret": SECRET},
                )
                final = s.json()["data"]
                progress = final.get("progress", 0.0)
                elapsed = time.time() - t0

                if elapsed - last_progress_log >= 3.0:
                    print(f"    [t={elapsed:5.1f}s] status={final['status']:11s} progress={progress*100:5.1f}%")
                    last_progress_log = elapsed

                if final["status"] in ("DONE", "FAILED"):
                    break
                await asyncio.sleep(0.2)

        elapsed = time.time() - t0
        if final:
            print(f"\n[6] Final status: {final['status']} (mất {elapsed:.1f}s)")
            if final["status"] == "FAILED":
                print(f"    Error: {final.get('error')}")

        # Wait for callback to arrive
        for _ in range(20):
            if received_callbacks:
                break
            await asyncio.sleep(0.3)

        if received_callbacks:
            payload = received_callbacks[-1]
            print("\n[7] Callback BE nhận được (AIDetectionDto.DonePayload):")
            print("-" * 64)
            print(json.dumps(payload, indent=2, ensure_ascii=False))
            print("-" * 64)

            print("\n[8] Tóm tắt key-fields:")
            print(f"    status         : {payload.get('status')}")
            print(f"    aiFishCount    : {payload.get('aiFishCount')} con")
            print(f"    healthScore    : {payload.get('healthScore')}/100")
            print(f"    qualityStatus  : {payload.get('qualityStatus')}")
            print(f"    aiNotes        : {payload.get('aiNotes')}")
            print(f"    proofHash      : {(payload.get('proofHash') or '')[:16]}...")

            best_frame = payload.get("aiImageUrl", "") or ""
            if best_frame.startswith("file://"):
                path = best_frame[len("file://"):]
                if os.path.isfile(path):
                    print(f"\n[9] Best-frame image: {path}")
                    print("    -> Đang mở trong viewer mặc định...")
                    open_image(path)
                else:
                    print(f"\n[!] Best-frame file missing: {path}")
            elif best_frame:
                print(f"\n[9] aiImageUrl = {best_frame}")
            else:
                print("\n[!] Không có aiImageUrl trong callback")
        else:
            print("\n[!] Mock BE chưa nhận được callback từ AI")

    finally:
        server.should_exit = True
        try:
            await asyncio.wait_for(server_task, timeout=5.0)
        except asyncio.TimeoutError:
            pass
        mock_be.shutdown()

    print("\n" + "=" * 64)
    print("  Demo done")
    print("=" * 64 + "\n")


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        print("\n[!] Interrupted")
        sys.exit(1)
