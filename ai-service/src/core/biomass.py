"""Tính toán sinh khối và độ đồng đều của đàn cá.

Pure functions, không state, dễ test và dễ tái sử dụng cho cả GUI lẫn
async pipeline (worker).

Công thức sinh khối: weight = a * (area ** b)
  - area: diện tích mask (px²) do YOLOv8-seg trả về
  - a, b: tham số allometric hiệu chỉnh theo loài (cần calibrate thực tế)

Mặc định dùng cho cá giống 5-15g: a=0.0005, b=1.5 (scaling 3D từ area 2D).
Các tham số này CẦN hiệu chỉnh lại với dữ liệu cân thực tế để chính xác
về thương mại.
"""
from __future__ import annotations

import logging
from typing import Iterable, Mapping

import numpy as np

from .types import UniformityStats

logger = logging.getLogger(__name__)


BiomassParams = Mapping[str, float]  # {"a": float, "b": float}

DEFAULT_BIOMASS_PARAMS: dict[int, BiomassParams] = {
    0: {"a": 0.0005, "b": 1.5},  # ca_nho
    1: {"a": 0.0005, "b": 1.5},  # ca_to
}


def calculate_weight(
    area: float,
    class_id: int,
    params_by_class: Mapping[int, BiomassParams] | None = None,
) -> float:
    """Ước lượng khối lượng 1 cá thể (gram) từ diện tích mask."""
    if area <= 0:
        return 0.0
    params_by_class = params_by_class or DEFAULT_BIOMASS_PARAMS
    params = params_by_class.get(class_id) or params_by_class.get(0)
    if not params:
        return 0.0
    try:
        return float(params["a"]) * (float(area) ** float(params["b"]))
    except (KeyError, ValueError, OverflowError) as e:
        logger.error("calculate_weight failed (area=%s, cls=%s): %s", area, class_id, e)
        return 0.0


def total_biomass(
    areas_and_classes: Iterable[tuple[float, int]],
    params_by_class: Mapping[int, BiomassParams] | None = None,
) -> float:
    """Tổng khối lượng của 1 frame = Σ weight(area_i, cls_i)."""
    return sum(calculate_weight(a, c, params_by_class) for a, c in areas_and_classes)


def compute_uniformity(weights: Iterable[float], z_threshold: float = 1.2) -> UniformityStats:
    """Tính mean/std/CV và tỉ lệ cá trội [+] / cá đẹt [-] so với lứa.

    z_threshold: ngưỡng z-score phân loại (mặc định ±1.2 — giữ y logic cũ
    trong FishCounter.draw_results).
    """
    weights_arr = np.asarray([w for w in weights if w > 0], dtype=np.float64)
    if weights_arr.size == 0:
        return UniformityStats.empty()

    mean = float(np.mean(weights_arr))
    std = float(np.std(weights_arr))
    cv = float(std / mean) if mean > 0 else 0.0

    if std > 0:
        z_scores = (weights_arr - mean) / std
        oversize = float(np.mean(z_scores > z_threshold))
        undersize = float(np.mean(z_scores < -z_threshold))
    else:
        oversize = undersize = 0.0

    return UniformityStats(
        mean_g=mean,
        std_g=std,
        cv=cv,
        oversize_ratio=oversize,
        undersize_ratio=undersize,
    )
