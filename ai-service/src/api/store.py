"""JobStore — lưu trạng thái job.

Có 2 implementation:
  - InMemoryJobStore: dict + asyncio.Lock (single-process, dev/test)
  - RedisJobStore: HASH trên Redis (multi-process, production)

`get_store()` chọn backend theo settings.job_store_backend ('memory' | 'redis').

JobRecord dùng dataclass đơn giản, serialize/deserialize qua JSON khi lưu Redis.

Idempotency: cùng `order_id` đang QUEUED/PROCESSING → trả ticket cũ.
"""
from __future__ import annotations

import asyncio
import json
import logging
import uuid
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any, Protocol

from .schemas import JobStatus
from .settings import Settings, get_settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# JobRecord
# ---------------------------------------------------------------------------

@dataclass
class JobRecord:
    ticket_id: str
    order_id: str
    proof_id: str
    status: JobStatus
    created_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None
    progress: float = 0.0
    video_url: str = ""
    callback_url: str | None = None
    fish_profile: str | None = None
    expected_count: int | None = None
    original_video_hash: str | None = None
    result: dict[str, Any] | None = None
    error: str | None = None
    # Sprint 5: số lần đã thử process (cho retry policy + dead-letter).
    attempts: int = 0

    def as_status_payload(self) -> dict[str, Any]:
        return {
            "ticketId": self.ticket_id,
            "orderId": self.order_id,
            "proofId": self.proof_id,
            "status": self.status.value,
            "progress": self.progress,
            "createdAt": self.created_at,
            "startedAt": self.started_at,
            "completedAt": self.completed_at,
            "result": self.result,
            "error": self.error,
            "attempts": self.attempts,
        }

    def to_json(self) -> str:
        d = asdict(self)
        d["status"] = self.status.value
        for k in ("created_at", "started_at", "completed_at"):
            if d[k] is not None:
                d[k] = d[k].isoformat()
        return json.dumps(d, ensure_ascii=False)

    @classmethod
    def from_json(cls, raw: str) -> "JobRecord":
        d = json.loads(raw)
        d["status"] = JobStatus(d["status"])
        for k in ("created_at", "started_at", "completed_at"):
            if d.get(k):
                d[k] = datetime.fromisoformat(d[k])
        return cls(**d)


# ---------------------------------------------------------------------------
# JobStore protocol
# ---------------------------------------------------------------------------

class IdempotencyConflictError(Exception):
    """Cùng orderId nhưng video_url/expectedCount khác (Sprint 5)."""


class JobStore(Protocol):
    async def create_or_get_active(
        self,
        *,
        order_id: str,
        proof_id: str,
        video_url: str,
        callback_url: str | None,
        fish_profile: str | None,
        expected_count: int | None,
    ) -> tuple[JobRecord, bool]: ...

    async def get(self, ticket_id: str) -> JobRecord | None: ...

    async def mark_processing(self, ticket_id: str) -> None: ...

    async def mark_done(self, ticket_id: str, result: dict[str, Any]) -> None: ...

    async def mark_failed(self, ticket_id: str, error: str) -> None: ...

    async def update_progress(self, ticket_id: str, progress: float) -> None: ...

    async def update_video_hash(self, ticket_id: str, video_hash: str) -> None: ...

    async def count_pending(self) -> int: ...

    # Sprint 5
    async def increment_attempts(self, ticket_id: str) -> int: ...

    async def push_dead_letter(self, ticket_id: str, reason: str) -> None: ...

    async def list_dead_letters(self, limit: int = 50) -> list[dict[str, Any]]: ...


# ---------------------------------------------------------------------------
# In-memory implementation (dev/test, single-process)
# ---------------------------------------------------------------------------

