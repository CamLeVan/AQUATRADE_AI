"""Ghi video annotated MP4 cho webhook.resultVideoUrl.

Dùng cv2.VideoWriter với codec H.264 (mp4v/avc1) để tương thích trình duyệt.
Sau khi ghi xong, file này sẽ được upload lên object storage (S3/MinIO) ở
Sprint 3, URL kết quả sẽ gửi kèm webhook.
"""
from __future__ import annotations

import logging
import os
from contextlib import AbstractContextManager
from types import TracebackType

import cv2
import numpy as np

logger = logging.getLogger(__name__)

DEFAULT_FOURCC = "mp4v"  # an toàn trên macOS/Linux; prod có thể đổi sang "avc1"


class AnnotatedVideoWriter(AbstractContextManager["AnnotatedVideoWriter"]):
    """Wrapper tiện dụng quanh cv2.VideoWriter.

    Tự khởi tạo writer khi frame đầu tiên được ghi (vì cần biết size thực tế).
    Hỗ trợ dùng qua `with` statement để đảm bảo release đúng.

    Example:
        with AnnotatedVideoWriter("/tmp/out.mp4", fps=30) as w:
            for frame in frames:
                w.write(frame)
        print(w.output_path, w.frames_written)
    """

    def __init__(
        self,
        output_path: str,
        fps: float = 30.0,
        fourcc: str = DEFAULT_FOURCC,
    ) -> None:
        self.output_path = output_path
        self.fps = float(fps) if fps and fps > 0 else 30.0
        self.fourcc_str = fourcc
        self._writer: cv2.VideoWriter | None = None
        self._size: tuple[int, int] | None = None
        self.frames_written = 0
        self._closed = False

    def _ensure_writer(self, frame: np.ndarray) -> None:
        if self._writer is not None:
            return
        h, w = frame.shape[:2]
        self._size = (w, h)
        os.makedirs(os.path.dirname(os.path.abspath(self.output_path)) or ".", exist_ok=True)
        fourcc = cv2.VideoWriter_fourcc(*self.fourcc_str)
        writer = cv2.VideoWriter(self.output_path, fourcc, self.fps, self._size)
        if not writer.isOpened():
            raise RuntimeError(
                f"Failed to open VideoWriter: path={self.output_path} "
                f"fourcc={self.fourcc_str} fps={self.fps} size={self._size}"
            )
        self._writer = writer
        logger.info(
            "VideoWriter opened: path=%s fps=%s size=%s fourcc=%s",
            self.output_path, self.fps, self._size, self.fourcc_str,
        )

    def write(self, frame: np.ndarray) -> None:
        if self._closed:
            raise RuntimeError("Cannot write to a closed AnnotatedVideoWriter")
        if frame is None or frame.size == 0:
            return
        self._ensure_writer(frame)
        assert self._writer is not None and self._size is not None

        # cv2 bắt buộc cùng kích thước trên toàn bộ video; resize nếu lệch.
        h, w = frame.shape[:2]
        if (w, h) != self._size:
            frame = cv2.resize(frame, self._size)

        self._writer.write(frame)
        self.frames_written += 1

    def close(self) -> None:
        if self._closed:
            return
        self._closed = True
        if self._writer is not None:
            try:
                self._writer.release()
            except Exception as e:  # pragma: no cover - defensive
                logger.warning("VideoWriter release failed: %s", e)
        logger.info(
            "VideoWriter closed: path=%s frames=%d",
            self.output_path, self.frames_written,
        )

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        self.close()
