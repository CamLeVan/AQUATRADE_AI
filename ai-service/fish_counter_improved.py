import cv2
import numpy as np
from ultralytics import YOLO
import time
import json
from datetime import datetime
import logging
import os
from collections import deque

# Import các module tự tạo
from kalman_tracker import SimpleTracker
from simple_reid import SimpleReID

class FishCounter:
    def __init__(self):
        try:
            # Kiểm tra file model
            if not os.path.exists("best.pt"):
                raise FileNotFoundError("Model file 'best.pt' not found")
            
            # Khởi tạo model YOLO
            self.model = YOLO("best.pt")
            self.model.conf = 0.3  # Giảm ngưỡng tin cậy để phát hiện nhiều cá hơn
            
            # Khởi tạo camera
            self.cap = None
            self.is_counting = False
            self.start_time = 0
            self.final_count = 0
            self.counting_duration = 30  # Thời gian đếm (giây)
            
            # Khởi tạo tracker và reid
            self.tracker = SimpleTracker(match_thresh=0.5, max_age=30)
            self.reid = SimpleReID(similarity_threshold=0.7)
            
            # Biến đếm cá
            self.unique_fish_count = 0
            self.track_to_fish_map = {}  # Ánh xạ track_id -> fish_id
            
            # Biến để theo dõi thống kê
            self.detection_stats = {
                'total_frames': 0,
                'total_detections': 0,
                'avg_confidence': 0,
                'avg_ratio': 0
            }
            
            # Buffer lưu trữ số lượng cá
            self.count_buffer = deque(maxlen=10)
            
            # Cờ đếm
            self.counting_method = "reid"  # "reid", "tracking", "statistical"
            
            logging.info("FishCounter initialized with improved tracking and ReID")
        except Exception as e:
            logging.error(f"Error initializing FishCounter: {e}")
            raise

    def start_counting(self):
        """Bắt đầu đếm cá"""
        try:
            # Mở file video
            self.cap = cv2.VideoCapture("1.mp4")
            if not self.cap.isOpened():
                logging.error("Failed to open video file")
                return False
            
            # Reset các biến theo dõi
            self.is_counting = True
            self.start_time = time.time()
            self.final_count = 0
            self.unique_fish_count = 0
            self.track_to_fish_map = {}
            self.count_buffer.clear()
            
            # Reset tracker và reid
            self.tracker = SimpleTracker(match_thresh=0.5, max_age=30)
            self.reid = SimpleReID(similarity_threshold=0.7)
            
            self.detection_stats = {
                'total_frames': 0,
                'total_detections': 0,
                'avg_confidence': 0,
                'avg_ratio': 0
            }
            
            return True
        except Exception as e:
            logging.error(f"Error starting counting: {e}")
            return False

    def stop_counting(self):
        """Dừng đếm cá"""
        try:
            if self.cap is not None:
                self.cap.release()
                self.cap = None
            
            self.is_counting = False
            
            # Lấy kết quả đếm cuối cùng
            if self.counting_method == "reid":
                self.final_count = self.unique_fish_count
            elif self.counting_method == "tracking":
                self.final_count = len(self.tracker.tracks)
            elif self.counting_method == "statistical":
                if len(self.count_buffer) > 0:
                    # Lấy giá trị trung vị
                    self.final_count = int(np.median(self.count_buffer))
                else:
                    self.final_count = 0
            
            logging.info(f"Counting stopped. Final count: {self.final_count}")
            
        except Exception as e:
            logging.error(f"Error stopping counting: {e}")

    def process_frame(self):
        """Xử lý frame hiện tại"""
        try:
            if not self.is_counting or self.cap is None:
                return None, self.get_fish_count(), 0
            
            # Kiểm tra thời gian đã trôi qua
            elapsed_time = time.time() - self.start_time
            if elapsed_time >= self.counting_duration:
                self.stop_counting()
                return None, self.get_fish_count(), elapsed_time
            
            # Đọc frame
            ret, frame = self.cap.read()
            if not ret:
                logging.error("Failed to read frame")
                return None, self.get_fish_count(), 0
            
            # Tăng cường chất lượng frame
            enhanced_frame = self.enhance_frame(frame)
            
            # Cập nhật số frame đã xử lý
            self.detection_stats['total_frames'] += 1
            
            # Chạy detection trên frame đã xử lý
            results = self.model(enhanced_frame)
            
            # Xử lý kết quả
            detections, features = self.process_detections(results, frame)
            
            # Cập nhật tracker
            tracks = self.tracker.update(detections, features)
            
            # Cập nhật ReID và đếm cá
            self.update_reid_counting(tracks)
            
            # Xử lý thống kê
            if self.counting_method == "statistical":
                current_count = len(detections)
                self.count_buffer.append(current_count)
            
            # Vẽ kết quả
            result_frame = self.draw_results(frame, detections, tracks)
            
            return result_frame, self.get_fish_count(), elapsed_time
        except Exception as e:
            logging.error(f"Error processing frame: {e}")
            return None, self.get_fish_count(), 0

    def process_detections(self, results, frame):
        """Xử lý kết quả detection từ YOLO"""
        try:
            detections = []
            features = []
            
            # Trích xuất thông tin từ mỗi kết quả
            for r in results:
                if hasattr(r, 'boxes') and len(r.boxes) > 0:
                    boxes = r.boxes.xyxy.cpu().numpy()
                    confidences = r.boxes.conf.cpu().numpy()
                    
                    # Tìm các detections phù hợp
                    for i, (box, conf) in enumerate(zip(boxes, confidences)):
                        # Chỉ xem xét các box có kích thước hợp lý
                        w, h = box[2] - box[0], box[3] - box[1]
                        area = w * h
                        if area < 100 or area > 100000:  # Bỏ qua box quá nhỏ hoặc quá lớn
                            continue
                        
                        # Kiểm tra tỷ lệ khung hình
                        aspect_ratio = w / h if h > 0 else 0
                        if aspect_ratio < 0.2 or aspect_ratio > 5.0:
                            continue
                        
                        # Thêm detection hợp lệ
                        box = box.astype(np.float32)
                        detections.append([box, float(conf)])
                        
                        # Trích xuất feature cho ReID
                        if self.counting_method == "reid":
                            x1, y1, x2, y2 = map(int, box)
                            fish_img = frame[max(0, y1):min(frame.shape[0], y2), 
                                           max(0, x1):min(frame.shape[1], x2)]
                            feature = self.reid.extract_features(fish_img)
                            features.append(feature)
            
            # Lọc các detection trùng lặp bằng Non-maximum suppression
            if len(detections) > 1:
                boxes = np.array([d[0] for d in detections])
                scores = np.array([d[1] for d in detections])
                
                # Áp dụng NMS
                indices = cv2.dnn.NMSBoxes(
                    boxes.tolist(), 
                    scores.tolist(), 
                    score_threshold=0.3, 
                    nms_threshold=0.4
                ).flatten()
                
                # Chỉ giữ lại các detection sau khi lọc NMS
                detections = [detections[i] for i in indices]
                if features:
                    features = [features[i] for i in indices]
            
            # Cập nhật thống kê
            self.detection_stats['total_detections'] += len(detections)
            if len(detections) > 0:
                self.detection_stats['avg_confidence'] = np.mean([d[1] for d in detections])
            
            return detections, features
        except Exception as e:
            logging.error(f"Error processing detections: {e}")
            return [], []
            
    def update_reid_counting(self, tracks):
        """Cập nhật đếm cá dựa trên ReID"""
        try:
            if self.counting_method != "reid":
                return
                
            for track in tracks:
                # Bỏ qua tracks đã ánh xạ
                if track.id in self.track_to_fish_map:
                    continue
                    
                # Bỏ qua tracks không có features
                if not track.features:
                    continue
                    
                # Lấy feature trung bình
                avg_feature = track.get_feature()
                if avg_feature is None:
                    continue
                
                # Tìm kiếm fish_id tương ứng
                fish_id = self.reid.find_fish_match(avg_feature)
                
                # Nếu không tìm thấy, tạo fish_id mới
                if fish_id is None:
                    fish_id = self.reid.next_fish_id
                    self.reid.next_fish_id += 1
                    self.unique_fish_count += 1
                    logging.info(f"New unique fish detected! Total: {self.unique_fish_count}")
                
                # Cập nhật database và ánh xạ
                self.reid.update_database(avg_feature, fish_id)
                self.track_to_fish_map[track.id] = fish_id
                
        except Exception as e:
            logging.error(f"Error updating ReID counting: {e}")

    def enhance_frame(self, frame):
        """Tăng cường chất lượng frame"""
        try:
            # Tăng độ sáng và độ tương phản
            alpha = 1.1  # Độ tương phản (1.0-3.0)
            beta = 10    # Độ sáng (0-100)
            enhanced = cv2.convertScaleAbs(frame, alpha=alpha, beta=beta)
            
            # Giảm nhiễu nhẹ
            enhanced = cv2.GaussianBlur(enhanced, (3, 3), 0)
            
            return enhanced
        except Exception as e:
            logging.error(f"Error enhancing frame: {e}")
            return frame

    def draw_results(self, frame, detections, tracks):
        """Vẽ kết quả lên frame"""
        try:
            # Tạo bản sao của frame để vẽ lên
            result_frame = frame.copy()
            
            # Vẽ các bounding box cho detections
            for det in detections:
                bbox, conf = det
                x1, y1, x2, y2 = map(int, bbox)
                cv2.rectangle(result_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(result_frame, f"{conf:.2f}", (x1, y1 - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            # Vẽ các tracks
            for track in tracks:
                bbox = track.bbox
                x1, y1, x2, y2 = map(int, bbox)
                
                # Màu khác nhau cho mỗi track
                track_id = track.id
                color = ((track_id * 50) % 255, (track_id * 100) % 255, (track_id * 150) % 255)
                
                # Vẽ bounding box
                cv2.rectangle(result_frame, (x1, y1), (x2, y2), color, 2)
                
                # Hiển thị ID
                label = f"T{track_id}"
                if self.counting_method == "reid" and track_id in self.track_to_fish_map:
                    fish_id = self.track_to_fish_map[track_id]
                    label += f":F{fish_id}"
                
                cv2.putText(result_frame, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            # Vẽ thông tin đếm cá
            offset_y = 30
            
            # Hiển thị số cá theo phương pháp đếm
            count = self.get_fish_count()
            if self.counting_method == "reid":
                count_text = f"Total Fish: {count} (ReID)"
            elif self.counting_method == "tracking":
                count_text = f"Total Fish: {count} (Tracking)"
            elif self.counting_method == "statistical":
                count_text = f"Total Fish: {count} (Statistical)"
                
            cv2.putText(result_frame, count_text, (10, offset_y),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            offset_y += 40
            
            # Hiển thị số detections trong frame hiện tại
            cv2.putText(result_frame, f"Detections: {len(detections)}", (10, offset_y),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            offset_y += 40
            
            # Vẽ thời gian đếm
            elapsed_time = time.time() - self.start_time
            cv2.putText(result_frame, f"Time: {elapsed_time:.1f}s", (10, offset_y),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            
            return result_frame
        except Exception as e:
            logging.error(f"Error drawing results: {e}")
            return frame

    def get_fish_count(self):
        """Lấy số lượng cá theo phương pháp đã chọn"""
        if self.counting_method == "reid":
            return self.unique_fish_count  # Số cá duy nhất đã nhận dạng
        elif self.counting_method == "tracking":
            # Đếm số track đang hoạt động
            return len(self.tracker.tracks)
        elif self.counting_method == "statistical":
            if len(self.count_buffer) > 0:
                # Loại bỏ giá trị cao nhất và thấp nhất, lấy trung bình
                sorted_counts = sorted(self.count_buffer)
                if len(sorted_counts) > 4:
                    filtered_counts = sorted_counts[1:-1]  # Loại bỏ min và max
                else:
                    filtered_counts = sorted_counts
                return int(sum(filtered_counts) / len(filtered_counts))
            return 0
        else:
            return 0

    def get_final_count(self):
        """Lấy số lượng cá cuối cùng"""
        return self.final_count

    def save_result(self, duration):
        """Lưu kết quả đếm"""
        try:
            # Tạo thư mục nếu chưa tồn tại
            if not os.path.exists("data"):
                os.makedirs("data")
            
            # Lưu kết quả
            result = {
                'session': 1,
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'count': self.get_fish_count(),
                'confidence': float(self.detection_stats['avg_confidence']),
                'method': self.counting_method,
                'duration': duration
            }
            
            # Tạo tên file
            filename = f"result_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            # Lưu file
            with open(os.path.join("data", filename), 'w') as f:
                json.dump(result, f)
                
            return result
        except Exception as e:
            logging.error(f"Error saving result: {e}")
            return None

    def is_counting_finished(self):
        """Kiểm tra xem đã đếm xong chưa"""
        return not self.is_counting
        
    def set_counting_method(self, method):
        """Thiết lập phương pháp đếm"""
        if method in ["reid", "tracking", "statistical"]:
            self.counting_method = method
            logging.info(f"Counting method set to: {method}")
            return True
        return False 