import sys
import os

# Thêm thư mục hiện tại vào sys.path để Python tìm thấy package 'src'
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from src.main import main

if __name__ == "__main__":
    main()
