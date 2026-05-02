"""Smoke test Sprint 5 - Security hardening & Reliability (BE-develop schema).

Bao phủ:
  1. Secret rotation: previous secret cũng được chấp nhận.
  2. Bad/missing secret: trả 401.
  3. HMAC signature compute & header presence.
  4. URL allowlist + path-traversal (file://..) bị reject.
  5. Idempotency mạnh: cùng proofId + khác videoUrl => 409 Conflict.
  6. Rate limit: vượt quota => 429.
  7. Dead-letter: lỗi terminal => job FAILED + push dead-letter.
  8. Retry: lỗi tạm thời => attempts tăng & retry.

Chạy: python smoke_test_sprint5.py
"""
from __future__ import annotations

import asyncio
import os
import sys
from unittest.mock import patch

os.environ["INTERNAL_SECRET"] = "current-secret-v2"
os.environ["INTERNAL_SECRET_PREVIOUS"] = "old-secret-v1"
os.environ["WEBHOOK_HMAC_ENABLED"] = "true"
os.environ["WEBHOOK_HMAC_SECRET"] = "hmac-shared-with-be"
os.environ["MODEL_VERSION"] = "v1.0.0-mock"
os.environ["RATE_LIMIT_JOBS_PER_MINUTE"] = "5"
os.environ["JOB_MAX_ATTEMPTS"] = "2"
os.environ["JOB_RETRY_DELAY_SECONDS"] = "0.05"
os.environ["DEAD_LETTER_ENABLED"] = "true"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.api.settings import get_settings
get_settings.cache_clear()

import httpx

from src.api import store as store_mod
from src.api import deps as deps_mod
from src.api.main import app
from src.api.webhook import compute_signature
from src.core.types import AnalysisResult, UniformityStats


PASS = "[OK]"
FAIL = "[FAIL]"

CALLBACK_BASE = "http://127.0.0.1:9999/api/v1/internal/orders"


def cb(order: str, proof: str) -> str:
    return f"{CALLBACK_BASE}/{order}/proofs/{proof}/ai-result"


def make_body(*, order: str, proof: str, video: str, callback: str | None = None) -> dict:
    body = {
        "orderId": order,
        "proofId": proof,
        "videoUrl": video,
        "callbackUrl": callback or cb(order, proof),
    }
    return body


# --- helpers ----------------------------------------------------------------

async def fake_download_ok(url, dest_path, settings):
    import hashlib
    os.makedirs(os.path.dirname(os.path.abspath(dest_path)) or ".", exist_ok=True)
    payload = b"FAKE VIDEO"
    with open(dest_path, "wb") as f:
        f.write(payload)
    return len(payload), hashlib.sha256(payload).hexdigest()


async def fake_download_terminal(url, dest_path, settings):
    """Mô phỏng lỗi terminal (validation) - không retry."""
    from src.api.service import VideoValidationError
    raise VideoValidationError("bad mime")


_transient_count = {"n": 0}


async def fake_download_transient(url, dest_path, settings):
    """Lần 1 fail (transient) -> Lần 2 OK -> attempts retry policy."""
    _transient_count["n"] += 1
    if _transient_count["n"] == 1:
        raise httpx.NetworkError("temporary network glitch")
    return await fake_download_ok(url, dest_path, settings)


def fake_pipeline_ok(**kwargs):
    # Tạo file giả ở best_frame_output để _upload_best_frame pass khi disabled
    best = kwargs.get("best_frame_output")
    if best:
        os.makedirs(os.path.dirname(os.path.abspath(best)) or ".", exist_ok=True)
        with open(best, "wb") as f:
            f.write(b"FAKE_JPEG")
    return AnalysisResult(
        fish_count=10,
        health_score=70.0,
        total_biomass_g=100.0,
        avg_weight_g=10.0,
        uniformity=UniformityStats(
            mean_g=10.0, std_g=1.0, cv=0.1,
            oversize_ratio=0.0, undersize_ratio=0.0,
        ),
        dead_fish_count=0,
        processed_frames=100,
        duration_seconds=5.0,
        model_version="mock",
        annotated_video_path="/tmp/x.mp4",
        extras={"smartStopTriggered": True},
    )


async def fake_send_webhook_ok(payload, *, callback_url=None, settings=None):
    return {"status": "success"}


# --- driver -----------------------------------------------------------------

