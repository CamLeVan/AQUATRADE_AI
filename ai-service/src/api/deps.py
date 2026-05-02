"""FastAPI dependencies chung.

Sprint 5:
    * Hỗ trợ rotate `X-Internal-Secret` (current + previous song song).
    * Rate limiting đơn giản (token-bucket per-IP) cho /ai/v1/jobs.
"""
from __future__ import annotations

import secrets
import time
from collections import defaultdict
from typing import Iterable

from fastapi import Depends, Header, HTTPException, Request, status

from .logging_config import get_logger
from .settings import Settings, get_settings

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Internal secret (with rotation)
# ---------------------------------------------------------------------------

def _accepted_secrets(settings: Settings) -> Iterable[str]:
    """Return tuple các secret hợp lệ (current + previous nếu có)."""
    if settings.internal_secret_previous:
        return (settings.internal_secret, settings.internal_secret_previous)
    return (settings.internal_secret,)


async def require_internal_secret(
    x_internal_secret: str | None = Header(default=None, alias="X-Internal-Secret"),
    settings: Settings = Depends(get_settings),
) -> None:
    """Kiểm tra header `X-Internal-Secret` khớp 1 trong các secret hợp lệ.

    Trong giai đoạn rotate, BE/AI có thể giữ song song 2 secret để các client
    chưa chuyển sang secret mới vẫn gọi được. Secret cũ luôn được log riêng
    để vận hành biết khi nào có thể tắt hẳn.
    """
    if not x_internal_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-Internal-Secret header",
        )

    accepted = list(_accepted_secrets(settings))
    for idx, expected in enumerate(accepted):
        if expected and secrets.compare_digest(x_internal_secret, expected):
            if idx > 0:
                logger.warning(
                    "internal_secret_legacy_used",
                    note="Caller still sends the previous secret; rotate clients ASAP.",
                )
            return

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid X-Internal-Secret header",
    )


# ---------------------------------------------------------------------------
# Rate limiting (per-IP token bucket)
# ---------------------------------------------------------------------------

class _RateLimiter:
    """Token bucket per-key.

    Đơn giản, single-process. Production có thể swap sang Redis-based limiter.
    Mục tiêu chính: chống burst do bug client / scan bên ngoài.
    """

    def __init__(self) -> None:
        self._buckets: dict[str, tuple[float, float]] = defaultdict(
            lambda: (0.0, 0.0)
        )

    def allow(self, key: str, *, capacity: int, refill_per_sec: float) -> bool:
        if capacity <= 0:
            return True  # disabled
        now = time.monotonic()
        tokens, last = self._buckets[key]
        if last == 0.0:
            tokens = float(capacity)
        else:
            tokens = min(float(capacity), tokens + (now - last) * refill_per_sec)
        if tokens < 1.0:
            self._buckets[key] = (tokens, now)
            return False
        self._buckets[key] = (tokens - 1.0, now)
        return True


_jobs_limiter = _RateLimiter()


async def rate_limit_jobs(
    request: Request,
    settings: Settings = Depends(get_settings),
) -> None:
    rpm = settings.rate_limit_jobs_per_minute
    if rpm <= 0:
        return
    client_ip = (request.client.host if request.client else "unknown") or "unknown"
    if not _jobs_limiter.allow(
        f"jobs:{client_ip}",
        capacity=rpm,
        refill_per_sec=rpm / 60.0,
    ):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded for /ai/v1/jobs",
        )


def reset_rate_limiter_for_tests() -> None:  # pragma: no cover
    _jobs_limiter._buckets.clear()
