# SỔ TAY HƯỚNG DẪN TRIỂN KHAI GIT VÀ LÀM VIỆC NHÓM - AQUATRADE AI

Chào mừng team đến với dự án **AquaTrade AI**! Dự án này áp dụng kiến trúc **Microservices (Monorepo)**, nghĩa là chúng ta có 3 hệ thống (Python, Java, React) nằm chung trong 1 kho chứa (Repository) nhưng hoạt động hoàn toàn độc lập.

Tài liệu này hướng dẫn chi tiết cách Leader thiết lập dự án và cách 3 thành viên phối hợp làm việc qua Git mà **không bao giờ bị lỗi đụng độ (Conflict)**.

---

## PHẦN 1: DÀNH CHO LEADER - THIẾT LẬP DỰ ÁN BAN ĐẦU

Leader có nhiệm vụ gom mã nguồn cũ và khởi tạo Git Repository gốc. Làm đúng bước này thì team mới code mượt được.

### Bước 1.1: Cấu trúc lại thư mục
Hiện tại máy bạn đang có 2 thư mục rời rạc. Hãy tạo thư mục ngoài cùng tên là `AquatradeAI` và tổ chức lại bên trong CHÍNH XÁC như sau:

```text
AquatradeAI/ (Thư mục gốc)
├── .gitignore               <-- (Đã được tạo sẵn, KHÔNG XÓA)
├── TEAM_GUIDE_GIT.md        <-- (Chính là file này)
│
├── ai-service/              <-- (Đổi tên từ: SmartFingerlingTracker/fish)
│   ├── api_server.py
│   ├── src/
│   └── requirements.txt
│
├── core-backend/            <-- (Copy thư mục: multi-source-downloader/origin-server vào đây)
│   ├── pom.xml
│   └── src/
│
└── web-frontend/            <-- (Tạo thư mục trống, để bạn Frontend khởi tạo code React vào sau)
```

### Bước 1.2: Đẩy lên Github (Chỉ Leader làm 1 lần duy nhất)
Mở Terminal / Git Bash tại thư mục gốc `AquatradeAI/`:

```bash
git init
git add .
git commit -m "Initial commit: Setup Monorepo structure for AquaTrade AI"
git branch -M main
# Thay URL_CUA_BAN bằng link repository trên Github của bạn
git remote add origin https://github.com/vku-team/aquatrade-ai.git
git push -u origin main

# Tạo luôn nhánh develop cho team làm việc
git checkout -b develop
git push origin develop
```
*Ghi chú: Lên Github > Settings > Branches > Bật bảo vệ nhánh `main` (Require pull request reviews) để không ai push bậy lên.*

---

## PHẦN 2: DÀNH CHO CẢ TEAM - QUY TRÌNH CODE HẰNG NGÀY (GIT FLOW)

**QUY TẮC SỐ 1: KHÔNG BAO GIỜ PUSH TRỰC TIẾP LÊN NHÁNH `main` hay `develop`.**

### Quy trình 4 bước mỗi khi code:

**Bước 1: Cập nhật code mới nhất về máy**
```bash
git checkout develop
git pull origin develop
```

**Bước 2: Tạo nhánh riêng của mình để code tính năng**
Tên nhánh nên bắt đầu bằng role của bạn (ai, backend, frontend) hoặc loại công việc (feat, fix).
```bash
# Ví dụ Backend Dev làm tính năng Login:
git checkout -b backend/feature-login

# Ví dụ AI Dev tối ưu model:
git checkout -b ai/optimize-yolo
```

**Bước 3: Code và Lưu lại (Commit)**
*Lưu ý: Bạn làm role nào thì chỉ sửa code trong thư mục của Role đó. Tuyệt đối không sửa file thư mục khác.*
```bash
git add .
git commit -m "backend: Thêm API đăng nhập JWT" 
```

