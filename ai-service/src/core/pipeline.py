"""High-level pipeline cho worker phân tích video không đồng bộ.

Entry point chính: `analyze_video(video_path, config) -> AnalysisResult`.
Đây là hàm Sprint 3 worker (Arq/Celery) sẽ gọi. Hoàn toàn headless — không
phụ thuộc PyQt5 hay event loop GUI.

Logic pipeline tái sử dụng FishCounter engine hiện có (đã được Sprint 0 dọn
sạch) thay vì viết lại. Các hàm ở đây chỉ đóng vai trò:
  1. Chạy FishCounter trong chế độ headless
  2. Gom frame đã annotate vào AnnotatedVideoWriter
  3. Gộp kết quả cuối → AnalysisResult khớp với webhook contract

HealthScore được map từ FAI + tỉ lệ cá chết + độ đồng đều (xem
_compute_health_score). Công thức cần calibrate bằng dữ liệu thực; phiên
bản hiện tại là heuristic khởi tạo, CHƯA phải giá trị thương mại cuối cùng.
"""
from __future__ import annotations

import logging
import os
import time
from typing import Any

import numpy as np

from .biomass import compute_uniformity
from .fish_counter import FishCounter
from .types import AnalysisResult, PipelineConfig, UniformityStats
from .video_writer import AnnotatedVideoWriter

logger = logging.getLogger(__name__)


def analyze_video(
    video_path: str,
    config: PipelineConfig | None = None,
) -> AnalysisResult:
    """Phân tích 1 video, trả về kết quả khớp webhook contract.

    Raises:
        FileNotFoundError: video_path không tồn tại
        RuntimeError: FishCounter không mở được video hoặc model lỗi
    """
    config = config or PipelineConfig()

    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video not found: {video_path}")

    logger.info("Pipeline start: video=%s config=%s", video_path, config)
    t0 = time.perf_counter()

    counter = FishCounter(model_path=config.model_path)
    counter.set_counting_method("statistical")
    counter.set_app_mode("counting" if config.enable_smart_stop else "monitoring")
    counter.set_fish_behavior(config.fish_profile)
    counter.counting_duration = config.max_duration_seconds
    counter.min_duration = config.min_duration_seconds
    counter.patience_duration = config.patience_seconds

    if not counter.start_counting(video_path):
        raise RuntimeError(f"FishCounter failed to start on video: {video_path}")

    per_frame_weights: list[list[float]] = []
    per_frame_dead_flags: list[bool] = []
    per_frame_fai: list[float] = []
    processed_frames = 0

    # Sprint 6: chọn frame "tốt nhất" (nhiều cá nhất + đủ rõ) để xuất JPG
    # làm `aiImageUrl` trong callback BE. Score đơn giản = số fish_count
    # quan sát ở frame đó. Frame đầu tiên gặp count cao nhất sẽ được giữ.
    best_frame_count: int = -1
    best_frame_image = None  # numpy array

    output_path = _resolve_output_path(config, video_path)
    best_frame_path = getattr(config, "best_frame_output_path", None)
    writer: AnnotatedVideoWriter | None = None

    try:
        if config.write_annotated_video and output_path:
            fps = _get_video_fps(counter)
            writer = AnnotatedVideoWriter(output_path, fps=fps)

        while True:
            result = counter.process_frame()
            if result is None:
                break
            frame, count, _elapsed, _biomass, fai, has_dead = result
            if frame is None:
                break

            if writer is not None:
                writer.write(frame)

            if int(count) > best_frame_count:
                best_frame_count = int(count)
                best_frame_image = frame.copy()

            weights_this_frame = _extract_current_frame_weights(counter)
            per_frame_weights.append(weights_this_frame)
            per_frame_dead_flags.append(bool(has_dead))
            per_frame_fai.append(float(fai))
            processed_frames += 1

            if not counter.is_counting:
                break
    finally:
        if writer is not None:
            writer.close()
        if counter.is_counting:
            counter.stop_counting()

    # Lưu best frame nếu được yêu cầu (best_frame_output_path).
    if best_frame_path and best_frame_image is not None:
        try:
            import cv2
            os.makedirs(os.path.dirname(os.path.abspath(best_frame_path)) or ".", exist_ok=True)
            cv2.imwrite(best_frame_path, best_frame_image)
            logger.info("best_frame_saved: path=%s count=%d", best_frame_path, best_frame_count)
        except Exception as exc:  # noqa: BLE001
            logger.warning("best_frame_save_failed: %s", exc)

    final_count = int(counter.get_final_count())
    final_biomass_g = float(getattr(counter, "final_biomass", 0.0) or 0.0)
    avg_weight = final_biomass_g / final_count if final_count > 0 else 0.0

    uniformity = _aggregate_uniformity(per_frame_weights)
    dead_fish_count = _count_distinct_dead(counter)
    smart_stop_triggered = bool(
        config.enable_smart_stop
        and getattr(counter, "stability_progress", 0.0) >= 1.0
    )
    health_score = _compute_health_score(
        fai_samples=per_frame_fai,
        dead_ratio=(dead_fish_count / final_count) if final_count > 0 else 0.0,
        uniformity=uniformity,
        smart_stop_triggered=smart_stop_triggered,
    )

    elapsed_total = time.perf_counter() - t0
    annotated_path = output_path if (writer and writer.frames_written > 0) else None

    result = AnalysisResult(
        fish_count=final_count,
        health_score=health_score,
        total_biomass_g=final_biomass_g,
        avg_weight_g=avg_weight,
        uniformity=uniformity,
        dead_fish_count=dead_fish_count,
        processed_frames=processed_frames,
        duration_seconds=elapsed_total,
        model_version=config.model_version,
        annotated_video_path=annotated_path,
        extras={
            "fishProfile": config.fish_profile,
            "maxPeakDetection": int(getattr(counter, "max_detection_count", 0)),
            "smartStopTriggered": smart_stop_triggered,
        },
    )

    logger.info(
        "Pipeline done: fishCount=%d health=%.1f biomass=%.1fg frames=%d elapsed=%.1fs",
        result.fish_count, result.health_score, result.total_biomass_g,
        result.processed_frames, result.duration_seconds,
    )
    return result


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _resolve_output_path(config: PipelineConfig, video_path: str) -> str | None:
    if not config.write_annotated_video:
        return None
    if config.annotated_output_path:
        return config.annotated_output_path
    base, _ext = os.path.splitext(os.path.basename(video_path))
    out_dir = os.path.join("data", "outputs")
    os.makedirs(out_dir, exist_ok=True)
    return os.path.join(out_dir, f"{base}_annotated.mp4")