class InMemoryJobStore:
    """Dict + asyncio.Lock. Mất state khi restart, không share giữa process."""

    def __init__(self) -> None:
        self._jobs: dict[str, JobRecord] = {}
        # Sprint 6 (BE multi-batch): idempotency theo proofId, KHÔNG theo orderId.
        # 1 Order có nhiều proof (BUYER/SELLER × Thùng 1/2/...), mỗi proof là 1 job.
        self._by_proof: dict[str, str] = {}
        self._dead_letters: list[dict[str, Any]] = []
        self._lock = asyncio.Lock()

    async def create_or_get_active(
        self,
        *,
        order_id: str,
        proof_id: str,
        video_url: str,
        callback_url: str | None,
        fish_profile: str | None,
        expected_count: int | None,
    ) -> tuple[JobRecord, bool]:
        async with self._lock:
            existing_ticket = self._by_proof.get(proof_id)
            if existing_ticket:
                existing = self._jobs.get(existing_ticket)
                if existing and existing.status in (JobStatus.QUEUED, JobStatus.PROCESSING):
                    if existing.video_url and existing.video_url != video_url:
                        raise IdempotencyConflictError(
                            f"proofId={proof_id} đang xử lý với video_url khác."
                        )
                    return existing, False

            ticket_id = str(uuid.uuid4())
            record = JobRecord(
                ticket_id=ticket_id,
                order_id=order_id,
                proof_id=proof_id,
                status=JobStatus.QUEUED,
                created_at=datetime.now(timezone.utc),
                video_url=video_url,
                callback_url=callback_url,
                fish_profile=fish_profile,
                expected_count=expected_count,
            )
            self._jobs[ticket_id] = record
            self._by_proof[proof_id] = ticket_id
            return record, True

    async def get(self, ticket_id: str) -> JobRecord | None:
        async with self._lock:
            return self._jobs.get(ticket_id)

    async def mark_processing(self, ticket_id: str) -> None:
        async with self._lock:
            job = self._jobs.get(ticket_id)
            if job:
                job.status = JobStatus.PROCESSING
                job.started_at = datetime.now(timezone.utc)
                job.progress = 0.05

    async def mark_done(self, ticket_id: str, result: dict[str, Any]) -> None:
        async with self._lock:
            job = self._jobs.get(ticket_id)
            if job:
                job.status = JobStatus.DONE
                job.completed_at = datetime.now(timezone.utc)
                job.progress = 1.0
                job.result = result

    async def mark_failed(self, ticket_id: str, error: str) -> None:
        async with self._lock:
            job = self._jobs.get(ticket_id)
            if job:
                job.status = JobStatus.FAILED
                job.completed_at = datetime.now(timezone.utc)
                job.error = error

    async def update_progress(self, ticket_id: str, progress: float) -> None:
        async with self._lock:
            job = self._jobs.get(ticket_id)
            if job:
                job.progress = max(0.0, min(1.0, progress))

    async def update_video_hash(self, ticket_id: str, video_hash: str) -> None:
        async with self._lock:
            job = self._jobs.get(ticket_id)
            if job:
                job.original_video_hash = video_hash

    async def count_pending(self) -> int:
        async with self._lock:
            return sum(
                1 for j in self._jobs.values()
                if j.status in (JobStatus.QUEUED, JobStatus.PROCESSING)
            )

    async def increment_attempts(self, ticket_id: str) -> int:
        async with self._lock:
            job = self._jobs.get(ticket_id)
            if job is None:
                return 0
            job.attempts += 1
            return job.attempts

    async def push_dead_letter(self, ticket_id: str, reason: str) -> None:
        async with self._lock:
            job = self._jobs.get(ticket_id)
            entry = {
                "ticketId": ticket_id,
                "orderId": job.order_id if job else None,
                "videoUrl": job.video_url if job else None,
                "attempts": job.attempts if job else 0,
                "reason": reason,
                "at": datetime.now(timezone.utc).isoformat(),
            }
            self._dead_letters.insert(0, entry)
            # Giữ tối đa 1000 entries để không phình bộ nhớ.
            del self._dead_letters[1000:]

    async def list_dead_letters(self, limit: int = 50) -> list[dict[str, Any]]:
        async with self._lock:
            return list(self._dead_letters[: max(0, limit)])


# ---------------------------------------------------------------------------
# Redis-backed implementation (multi-process, production)
# ---------------------------------------------------------------------------

