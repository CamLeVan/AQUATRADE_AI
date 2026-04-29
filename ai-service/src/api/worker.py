"""Arq worker entrypoint for AI jobs.

Run:
    arq src.api.worker.WorkerSettings
"""
from __future__ import annotations

import logging
from typing import Any

from arq.connections import RedisSettings

from .service import process_job
from .settings import get_settings

logger = logging.getLogger(__name__)


async def process_job_task(ctx: dict[str, Any], ticket_id: str) -> None:
    """Arq task wrapper gọi pipeline processing."""
    await process_job(ticket_id)


class WorkerSettings:
    settings = get_settings()

    functions = [process_job_task]
    queue_name = settings.arq_queue_name
    redis_settings = RedisSettings(
        host=settings.redis_host,
        port=settings.redis_port,
        database=settings.redis_db,
        password=settings.redis_password,
        ssl=settings.redis_ssl,
    )
    job_timeout = settings.arq_job_timeout_seconds
    keep_result = settings.arq_job_keep_result_seconds

