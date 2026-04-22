import cv2
import numpy as np
import scipy.spatial
import time

class Track:
    """Lớp đại diện cho một đối tượng theo dõi"""
    count = 0
    
    def __init__(self, bbox, score):
        self.id = Track.count
        Track.count += 1
        self.bbox = bbox
        self.score = score
        self.hits = 0
        self.age = 0
        self.time_since_update = 0
        
        # Activity Index features
        self.velocity = 0.0 # Normalized velocity (Body Lengths per frame)
        self.stationary_frames = 0 # DEPRECATED: Giữ lại để tương thích ngược
        self.stationary_start_time = None # Thời điểm bắt đầu đứng yên (Real-time)
        self.history = [] # Optional: store path history
        
        # Khởi tạo Kalman Filter
        self.kf = cv2.KalmanFilter(8, 4)  # 8 states (x, y, w, h, vx, vy, vw, vh), 4 measurements (x, y, w, h)
        self.kf.transitionMatrix = np.array([
            [1, 0, 0, 0, 1, 0, 0, 0],  # x = x + vx
            [0, 1, 0, 0, 0, 1, 0, 0],  # y = y + vy
            [0, 0, 1, 0, 0, 0, 1, 0],  # w = w + vw
            [0, 0, 0, 1, 0, 0, 0, 1],  # h = h + vh
            [0, 0, 0, 0, 1, 0, 0, 0],  # vx = vx
            [0, 0, 0, 0, 0, 1, 0, 0],  # vy = vy
            [0, 0, 0, 0, 0, 0, 1, 0],  # vw = vw
            [0, 0, 0, 0, 0, 0, 0, 1],  # vh = vh
        ], np.float32)
        
        self.kf.measurementMatrix = np.array([
            [1, 0, 0, 0, 0, 0, 0, 0],  # x
            [0, 1, 0, 0, 0, 0, 0, 0],  # y
            [0, 0, 1, 0, 0, 0, 0, 0],  # w
            [0, 0, 0, 1, 0, 0, 0, 0],  # h
        ], np.float32)
        
        # Process noise
        self.kf.processNoiseCov = np.eye(8, dtype=np.float32) * 0.03
        
        # Measurement noise
        self.kf.measurementNoiseCov = np.eye(4, dtype=np.float32) * 0.1
        
        # Initial state
        self.kf.errorCovPost = np.eye(8, dtype=np.float32) * 1
        
        # Initialize state
        x, y, w, h = self._bbox_to_xyah(bbox)
        self.kf.statePost = np.array([[x], [y], [w], [h], [0], [0], [0], [0]], np.float32)
        
        # Features for Re-ID
        self.features = []
        
    def update(self, bbox, score, feature=None):
        """Cập nhật track với một detection mới"""
        # Tính vận tốc trước khi cập nhật bbox mới
        if self.bbox is not None:
            # Tâm cũ
            cx_old = (self.bbox[0] + self.bbox[2]) / 2
            cy_old = (self.bbox[1] + self.bbox[3]) / 2
            
            # Tâm mới
            cx_new = (bbox[0] + bbox[2]) / 2
            cy_new = (bbox[1] + bbox[3]) / 2
            
            # Khoảng cách di chuyển (pixels)
            distance = np.sqrt((cx_new - cx_old)**2 + (cy_new - cy_old)**2)
            
            # Kích thước thân cá (Body Length - lấy cạnh lớn nhất)
            w_box = bbox[2] - bbox[0]
            h_box = bbox[3] - bbox[1]
            body_length = max(w_box, h_box, 1.0) # Tránh chia cho 0
            
            # Thời gian trôi qua (số frame) kể từ lần update trước
            # Nếu vừa khởi tạo thì time_since_update = 0 -> lấy là 1
            time_delta = max(1, self.time_since_update)
            
            # Lọc nhiễu: Chỉ tính nếu di chuyển > 2.0 pixel (đã tăng lên để tránh nhiễu rung)
            if distance > 2.0:
                # Vận tốc chuẩn hóa theo thời gian: (Distance / BodyLength) / Time
                self.velocity = distance / (body_length * time_delta)
                self.stationary_frames = 0 
                self.stationary_start_time = None # Reset mốc thời gian (ĐANG DI CHUYỂN)
            else:
                self.velocity = 0.0
                self.stationary_frames += time_delta
                
                # Bắt đầu tính giờ đứng yên
                if self.stationary_start_time is None:
                    self.stationary_start_time = time.time()
                    
        else:
             # First update
             self.stationary_start_time = time.time()
        
        self.time_since_update = 0
        self.age += 1
        self.bbox = bbox
        self.score = score
        
        # Cập nhật Kalman Filter
        x, y, w, h = self._bbox_to_xyah(bbox)
        measurement = np.array([[x], [y], [w], [h]], np.float32)
        self.kf.correct(measurement)
        
        # Lưu feature nếu có
        if feature is not None:
            self.features.append(feature)
    
    def predict(self):
        """Dự đoán vị trí tiếp theo dựa vào Kalman Filter"""
        self.kf.predict()
        self.time_since_update += 1
        
        # Chuyển state về lại bbox
        x, y, w, h = self.kf.statePost[0:4, 0]
        return self._xyah_to_bbox(x, y, w, h)
    
    def _bbox_to_xyah(self, bbox):
        """Chuyển đổi bounding box [x1, y1, x2, y2] thành [center_x, center_y, aspect_ratio, height]"""
        x1, y1, x2, y2 = bbox
        w = x2 - x1
        h = y2 - y1
        x = x1 + w/2
        y = y1 + h/2
        return x, y, w, h
    
    def _xyah_to_bbox(self, x, y, w, h):
        """Chuyển đổi [center_x, center_y, width, height] thành bounding box [x1, y1, x2, y2]"""
        x1 = x - w/2
        y1 = y - h/2
        x2 = x + w/2
        y2 = y + h/2
        return [x1, y1, x2, y2]
    
    def get_feature(self):
        """Lấy vector đặc trưng trung bình cho Re-ID"""
        if not self.features:
            return None
        return np.mean(self.features[-5:], axis=0) if len(self.features) >= 5 else np.mean(self.features, axis=0)

