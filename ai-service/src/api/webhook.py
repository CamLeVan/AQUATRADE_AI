"""Async webhook client gọi POST về core-backend.

Retry policy (tenacity):
  - exponential backoff: 1s -> 2s -> 4s -> 8s -> 16s (cap 32s)
  - chỉ retry khi lỗi mạng hoặc HTTP 5xx / 408 / 429
  - KHÔNG retry với 4xx khác (vì 4xx là lỗi payload của chính ta)
  - Retry tối đa settings.webhook_max_retries lần

BE idempotency: cùng `ticketId` đã xử lý sẽ trả 200 "Already processed"
(§3 contract) - retry an toàn.

Sprint 5 ADDITIVE:
  - HMAC-SHA256 signature outbound (Standard Webhooks style):
      X-Webhook-Timestamp: <unix-seconds>
      X-Webhook-Signature: v1=<hex>
    BE verify: hex == HMAC_SHA256(secret, f"{ts}.{raw_body}").
    KHÔNG đổi 6 trường body §3. BE chưa support → AI vẫn gửi (BE bỏ qua header).
"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import time
from typing import Any

import httpx
from tenacity import (
    AsyncRetrying,
    retry_if_exception,
    stop_after_attempt,
    wait_exponential,
)

from . import metrics as ai_metrics
from .schemas import AiResultPayload
from .settings import Settings, get_settings

logger = logging.getLogger(__name__)


class WebhookDeliveryError(Exception):
    """Webhook không gửi được sau khi hết retry."""


def _is_retryable(exc: BaseException) -> bool:
    if isinstance(exc, (httpx.TimeoutException, httpx.NetworkError)):
        return True
    if isinstance(exc, httpx.HTTPStatusError):
        code = exc.response.status_code
        # 408 Request Timeout, 429 Too Many Requests, 5xx -> đáng retry
        return code in (408, 429) or 500 <= code < 600
    return False


def compute_signature(secret: str, timestamp: int, body: bytes) -> str:
    """HMAC-SHA256 over `f"{timestamp}.{body}"` -> hex digest.

    Standardized to match Standard Webhooks v1.
    """
    msg = f"{timestamp}.".encode("utf-8") + body
    digest = hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()
    return digest


def _build_headers(
    settings: Settings,
    body_bytes: bytes,
) -> dict[str, str]:
    """Build webhook headers, including HMAC signature if enabled."""
    headers = {
        "X-Internal-Secret": settings.internal_secret,
        "Content-Type": "application/json",
    }
    if settings.webhook_hmac_enabled:
        if not settings.webhook_hmac_secret:
            # Bật HMAC nhưng quên config secret -> fail loud (security misconfig).
            raise WebhookDeliveryError(
                "webhook_hmac_enabled=True but webhook_hmac_secret is empty"
            )
        ts = int(time.time())
        sig = compute_signature(settings.webhook_hmac_secret, ts, body_bytes)
        headers[settings.webhook_hmac_timestamp_header] = str(ts)
        headers[settings.webhook_hmac_signature_header] = f"v1={sig}"
    return headers


async def send_webhook(
    payload: AiResultPayload,
    *,
    callback_url: str | None = None,
    settings: Settings | None = None,
) -> dict[str, Any]:
    """Gửi callback về BE develop với retry + (optional) HMAC signature.

    BE develop expect endpoint động (callbackUrl từ JobRequest):
        POST {callbackUrl}
        Header: X-Internal-Secret
        Body: AIDetectionDto.DonePayload (status DONE/FAILED)

    Raises:
        WebhookDeliveryError: sau khi hết retry vẫn fail.
        ValueError: nếu callback_url không được cung cấp (không có default fallback).
    """
    settings = settings or get_settings()
    if not callback_url:
        raise ValueError("callback_url is required (BE phải cấp khi gọi /ai/v1/jobs)")
    url = callback_url
    body = payload.to_wire()
    # Serialize ổn định để chữ ký HMAC tính trên đúng bytes server nhận được.
    body_bytes = json.dumps(body, separators=(",", ":"), ensure_ascii=False).encode(
        "utf-8"
    )
    headers = _build_headers(settings, body_bytes)

    logger.info(
        "Sending callback: url=%s status=%s orderId=%s aiFishCount=%s hmac=%s",
        url,
        payload.status,
        payload.order_id,
        payload.ai_fish_count,
        settings.webhook_hmac_enabled,
    )

    async def _attempt() -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=settings.webhook_timeout_seconds) as client:
            resp = await client.post(url, content=body_bytes, headers=headers)
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
                if attempt.retry_state.attempt_number > 1:
                    ai_metrics.webhook_delivery.labels(outcome="retry").inc()
                return await _attempt()
    except Exception as exc:
        logger.error(
            "Webhook delivery failed after retries: orderId=%s url=%s err=%s",
            payload.order_id, url, exc,
        )
        raise WebhookDeliveryError(str(exc)) from exc

    raise WebhookDeliveryError("Unknown error - AsyncRetrying did not yield")  # pragma: no cover