def _get_video_fps(counter: FishCounter) -> float:
    try:
        import cv2
        if counter.cap is not None:
            fps = counter.cap.get(cv2.CAP_PROP_FPS)
            if fps and fps > 0:
                return float(fps)
    except Exception:  # pragma: no cover - defensive
        pass
    return 30.0


def _extract_current_frame_weights(counter: FishCounter) -> list[float]:
    """Trích trọng lượng từng cá trong frame vừa xử lý qua track list."""
    weights: list[float] = []
    for track in getattr(counter.tracker, "tracks", []):
        bbox = track.bbox
        if bbox is None:
            continue
        w = max(0.0, bbox[2] - bbox[0])
        h = max(0.0, bbox[3] - bbox[1])
        area = w * h
        if area <= 0:
            continue
        weights.append(counter.calculate_biomass(area, 0))
    return weights


def _aggregate_uniformity(per_frame_weights: list[list[float]]) -> UniformityStats:
    """Gom weights nhiều frame để tính uniformity tổng phiên."""
    flat: list[float] = []
    for ws in per_frame_weights:
        flat.extend(ws)
    if not flat:
        return UniformityStats.empty()
    return compute_uniformity(flat)


def _count_distinct_dead(counter: FishCounter) -> int:
    """Đếm số track bị đánh dấu chết tại cuối phiên."""
    threshold = float(getattr(counter, "current_dead_threshold", 10.0))
    dead = 0
    now = time.time()
    for track in getattr(counter.tracker, "tracks", []):
        start = getattr(track, "stationary_start_time", None)
        if start is not None and (now - start) > threshold:
            dead += 1
    return dead


def _compute_health_score(
    fai_samples: list[float],
    dead_ratio: float,
    uniformity: UniformityStats,
    smart_stop_triggered: bool = True,
) -> float:
    """Map FAI + dead + uniformity + stability -> điểm sức khỏe 0..100.

    Công thức khởi tạo (cần calibrate dữ liệu thực):
      * Sweet spot FAI: 30..70. Lệch khỏi 50 càng nhiều, càng trừ điểm.
      * Tỉ lệ cá chết: mỗi 1% trừ 5 điểm.
      * CV > 0.15 bị trừ điểm (lứa càng loạn size, điểm càng thấp).
      * Smart Stop không trigger -> trừ 30 điểm (bằng chứng video không ổn định,
        AI không chốt được con số trong thời gian patience -> độ tin cậy thấp).
    """
    if not fai_samples:
        return 0.0
    fai_avg = float(np.mean(fai_samples))

    activity = max(0.0, 100.0 - abs(50.0 - fai_avg) * 2.0)
    mortality_penalty = float(dead_ratio) * 500.0
    uniformity_penalty = max(0.0, (uniformity.cv - 0.15) * 100.0)
    instability_penalty = 0.0 if smart_stop_triggered else 30.0

    score = activity - mortality_penalty - uniformity_penalty - instability_penalty
    return max(0.0, min(100.0, float(score)))


__all__ = ["analyze_video", "PipelineConfig", "AnalysisResult"]
