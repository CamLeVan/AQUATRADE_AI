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
    app_version: str = "2.0.0-sprint2"
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

    @property
    def webhook_url(self) -> str:
        base = self.backend_base_url.rstrip("/")
        path = "/" + self.webhook_path.lstrip("/")
        return base + path


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached singleton - gọi nhiều lần không tốn."""
    return Settings()
