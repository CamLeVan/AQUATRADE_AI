"""Sprint 3 smoke tests (queue / storage / store / health-score).

Không đụng YOLO thật. Verify:
- queue_backend switch: background vs arq (Sprint 3.0)
- Arq enqueue called đúng queue name (Sprint 3.0)
- MinIO upload helper (mock client) (Sprint 3.0)
- HealthScore penalty khi smart_stop_triggered=False (Sprint 3.1)
- RedisJobStore round-trip serialize JobRecord (Sprint 3.1)
- InMemoryJobStore lưu được originalVideoHash (Sprint 3.1)
"""
from __future__ import annotations

import importlib.util
import os
import sys
import types as _t
from unittest.mock import AsyncMock, MagicMock, patch

os.environ["QUEUE_BACKEND"] = "background"
os.environ["INTERNAL_SECRET"] = "test"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Stub ultralytics + scipy để test pipeline._compute_health_score không cần YOLO.
if importlib.util.find_spec("ultralytics") is None:
    ultra_mod = _t.ModuleType("ultralytics")

    class _YOLO:  # noqa: D401 - minimal stub
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

from src.api.queue import enqueue_job
from src.api.settings import get_settings
from src.api.storage import upload_annotated_video


async def test_queue_background() -> None:
    get_settings.cache_clear()
    s = get_settings()
    s.queue_backend = "background"  # type: ignore[misc]
    mode = await enqueue_job("t-1", s)
    assert mode == "background"
    print("  queue background OK")


async def test_queue_arq_mock() -> None:
    get_settings.cache_clear()
    s = get_settings()
    s.queue_backend = "arq"  # type: ignore[misc]
    s.arq_queue_name = "q-test"  # type: ignore[misc]

    fake_redis = MagicMock()
    fake_redis.enqueue_job = AsyncMock()
    fake_redis.close = AsyncMock()

    with patch("src.api.queue.create_pool", AsyncMock(return_value=fake_redis)):
        mode = await enqueue_job("t-2", s)
        assert mode == "arq"
        fake_redis.enqueue_job.assert_awaited_once()
        kwargs = fake_redis.enqueue_job.await_args.kwargs
        assert kwargs["_queue_name"] == "q-test"
    print("  queue arq enqueue OK")


def test_storage_minio_mock() -> None:
    import tempfile

    get_settings.cache_clear()
    s = get_settings()
    s.minio_bucket = "bucket-test"  # type: ignore[misc]
    s.minio_presign_expiry_seconds = 123  # type: ignore[misc]

    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "a.mp4")
        with open(p, "wb") as f:
            f.write(b"video")

        fake_client = MagicMock()
        fake_client.bucket_exists.return_value = True
        fake_client.presigned_get_object.return_value = "http://minio/presigned"

        with patch("src.api.storage._build_client", return_value=fake_client):
            url = upload_annotated_video(p, "ticket123", s)
            assert url == "http://minio/presigned"
            fake_client.fput_object.assert_called_once()
    print("  storage upload mock OK")


def test_health_score_penalty_when_unstable() -> None:
    """Sprint 3.1: smart_stop_triggered=False => -30 điểm."""
    from src.core.pipeline import _compute_health_score
    from src.core.types import UniformityStats

    fai = [50.0] * 30  # FAI lý tưởng -> activity = 100
    uniformity = UniformityStats(mean_g=10, std_g=1, cv=0.10,
                                 oversize_ratio=0, undersize_ratio=0)

    stable = _compute_health_score(fai, dead_ratio=0.0, uniformity=uniformity,
                                   smart_stop_triggered=True)
    unstable = _compute_health_score(fai, dead_ratio=0.0, uniformity=uniformity,
                                     smart_stop_triggered=False)
    assert stable == 100.0, f"stable expected 100, got {stable}"
    assert unstable == 70.0, f"unstable expected 70 (100-30), got {unstable}"
    print("  health-score penalty (smart-stop) OK")


async def test_in_memory_store_video_hash() -> None:
    """Sprint 3.1: InMemoryJobStore lưu original_video_hash."""
    from src.api.store import InMemoryJobStore

    store = InMemoryJobStore()
    record, is_new = await store.create_or_get_active(
        order_id="o-1", video_url="https://x/v.mp4",
        callback_url=None, fish_profile="normal", expected_count=None,
    )
    assert is_new
    await store.update_video_hash(record.ticket_id, "a" * 64)
    after = await store.get(record.ticket_id)
    assert after is not None
    assert after.original_video_hash == "a" * 64
    print("  in-memory store hash OK")


async def test_job_record_json_round_trip() -> None:
    """Sprint 3.1: JobRecord serialize/deserialize JSON cho RedisJobStore."""
    from datetime import datetime, timezone

    from src.api.schemas import JobStatus
    from src.api.store import JobRecord

    rec = JobRecord(
        ticket_id="t-x", order_id="o-x", status=JobStatus.PROCESSING,
        created_at=datetime.now(timezone.utc),
        started_at=datetime.now(timezone.utc),
        progress=0.42, video_url="https://...",
        original_video_hash="b" * 64,
        result={"foo": "bar"},
    )
    raw = rec.to_json()
    back = JobRecord.from_json(raw)
    assert back.ticket_id == rec.ticket_id
    assert back.status == JobStatus.PROCESSING
    assert back.original_video_hash == rec.original_video_hash
    assert back.progress == 0.42
    assert back.result == {"foo": "bar"}
    print("  JobRecord JSON round-trip OK")


async def main() -> None:
    print("=== Sprint 3 smoke tests ===")
    await test_queue_background()
    await test_queue_arq_mock()
    test_storage_minio_mock()
    test_health_score_penalty_when_unstable()
    await test_in_memory_store_video_hash()
    await test_job_record_json_round_trip()
    print("All Sprint 3 tests passed.")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())

