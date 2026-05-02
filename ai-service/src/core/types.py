"""Dataclasses dùng chung cho toàn bộ core pipeline.

Các DTO ở đây KHÔNG phụ thuộc cv2/torch để dễ serialize (JSON, Pydantic,
webhook payload...). Mọi field đều là kiểu Python cơ bản.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any


@dataclass(frozen=True)
class FishDetection:
    """Một cá thể được phát hiện trong 1 frame (sau NMS)."""
    box: tuple[float, float, float, float]  # x1, y1, x2, y2
    confidence: float
    class_id: int
    mask_area: float  # diện tích mask (px²) — dùng tính biomass

    def to_dict(self) -> dict[str, Any]:
        return {
            "box": list(self.box),
            "confidence": self.confidence,
            "class_id": self.class_id,
            "mask_area": self.mask_area,
        }


@dataclass(frozen=True)
class UniformityStats:
    """Thống kê độ đồng đều lứa cá - thông tin bán hàng quan trọng."""
    mean_g: float
    std_g: float
    cv: float  # coefficient of variation = std/mean
    oversize_ratio: float  # tỉ lệ cá có z-score > +1.2
    undersize_ratio: float  # tỉ lệ cá có z-score < -1.2

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def empty(cls) -> "UniformityStats":
        return cls(0.0, 0.0, 0.0, 0.0, 0.0)


@dataclass
class AnalysisResult:
    """Kết quả phân tích video/ảnh cá.

    Ánh xạ trực tiếp sang webhook payload của core-backend
    (xem EXHAUSTIVE_API_CONTRACT.md section 2.6 & 3).
    """
    fish_count: int                          # → webhook.fishCount
    health_score: float                      # 0..100 → webhook.healthScore
    total_biomass_g: float
    avg_weight_g: float
    uniformity: UniformityStats
    dead_fish_count: int
    processed_frames: int
    duration_seconds: float
    model_version: str
    annotated_video_path: str | None = None  # sau upload → resultVideoUrl
    annotated_video_url: str | None = None
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    extras: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "fishCount": self.fish_count,
            "healthScore": round(self.health_score, 2),
            "totalBiomassG": round(self.total_biomass_g, 2),
            "avgWeightG": round(self.avg_weight_g, 2),
            "uniformity": self.uniformity.to_dict(),
            "deadFishCount": self.dead_fish_count,
            "processedFrames": self.processed_frames,
            "durationSeconds": round(self.duration_seconds, 2),
            "modelVersion": self.model_version,
            "annotatedVideoUrl": self.annotated_video_url,
            "timestamp": self.timestamp.isoformat().replace("+00:00", "Z"),
            "extras": self.extras,
        }


@dataclass
class PipelineConfig:
    """Cấu hình chạy pipeline cho 1 phiên phân tích."""
    fish_profile: str = "normal"  # slow | normal | fast
    max_duration_seconds: int = 90
    min_duration_seconds: int = 15
    patience_seconds: int = 10
    enable_smart_stop: bool = True
    write_annotated_video: bool = True
    annotated_output_path: str | None = None
    model_path: str = "models/best.pt"
    model_version: str = "unknown"
