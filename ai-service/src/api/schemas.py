"""Pydantic v2 models cho AI service HTTP API.

Các schema này được thiết kế để:
  1. WebhookPayload khớp CHÍNH XÁC §3 EXHAUSTIVE_API_CONTRACT.md
     (tên field camelCase, kiểu dữ liệu, format timestamp ISO-8601 UTC).
  2. JobRequest/JobResponse là thiết kế nội bộ cho chiều BE → AI
     (contract không quy định cụ thể).
  3. ApiResponse wrapper khớp với format global của BE (§1) để dễ parse.
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
    """BE gửi khi muốn AI phân tích video của 1 Order.

    `videoUrl` phải là URL có thể tải được từ AI service (MinIO/S3 pre-signed,
    hoặc endpoint nội bộ BE cung cấp).
    """
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    order_id: str = Field(..., alias="orderId", description="UUID của Order")
    video_url: str = Field(..., alias="videoUrl", description="URL tải video")
    callback_url: str | None = Field(
        default=None, alias="callbackUrl",
        description=(
            "Override webhook URL. Nếu None → dùng settings.webhook_url."
        ),
    )
    fish_profile: Literal["slow", "normal", "fast"] | None = Field(
        default=None, alias="fishProfile",
    )
    expected_count: int | None = Field(
        default=None, alias="expectedCount", ge=0,
        description="Số cá buyer đặt ban đầu, dùng để AI log nếu lệch lớn",
    )

    @field_validator("video_url")
    @classmethod
    def _validate_url(cls, v: str) -> str:
        if not v or not v.startswith(("http://", "https://", "file://")):
            raise ValueError("videoUrl phải bắt đầu bằng http://, https://, hoặc file://")
        return v


class JobAcceptedResponse(BaseModel):
    """202 Accepted: xác nhận đã nhận job, chưa xử lý."""
    model_config = ConfigDict(populate_by_name=True)

    ticket_id: str = Field(..., alias="ticketId")
    status: JobStatus = JobStatus.QUEUED
    accepted_at: datetime = Field(..., alias="acceptedAt")
    estimated_seconds: int = Field(..., alias="estimatedSeconds")


class JobStatusResponse(BaseModel):
    """GET /ai/v1/jobs/{ticketId}: trạng thái + (nếu DONE) kết quả."""
    model_config = ConfigDict(populate_by_name=True)

    ticket_id: str = Field(..., alias="ticketId")
    order_id: str = Field(..., alias="orderId")
    status: JobStatus
    progress: float = Field(0.0, ge=0.0, le=1.0)
    created_at: datetime = Field(..., alias="createdAt")
    started_at: datetime | None = Field(None, alias="startedAt")
    completed_at: datetime | None = Field(None, alias="completedAt")
    result: dict[str, Any] | None = None
    error: str | None = None


# ---------------------------------------------------------------------------
# Outbound: AI → BE webhook (§3 contract)
# ---------------------------------------------------------------------------

class WebhookPayload(BaseModel):
    """KHỚP §3 EXHAUSTIVE_API_CONTRACT.md.

    6 field bắt buộc theo §3 GIỮ NGUYÊN. Bổ sung optional `originalVideoHash`
    cho mục đích audit/dispute (Sprint 3.1) — BE chưa parse cũng không sao.
    Nếu BE update contract, phải update schema này đồng thời.
    """
    model_config = ConfigDict(populate_by_name=True)

    ticket_id: str = Field(..., alias="ticketId")
    order_id: str = Field(..., alias="orderId")
    fish_count: int = Field(..., alias="fishCount", ge=0)
    health_score: float = Field(..., alias="healthScore", ge=0.0, le=100.0)
    result_video_url: str = Field(..., alias="resultVideoUrl")
    timestamp: datetime
    original_video_hash: str | None = Field(
        default=None,
        alias="originalVideoHash",
        description="SHA-256 hex digest của video gốc đã download (audit/dispute).",
    )

    def to_wire(self) -> dict[str, Any]:
        """JSON-ready dict với alias camelCase + timestamp ISO-8601 UTC Z."""
        data = self.model_dump(by_alias=True, mode="json", exclude_none=True)
        ts = self.timestamp
        if ts.tzinfo is None:
            data["timestamp"] = ts.isoformat() + "Z"
        else:
            data["timestamp"] = ts.isoformat().replace("+00:00", "Z")
        return data


# ---------------------------------------------------------------------------
# Health & Models
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status: Literal["UP", "DEGRADED", "DOWN"] = "UP"
    app_name: str = Field(..., alias="appName")
    app_version: str = Field(..., alias="appVersion")
    model_loaded: bool = Field(..., alias="modelLoaded")
    model_version: str = Field(..., alias="modelVersion")
    uptime_seconds: float = Field(..., alias="uptimeSeconds")
    pending_jobs: int = Field(..., alias="pendingJobs")


class ModelInfo(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    version: str
    path: str
    active: bool = True
    loaded_at: datetime | None = Field(None, alias="loadedAt")


class ModelListResponse(BaseModel):
    active_version: str = Field(..., alias="activeVersion")
    models: list[ModelInfo]
    model_config = ConfigDict(populate_by_name=True)
