import sys
import os
import logging

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO, # Chuyển từ DEBUG sang INFO để bớt rác
    format='%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.FileHandler('fish_counter_debug.log', mode='w'),
        logging.StreamHandler()
    ]
)

# Tắt log của matplotlib
logging.getLogger('matplotlib').setLevel(logging.WARNING)

def main():
    try:
        from PyQt5.QtWidgets import QApplication
        # Import từ cấu trúc mới
        from src.ui.gui import MainWindow
        from src.core.fish_counter import FishCounter
    except ImportError as e:
        logging.error(f"Error importing modules: {e}")
        print(f"Error importing modules: {e}")
        print("Please make sure you are running from the root directory (python run.py).")
        sys.exit(1)

    try:
        # Tạo thư mục dữ liệu nếu chưa tồn tại
        os.makedirs('data/outputs', exist_ok=True)
        
        # Kiểm tra model
        model_path = os.path.join("models", "best.pt")
        if not os.path.exists(model_path):
            # Fallback tìm trong thư mục gốc hoặc models
            if os.path.exists("best.pt"):
                 model_path = "best.pt"
            else:
                logging.warning(f"Model file not found at {model_path}. Checking other locations...")
        
        # Kiểm tra video (để test)
        video_path = "1.mp4"
        if not os.path.exists(video_path):
            logging.warning(f"Video file '{video_path}' not found!")
        
        app = QApplication(sys.argv)
        
        # Khởi tạo bộ đếm cá với đường dẫn model
        fish_counter = FishCounter(model_path=model_path)  
        fish_counter.set_counting_method("statistical")
        
        # Khởi tạo cửa sổ chính
        window = MainWindow(fish_counter)
        window.show()
        
        # Khởi chạy ứng dụng
        sys.exit(app.exec_())
    except Exception as e:
        logging.error(f"Error in main: {e}")
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()