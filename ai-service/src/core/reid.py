import cv2
import numpy as np
import logging

class SimpleReID:
    """ReID đơn giản sử dụng histograms và HOG features"""
    def __init__(self, similarity_threshold=0.7):
        self.similarity_threshold = similarity_threshold
        self.fish_database = {}  # Dictionary mapping fish_id -> feature vector
        self.next_fish_id = 0
        
    def extract_features(self, image):
        """Trích xuất đặc trưng từ ảnh cá
        
        Args:
            image: ảnh cắt ra của con cá (cropped ROI)
            
        Returns:
            feature vector
        """
        if image is None or image.size == 0 or image.shape[0] < 10 or image.shape[1] < 10:
            logging.warning("Invalid image for feature extraction")
            return np.zeros(384)
            
        try:
            # Resize ảnh về kích thước cố định
            img = cv2.resize(image, (64, 64))
            
            # Chuyển về grayscale
            if len(img.shape) == 3 and img.shape[2] == 3:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            else:
                gray = img.copy()  # Đã là grayscale
            
            # Tính HOG features
            hog = cv2.HOGDescriptor((64, 64), (16, 16), (8, 8), (8, 8), 9)
            hog_features = hog.compute(gray).flatten()
            
            # Tính color histogram
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            hist_h = cv2.calcHist([hsv], [0], None, [16], [0, 180])
            hist_s = cv2.calcHist([hsv], [1], None, [16], [0, 256])
            hist_v = cv2.calcHist([hsv], [2], None, [16], [0, 256])
            
            # Chuẩn hóa histograms
            cv2.normalize(hist_h, hist_h, 0, 1, cv2.NORM_MINMAX)
            cv2.normalize(hist_s, hist_s, 0, 1, cv2.NORM_MINMAX)
            cv2.normalize(hist_v, hist_v, 0, 1, cv2.NORM_MINMAX)
            
            # Kết hợp features
            combined_features = np.concatenate([
                hog_features,
                hist_h.flatten(),
                hist_s.flatten(),
                hist_v.flatten()
            ])
            
            # Chuẩn hóa feature vector
            norm = np.linalg.norm(combined_features)
            if norm > 0:
                combined_features = combined_features / norm
                
            # Đảm bảo kết quả luôn có kích thước 384
            result = np.zeros(384)
            if combined_features.shape[0] > 384:
                result = combined_features[:384]  # Cắt bớt nếu quá lớn
            else:
                result[:combined_features.shape[0]] = combined_features  # Padding nếu quá nhỏ
            
            return result
        except Exception as e:
            print(f"Error extracting features: {e}")
            return np.zeros(384)
    
    def compare_features(self, feature1, feature2):
        """So sánh hai feature vectors và trả về độ tương đồng"""
        # Cosine similarity
        dot_product = np.dot(feature1, feature2)
        norm1 = np.linalg.norm(feature1)
        norm2 = np.linalg.norm(feature2)
        
        if norm1 == 0 or norm2 == 0:
            return 0
            
        similarity = dot_product / (norm1 * norm2)
        
        # Thêm một số phép kiểm tra để giảm khả năng sai
        # Nếu độ tương đồng quá cao (>0.95), khả năng cao là cùng một con cá
        if similarity > 0.95:
            return similarity
        
        # Nếu độ tương đồng trung bình, thêm xác minh khoảng cách Euclidean
        euclidean_dist = np.linalg.norm(feature1 - feature2)
        if euclidean_dist < 0.5 and similarity > 0.6:
            return max(similarity, 0.85)  # Tăng độ tin cậy
            
        return similarity
    
    def find_fish_match(self, feature):
        """Tìm kiếm fish_id tương ứng với feature vector
        
        Args:
            feature: feature vector của cá cần tìm
            
        Returns:
            fish_id nếu tìm thấy, None nếu không tìm thấy
        """
        best_match = None
        best_score = 0
        
        for fish_id, db_feature in self.fish_database.items():
            similarity = self.compare_features(feature, db_feature)
            if similarity > self.similarity_threshold and similarity > best_score:
                best_match = fish_id
                best_score = similarity
                
        return best_match
    
    def update_database(self, feature, fish_id=None):
        """Cập nhật cơ sở dữ liệu với feature vector mới
        
        Args:
            feature: feature vector
            fish_id: fish_id nếu đã biết, None nếu là cá mới
            
        Returns:
            fish_id
        """
        if fish_id is None:
            # Tìm kiếm match trước
            fish_id = self.find_fish_match(feature)
            
            # Nếu không tìm thấy, tạo fish_id mới
            if fish_id is None:
                fish_id = self.next_fish_id
                self.next_fish_id += 1
        
        # Cập nhật/thêm mới vào database
        self.fish_database[fish_id] = feature
        
        return fish_id 