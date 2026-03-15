from ultralytics import YOLO
import cv2
import numpy as np
from collections import deque
import datetime
import os
import json
import time
import logging

# Cấu hình logging
logging.basicConfig(level=logging.INFO,
                format='%(asctime)s - %(levelname)s - %(message)s')

# Tạo thư mục để lưu dữ liệu
base_dir = "fish_monitoring"
for folder in ['logs', 'snapshots', 'stats']:
    os.makedirs(os.path.join(base_dir, folder), exist_ok=True)

# Khởi tạo mô hình
model = YOLO("best.pt")
model.conf = 0.6  # Ngưỡng tin cậy cao hơn

# Mở camera
cap = cv2.VideoCapture(0)  # Sau này sẽ thay bằng IP camera hoặc RTSP stream
if not cap.isOpened():
    logging.error("Failed to open camera")
    exit()

# Thiết lập độ phân giải camera
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# Lấy kích thước frame
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Tính toán kích thước cho fish
min_fish_area = (frame_width * frame_height) * 0.005
max_fish_area = (frame_width * frame_height) * 0.3

# Queue để lưu trữ các detection gần đây
recent_detections = deque(maxlen=30)  # Tăng lên 30 frame để ổn định hơn

# Biến để theo dõi thời gian
last_save_time = time.time()
last_stats_time = time.time()
stats_interval = 300  # 5 phút
save_interval = 3600  # 1 giờ

