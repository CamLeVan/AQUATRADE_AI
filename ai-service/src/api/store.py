"""JobStore - lưu trạng thái job trong RAM.

Sprint 2 dùng tạm dict + asyncio.Lock để PoC end-to-end. Sprint 3 sẽ chuyển
sang PostgreSQL + Arq (khi đó store này thành interface để backend storage
dễ thay thế).

Idempotency đơn giản: cùng `order_id` đang PROCESSING → trả về ticket cũ
thay vì tạo ticket mới (chống buyer bấm 2 lần hoặc BE retry).
"""
from __future__ import annotations

import asyncio
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from .schemas import JobStatus


@dataclass
class JobRecord:
    ticket_id: str
    order_id: str
    status: JobStatus
    created_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None
    progress: float = 0.0
    video_url: str = ""
    callback_url: str | None = None
    fish_profile: str | None = None
    expected_count: int | None = None
    result: dict[str, Any] | None = None
    error: str | None = None

    def as_status_payload(self) -> dict[str, Any]:
        return {
            "ticketId": self.ticket_id,
            "orderId": self.order_id,
            "status": self.status.value,
            "progress": self.progress,
            "createdAt": self.created_at,
            "startedAt": self.started_at,
            "completedAt": self.completed_at,
            "result": self.result,
            "error": self.error,
        }


class JobStore:
    """In-memory, async-safe store."""

    def __init__(self) -> None:
        self._jobs: dict[str, JobRecord] = {}
        self._by_order: dict[str, str] = {}  # orderId → ticketId đang active
        self._lock = asyncio.Lock()

    async def create_or_get_active(
        self,
        *,
        order_id: str,
        video_url: str,
        callback_url: str | None,
        fish_profile: str | None,
        expected_count: int | None,
    ) -> tuple[JobRecord, bool]:
        """Tạo job mới, hoặc trả job đang chạy cho orderId (idempotency nhẹ).

        Returns:
            (JobRecord, is_new): is_new=False nếu orderId đã có ticket active.
        """
        async with self._lock:
            existing_ticket = self._by_order.get(order_id)
            if existing_ticket:
                existing = self._jobs.get(existing_ticket)
                if existing and existing.status in (JobStatus.QUEUED, JobStatus.PROCESSING):
                    return existing, False

            ticket_id = str(uuid.uuid4())
            record = JobRecord(
                ticket_id=ticket_id,
                order_id=order_id,
                status=JobStatus.QUEUED,
                created_at=datetime.now(timezone.utc),
                video_url=video_url,
                callback_url=callback_url,
                fish_profile=fish_profile,
                expected_count=expected_count,
            )
            self._jobs[ticket_id] = record
            self._by_order[order_id] = ticket_id
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

    async def count_pending(self) -> int:
        async with self._lock:
            return sum(
                1 for j in self._jobs.values()
                if j.status in (JobStatus.QUEUED, JobStatus.PROCESSING)
            )


_default_store: JobStore | None = None


def get_store() -> JobStore:
    """Singleton JobStore, dùng qua Depends hoặc truy cập trực tiếp."""
    global _default_store
    if _default_store is None:
        _default_store = JobStore()
    return _default_store


def reset_store_for_tests() -> None:  # pragma: no cover - used in tests
    global _default_store
    _default_store = None
