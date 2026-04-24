"""Smoke test nhanh cho Sprint 1 (không cần ultralytics/torch).

Kiểm tra:
  1. Import từng module mới không lỗi
  2. types dataclasses serialize OK
  3. biomass.calculate_weight + compute_uniformity đúng công thức
  4. video_writer mở/ghi/đóng MP4 hợp lệ
  5. fish_counter.calculate_biomass delegate đúng (không cần model YOLO)

Chạy: python smoke_test_sprint1.py  (trong venv đã có numpy, opencv)
"""
from __future__ import annotations

import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np

from src.core import biomass, types, video_writer


def test_types_serialize():
    u = types.UniformityStats(mean_g=10.0, std_g=1.5, cv=0.15,
                              oversize_ratio=0.1, undersize_ratio=0.05)
    assert u.to_dict() == {
        "mean_g": 10.0, "std_g": 1.5, "cv": 0.15,
        "oversize_ratio": 0.1, "undersize_ratio": 0.05,
    }
    r = types.AnalysisResult(
        fish_count=29, health_score=85.4, total_biomass_g=425.7,
        avg_weight_g=14.68, uniformity=u, dead_fish_count=0,
        processed_frames=450, duration_seconds=15.2,
        model_version="v1.0.0",
    )
    d = r.to_dict()
    assert d["fishCount"] == 29
    assert d["healthScore"] == 85.4
    assert d["modelVersion"] == "v1.0.0"
    assert d["uniformity"]["cv"] == 0.15
    assert d["timestamp"].endswith("Z")
    print("  types.py OK")


def test_biomass_weight_matches_legacy_formula():
    # Công thức cũ: a * (area**b). a=0.0005, b=1.5 cho cả class 0 và 1.
    for area in (1000.0, 2500.0, 10000.0):
        expected = 0.0005 * (area ** 1.5)
        got = biomass.calculate_weight(area, 0)
        assert abs(got - expected) < 1e-6, f"mismatch at area={area}: {got} vs {expected}"
        got1 = biomass.calculate_weight(area, 1)
        assert abs(got1 - expected) < 1e-6

    # Unknown class fallback về class 0
    assert biomass.calculate_weight(1000.0, 99) == biomass.calculate_weight(1000.0, 0)

    # area <= 0 → 0
    assert biomass.calculate_weight(0.0, 0) == 0.0
    assert biomass.calculate_weight(-100.0, 0) == 0.0
    print("  biomass.calculate_weight OK")


def test_uniformity():
    # Lứa rất đều
    stats = biomass.compute_uniformity([10.0] * 20)
    assert stats.mean_g == 10.0
    assert stats.std_g == 0.0
    assert stats.cv == 0.0
    assert stats.oversize_ratio == 0.0
    assert stats.undersize_ratio == 0.0

    # Lứa có vài outlier
    weights = [5.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 15.0]
    stats = biomass.compute_uniformity(weights, z_threshold=1.2)
    assert 9.0 < stats.mean_g < 11.0
    assert stats.std_g > 0
    assert stats.cv > 0
    # 5.0 và 15.0 đủ xa trung bình → phải rơi vào outsize
    assert stats.oversize_ratio > 0
    assert stats.undersize_ratio > 0

    # Empty list
    empty = biomass.compute_uniformity([])
    assert empty.mean_g == 0.0
    assert empty.cv == 0.0
    print("  biomass.compute_uniformity OK")


def test_video_writer():
    with tempfile.TemporaryDirectory() as d:
        out_path = os.path.join(d, "sub", "test_out.mp4")
        with video_writer.AnnotatedVideoWriter(out_path, fps=10.0) as w:
            frame = np.zeros((240, 320, 3), dtype=np.uint8)
            for i in range(15):
                frame[:] = (i * 10, 0, 0)
                w.write(frame)
        assert os.path.isfile(out_path), f"MP4 not created: {out_path}"
        assert os.path.getsize(out_path) > 0
        # writer đã đóng → ghi thêm phải raise
        try:
            w.write(np.zeros((240, 320, 3), dtype=np.uint8))
        except RuntimeError:
            pass
        else:
            raise AssertionError("Writer không raise khi ghi sau close")
    print("  video_writer OK")


def test_fish_counter_biomass_delegation():
    """FishCounter.calculate_biomass giờ delegate sang biomass module.

    Chỉ test phần delegation, tránh __init__ load YOLO. Dùng object.__new__
    bỏ qua constructor.
    """
    # Tránh import fish_counter ở top-level (nó import ultralytics khi load YOLO
    # trong __init__, nhưng import module thì chỉ cần ultralytics có hay không).
    # Ultralytics không có → import sẽ fail. Thay vào đó ta test hàm biomass
    # trực tiếp (delegation chỉ là thin wrapper).

    try:
        from src.core.fish_counter import FishCounter  # noqa: F401
    except ImportError as e:
        print(f"  fish_counter skip (ultralytics not installed): {e}")
        return

    fc = FishCounter.__new__(FishCounter)
    fc.biomass_params = biomass.DEFAULT_BIOMASS_PARAMS
    assert fc.calculate_biomass(1000.0, 0) == biomass.calculate_weight(1000.0, 0)
    print("  fish_counter delegation OK")


def test_pipeline_imports():
    """Pipeline import FishCounter → cần ultralytics. Skip nếu chưa có."""
    try:
        from src.core import pipeline  # noqa: F401
        assert hasattr(pipeline, "analyze_video")
        print("  pipeline.analyze_video importable OK")
    except ImportError as e:
        print(f"  pipeline skip (ultralytics not installed): {e}")


def main():
    print("=== Sprint 1 smoke tests ===")
    test_types_serialize()
    test_biomass_weight_matches_legacy_formula()
    test_uniformity()
    test_video_writer()
    test_fish_counter_biomass_delegation()
    test_pipeline_imports()
    print("\nAll tests passed.")


if __name__ == "__main__":
    main()