class SimpleTracker:
    """Đối tượng tracker đơn giản"""
    def __init__(self, match_thresh=0.3, max_age=50):
        self.tracks = []  # Danh sách các track đang hoạt động
        self.match_thresh = match_thresh  # Ngưỡng IoU để ghép cặp các track (Giảm xuống 0.3 để bắt tốt hơn)
        self.max_age = max_age  # Tuổi tối đa (Tăng lên 50 để giữ track lâu hơn khi cá đứng yên/mất dấu tạm thời)
        
    def update(self, detections, features=None):
        """Cập nhật tracker với detections mới
        
        Args:
            detections: Danh sách các detection, mỗi detection là [bbox, score]
            features: Danh sách các vector đặc trưng tương ứng với mỗi detection
        
        Returns:
            List of Tracks
        """
        # Dự đoán vị trí mới cho các track hiện tại
        for track in self.tracks:
            track.predict()
        
        # Ghép cặp detections với tracks
        if detections:
            if self.tracks:
                iou_matrix = np.zeros((len(self.tracks), len(detections)))
                for i, track in enumerate(self.tracks):
                    for j, detection in enumerate(detections):
                        iou_matrix[i, j] = self._calculate_iou(track.bbox, detection[0])
                
                # Áp dụng Hungarian algorithm
                matched_indices = self._hungarian_matching(1 - iou_matrix)
                
                # Cập nhật tracks
                for track_idx, det_idx in matched_indices:
                    if iou_matrix[track_idx, det_idx] >= self.match_thresh:
                        bbox, score = detections[det_idx][:2]
                        feature = features[det_idx] if features is not None and det_idx < len(features) else None
                        self.tracks[track_idx].update(bbox, score, feature)
                    else:
                        self.tracks[track_idx].time_since_update += 1
                
                # Xử lý tracks chưa được ghép cặp
                unmatched_tracks = [i for i in range(len(self.tracks)) 
                                 if i not in [idx for idx, _ in matched_indices]]
                for track_idx in unmatched_tracks:
                    self.tracks[track_idx].time_since_update += 1
                
                # Xử lý detections chưa được ghép cặp
                unmatched_dets = [j for j in range(len(detections)) 
                                if j not in [_ for _, idx in matched_indices]]
                for det_idx in unmatched_dets:
                    bbox, score = detections[det_idx][:2]
                    feature = features[det_idx] if features is not None and det_idx < len(features) else None
                    track = Track(bbox, score)
                    if feature is not None:
                        track.features.append(feature)
                    self.tracks.append(track)
            else:
                # Nếu không có tracks, tạo mới cho tất cả detections
                for i, detection in enumerate(detections):
                    bbox, score = detection[:2]
                    track = Track(bbox, score)
                    if features is not None and i < len(features):
                        track.features.append(features[i])
                    self.tracks.append(track)
        
        # Loại bỏ tracks quá cũ
        self.tracks = [track for track in self.tracks if track.time_since_update <= self.max_age]
        
        return self.tracks
    
    def _calculate_iou(self, bbox1, bbox2):
        """Tính IoU giữa hai bounding boxes"""
        # Convert to [x1, y1, w, h] format
        x1, y1, x2, y2 = bbox1
        x1_, y1_, x2_, y2_ = bbox2
        
        # Calculate overlap area
        xx1 = max(x1, x1_)
        yy1 = max(y1, y1_)
        xx2 = min(x2, x2_)
        yy2 = min(y2, y2_)
        
        w = max(0, xx2 - xx1)
        h = max(0, yy2 - yy1)
        overlap = w * h
        
        # Calculate union area
        area1 = (x2 - x1) * (y2 - y1)
        area2 = (x2_ - x1_) * (y2_ - y1_)
        union = area1 + area2 - overlap
        
        # Calculate IoU
        iou = overlap / union if union > 0 else 0
        return iou
    
    def _hungarian_matching(self, cost_matrix):
        """Áp dụng Hungarian algorithm để giải quyết bài toán ghép cặp
        
        Args:
            cost_matrix: Ma trận chi phí, giá trị càng thấp càng tốt
            
        Returns:
            Danh sách các cặp (track_idx, det_idx)
        """
        try:
            from scipy.optimize import linear_sum_assignment
            row_ind, col_ind = linear_sum_assignment(cost_matrix)
            matched_indices = list(zip(row_ind, col_ind))
        except:
            # Fallback to greedy matching
            matched_indices = self._greedy_matching(cost_matrix)
        
        return matched_indices
    
    def _greedy_matching(self, cost_matrix):
        """Thuật toán ghép cặp tham lam khi không có scipy"""
        matched_indices = []
        
        # Flatten cost matrix
        flat_costs = [(i, j, cost_matrix[i, j]) 
                    for i in range(cost_matrix.shape[0]) 
                    for j in range(cost_matrix.shape[1])]
        
        # Sort by cost (ascending)
        flat_costs.sort(key=lambda x: x[2])
        
        # Greedy matching
        row_used = set()
        col_used = set()
        for i, j, _ in flat_costs:
            if i not in row_used and j not in col_used:
                matched_indices.append((i, j))
                row_used.add(i)
                col_used.add(j)
        
        return matched_indices 