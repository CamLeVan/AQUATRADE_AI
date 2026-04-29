"""Cấu hình AI service, đọc từ env vars (hoặc file .env khi dev).

Tuân theo 12-factor: mọi giá trị cấu hình đều có thể override qua env mà
không cần sửa code. Trong Docker/k8s chỉ cần set env là đủ.

Cách dùng:
    from src.api.settings import get_settings
    settings = get_settings()
    print(settings.internal_secret)

File .env (dev):
    INTERNAL_SECRET=dev-secret-change-me
    BACKEND_BASE_URL=http://localhost:8080
    MODEL_PATH=models/best.pt
    MODEL_VERSION=v1.0.0
"""
from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # === App metadata ===
    app_name: str = "AquaTrade AI Service"
    app_version: str = "3.0.0-sprint3"
    environment: Literal["dev", "staging", "prod"] = "dev"

    # === Security ===
    # Khớp với §1 Technical Standards của EXHAUSTIVE_API_CONTRACT.md
    # Giá trị này PHẢI trùng với cấu hình `X-Internal-Secret` bên core-backend.
    internal_secret: str = Field(
        default="dev-secret-change-me",
        description="Shared secret với core-backend cho header X-Internal-Secret",
    )

    # === Backend webhook ===
    backend_base_url: str = Field(
        default="http://localhost:8080",
        description="Base URL của core-backend (Java Spring)",
    )
    webhook_path: str = Field(
        default="/api/v1/internal/ai-webhook",
        description="Đường dẫn webhook bên BE (ứng với §2.6 contract)",
    )
    webhook_timeout_seconds: float = 10.0
    webhook_max_retries: int = 5

    # === Model ===
    model_path: str = "models/best.pt"
    model_version: str = "unknown"

    # === Pipeline defaults ===
    default_fish_profile: Literal["slow", "normal", "fast"] = "normal"
    max_video_duration_seconds: int = 90
    min_video_duration_seconds: int = 15
    smart_stop_patience_seconds: int = 10

    # === Video download ===
    video_download_dir: str = "data/incoming"
    video_download_timeout_seconds: float = 120.0
    max_video_size_mb: int = 500

    # === Annotated video output ===
    annotated_output_dir: str = "data/outputs"

    # === Queue backend (Sprint 3) ===
    # `background`: giữ cách cũ (FastAPI BackgroundTasks) để tương thích ngược.
    # `arq`: enqueue job qua Redis + Arq worker (khuyến nghị production).
    queue_backend: Literal["background", "arq"] = "background"

    # === Job state store (Sprint 3.1) ===
    # `memory`: dict in-process (single-process, dev/test).
    # `redis`: Redis HASH share giữa API + worker process (bắt buộc khi queue=arq).
    job_store_backend: Literal["memory", "redis"] = "memory"

    # Redis/Arq settings
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: str | None = None
    redis_ssl: bool = False
    arq_queue_name: str = "aquatrade:jobs"
    arq_job_timeout_seconds: int = 3600
    arq_job_keep_result_seconds: int = 2592000  # 30 days

    # === Object storage (Sprint 3) ===
    # Nếu false: giữ behavior cũ, trả file:// URL local.
    object_storage_enabled: bool = False
    object_storage_backend: Literal["minio"] = "minio"
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_secure: bool = False
    minio_bucket: str = "aquatrade-ai"
    minio_presign_expiry_seconds: int = 604800  # 7 days

    @property
    def webhook_url(self) -> str:
        base = self.backend_base_url.rstrip("/")
        path = "/" + self.webhook_path.lstrip("/")
        return base + path

    @property
    def redis_dsn(self) -> str:
        scheme = "rediss" if self.redis_ssl else "redis"
        auth = ""
        if self.redis_password:
            auth = f":{self.redis_password}@"
        return f"{scheme}://{auth}{self.redis_host}:{self.redis_port}/{self.redis_db}"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached singleton - gọi nhiều lần không tốn."""
    return Settings()
