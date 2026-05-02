"""Pydantic v2 models cho AI service HTTP API.

Sprint 6 (BE-develop integration): schema khớp BE branch develop.

  * `JobRequest` thêm `proofId` (BE multi-batch: 1 Order có nhiều DigitalProof
    theo `proofRole`=BUYER/SELLER và `batchName`=Thùng 1, 2…).
  * `AiResultPayload` (outbound) khớp `AIDetectionDto.DonePayload` Java BE,
    thay cho `WebhookPayload` §3 cũ.
  * `JobAcceptedResponse` thêm `ticketId` ở root response data — BE develop
    check `response.containsKey("ticketId")` ở root level.
  * Endpoint webhook KHÔNG cố định: BE truyền `callbackUrl` động kiểu
    `/api/v1/internal/orders/{orderId}/proofs/{proofId}/ai-result`.
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel, ConfigDict, Field, field_validator

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class JobStatus(str, Enum):
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    DONE = "DONE"
    FAILED = "FAILED"


# ---------------------------------------------------------------------------
# Global API wrapper (đồng bộ với BE)
# ---------------------------------------------------------------------------

class ApiResponse(BaseModel, Generic[T]):
    """Wrapper thống nhất khớp §1 Global Error Schema của contract."""
    status: Literal["success", "error"] = "success"
    message: str | None = None
    data: T | None = None


class ErrorResponse(BaseModel):
    status: Literal["error"] = "error"
    message: str
    data: None = None


# ---------------------------------------------------------------------------
# Inbound: BE submits a video analysis job
# ---------------------------------------------------------------------------

class JobRequest(BaseModel):
    """BE gửi khi muốn AI phân tích video của 1 mẻ (proof) trong 1 Order.

    BE develop multi-batch: 1 Order có nhiều DigitalProof
    (BUYER/SELLER × Thùng 1/2/...). Mỗi proof = 1 job AI riêng,
    được idempotent theo `proofId`.

    `videoUrl` là URL Cloudinary (FE đã upload bằng signed-upload).
    `callbackUrl` là URL động BE cấp:
        `<be>/api/v1/internal/orders/{orderId}/proofs/{proofId}/ai-result`
    """
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    order_id: str = Field(..., alias="orderId", description="UUID của Order")
    proof_id: str = Field(
        ..., alias="proofId",
        description="UUID của DigitalProof - khoá idempotency của AI job.",
    )
    video_url: str = Field(..., alias="videoUrl", description="URL tải video")
    callback_url: str | None = Field(
        default=None, alias="callbackUrl",
        description="URL BE cấp để AI POST kết quả về (bắt buộc trong prod).",
    )
    fish_profile: Literal["slow", "normal", "fast"] | None = Field(
        default=None, alias="fishProfile",
    )
    expected_count: int | None = Field(
        default=None, alias="expectedCount", ge=0,
    )

    @field_validator("video_url")
    @classmethod
    def _validate_url(cls, v: str) -> str:
        if not v or not v.startswith(("http://", "https://", "file://")):
            raise ValueError("videoUrl phải bắt đầu bằng http://, https://, hoặc file://")
        # Sprint 5: chống path traversal khi dùng file:// (chỉ dev/test)
        if v.startswith("file://"):
            path = v[len("file://"):]
            if ".." in path:
                raise ValueError("videoUrl file:// không được chứa '..'")
        return v


class JobAcceptedResponse(BaseModel):
    """202 Accepted: xác nhận đã nhận job, chưa xử lý."""
    model_config = ConfigDict(populate_by_name=True)

    ticket_id: str = Field(..., alias="ticketId")
    proof_id: str = Field(..., alias="proofId")
    status: JobStatus = JobStatus.QUEUED
    accepted_at: datetime = Field(..., alias="acceptedAt")
    estimated_seconds: int = Field(..., alias="estimatedSeconds")


class JobStatusResponse(BaseModel):
    """GET /ai/v1/jobs/{ticketId}: trạng thái + (nếu DONE) kết quả."""
    model_config = ConfigDict(populate_by_name=True)

    ticket_id: str = Field(..., alias="ticketId")
    order_id: str = Field(..., alias="orderId")
    proof_id: str = Field(..., alias="proofId")
    status: JobStatus
    progress: float = Field(0.0, ge=0.0, le=1.0)
    created_at: datetime = Field(..., alias="createdAt")
    started_at: datetime | None = Field(None, alias="startedAt")
    completed_at: datetime | None = Field(None, alias="completedAt")
    result: dict[str, Any] | None = None
    error: str | None = None


# ---------------------------------------------------------------------------
# Outbound: AI → BE callback (khớp AIDetectionDto.DonePayload của BE develop)
# ---------------------------------------------------------------------------

class AiResultPayload(BaseModel):
    """Khớp `AIDetectionDto.DonePayload` Java BE develop.

    BE expect endpoint động: POST {callbackUrl} (do BE cấp khi gọi /ai/v1/jobs).
    Header bắt buộc: `X-Internal-Secret`.

    Field bắt buộc khi `status="DONE"`: orderId, aiFishCount, healthScore,
    qualityStatus, aiImageUrl, proofHash, createdAt.
    Field bắt buộc khi `status="FAILED"`: orderId, errorMessage, createdAt.

    Các field "mở rộng" (averageSize, impuritiesCount, colorUniformity,
    aiNotes) BE để optional, AI để None nếu chưa hỗ trợ.
    """
    model_config = ConfigDict(populate_by_name=True)

    status: Literal["DONE", "FAILED"]
    order_id: str = Field(..., alias="orderId")
    error_message: str | None = Field(default=None, alias="errorMessage")
    ai_fish_count: int | None = Field(default=None, alias="aiFishCount", ge=0)
    health_score: int | None = Field(default=None, alias="healthScore", ge=0, le=100)
    quality_status: Literal["NORMAL", "LOW"] | None = Field(
        default=None, alias="qualityStatus",
    )
    ai_image_url: str | None = Field(default=None, alias="aiImageUrl")
    proof_hash: str | None = Field(default=None, alias="proofHash")

    # Mở rộng - chưa hỗ trợ, để None.
    average_size: float | None = Field(default=None, alias="averageSize")
    impurities_count: int | None = Field(default=None, alias="impuritiesCount")
    color_uniformity: int | None = Field(default=None, alias="colorUniformity")
    ai_notes: str | None = Field(default=None, alias="aiNotes")

    created_at: datetime = Field(..., alias="createdAt")

    def to_wire(self) -> dict[str, Any]:
        """JSON-ready dict với alias camelCase + ISO-8601 UTC Z timestamp."""
        data = self.model_dump(by_alias=True, mode="json", exclude_none=True)
        ts = self.created_at
        if ts.tzinfo is None:
            data["createdAt"] = ts.isoformat() + "Z"
        else:
            data["createdAt"] = ts.isoformat().replace("+00:00", "Z")
        return data


# ---------------------------------------------------------------------------
# Health & Models
# ---------------------------------------------------------------------------

class DependencyStatus(BaseModel):
    """Trạng thái 1 dependency (Redis, MinIO...). Sprint 4."""
    model_config = ConfigDict(populate_by_name=True)

    status: Literal["UP", "DOWN", "DISABLED"]
    error: str | None = None


class HealthResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status: Literal["UP", "DEGRADED", "DOWN"] = "UP"
    app_name: str = Field(..., alias="appName")
    app_version: str = Field(..., alias="appVersion")
    model_loaded: bool = Field(..., alias="modelLoaded")
    model_version: str = Field(..., alias="modelVersion")
    uptime_seconds: float = Field(..., alias="uptimeSeconds")
    pending_jobs: int = Field(..., alias="pendingJobs")
    # Sprint 4: dependency health detail
    dependencies: dict[str, DependencyStatus] = Field(default_factory=dict)


class ModelInfo(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    version: str
    path: str
    active: bool = True
    loaded_at: datetime | None = Field(None, alias="loadedAt")
    # Sprint 7-LITE: SHA-256 file weights cho audit dispute.
    sha256: str | None = None


class ModelListResponse(BaseModel):
    active_version: str = Field(..., alias="activeVersion")
    models: list[ModelInfo]
    model_config = ConfigDict(populate_by_name=True)
