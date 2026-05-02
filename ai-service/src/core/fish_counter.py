import cv2
import numpy as np
from ultralytics import YOLO
from collections import deque
import time
import json
from datetime import datetime
import logging
import os

# Import các module từ cùng package core
# Sử dụng relative import vì chúng nằm cùng thư mục src/core
from .tracker import SimpleTracker
from .reid import SimpleReID

class FishCounter:
    def __init__(self, model_path="models/best.pt"):
        try:
            # Kiểm tra file model
            if not os.path.exists(model_path):
                # Thử tìm ở thư mục gốc nếu không thấy
                if os.path.exists("best.pt"):
                    model_path = "best.pt"
                else:
                    logging.warning(f"Model file '{model_path}' not found. Attempting to download or use default.")
            
            # Khởi tạo model YOLO
            logging.info(f"Loading model from: {model_path}")
            self.model = YOLO(model_path)
            self.model.conf = 0.45  # Tăng ngưỡng tin cậy để giảm nhiễu (tối ưu cho độ chính xác cao)
            logging.info(f"Model classes: {self.model.names}")
            
            # Khởi tạo camera
            self.cap = None
            self.is_counting = False
            self.start_time = 0
            self.final_count = 0
            self.counting_duration = 90  # Thời gian tối ưu: 90s đủ để cá tản ra và lấy mẫu sinh khối chính xác
            
            # Khởi tạo tracker và reid
            self.tracker = SimpleTracker(match_thresh=0.5, max_age=30)
            self.reid = SimpleReID(similarity_threshold=0.5)
            
            # Biến đếm cá
            self.unique_fish_count = 0
            self.max_detection_count = 0 # Theo dõi số lượng lớn nhất từng phát hiện (Max Peak)
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
            self.biomass_buffer = deque(maxlen=10)
            
            # --- SMART STOPPING VARIABLES ---
            self.all_counts = [] # Lưu toàn bộ lịch sử đếm của phiên
            self.all_biomass = [] # Lưu toàn bộ lịch sử sinh khối (đã lọc FAI)
            self.all_biomass_raw = [] # FALLBACK: Lưu toàn bộ sinh khối (thô, không lọc)
            self.min_duration = 15 # DEMO MODE: 15s khởi động
            self.patience_duration = 10 # DEMO MODE: 10s chờ ổn định
            self.stability_progress = 0 # Tiến độ ổn định (0.0 - 1.0) để visualize Smart Stop
            self.best_session_count = 0 # Đỉnh cao nhất tìm được
            self.last_peak_time = 0 # Thời điểm tìm thấy đỉnh cuối cùng
            self.fai_buffer = deque(maxlen=150) # Tăng bộ nhớ đệm lên 150 frames (~10s) để chỉ số FAI đầm hơn, bớt nhảy
            
            # Cờ đếm
            self.counting_method = "statistical"  # Thay đổi từ "reid" thành "statistical"
            
            # Tham số sinh khối (Đã hiệu chỉnh cho cá giống 5-15g)
            # a=0.0005, b=1.3 giúp biến đổi diện tích pixel sang gam một cách mượt mà
            # Cấu hình tham số sinh khối (a*Area^b) - Hiệu chỉnh theo Báo cáo
            # b=1.5 (Lý thuyết hình học 3D)
            self.biomass_params = {
                0: {'a': 0.0005, 'b': 1.5},  # Class 0 (Cá nhỏ/Chung)
                1: {'a': 0.0005, 'b': 1.5}   # Class 1 (Cá lớn - nếu có)
            }

            # --- FISH BEHAVIOR PROFILES (FAI CONFIG) ---
            # Cấu hình ngưỡng vận động và ngưỡng chết (dead_threshold) cho các loài cá khác nhau
            self.fai_profiles = {
                'slow': {'threshold': 0.05, 'dead_threshold': 30.0, 'desc': 'Slow/Bottom (Catfish, Shark catfish)'},
                'normal': {'threshold': 0.10, 'dead_threshold': 10.0, 'desc': 'Normal (Carp, Tilapia)'},
                'fast': {'threshold': 0.20, 'dead_threshold': 5.0, 'desc': 'Active/Predator (Snakehead, Bass)'}
            }
            # Mặc định là Normal
            self.current_profile = 'normal' 
            self.current_fai_threshold = self.fai_profiles['normal']['threshold']
            self.current_dead_threshold = self.fai_profiles['normal']['dead_threshold']
            
            # Application Mode: 'counting' (Default) prevents Smart Stop in Monitoring mode
            self.app_mode = 'counting'
            
            logging.info("FishCounter initialized with improved tracking, Biomass(3D), and Dynamic FAI & Dead Thresholds")
        except Exception as e:
            logging.error(f"Error initializing FishCounter: {e}")
            raise

    def start_counting(self, video_path=None):
        """Bắt đầu đếm cá"""
        try:
            # Nếu đang đếm, dừng trước
            if self.is_counting:
                self.stop_counting()
            
            time.sleep(0.5)
            
            # Xử lý đường dẫn video
            if video_path is None:
                video_path = '1.mp4'
                if not os.path.exists(video_path):
                    # Thử tìm ở thư mục gốc
                    if os.path.exists(os.path.join('..', '..', '1.mp4')):
                        video_path = os.path.join('..', '..', '1.mp4')
            
            if not os.path.exists(video_path):
                logging.error(f"Video file not found: {video_path}")
                return False

            self.cap = cv2.VideoCapture(video_path, cv2.CAP_FFMPEG)
            
            if not self.cap.isOpened():
                try:
                    self.cap = cv2.VideoCapture(video_path, cv2.CAP_MSMF)
                except:
                    pass
                
            if not self.cap.isOpened():
                try:
                    self.cap = cv2.VideoCapture(video_path)
                except:
                    pass
                
            if not self.cap.isOpened():
                logging.error(f"Failed to open video file: {video_path}")
                return False
            
            # Reset các biến theo dõi
            self.is_counting = True
            self.start_time = time.time()
            self.final_count = 0
            self.unique_fish_count = 0
            self.track_to_fish_map = {}
            self.count_buffer.clear()
            self.biomass_buffer.clear()
            
            # Reset Smart Stopping
            self.all_counts = []
            self.all_biomass = []
            self.all_biomass_raw = [] # Reset raw buffer
            self.best_session_count = 0
            self.last_peak_time = time.time()
            self.stability_progress = 0 # Reset về 0 khi bắt đầu phiên mới
            
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
        """Dừng đếm cá và chốt số lượng cuối cùng"""
        try:
            self.is_counting = False
            
            if self.cap is not None:
                try:
                    self.cap.release()
                except Exception as e:
                    logging.error(f"Error releasing video capture: {e}")
                self.cap = None
            
            logging.debug(f"[Final Calculation] Session history length: {len(self.all_counts)}")
            if len(self.all_counts) > 0:
                try:
                    valid_counts = [count for count in self.all_counts if count > 0]
                    if valid_counts:
                        # Dùng 95th Percentile của TOÀN BỘ PHIÊN (chính xác hơn dùng buffer 10 frame cuối)
                        self.final_count = int(np.percentile(valid_counts, 95))
                        logging.debug(f"[Final Calculation] 95th Percentile of {len(valid_counts)} valid frames: {self.final_count}")
                    else:
                        self.final_count = 0
                except Exception as median_err:
                    logging.error(f"[Final Calculation] Error calculating percentile: {median_err}")
                    valid_counts = [count for count in self.all_counts if count > 0]
                    if valid_counts:
                       self.final_count = int(max(valid_counts))
                    else:
                       self.final_count = 0
            else:
                self.final_count = 0
            
            logging.info(f"Counting stopped. Final count (95th Percentile): {self.final_count} | Max Peak Seen: {self.max_detection_count}")

            # Calculate final biomass using percentile of full history
            self.final_biomass = 0
            
            # Ưu tiên 1: Dữ liệu sạch (đã lọc FAI)
            if len(self.all_biomass) > 0:
                try:
                    valid_biomass = [b for b in self.all_biomass if b > 0]
                    if valid_biomass:
                        self.final_biomass = float(np.percentile(valid_biomass, 95))
                        logging.info(f"Final Biomass (Filtered): {self.final_biomass}")
                except Exception as e:
                    logging.error(f"Error calculating final biomass: {e}")
            
            # Ưu tiên 2: Fallback sang dữ liệu thô nếu lọc quá chặt (trả về danh sách rỗng)
            elif len(self.all_biomass_raw) > 0:
                try:
                    valid_biomass = [b for b in self.all_biomass_raw if b > 0]
                    if valid_biomass:
                        # Vẫn dùng 95th percentile nhưng trên tập dữ liệu chưa lọc
                        self.final_biomass = float(np.percentile(valid_biomass, 95))
                        logging.warning(f"Final Biomass (FALLBACK RAW): {self.final_biomass}. FAI filter was too strict.")
                except Exception as e:
                    logging.error(f"Error calculating fallback biomass: {e}")
            
        except Exception as e:
            logging.error(f"Error stopping counting: {e}")

    def set_app_mode(self, mode):
        """Set Application Mode: 'counting' or 'monitoring'"""
        if mode in ['counting', 'monitoring']:
            self.app_mode = mode
            logging.info(f"App Mode set to: {mode.upper()}")
        else:
            logging.warning(f"Invalid app mode: {mode}")

    def set_fish_behavior(self, profile_key):
        """
        Cài đặt loại hành vi cá để điều chỉnh độ nhạy FAI.
        profile_key: 'slow' (Cá đáy), 'normal' (Cá thường), 'fast' (Cá săn mồi)
        """
        try:
            if profile_key in self.fai_profiles:
                self.current_profile = profile_key
                self.current_fai_threshold = self.fai_profiles[profile_key]['threshold']
                self.current_dead_threshold = self.fai_profiles[profile_key]['dead_threshold']
                # Xóa buffer cũ để biểu đồ phản ứng ngay với cài đặt mới
                self.fai_buffer.clear()
                logging.info(f"FAI Profile changed to: {self.fai_profiles[profile_key]['desc']} (FAI Thresh: {self.current_fai_threshold}, Dead Thresh: {self.current_dead_threshold}s)")
            else:
                logging.warning(f"Invalid profile key: {profile_key}. Keeping current: {self.current_profile}")
        except Exception as e:
            logging.error(f"Error setting fish behavior: {e}")

    def process_frame(self):
        """Xử lý frame hiện tại"""
        try:
            if not self.is_counting or self.cap is None:
                return None, self.get_fish_count(), 0, 0, 0, False
            
            elapsed_time = time.time() - self.start_time
            if elapsed_time >= self.counting_duration:
                self.stop_counting()
                return None, self.get_fish_count(), elapsed_time, getattr(self, 'final_biomass', 0), 0, False
            
            ret, frame = self.cap.read()
            if not ret:
                logging.error("Failed to read frame")
                return None, self.get_fish_count(), 0, 0, 0, False
            
            enhanced_frame = self.enhance_frame(frame)
            self.detection_stats['total_frames'] += 1
            
            results = self.model(enhanced_frame)
            # process_detections trả về 2 giá trị, nhưng có thể gây lỗi nếu không unpack đúng
            # Kiểm tra kỹ hàm process_detections
            detections_and_features = self.process_detections(results, frame)
            if len(detections_and_features) == 2:
                detections, features = detections_and_features
            else:
                logging.error(f"Unexpected return from process_detections: {len(detections_and_features)}")
                detections, features = [], []
            
            num_detections = len(detections)
            self.max_detection_count = max(self.max_detection_count, num_detections) # Cập nhật Max Peak
            # Lưu trữ toàn bộ lịch sử đếm của phiên này để tính toán thống kê
            self.all_counts.append(num_detections)
            
            # Cập nhật buffer hiển thị (chỉ giữ 10 frame cuối để mượt số trên UI)
            self.count_buffer.append(num_detections) 
            
            # Luôn chạy Tracker để hỗ trợ debug và visualization (người dùng muốn thấy track ID)
            tracks = self.tracker.update(detections, features)
            self.update_reid_counting(tracks)
            
            if len(self.count_buffer) > 10:
                self.count_buffer.popleft()
            
            result_frame = self.draw_results(frame, detections, tracks)
            current_display_count = self.get_fish_count() 
            
            total_biomass = 0
            for d in detections:
                # d[3] is mask_area, d[2] is class_id
                total_biomass += self.calculate_biomass(d[3], d[2])

            # --- CALCULATE ACTIVITY INDEX (FAI) ---
            current_fai = 0
            if len(self.tracker.tracks) > 0:
                # Chỉ tính vận tốc của những track ĐANG DI CHUYỂN
                velocities = [t.velocity for t in self.tracker.tracks if t.velocity > 0]
                if velocities:
                    median_vel = np.median(velocities)
                    # Sử dụng ngưỡng động (Dynamic Threshold) dựa trên Profile
                    raw_fai = min(100, (median_vel / self.current_fai_threshold) * 100)
                    self.fai_buffer.append(raw_fai)
                else:
                     # Nếu có track nhưng không ai di chuyển -> FAI = 0
                     # Fix lỗi logic cũ: Trước đây nếu đứng yên, không append gì cả -> FAI giữ nguyên giá trị cũ cao
                     self.fai_buffer.append(0)
            
            if len(self.fai_buffer) > 10:
                self.fai_buffer.popleft()
                
            if len(self.fai_buffer) > 0:
                current_fai = sum(self.fai_buffer) / len(self.fai_buffer)

            # --- OPTION 3: BIOMASS FILTER ---
            # Luôn lưu trữ dữ liệu thô để fallback phòng khi lọc quá chặt
            if total_biomass > 0:
                self.all_biomass_raw.append(total_biomass)

            # Chỉ ghi nhận sinh khối "sạch" nếu cá khỏe mạnh (5 < FAI < 80)
            # FAI thang điểm 100: 
            # < 20: Lờ đờ (bỏ qua do cá nằm đáy/che khuất)
            # > 80: Náo loạn (bỏ qua do bơi quá nhanh/nhiễu)
            if 5 < current_fai < 80:
                self.all_biomass.append(total_biomass)
            
            # --- CHECK FOR DEAD FISH ---
            has_dead_fish = False
            if len(self.tracker.tracks) > 0:
                current_time = time.time()
                # Ngưỡng Demo: Động theo Profile (Slow=30s, Normal=10s, Fast=5s)
                # Logic: Đã bắt đầu đứng yên VÀ thời gian đứng yên > Ngưỡng cho phép
                has_dead_fish = any(
                    (t.stationary_start_time is not None) and 
                    ((current_time - t.stationary_start_time) > self.current_dead_threshold) 
                    for t in self.tracker.tracks
                )

            # --- SMART STOPPING LOGIC (Plateau Detection) ---
            # Chỉ chạy ở chế độ Đếm/Trading. Chế độ Giám sát chạy 24/7.
            if self.app_mode == 'counting':
                # Di chuyển xuống đây để đảm bảo result_frame và các biến khác đã có giá trị
                if len(self.all_counts) > 30: 
                    current_best = int(np.percentile(self.all_counts, 95))
                    
                    if current_best > self.best_session_count:
                        self.best_session_count = current_best
                        self.last_peak_time = time.time()
                        self.stability_progress = 0
                        logging.info(f"New peak detected: {current_best}. Resetting patience timer.")
                    
                    time_since_peak = time.time() - self.last_peak_time
                    
                    # Calculate Stability Progress (0.0 -> 1.0)
                    if elapsed_time > self.min_duration:
                        self.stability_progress = min(1.0, time_since_peak / self.patience_duration)
                    else:
                         self.stability_progress = 0
                         
                    if elapsed_time > self.min_duration and time_since_peak > self.patience_duration:
                        logging.info(f"Smart Stop triggered: Stable at {current_best} for {self.patience_duration}s")
                        self.stop_counting()
                        self.stability_progress = 1.0
                        # Trả về đầy đủ giá trị bao gồm current_fai và has_dead_fish
                        return result_frame, current_display_count, elapsed_time, total_biomass, current_fai, has_dead_fish

            return result_frame, current_display_count, elapsed_time, total_biomass, current_fai, has_dead_fish
            
        except Exception as e:
            logging.error(f"Error processing frame: {e}")
            # Trả về frame gốc nếu lỗi để không bị crash stream
            return frame, 0, 0, 0, 0, False

    def process_detections(self, results, frame):
        try:
            detections = []
            features = []
            
            # Debug counters
            dropped_area = 0
            dropped_ratio = 0
            
            for r in results:
                if hasattr(r, 'boxes') and len(r.boxes) > 0:
                    boxes = r.boxes.xyxy.cpu().numpy()
                    confidences = r.boxes.conf.cpu().numpy()
                    classes = r.boxes.cls.cpu().numpy()
                    
                    for i, (box, conf, cls) in enumerate(zip(boxes, confidences, classes)):
                        # Chỉ xem xét các box có kích thước hợp lý
                        w, h = box[2] - box[0], box[3] - box[1]
                        area = w * h
                        # Relaxed thresholds: Max area increased to 400,000 (almost full screen) to catch big fish
                        if area < 50 or area > 400000:  
                            dropped_area += 1
                            logging.debug(f"Dropped detection: Area {area} out of range")
                            continue
                        
                        # Kiểm tra tỷ lệ khung hình
                        aspect_ratio = w / h if h > 0 else 0
                        self.detection_stats['avg_ratio'] = (
                            (self.detection_stats['avg_ratio'] * self.detection_stats['total_detections'] + aspect_ratio) / 
                            (self.detection_stats['total_detections'] + 1)
                        )
                        
                        # Relaxed aspect ratio
                        if aspect_ratio < 0.1 or aspect_ratio > 8.0:
                            dropped_ratio += 1
                            logging.debug(f"Dropped detection: Ratio {aspect_ratio:.2f} out of range")
                            continue
                        
                        mask_area = 0
                        if hasattr(r, 'masks') and r.masks is not None:
                             if i < len(r.masks.xy):
                                 poly = r.masks.xy[i]
                                 if len(poly) > 0:
                                     mask_area = cv2.contourArea(poly.astype(np.float32))
                        
                        if mask_area == 0:
                            mask_area = area

                        detections.append([box.astype(np.float32), float(conf), int(cls), mask_area])
                        
                        if self.counting_method == "reid":
                            x1, y1, x2, y2 = map(int, box)
                            fish_img = frame[max(0, y1):min(frame.shape[0], y2), 
                                           max(0, x1):min(frame.shape[1], x2)]
                            feature = self.reid.extract_features(fish_img)
                            features.append(feature)
            
            detections_after_nms = []
            features_after_nms = [] 
            
            # Global NMS: Gộp tất cả các class lại để chạy NMS
            # Điều này giải quyết vấn đề: 1 con cá bị nhận diện là cả "ca_to" và "ca_nho" (2 box chồng lên nhau)
            if len(detections) > 0:
                try:
                    # Chuẩn bị dữ liệu cho NMS
                    boxes = np.array([d[0] for d in detections])
                    scores = np.array([d[1] for d in detections])
                    
                    # NMSBoxes của OpenCV
                    nms_indices = cv2.dnn.NMSBoxes(
                        boxes.tolist(),
                        scores.tolist(),
                        score_threshold=0.45,
                        nms_threshold=0.7,
                    )
                    
                    if isinstance(nms_indices, tuple): nms_indices = nms_indices[0]
                    elif isinstance(nms_indices, np.ndarray): nms_indices = nms_indices.flatten()
                    
                    detections_after_nms = [detections[i] for i in nms_indices]
                    if self.counting_method == "reid":
                         features_after_nms = [features[i] for i in nms_indices if i < len(features)]

                    # Log NMS stats
                    dropped_nms = len(detections) - len(detections_after_nms)
                    if dropped_nms > 0 or dropped_area > 0 or dropped_ratio > 0:
                        logging.info(f"Frame Stats - YOLO: {len(detections) + dropped_area + dropped_ratio} | "
                                   f"Area Drop: {dropped_area} | Ratio Drop: {dropped_ratio} | "
                                   f"NMS Drop: {dropped_nms} | Final: {len(detections_after_nms)}")

                except Exception as e:
                    logging.error(f"Error applying Global NMS: {e}")
                    detections_after_nms = detections
                    features_after_nms = features
            else:
                 detections_after_nms = []
                 features_after_nms = []
            
            self.detection_stats['total_detections'] += len(detections_after_nms)
            if len(detections_after_nms) > 0:
                self.detection_stats['avg_confidence'] = np.mean([d[1] for d in detections_after_nms])
            
            return detections_after_nms, features_after_nms
        except Exception as e:
            logging.error(f"Error processing detections: {e}")
            return [], []
            
    def update_reid_counting(self, tracks):
        try:
            if self.counting_method != "reid":
                return
                
            self.unique_fish_count = min(self.unique_fish_count, len(tracks))
            
            if len(self.count_buffer) > 0:
                avg_detections = sum(self.count_buffer) / len(self.count_buffer)
                self.unique_fish_count = min(self.unique_fish_count, int(avg_detections * 1.3))
            
            for track in tracks:
                if track.id in self.track_to_fish_map:
                    continue
                if not track.features:
                    continue
                    
                avg_feature = track.get_feature()
                if avg_feature is None:
                    continue
                
                fish_id = self.reid.find_fish_match(avg_feature)
                
                if fish_id is None:
                    fish_id = self.reid.next_fish_id
                    self.reid.next_fish_id += 1
                    self.unique_fish_count += 1
                
                self.reid.update_database(avg_feature, fish_id)
                self.track_to_fish_map[track.id] = fish_id
                
        except Exception as e:
            logging.error(f"Error updating ReID counting: {e}")

    def enhance_frame(self, frame):
        try:
            alpha = 1.1
            beta = 10
            enhanced = cv2.convertScaleAbs(frame, alpha=alpha, beta=beta)
            enhanced = cv2.GaussianBlur(enhanced, (3, 3), 0)
            return enhanced
        except Exception as e:
            logging.error(f"Error enhancing frame: {e}")
            return frame
            
    def needs_contrast_enhancement(self, frame):
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
            std_dev = np.std(hist)
            return std_dev < 50
        except Exception as e:
            logging.error(f"Error checking contrast: {e}")
            return False

    def draw_results(self, frame, detections, tracks):
        try:
            result_frame = frame.copy()
            
            total_weight = 0
            for det in detections:
                if len(det) >= 4:
                    bbox, conf, cls, mask_area = det
                    weight = self.calculate_biomass(mask_area, cls)
                    total_weight += weight
                    
                    x1, y1, x2, y2 = map(int, bbox)
                    cv2.rectangle(result_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    
                    label = f"C{cls} {conf:.2f} W:{weight:.1f}g"
                    cv2.putText(result_frame, label, (x1, y1 - 10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                else:
                    bbox, conf = det[:2]
                    x1, y1, x2, y2 = map(int, bbox)
                    cv2.rectangle(result_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Calculate fps (default 30 if not available)
            fps = getattr(self, 'fps', 30) # Assuming self.fps might exist, otherwise default to 30

            # --- BƯỚC 1: TÍNH TOÁN THỐNG KÊ ĐỂ PHÂN LOẠI SIZE ĐỘNG ---
            # Mục đích: Tìm ra cá Trội ([+]) và Cá Đẹt ([-]) trong đàn hiện tại
            active_weights = []
            valid_tracks_data = [] # Lưu tạm để đỡ tính lại
            
            for track in tracks:
                bbox = track.bbox
                x1, y1, x2, y2 = map(int, bbox)
                w_rect = x2 - x1
                h_rect = y2 - y1
                area = w_rect * h_rect
                # Ước lượng sinh khối (Dùng profile mặc định hoặc cls=0)
                weight = self.calculate_biomass(area, 0)
                
                if weight > 0:
                    active_weights.append(weight)
                    valid_tracks_data.append((track, weight))

            mean_w = np.mean(active_weights) if active_weights else 0
            std_w = np.std(active_weights) if active_weights else 0
            # ---------------------------------------------------------

            for track, weight in valid_tracks_data:
                bbox = track.bbox
                x1, y1, x2, y2 = map(int, bbox)
                track_id = track.id
                
                # Kiểm tra cá chết / bất thường (Logic Thời gian thực)
                current_time = time.time()
                is_dead = (track.stationary_start_time is not None) and \
                          ((current_time - track.stationary_start_time) > self.current_dead_threshold)
                
                # --- LOGIC GÁN NHÃN SIZE & MÀU SẮC ---
                size_tag = ""
                # Mặc định lấy màu theo ID (cầu vồng) để phân biệt từng con
                color_idx = track_id % 7
                if color_idx == 0: color = (255, 0, 0)      # Blue
                elif color_idx == 1: color = (0, 255, 0)    # Green
                elif color_idx == 2: color = (0, 0, 255)    # Red
                elif color_idx == 3: color = (255, 255, 0)  # Cyan
                elif color_idx == 4: color = (255, 0, 255)  # Magenta
                elif color_idx == 5: color = (0, 255, 255)  # Yellow
                else: color = (255, 165, 0)                 # Orange
                
                # Phân loại Động (Dynamic Grading)
                if std_w > 0 and not is_dead: # Chỉ phân loại cá sống
                    z_score = (weight - mean_w) / std_w
                    if z_score > 1.2: 
                        size_tag = "[+] " # Trội (Lớn hơn 1.2 độ lệch chuẩn)
                    elif z_score < -1.2:
                        size_tag = "[-] " # Đẹt (Nhỏ hơn 1.2 độ lệch chuẩn)
                
                # Xử lý hiển thị
                if is_dead:
                    color = (0, 0, 0) # Màu Đen cho cá chết
                    label = f"DEAD #{track_id}"
                    thickness = 3
                    # Vẽ thêm viền đỏ cảnh báo bên ngoài
                    cv2.rectangle(result_frame, (x1-5, y1-5), (x2+5, y2+5), (0, 0, 255), 2)
                    cv2.putText(result_frame, "!!! CANH BAO !!!", (x1, y1 - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                else:
                    label = f"{size_tag}T{track_id} {weight:.1f}g"
                    thickness = 2
                
                cv2.rectangle(result_frame, (x1, y1), (x2, y2), color, thickness)
                
                # Vẽ nền cho chữ dễ đọc
                (w_text, h_text), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(result_frame, (x1, y1 - 20), (x1 + w_text, y1), color, -1)
                
                # Chữ trắng trên nền màu
                cv2.putText(result_frame, label, (x1, y1 - 5),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                           
                # Vẽ tâm
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
                cv2.circle(result_frame, (cx, cy), 2, (0, 0, 255), -1)
            
            offset_y = 30
            count = self.get_fish_count()
            if self.counting_method == "reid":
                count_text = f"Total Fish: {count} (ReID)"
            elif self.counting_method == "tracking":
                count_text = f"Total Fish: {count} (Tracking)"
            elif self.counting_method == "statistical":
                count_text = f"Total Fish: {count} (Stat - 95th%)"
                
            cv2.putText(result_frame, count_text, (10, offset_y),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            offset_y += 40
            
            cv2.putText(result_frame, f"Detections: {len(detections)}", (10, offset_y),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            offset_y += 40
            
            elapsed_time = time.time() - self.start_time
            cv2.putText(result_frame, f"Time: {elapsed_time:.1f}s", (10, offset_y),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            offset_y += 40

            cv2.putText(result_frame, f"Est. Biomass: {total_weight:.1f}g", (10, offset_y),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            
            return result_frame
        except Exception as e:
            logging.error(f"Error drawing results: {e}")
            return frame

    def get_fish_count(self):
        if self.counting_method == "reid":
            if len(self.count_buffer) > 5:
                avg_detections = sum(c for c in self.count_buffer if c > 0) / len([c for c in self.count_buffer if c > 0]) if any(c > 0 for c in self.count_buffer) else 0
                return min(self.unique_fish_count, int(avg_detections * 1.3)) if avg_detections > 0 else self.unique_fish_count
            return self.unique_fish_count
        elif self.counting_method == "tracking":
            return len(self.tracker.tracks)
        elif self.counting_method == "statistical":
            if len(self.count_buffer) > 0:
                try:
                    valid_counts = [count for count in list(self.count_buffer) if count > 0]
                    if valid_counts:
                        # Dùng 95th Percentile thay vì Median để lấy cận trên (giảm thiểu tác động của che khuất)
                        return int(np.percentile(valid_counts, 95))
                    else: return 0
                except Exception:
                    valid_counts = [count for count in list(self.count_buffer) if count > 0]
                    if valid_counts: return int(max(valid_counts)) # Fallback to max if percentile fails
                    else: return 0
            return 0
        else:
            return 0

    def get_final_count(self):
        return self.final_count

    def save_result(self, duration):
        try:
            os.makedirs(os.path.join("data", "outputs"), exist_ok=True)
            
            result = {
                'session': 1,
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'count': self.final_count,
                'confidence': float(self.detection_stats['avg_confidence']),
                'method': self.counting_method,
                'duration': duration,
                'ratio': float(self.detection_stats['avg_ratio']),
                'biomass': getattr(self, 'final_biomass', 0)
            }
            
            filename = f"result_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            with open(os.path.join("data", "outputs", filename), 'w') as f:
                json.dump(result, f)
                
            return result
        except Exception as e:
            logging.error(f"Error saving result: {e}")
            return None

    def calculate_biomass(self, area, class_id):
        # Delegate sang biomass module để giữ DRY giữa FishCounter (GUI)
        # và pipeline (async worker). self.biomass_params vẫn giữ để các
        # test/cấu hình cũ override được per-instance.
        from .biomass import calculate_weight
        return calculate_weight(area, class_id, self.biomass_params)

    def is_counting_finished(self):
        return not self.is_counting
        
    def set_counting_method(self, method):
        if method in ["reid", "tracking", "statistical"]:
            self.counting_method = method
            logging.info(f"Counting method set to: {method}")
            return True
        return False 