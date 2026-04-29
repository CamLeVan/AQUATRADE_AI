"""Structured logging cho AI service (Sprint 4).

Mục tiêu:
  * Log JSON format ở production để ELK/Loki/Datadog parse được
  * Log key-value màu mè ở dev để dễ đọc
  * Mỗi log line có thể bind context (ticket_id, order_id, model_version) để
    grep nhanh khi debug dispute hoặc xem log 1 job cụ thể

Cách dùng:

    # Bootstrap 1 lần ở entry point (uvicorn, arq worker):
    from src.api.logging_config import configure_logging
    configure_logging()

    # Trong code:
    from src.api.logging_config import get_logger
    log = get_logger(__name__)

    log.info("job_started", ticket_id="abc", order_id="xyz")
    # → JSON: {"event":"job_started","ticket_id":"abc","order_id":"xyz",...}

    # Bind context để mọi log sau đó tự kèm:
    log = log.bind(ticket_id="abc")
    log.info("downloaded", bytes=1234)  # → có ticket_id sẵn
"""
from __future__ import annotations

import logging
import os
import sys
from typing import Any

import structlog

from .settings import get_settings


def configure_logging() -> None:
    """Cấu hình structlog + stdlib logging dùng chung formatter.

    Idempotent: gọi nhiều lần không bị nhân đôi handler.
    """
    settings = get_settings()
    level_name = os.environ.get("LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    # Format JSON ở prod/staging, console-friendly ở dev.
    json_logs = settings.environment != "dev" or os.environ.get("LOG_JSON") == "1"

    timestamper = structlog.processors.TimeStamper(fmt="iso", utc=True)

    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        timestamper,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    if json_logs:
        renderer: Any = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer(colors=True)

    structlog.configure(
        processors=shared_processors
        + [structlog.stdlib.ProcessorFormatter.wrap_for_formatter],
        wrapper_class=structlog.make_filtering_bound_logger(level),
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=shared_processors,
        processors=[structlog.stdlib.ProcessorFormatter.remove_processors_meta, renderer],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root = logging.getLogger()
    # Replace handlers (idempotent)
    for h in list(root.handlers):
        root.removeHandler(h)
    root.addHandler(handler)
    root.setLevel(level)

    # Tắt log noisy của vài lib
    for noisy in ("uvicorn.access", "matplotlib", "PIL", "httpx", "httpcore"):
        logging.getLogger(noisy).setLevel(max(level, logging.WARNING))


def get_logger(name: str | None = None) -> structlog.stdlib.BoundLogger:
    """Wrapper structlog có type hint."""
    return structlog.stdlib.get_logger(name)


def bind_context(**kwargs: Any) -> None:
    """Bind context vào contextvars để mọi log trong cùng task tự kèm.

    Hữu ích trong async worker khi muốn ticket_id/order_id xuất hiện ở mọi
    dòng log của 1 job mà không phải truyền tay xuống.
    """
    structlog.contextvars.bind_contextvars(**kwargs)


def clear_context() -> None:
    """Xóa contextvars (gọi cuối job để không leak sang job sau)."""
    structlog.contextvars.clear_contextvars()
