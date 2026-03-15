# DANH SÁCH CÔNG VIỆC CỤ THỂ (SPRINT 1) - BẮT ĐẦU CODE NGAY!

Tài liệu này giải quyết vấn đề "Không biết phải code cái gì đầu tiên". Dưới đây là những thao tác XƯƠNG MÁU, CỤ THỂ ĐẾN TỪNG DÒNG LỆNH mà mỗi người phải làm ngay trong ngày hôm nay.

---

## 🤖 1. NHIỆM VỤ CỦA BẠN LÀM AI (CẢM - Thư mục `ai-service`)

**Hiện trạng:** API đã chạy được (nhận ảnh, đếm ra số JSON).
**Mục tiêu Sprint 1:** Trả về được tấm ảnh đã "vẽ khung đỏ" (Bounding Box) để Frontend hiển thị cho khách xem.

**Cụ thể cần code:**
1. Mở file `api_server.py`.
2. Sửa lại hàm `process_single_image(image_bytes)`: Thay vì chỉ đếm số lượng, hãy dùng OpenCV (`cv2.rectangle`) để vẽ các khung vuông tọa độ lên con cá trên bức ảnh đó.
3. Chuyển đổi bức ảnh đã vẽ khung đó thành chuỗi **Base64** và nhét vào file JSON trả về.
   - *Gợi ý code Python:* 
     ```python
     _, buffer = cv2.imencode('.jpg', image_with_boxes)
     img_base64 = base64.b64encode(buffer).decode('utf-8')
     ```
4. **Đầu ra mong đợi:** Khi dùng Postman bắn ảnh vào `http://localhost:8000/predict/snapshot`, kết quả JSON trả về phải có trường `"image_base64": "iVBORw0KGgoAAA..."`.

---

## ☕ 2. NHIỆM VỤ CỦA BẠN LÀM BACKEND (Khôi/Đức - Thư mục `core-backend`)

**Hiện trạng:** Là một khung Spring Boot trống rỗng, đã cài sẵn thư viện PostgreSQL.
**Mục tiêu Sprint 1:** Kết nối thành công Database và tạo được bảng Users.

**Cụ thể cần code:**
1. Cài đặt phần mềm **PostgreSQL** và **pgAdmin4** trên máy tính. Tạo một database tên là `aquatrade_db`.
2. Mở IntelliJ, vào file `src/main/resources/application.properties`, gõ cấu hình kết nối DB:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/aquatrade_db
   spring.datasource.username=postgres
   spring.datasource.password=mat_khau_cua_ban
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Tạo thư mục `entity` (nằm trong `com.aquatrade.corebackend`). Tạo file `User.java`:
   - Dùng `@Entity`, `@Table(name="users")`.
   - Các cột: `id`, `username`, `password`, `role` (BUYER, SELLER, ADMIN).
4. Tạo thư mục `controller`. Tạo file `TestController.java`:
   - Mở 1 API `@GetMapping("/api/v1/ping")` trả về chữ "Backend is running!".
5. **Đầu ra mong đợi:** Bấm nút **Run** dự án. Mở trình duyệt gõ `http://localhost:8080/api/v1/ping` thấy hiện chữ là thành công 100%!

---

## ⚛️ 3. NHIỆM VỤ CỦA BẠN LÀM FRONTEND (Khôi/Đức - Thư mục `web-frontend`)

**Hiện trạng:** Thư mục đang trống không.
**Mục tiêu Sprint 1:** Dựng lên được cái giao diện "Phòng Giao Dịch" (Chưa cần chức năng Video Call vội, dựng cái xác nhà trước).

**Cụ thể cần code:**
1. Mở Terminal tại thư mục `web-frontend`, gõ lệnh khởi tạo React:
   ```bash
   npm create vite@latest . -- --template react
   npm install
   npm run dev
   ```
2. Cài đặt **TailwindCSS** theo hướng dẫn trên web của Tailwind cho Vite React.
3. Làm 2 màn hình (Tạo thư mục `src/pages`):
   - **Màn hình Đăng Nhập:** Có 2 ô nhập ID, Password và nút "Vào hệ thống".
   - **Màn hình Phòng Giao Dịch AI:** Chia đôi màn hình. Một bên là khung đen (để sau này nhúng Camera). Một bên có một cái nút khổng lồ màu xanh lá cây: **[CHỤP ẢNH & ĐẾM CÁ AI]**.
4. **Đầu ra mong đợi:** Giao diện chạy mượt mà, responsive, nhìn hiện đại và bóng bẩy.

---

**Đó! Các bạn cứ nhắm mắt làm đúng nhíp độ 3 việc nhỏ xíu này trong 3 ngày tới. Khi cả 3 người cùng xong, ráp lại là thấy hình hài đồ án ngay!**
