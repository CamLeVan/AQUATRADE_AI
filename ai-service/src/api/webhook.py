"""Async webhook client gọi POST về core-backend.

Retry policy (tenacity):
  - exponential backoff: 1s → 2s → 4s → 8s → 16s (max 32s cap)
  - chỉ retry khi lỗi mạng hoặc HTTP 5xx / 408 / 429
  - KHÔNG retry với 4xx (vì 4xx là lỗi payload của chính ta)
  - Retry tối đa settings.webhook_max_retries lần

BE idempotency: cùng `ticketId` đã xử lý sẽ trả 200 "Already processed"
(§3 contract) — nên ta có thể retry an toàn.
"""
from __future__ import annotations

import logging
from typing import Any

import httpx
from tenacity import (
    AsyncRetrying,
    retry_if_exception,
    stop_after_attempt,
    wait_exponential,
)

from .schemas import WebhookPayload
from .settings import Settings, get_settings

logger = logging.getLogger(__name__)


class WebhookDeliveryError(Exception):
    """Webhook không gửi được sau khi hết retry."""


def _is_retryable(exc: BaseException) -> bool:
    if isinstance(exc, (httpx.TimeoutException, httpx.NetworkError)):
        return True
    if isinstance(exc, httpx.HTTPStatusError):
        code = exc.response.status_code
        # 408 Request Timeout, 429 Too Many Requests, 5xx → đáng retry
        return code in (408, 429) or 500 <= code < 600
    return False


async def send_webhook(
    payload: WebhookPayload,
    *,
    callback_url: str | None = None,
    settings: Settings | None = None,
) -> dict[str, Any]:
    """Gửi webhook về BE với retry.

    Args:
        payload: đã validate theo §3 contract.
        callback_url: nếu None, dùng settings.webhook_url.

    Returns:
        Response JSON từ BE (thường là {"message": "Webhook processed", ...}).

    Raises:
        WebhookDeliveryError: sau khi hết retry vẫn fail.
    """
    settings = settings or get_settings()
    url = callback_url or settings.webhook_url
    headers = {
        "X-Internal-Secret": settings.internal_secret,
        "Content-Type": "application/json",
    }
    body = payload.to_wire()

    logger.info(
        "Sending webhook: url=%s ticketId=%s orderId=%s fishCount=%d",
        url, payload.ticket_id, payload.order_id, payload.fish_count,
    )

    async def _attempt() -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=settings.webhook_timeout_seconds) as client:
            resp = await client.post(url, json=body, headers=headers)
            resp.raise_for_status()
            try:
                return resp.json()
            except ValueError:
                return {"status": resp.status_code, "body": resp.text}

    retry = AsyncRetrying(
        stop=stop_after_attempt(max(1, settings.webhook_max_retries)),
        wait=wait_exponential(multiplier=1, min=1, max=32),
        retry=retry_if_exception(_is_retryable),
        reraise=False,
    )

    try:
        async for attempt in retry:
            with attempt:
                return await _attempt()
    except Exception as exc:
        logger.error(
            "Webhook delivery failed after retries: ticketId=%s url=%s err=%s",
            payload.ticket_id, url, exc,
        )
        raise WebhookDeliveryError(str(exc)) from exc

    raise WebhookDeliveryError("Unknown error - AsyncRetrying did not yield")  # pragma: no cover