def check_fish_shape(mask):
    """Kiểm tra hình dạng của đối tượng có giống cá không"""
    try:
        # Tìm contour
        contours, _ = cv2.findContours(mask.astype(np.uint8), 
                                     cv2.RETR_EXTERNAL, 
                                     cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return False
        
        # Lấy contour lớn nhất
        contour = max(contours, key=cv2.contourArea)
        
        # Tính tỷ lệ khung hình
        rect = cv2.minAreaRect(contour)
        width, height = rect[1]
        aspect_ratio = max(width, height) / min(width, height)
        
        # Tính độ tròn
        area = cv2.contourArea(contour)
        perimeter = cv2.arcLength(contour, True)
        circularity = 4 * np.pi * area / (perimeter * perimeter)
        
        # Kiểm tra điều kiện
        return 1.5 <= aspect_ratio <= 4.0 and circularity < 0.8
    except Exception as e:
        logging.error(f"Error checking fish shape: {e}")
        return False

def enhance_frame(frame):
    """Tăng cường chất lượng frame"""
    try:
        # Giảm nhiễu
        denoised = cv2.fastNlMeansDenoisingColored(frame, None, 10, 10, 7, 21)
        
        # Chuyển sang ảnh xám
        gray = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
        
        # Cân bằng histogram
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        equalized = clahe.apply(gray)
        
        # Chuyển lại sang ảnh màu
        enhanced = cv2.cvtColor(equalized, cv2.COLOR_GRAY2BGR)
        
        # Trộn với ảnh gốc
        result = cv2.addWeighted(denoised, 0.7, enhanced, 0.3, 0)
        
        return result
    except Exception as e:
        logging.error(f"Error enhancing frame: {e}")
        return frame

def save_snapshot(frame, valid_indices, timestamp, all_boxes, all_confidences):
    """Lưu ảnh và thông tin detection"""
    try:
        # Create filename based on timestamp
        filename = timestamp.strftime("%Y%m%d_%H%M%S")
        
        # Save image
        image_path = os.path.join(base_dir, 'snapshots', f"{filename}.jpg")
        cv2.imwrite(image_path, frame)
        
        # Save detection info using the passed lists and valid indices
        data = {
            'timestamp': timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            'fish_count': len(valid_indices), # Count based on valid indices
            'detections': [{
                'confidence': float(all_confidences[idx]), # Use all_confidences
                'bbox': all_boxes[idx].tolist()        # Use all_boxes
            } for idx in valid_indices] # Iterate through valid indices
        }
        
        json_path = os.path.join(base_dir, 'logs', f"{filename}.json")
        with open(json_path, 'w') as f:
            json.dump(data, f, indent=4) # Added indent for readability
        logging.info(f"Snapshot saved: {filename}")
    except IndexError as ie:
         logging.error(f"Error saving snapshot - Index out of bounds: {ie}. Indices: {valid_indices}, Boxes len: {len(all_boxes)}, Confidences len: {len(all_confidences)}")
    except Exception as e:
        logging.error(f"Error saving snapshot: {e}")

def update_stats(timestamp, count):
    """Cập nhật thống kê"""
    try:
        stats_file = os.path.join(base_dir, 'stats', 
                                 timestamp.strftime("%Y%m%d") + "_stats.json")
        
        # Đọc dữ liệu cũ nếu có
        if os.path.exists(stats_file):
            with open(stats_file, 'r') as f:
                stats = json.load(f)
        else:
            stats = {
                'date': timestamp.strftime("%Y-%m-%d"),
                'min_count': count,
                'max_count': count,
                'total_readings': 0,
                'sum_count': 0
            }
        
        # Cập nhật thống kê
        stats['min_count'] = min(stats['min_count'], count)
        stats['max_count'] = max(stats['max_count'], count)
        stats['total_readings'] += 1
        stats['sum_count'] += count
        stats['avg_count'] = stats['sum_count'] / stats['total_readings']
        
        # Lưu lại
        with open(stats_file, 'w') as f:
            json.dump(stats, f)
    except Exception as e:
        print(f"Error updating stats: {e}")

def main():
    global last_save_time, last_stats_time # Ensure these are accessible if defined outside
    try:
        while True:
            try:
                # Đọc frame
                ret, frame = cap.read()
                if not ret:
                    logging.error("Failed to read frame")
                    break
                
                # Tăng cường chất lượng frame
                enhanced_frame = enhance_frame(frame)
                
                # Chạy detection trên cả frame gốc và frame đã xử lý
                results_orig = model(frame)
                results_enhanced = model(enhanced_frame)
                
                # Kết hợp kết quả
                boxes = []
                masks = []
                confidences = []
                
                # Thêm kết quả từ frame gốc
                for r in results_orig:
                    if hasattr(r, 'boxes') and hasattr(r, 'masks'):
                        for box, mask, conf in zip(r.boxes, r.masks, r.boxes.conf):
                            if conf > 0.3:  # Ngưỡng tin cậy thấp hơn để tăng độ nhạy
                                boxes.append(box.xyxy[0])
                                masks.append(mask.data[0])
                                confidences.append(conf)
                
                # Thêm kết quả từ frame đã xử lý
                for r in results_enhanced:
                    if hasattr(r, 'boxes') and hasattr(r, 'masks'):
                        for box, mask, conf in zip(r.boxes, r.masks, r.boxes.conf):
                            if conf > 0.3:
                                boxes.append(box.xyxy[0])
                                masks.append(mask.data[0])
                                confidences.append(conf)
                
                # Lọc kết quả trùng lặp
                valid_indices = filter_detections(boxes, masks, confidences)
                
                # Cập nhật số lượng cá
                recent_detections.append(len(valid_indices))
                avg_detections = int(sum(recent_detections) / len(recent_detections)) if recent_detections else 0
                
                # Vẽ kết quả
                result_frame = draw_results(frame, boxes, masks, confidences, valid_indices, avg_detections)
                
                # Hiển thị frame
                cv2.imshow("Fish Detection", result_frame)
                
                # Kiểm tra phím thoát
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                
                # Check save interval
                current_time = time.time()
                timestamp_dt = datetime.datetime.fromtimestamp(current_time) 

                if current_time - last_save_time >= save_interval:
                     # *** Pass boxes and confidences lists to the function ***
                     save_snapshot(result_frame, valid_indices, timestamp_dt, boxes, confidences) 
                     last_save_time = current_time

                if current_time - last_stats_time >= stats_interval:
                    update_stats(timestamp_dt, avg_detections)
                    last_stats_time = current_time

            except Exception as e:
                logging.error(f"Error processing frame: {e}")
                continue
        
        # Giải phóng tài nguyên
        cap.release()
        cv2.destroyAllWindows()
        
    except Exception as e:
        logging.error(f"Error in main: {e}")

def filter_detections(boxes, masks, confidences):
    """Lọc các detection hợp lệ"""
    try:
        valid_indices = []
        used_boxes = set()
        
        # Tính kích thước frame
        frame_area = masks[0].shape[0] * masks[0].shape[1]
        min_area = 0.001 * frame_area  # 0.1% của frame
        max_area = 0.2 * frame_area    # 20% của frame
        
        for i in range(len(boxes)):
            # Kiểm tra kích thước
            box = boxes[i]
            area = (box[2] - box[0]) * (box[3] - box[1])
            if area < min_area or area > max_area:
                continue
            
            # Kiểm tra độ tin cậy
            if confidences[i] < 0.3:
                continue
            
            # Kiểm tra trùng lặp
            box_key = tuple(map(int, box))
            if box_key in used_boxes:
                continue
            
            # Kiểm tra hình dạng
            if not check_fish_shape(masks[i]):
                continue
            
            valid_indices.append(i)
            used_boxes.add(box_key)
        
        return valid_indices
    except Exception as e:
        logging.error(f"Error filtering detections: {e}")
        return []

def draw_results(frame, boxes, masks, confidences, valid_indices, current_count):
    """Vẽ kết quả lên frame"""
    try:
        result = frame.copy()
        
        # Vẽ mask và box cho các detection hợp lệ
        for i in valid_indices:
            box = boxes[i]
            mask = masks[i]
            conf = confidences[i]
            
            # Vẽ mask
            color = np.array([0, 255, 0])  # Màu xanh lá
            mask_bool = mask > 0.5
            result[mask_bool] = result[mask_bool] * 0.6 + color * 0.4
            
            # Vẽ box
            x1, y1, x2, y2 = map(int, box)
            cv2.rectangle(result, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Vẽ nhãn
            label = f"Fish {conf:.2f}"
            cv2.putText(result, label, (x1, y1 - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Vẽ số lượng cá
        cv2.putText(result, f"Count: {current_count}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        return result
    except Exception as e:
        logging.error(f"Error drawing results: {e}")
        return frame

if __name__ == "__main__":
    main()
