"""Object storage for annotated videos (MinIO).

Không đổi contract BE: vẫn chỉ gửi `resultVideoUrl` string.
Nếu storage disabled -> fallback file:// local (hành vi Sprint 2).
"""
from __future__ import annotations

import logging
import os
from datetime import timedelta

from minio import Minio
from minio.error import S3Error

from .settings import Settings

logger = logging.getLogger(__name__)


def _build_client(settings: Settings) -> Minio:
    return Minio(
        settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        secure=settings.minio_secure,
    )


def _ensure_bucket(client: Minio, bucket: str) -> None:
    exists = client.bucket_exists(bucket)
    if not exists:
        client.make_bucket(bucket)
        logger.info("Created MinIO bucket: %s", bucket)


def upload_annotated_video(local_path: str, ticket_id: str, settings: Settings) -> str:
    """Upload file annotated và trả pre-signed URL.

    Raises exception nếu upload lỗi để caller quyết định mark FAILED hay fallback.
    """
    if not os.path.isfile(local_path):
        raise FileNotFoundError(f"Annotated file not found: {local_path}")

    object_name = f"annotated/{ticket_id}.mp4"
    client = _build_client(settings)
    _ensure_bucket(client, settings.minio_bucket)

    try:
        client.fput_object(
            settings.minio_bucket,
            object_name,
            local_path,
            content_type="video/mp4",
        )
    except S3Error as e:
        logger.error("MinIO upload failed: %s", e)
        raise

    url = client.presigned_get_object(
        settings.minio_bucket,
        object_name,
        expires=timedelta(seconds=settings.minio_presign_expiry_seconds),
    )
    logger.info("Uploaded annotated video: ticket=%s object=%s", ticket_id, object_name)
    return url

