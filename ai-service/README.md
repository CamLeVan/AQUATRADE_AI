# 🐟 Smart Fingerling Tracker - Hệ thống Đếm & Giám sát Cá giống Thông minh

**Đội thi:** Đom Đóm (AI FOR REAL)  
**Cuộc thi:** Danang AI4Life 2025  
**Phiên bản:** 1.0.0 (Stable)

---

## 📖 Giới thiệu
**Smart Fingerling Tracker** là giải pháp ứng dụng Trí tuệ nhân tạo (AI) và Thị giác máy tính (Computer Vision) để giải quyết bài toán đếm và giám sát cá giống trong nuôi trồng thủy sản.

### 🚀 Tính năng nổi bật:
1.  **Đếm thông minh (Smart Counting):** Sử dụng thuật toán **95th Percentile** để loại bỏ sai số do cá bơi chồng lên nhau (Occlusion). Tự động dừng (**Smart Stop**) khi kết quả ổn định.
2.  **Chỉ số Hoạt động (FAI):** Phân tích hành vi bơi để đánh giá sức khỏe và mức độ đói của đàn cá (Lờ đờ / Sung sức / Hoảng loạn).
3.  **Phát hiện Cá chết (Anomaly Detection):** Tự động khoanh vùng cảnh báo nếu phát hiện cá đứng yên quá 60 giây.
4.  **Dự báo Tăng trưởng (Growth Prediction):** Sử dụng Hồi quy tuyến tính để dự báo ngày cá đạt trọng lượng xuất bán.
5.  **Ước lượng Sinh khối (Biomass):** Tính toán tổng trọng lượng cá trong bể thông qua diện tích hình ảnh.

---

## 🛠️ Yêu cầu hệ thống
*   **OS:** Windows 10/11, Linux (Ubuntu 20.04+), hoặc macOS.
*   **Python:** 3.8 trở lên.
*   **Phần cứng khuyến nghị:**
    *   CPU: Intel Core i5 trở lên.
    *   GPU: NVIDIA GTX/RTX (để chạy YOLOv8 mượt mà > 30 FPS). Nếu dùng CPU tốc độ sẽ chậm hơn.
    *   RAM: 8GB+.

---

## ⚙️ Cài đặt

1.  **Clone hoặc Tải về source code:**
    ```bash
    git clone https://github.com/CamLeVan/SmartFingerlingTracker.git
    cd SmartFingerlingTracker/fish
    ```

2.  **Cài đặt thư viện phụ thuộc:**
    Mở terminal tại thư mục dự án và chạy:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Chuẩn bị Model:**
    Đảm bảo file trọng số `best.pt` đã nằm trong thư mục `models/`.
    *(Nếu chưa có, vui lòng liên hệ đội thi để nhận file weights đã train)*.

---

## ▶️ Hướng dẫn sử dụng

1.  **Chạy chương trình:**
    ```bash
    python run.py
    ```

2.  **Trên giao diện Dashboard:**
    *   **Bước 1:** Nhấn nút **"Chọn Video"** để tải video quay bể cá (hoặc dùng Webcam).
    *   **Bước 2:** Nhấn **"Bắt đầu"**. Hệ thống sẽ tự động đếm và phân tích.
    *   **Bước 3:** Quan sát các chỉ số:
        *   *Thanh FAI:* Màu sắc thể hiện sức khỏe cá.
        *   *Số lượng:* Cập nhật theo thời gian thực (Logic 95th Percentile).
    *   **Bước 4:** Nhấn **"Dự báo Tăng trưởng"** để xem biểu đồ xu hướng lớn của cá.
    *   **Bước 5:** Khi hoàn tất, nhấn **"Dừng"** hoặc đợi Smart Stop kích hoạt. Kết quả sẽ được lưu tự động.

---

## 📂 Cấu trúc thư mục
```
fish/
├── data/               # Chứa video test và file kết quả (json)
├── docs/               # Tài liệu báo cáo, slide thuyết trình
├── models/             # Chứa file model YOLOv8 (best.pt)
├── src/
│   ├── core/           # Xử lý chính (YOLO, Tracking, FAI, Growth)
│   ├── ui/             # Giao diện người dùng (PyQt5)
│   └── utils/          # Các hàm hỗ trợ
├── run.py              # File khởi chạy chương trình
├── requirements.txt    # Danh sách thư viện
└── README.md           # Hướng dẫn sử dụng
```

---

## 👨‍💻 Liên hệ
Mọi thắc mắc xin liên hệ đội thi **Đom Đóm**:
*   Email: lvcama2k25@gmail.com
*   Phone: 0344574050

---
*Developed with ❤️ for Vietnam Aquaculture.*