async def run() -> None:
    print("=== Sprint 5 smoke test (BE-develop schema) ===\n")

    import uvicorn
    store_mod.reset_store_for_tests()
    deps_mod.reset_rate_limiter_for_tests()

    config = uvicorn.Config(
        app, host="127.0.0.1", port=19500,
        log_level="warning", loop="asyncio",
    )
    server = uvicorn.Server(config)
    server_task = asyncio.create_task(server.serve())

    base = "http://127.0.0.1:19500"
    for _ in range(20):
        try:
            async with httpx.AsyncClient() as c:
                r = await c.get(f"{base}/ai/v1/health", timeout=1.0)
                if r.status_code == 200:
                    break
        except Exception:
            await asyncio.sleep(0.2)

    try:
        # 1. Secret rotation: PREVIOUS secret được chấp nhận ----------------
        async with httpx.AsyncClient(base_url=base) as c:
            r = await c.get(
                "/ai/v1/models",
                headers={"X-Internal-Secret": "old-secret-v1"},
            )
        assert r.status_code == 200, f"old secret rejected: {r.status_code}"
        print(f"{PASS} 1. Previous secret được chấp nhận trong giai đoạn rotate")

        # 2. Sai secret => 401 ---------------------------------------------
        async with httpx.AsyncClient(base_url=base) as c:
            r = await c.get(
                "/ai/v1/models",
                headers={"X-Internal-Secret": "totally-wrong"},
            )
        assert r.status_code == 401, f"expected 401, got {r.status_code}"
        async with httpx.AsyncClient(base_url=base) as c:
            r2 = await c.get("/ai/v1/models")
        assert r2.status_code == 401
        print(f"{PASS} 2. Sai/missing X-Internal-Secret => 401")

        # 3. HMAC compute đúng và header được set -------------------------
        sig = compute_signature("hmac-shared-with-be", 1700000000, b'{"x":1}')
        assert len(sig) == 64 and all(c in "0123456789abcdef" for c in sig)

        captured: dict = {}

        async def _capture_send(payload, *, callback_url=None, settings=None):
            from src.api.webhook import _build_headers
            import json as _j
            wire = payload.to_wire()
            body = _j.dumps(wire, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
            captured.update(_build_headers(settings or get_settings(), body))
            return {"status": "success"}

        store_mod.reset_store_for_tests()
        with patch("src.api.service.download_video", side_effect=fake_download_ok), \
             patch("src.api.service._run_pipeline", side_effect=fake_pipeline_ok), \
             patch("src.api.service.send_webhook", side_effect=_capture_send):
            async with httpx.AsyncClient(base_url=base) as c:
                r = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                    json=make_body(
                        order="s5-order-hmac",
                        proof="s5-proof-hmac",
                        video="http://example.com/x.mp4",
                    ),
                )
                assert r.status_code == 202, r.text
                tid = r.json()["ticketId"]

                for _ in range(40):
                    s = await c.get(
                        f"/ai/v1/jobs/{tid}",
                        headers={"X-Internal-Secret": "current-secret-v2"},
                    )
                    if s.json()["data"]["status"] in ("DONE", "FAILED"):
                        break
                    await asyncio.sleep(0.1)

        assert "X-Webhook-Signature" in captured, captured
        assert "X-Webhook-Timestamp" in captured
        assert captured["X-Webhook-Signature"].startswith("v1=")
        print(f"{PASS} 3. HMAC headers (X-Webhook-Signature/Timestamp) outbound")

        # 4. file:// '..' bị reject -----------------------------------------
        async with httpx.AsyncClient(base_url=base) as c:
            r = await c.post(
                "/ai/v1/jobs",
                headers={"X-Internal-Secret": "current-secret-v2"},
                json=make_body(
                    order="s5-order-trav",
                    proof="s5-proof-trav",
                    video="file:///tmp/../etc/passwd",
                ),
            )
        assert r.status_code == 400, f"expected 400, got {r.status_code} {r.text}"
        print(f"{PASS} 4. file:// chứa '..' => 400 (path traversal blocked)")

        # 5. Idempotency conflict: cùng proofId + khác videoUrl => 409 -----
        store_mod.reset_store_for_tests()
        deps_mod.reset_rate_limiter_for_tests()

        def _slow_pipeline_thread(**kwargs):
            import time as _t
            _t.sleep(1.0)
            return fake_pipeline_ok(**kwargs)

        with patch("src.api.service.download_video", side_effect=fake_download_ok), \
             patch("src.api.service._run_pipeline", side_effect=_slow_pipeline_thread), \
             patch("src.api.service.send_webhook", side_effect=fake_send_webhook_ok):
            async with httpx.AsyncClient(base_url=base) as c:
                proof_idem = "s5-proof-idem"
                r1 = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                    json=make_body(
                        order="s5-order-idem",
                        proof=proof_idem,
                        video="http://cdn.example.com/v1.mp4",
                    ),
                )
                assert r1.status_code == 202

                # Cùng proofId nhưng videoUrl khác -> 409
                r2 = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                    json=make_body(
                        order="s5-order-idem",
                        proof=proof_idem,
                        video="http://cdn.example.com/DIFFERENT.mp4",
                    ),
                )
                assert r2.status_code == 409, r2.text

                # Cùng proofId + cùng videoUrl -> 202 same ticket
                r3 = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                    json=make_body(
                        order="s5-order-idem",
                        proof=proof_idem,
                        video="http://cdn.example.com/v1.mp4",
                    ),
                )
                assert r3.status_code == 202
                assert r3.json()["ticketId"] == r1.json()["ticketId"]
        print(f"{PASS} 5. Idempotency cùng proofId+videoUrl=>same ticket; khác=>409")

        # 6. Rate limit: vượt quota (5 rpm) => 429 ------------------------
        deps_mod.reset_rate_limiter_for_tests()
        async with httpx.AsyncClient(base_url=base) as c:
            saw_429 = False
            for i in range(8):
                r = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                    json=make_body(
                        order=f"s5-rate-{i}",
                        proof=f"s5-rate-proof-{i}",
                        video=f"http://cdn.example.com/r{i}.mp4",
                    ),
                )
                if r.status_code == 429:
                    saw_429 = True
                    break
            assert saw_429, "rate limit không trigger"
        print(f"{PASS} 6. Rate limit /ai/v1/jobs (5 rpm) => 429 khi vượt")

        # Đợi tất cả background job (slow_pipeline 1s + tail) xong trước test 7
        await asyncio.sleep(1.5)

        # 7. Dead-letter: lỗi terminal => FAILED + dead-letter --------------
        store_mod.reset_store_for_tests()
        deps_mod.reset_rate_limiter_for_tests()

        with patch("src.api.service.download_video", side_effect=fake_download_terminal), \
             patch("src.api.service._run_pipeline", side_effect=fake_pipeline_ok), \
             patch("src.api.service.send_webhook", side_effect=fake_send_webhook_ok):
            async with httpx.AsyncClient(base_url=base) as c:
                r = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                    json=make_body(
                        order="s5-dl-order",
                        proof="s5-dl-proof",
                        video="http://cdn.example.com/bad.mp4",
                    ),
                )
                assert r.status_code == 202
                tid = r.json()["ticketId"]

                final_status = None
                for _ in range(40):
                    s = await c.get(
                        f"/ai/v1/jobs/{tid}",
                        headers={"X-Internal-Secret": "current-secret-v2"},
                    )
                    final_status = s.json()["data"]
                    if final_status["status"] == "FAILED":
                        break
                    await asyncio.sleep(0.1)
                assert final_status and final_status["status"] == "FAILED", final_status

                dl = await c.get(
                    "/ai/v1/dead-letters",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                )
                assert dl.status_code == 200
                items = dl.json()["data"]["items"]
                assert any(it["ticketId"] == tid for it in items), items
        print(f"{PASS} 7. Lỗi terminal => FAILED + dead-letter có entry")

        # 8. Retry: lỗi transient => attempts tăng + retry -----------------
        store_mod.reset_store_for_tests()
        deps_mod.reset_rate_limiter_for_tests()
        _transient_count["n"] = 0

        with patch("src.api.service.download_video", side_effect=fake_download_transient), \
             patch("src.api.service._run_pipeline", side_effect=fake_pipeline_ok), \
             patch("src.api.service.send_webhook", side_effect=fake_send_webhook_ok):
            async with httpx.AsyncClient(base_url=base) as c:
                r = await c.post(
                    "/ai/v1/jobs",
                    headers={"X-Internal-Secret": "current-secret-v2"},
                    json=make_body(
                        order="s5-trans-order",
                        proof="s5-trans-proof",
                        video="http://cdn.example.com/transient.mp4",
                    ),
                )
                assert r.status_code == 202
                tid = r.json()["ticketId"]

                final = None
                for _ in range(60):
                    s = await c.get(
                        f"/ai/v1/jobs/{tid}",
                        headers={"X-Internal-Secret": "current-secret-v2"},
                    )
                    final = s.json()["data"]
                    if final["status"] in ("DONE", "FAILED"):
                        break
                    await asyncio.sleep(0.1)
                assert final and final["status"] == "DONE", final
                assert _transient_count["n"] >= 2, _transient_count
        print(f"{PASS} 8. Lỗi transient => retry => DONE")

    finally:
        server.should_exit = True
        await asyncio.wait_for(server_task, timeout=5.0)

    print("\n=== Sprint 5 PASSED ===")


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except AssertionError as e:
        print(f"\n{FAIL} {e}")
        sys.exit(1)
