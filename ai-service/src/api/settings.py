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
    # Header `X-Internal-Secret` shared với core-backend (InternalApiKeyFilter).
    # BE default: `AquaTrade-AI-Secret-Key-2026` (config key
    # `aquatrade.internal.api-key`). Production PHẢI override qua env.
    internal_secret: str = Field(
        default="AquaTrade-AI-Secret-Key-2026",
        description="Shared secret hiện tại (X-Internal-Secret).",
    )
    # Sprint 5: rotation. Khi đang rotate: BE/AI nhận cả 2 secret hợp lệ.
    # Sau khi xác nhận tất cả client đã chuyển → bỏ giá trị này.
    internal_secret_previous: str | None = Field(
        default=None,
        description=(
            "Secret cũ vẫn được chấp nhận trong giai đoạn rotate. "
            "Sau khi rollout xong PHẢI để None để khoá hoàn toàn."
        ),
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

    # === Webhook HMAC signature (Sprint 5, Standard Webhooks style) ===
    # ADDITIVE: §3 vẫn giữ 6 trường body, chỉ THÊM 2 HEADER mới.
    # BE chưa verify cũng KHÔNG ảnh hưởng - 401 được trả nếu BE đã bật verify
    # mà secret không khớp.
    webhook_hmac_enabled: bool = Field(
        default=False,
        description="Bật ký HMAC-SHA256 outbound webhook (khuyến nghị production).",
    )
    webhook_hmac_secret: str | None = Field(
        default=None,
        description=(
            "Secret để ký webhook body (KHÁC với internal_secret). "
            "Bắt buộc khi webhook_hmac_enabled=True."
        ),
    )
    webhook_hmac_signature_header: str = "X-Webhook-Signature"
    webhook_hmac_timestamp_header: str = "X-Webhook-Timestamp"

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

    # Sprint 5: ràng buộc URL video chặt hơn để tránh SSRF / file lậu.
    # - dev: để rỗng -> chấp nhận mọi http(s) host (giữ tương thích test)
    # - prod: liệt kê host MinIO/CDN BE phát URL: ["minio.aquatrade.local", "s3.amazonaws.com"]
    allowed_video_hosts: list[str] = Field(default_factory=list)
    # MIME được chấp nhận khi check Content-Type của response HTTP.
    allowed_video_mime_prefixes: list[str] = Field(
        default_factory=lambda: [
            "video/",
            "application/octet-stream",  # MinIO/S3 hay trả thế này
        ]
    )

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

    # === Reliability: retry pipeline + dead-letter (Sprint 5) ===
    # Khi pipeline raise (download/inference/etc) trước khi gửi webhook ->
    # ta sẽ thử tối đa `job_max_attempts` lần. Mỗi lần fail -> tăng attempts.
    # Khi vượt ngưỡng -> mark FAILED + đẩy vào dead-letter để vận hành xử lý.
    job_max_attempts: int = Field(default=3, ge=1, le=10)
    job_retry_delay_seconds: float = 5.0
    dead_letter_enabled: bool = True

    # === Rate limit cho POST /ai/v1/jobs (Sprint 5) ===
    # Token bucket đơn giản, theo IP. 0 = tắt.
    rate_limit_jobs_per_minute: int = Field(default=120, ge=0)

    # === Object storage (Sprint 3) - MinIO/S3 cho video annotated (private) ===
    # Tùy chọn: nếu false, AI vẫn chạy được, nhưng sẽ không có URL video annotated.
    object_storage_enabled: bool = False
    object_storage_backend: Literal["minio"] = "minio"
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_secure: bool = False
    minio_bucket: str = "aquatrade-ai"
    minio_presign_expiry_seconds: int = 604800  # 7 days

    # === Cloudinary (Sprint 6 BE-develop integration) ===
    # AI upload "best frame" image lên Cloudinary cho `aiImageUrl` trong
    # callback BE. Sử dụng cùng credentials với BE (Cách A).
    cloudinary_enabled: bool = False
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    cloudinary_image_upload_preset: str = "aquatrade_ai_image_preset"
    cloudinary_image_folder: str = "aquatrade/ai-results"

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