class RedisJobStore:
    """Lưu JobRecord trong Redis HASH để API + worker share state.

    Layout key (Sprint 6 BE-develop integration):
      ai:job:<ticket_id>          → JSON serialized JobRecord (TTL = settings)
      ai:job_by_proof:<proof_id>  → ticket_id (TTL = settings, dùng idempotency)
      ai:job_pending              → SET ticketId các job QUEUED/PROCESSING
      ai:job_dead_letters         → LIST các entry FAILED nhiều lần
    """

    def __init__(self, settings: Settings) -> None:
        # Import lazy để test không cần redis nếu chọn memory.
        from redis.asyncio import Redis

        self._redis: Redis = Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            db=settings.redis_db,
            password=settings.redis_password,
            ssl=settings.redis_ssl,
            decode_responses=True,
        )
        self._ttl = max(60, int(settings.arq_job_keep_result_seconds))
        self._key_prefix = "ai:job"
        # Sprint 6: idempotency theo proofId thay vì orderId.
        self._proof_prefix = "ai:job_by_proof"
        self._pending_set = "ai:job_pending"
        self._dead_letter_list = "ai:job_dead_letters"

    # ---- helpers ----

    def _job_key(self, ticket_id: str) -> str:
        return f"{self._key_prefix}:{ticket_id}"

    def _proof_key(self, proof_id: str) -> str:
        return f"{self._proof_prefix}:{proof_id}"

    async def _save(self, record: JobRecord) -> None:
        await self._redis.set(self._job_key(record.ticket_id), record.to_json(), ex=self._ttl)

    async def _load(self, ticket_id: str) -> JobRecord | None:
        raw = await self._redis.get(self._job_key(ticket_id))
        if raw is None:
            return None
        try:
            return JobRecord.from_json(raw)
        except Exception as e:  # noqa: BLE001
            logger.error("RedisJobStore: failed to parse %s: %s", ticket_id, e)
            return None

    # ---- API ----

    async def create_or_get_active(
        self,
        *,
        order_id: str,
        proof_id: str,
        video_url: str,
        callback_url: str | None,
        fish_profile: str | None,
        expected_count: int | None,
    ) -> tuple[JobRecord, bool]:
        existing_ticket = await self._redis.get(self._proof_key(proof_id))
        if existing_ticket:
            existing = await self._load(existing_ticket)
            if existing and existing.status in (JobStatus.QUEUED, JobStatus.PROCESSING):
                if existing.video_url and existing.video_url != video_url:
                    raise IdempotencyConflictError(
                        f"proofId={proof_id} đang xử lý với video_url khác."
                    )
                return existing, False

        ticket_id = str(uuid.uuid4())
        record = JobRecord(
            ticket_id=ticket_id,
            order_id=order_id,
            proof_id=proof_id,
            status=JobStatus.QUEUED,
            created_at=datetime.now(timezone.utc),
            video_url=video_url,
            callback_url=callback_url,
            fish_profile=fish_profile,
            expected_count=expected_count,
        )
        await self._save(record)
        await self._redis.set(self._proof_key(proof_id), ticket_id, ex=self._ttl)
        await self._redis.sadd(self._pending_set, ticket_id)
        return record, True

    async def get(self, ticket_id: str) -> JobRecord | None:
        return await self._load(ticket_id)

    async def _update(self, ticket_id: str, mutator) -> None:
        record = await self._load(ticket_id)
        if record is None:
            return
        mutator(record)
        await self._save(record)

    async def mark_processing(self, ticket_id: str) -> None:
        def _m(r: JobRecord) -> None:
            r.status = JobStatus.PROCESSING
            r.started_at = datetime.now(timezone.utc)
            r.progress = 0.05
        await self._update(ticket_id, _m)

    async def mark_done(self, ticket_id: str, result: dict[str, Any]) -> None:
        def _m(r: JobRecord) -> None:
            r.status = JobStatus.DONE
            r.completed_at = datetime.now(timezone.utc)
            r.progress = 1.0
            r.result = result
        await self._update(ticket_id, _m)
        await self._redis.srem(self._pending_set, ticket_id)

    async def mark_failed(self, ticket_id: str, error: str) -> None:
        def _m(r: JobRecord) -> None:
            r.status = JobStatus.FAILED
            r.completed_at = datetime.now(timezone.utc)
            r.error = error
        await self._update(ticket_id, _m)
        await self._redis.srem(self._pending_set, ticket_id)

    async def update_progress(self, ticket_id: str, progress: float) -> None:
        clamped = max(0.0, min(1.0, progress))

        def _m(r: JobRecord) -> None:
            r.progress = clamped
        await self._update(ticket_id, _m)

    async def update_video_hash(self, ticket_id: str, video_hash: str) -> None:
        def _m(r: JobRecord) -> None:
            r.original_video_hash = video_hash
        await self._update(ticket_id, _m)

    async def count_pending(self) -> int:
        return int(await self._redis.scard(self._pending_set))

    async def increment_attempts(self, ticket_id: str) -> int:
        record = await self._load(ticket_id)
        if record is None:
            return 0
        record.attempts += 1
        await self._save(record)
        return record.attempts

    async def push_dead_letter(self, ticket_id: str, reason: str) -> None:
        record = await self._load(ticket_id)
        entry = {
            "ticketId": ticket_id,
            "orderId": record.order_id if record else None,
            "videoUrl": record.video_url if record else None,
            "attempts": record.attempts if record else 0,
            "reason": reason,
            "at": datetime.now(timezone.utc).isoformat(),
        }
        await self._redis.lpush(self._dead_letter_list, json.dumps(entry, ensure_ascii=False))
        await self._redis.ltrim(self._dead_letter_list, 0, 999)

    async def list_dead_letters(self, limit: int = 50) -> list[dict[str, Any]]:
        if limit <= 0:
            return []
        raw = await self._redis.lrange(self._dead_letter_list, 0, limit - 1)
        out: list[dict[str, Any]] = []
        for item in raw:
            try:
                out.append(json.loads(item))
            except Exception:  # noqa: BLE001
                continue
        return out


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------

_default_store: JobStore | None = None


def get_store() -> JobStore:
    """Singleton JobStore theo settings.job_store_backend."""
    global _default_store
    if _default_store is None:
        settings = get_settings()
        if settings.job_store_backend == "redis":
            _default_store = RedisJobStore(settings)
            logger.info("JobStore backend: redis (host=%s)", settings.redis_host)
        else:
            _default_store = InMemoryJobStore()
            logger.info("JobStore backend: in-memory")
    return _default_store


def reset_store_for_tests() -> None:  # pragma: no cover - used in tests
    global _default_store
    _default_store = None
