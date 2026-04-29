"""Queue abstraction cho submit job.

Sprint 3 thêm Arq + Redis nhưng giữ backward compatibility:
- queue_backend=background: chạy như Sprint 2
- queue_backend=arq: enqueue qua Redis để worker xử lý async
"""
from __future__ import annotations

import logging
from typing import Literal

from arq import create_pool
from arq.connections import RedisSettings

from .settings import Settings

logger = logging.getLogger(__name__)


def _redis_settings_from_app(settings: Settings) -> RedisSettings:
    return RedisSettings(
        host=settings.redis_host,
        port=settings.redis_port,
        database=settings.redis_db,
        password=settings.redis_password,
        ssl=settings.redis_ssl,
    )


async def enqueue_job(ticket_id: str, settings: Settings) -> Literal["background", "arq"]:
    """Enqueue ticket theo backend đã chọn."""
    if settings.queue_backend == "background":
        return "background"

    redis = await create_pool(_redis_settings_from_app(settings))
    await redis.enqueue_job(
        "process_job_task",
        ticket_id,
        _queue_name=settings.arq_queue_name,
        _job_timeout=settings.arq_job_timeout_seconds,
    )
    logger.info("Enqueued via Arq: ticket=%s queue=%s", ticket_id, settings.arq_queue_name)
    await redis.close()
    return "arq"