**Bước 4: Đẩy lên Git và Yêu cầu ghép code (Pull Request)**
```bash
git push origin backend/feature-login
```
-> Lên web Github, bấm nút **Compare & pull request**. Chọn ghép từ nhánh `backend/feature-login` vào nhánh `develop`.
-> Nhờ 1 bạn trong team vào File Changed xem báo cáo, nếu OK thì bấm **Merge**.

---

## PHẦN 3: NHIỆM VỤ CHI TIẾT CHO TỪNG THÀNH VIÊN

### 🤖 Vị trí 1: AI Engineer (Tập trung thư mục `ai-service/`)
* **Nhiệm vụ:** Hoàn thiện `api_server.py`. Khi backend gửi 1 cái ảnh lên, AI phải trả về file JSON gồm độ tin cậy, số lượng điểm ảnh, toạ độ, số lượng cá.
* **Lưu ý Git:** File model YOLO (`best.pt`) nặng ~20-50MB. Theo luật của `gitignore`, file này BỊ CẤM đẩy lên Git (Github giới hạn file >100MB sẽ bị khóa repo).
* **Cách làm:** Tải `best.pt` lên Google Drive. Giao link Drive cho Backend/Frontend để mọi người tự tải về bỏ vào thư mục `ai-service/models/` trên máy cá nhân.

### ☕ Vị trí 2: Backend Developer (Tập trung thư mục `core-backend/`)
* **Nhiệm vụ:** 
  1. Dọn dẹp code rác của dự án *Multi-source downloader* cũ. 
  2. Setup kết nối PostgreSQL trong `application.properties`.
  3. Xây dựng API (Login, Đăng sản phẩm, Đặt hàng, Lưu bằng chứng Digital Proof).
  4. Viết Service bằng Java (dùng `RestTemplate` hoặc `WebClient`) để bắn ảnh sang cổng `:8000` của phần AI khi có người dùng upload lên.
* **Lệnh khởi chạy khi test:** `mvn spring-boot:run` (Code chạy ở cổng 8080).

### ⚛️ Vị trí 3: Frontend Developer (Tập trung thư mục `web-frontend/`)
* **Nhiệm vụ:**
  1. Vào thư mục `web-frontend`, gõ lệnh khởi tạo UI: `npm create vite@latest . -- --template react` (hoặc nextjs).
  2. Dựng giao diện TailwindCSS bóng bẩy cho dự án.
  3. Giao diện phải có: Nút chụp màn hình (WebRTC) -> Bắn file ảnh đó về API của Java (Cổng 8080).
* **Quy tắc phối hợp:** Hãy xin Postman Collection từ bạn Backend để biết danh sách API mà gọi cho đúng. Chưa có API thì bạn cứ dùng Data giả (Mockup) để thiết kế giao diện trước.
* **Lệnh khởi chạy khi test:** `npm run dev` (Code chạy ở cổng 5173 hoặc 3000).

---

## PHẦN 4: CÁCH XỬ LÝ KHI BỊ "MERGE CONFLICT" (ĐỤNG ĐỘ CODE)

Vì mô hình chúng ta chia thư mục làm 3 (`ai-service`, `core-backend`, `web-frontend`), tỷ lệ Conflict gần như bằng 0 (vì AI không bao giờ đụng vào code Java). 

**Trường hợp hy hữu có Conflict (Ví dụ cả 2 bạn cùng sửa file `.gitignore`):**
1. Git sẽ báo `CONFLICT (content): Merge conflict in .gitignore`.
2. Mở file bị lỗi trên VS Code. Bạn sẽ thấy các dòng `<<<<<<< HEAD` và `======`.
3. Nhấm "**Accept Both Changes**" (Giữ lại cả code của mình và của bạn kia) hoặc xóa dòng sai đi.
4. Chạy lại: 
   ```bash
   git add .
   git commit -m "fix: Resolve merge conflict"
   git push origin ten-nhanh-cua-ban
   ```

**CHÚC TEAM LÀM DỰ ÁN CUỐI KỲ THÀNH CÔNG RỰC RỠ! MÔ HÌNH NÀY RẤT THỰC TẾ, CÁC BẠN NHỚ VẬN DỤNG TỐT!**
