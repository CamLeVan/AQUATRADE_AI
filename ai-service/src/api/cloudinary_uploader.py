"""Cloudinary uploader cho AI service 

Cách A: AI có credentials đầy đủ (cùng với BE), tự sign + upload trực tiếp.
- BE đã config sẵn upload preset `aquatrade_ai_image_preset` cho ảnh annotated.
- AI upload public image (signed) -> dùng làm `aiImageUrl` trong callback.

Cách B: AI xin signature từ BE qua endpoint riêng. Khi đó chỉ
cần thay `upload_image_public` bằng implementation gọi BE.
"""
from __future__ import annotations

import logging
from typing import Any

from .settings import Settings

logger = logging.getLogger(__name__)


class CloudinaryNotConfiguredError(Exception):
    """Cloudinary đã enable nhưng thiếu credentials."""


def _ensure_configured(settings: Settings) -> None:
    if not settings.cloudinary_enabled:
        raise CloudinaryNotConfiguredError("cloudinary_enabled=False")
    missing = [
        name
        for name, val in (
            ("cloud_name", settings.cloudinary_cloud_name),
            ("api_key", settings.cloudinary_api_key),
            ("api_secret", settings.cloudinary_api_secret),
        )
        if not val
    ]
    if missing:
        raise CloudinaryNotConfiguredError(
            f"missing credentials: {', '.join(missing)}"
        )


def _configure_sdk(settings: Settings) -> None:
    """Lazy-config Cloudinary SDK từ settings."""
    import cloudinary

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


def upload_image_public(
    local_path: str, ticket_id: str, settings: Settings,
) -> str:
    """Upload `local_path` lên Cloudinary, trả về `secure_url`.

    Sử dụng `upload_preset` (đã config trên Cloudinary) để giới hạn:
    folder, max size, allowed formats. AI chỉ ký timestamp + preset.

    Raises:
        CloudinaryNotConfiguredError: thiếu cấu hình.
        cloudinary.exceptions.Error: lỗi mạng / quota / preset sai.
    """
    _ensure_configured(settings)
    _configure_sdk(settings)

    import cloudinary.uploader

    # Public ID lưu kèm ticket_id để tra lại được khi dispute.
    public_id = f"order_proof_{ticket_id}"

    logger.info(
        "cloudinary_upload_start: public_id=%s preset=%s folder=%s",
        public_id,
        settings.cloudinary_image_upload_preset,
        settings.cloudinary_image_folder,
    )

    result: dict[str, Any] = cloudinary.uploader.upload(
        local_path,
        public_id=public_id,
        upload_preset=settings.cloudinary_image_upload_preset,
        folder=settings.cloudinary_image_folder,
        resource_type="image",
        overwrite=True,
        invalidate=True,
    )

    secure_url = result.get("secure_url")
    if not secure_url:
        raise RuntimeError(f"Cloudinary upload OK but no secure_url: {result}")

    logger.info("cloudinary_upload_ok: url=%s bytes=%s",
                secure_url, result.get("bytes"))
    return secure_url


__all__ = ["upload_image_public", "CloudinaryNotConfiguredError"]
