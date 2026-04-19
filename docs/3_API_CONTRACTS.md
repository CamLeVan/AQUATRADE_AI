# 2. HỢP ĐỒNG GIAO TIẾP API (API CONTRACTS)

Tài liệu quy định chi tiết cách 3 tầng (Frontend, Backend, AI Server) nói chuyện với nhau.

## 2.1. Giao tiếp giữa Frontend và Java Core Backend (REST API)
*Base URL:* `http://localhost:8080/api/v1`
*Headers Bắt Buộc cho API có xác thực:* `Authorization: Bearer <JWT_TOKEN>`

### 2.1.1. User Service
- **`POST /users/login`**: Đăng nhập hệ thống.
  - **Request Body:** `{ "username": "buyer1", "password": "123" }`
  - **Response (200 OK):** `{ "status": "success", "data": { "token": "ey...", "role": "BUYER" } }`

### 2.1.2. Listing Service (Sản phẩm)
- **`GET /listings`**: Lấy danh sách cá giống hiển thị Homepage.
  - **Query Params:** `?province=DaNang&species=CaTra` (Tối ưu trải nghiệm lọc vị trí).
  - **Response (200 OK):** Trả về mảng các lô cá giống kèm `size_min`, `size_max`.

### 2.1.3. Wallet Service (Ví tiền)
- **`GET /users/me/wallet`**: Kiểm tra số dư khả dụng (Frontend cần báo cho Buyer biết có đủ cọc hay không).
  - **Response (200 OK):** `{ "wallet_balance": 5000000 }`

### 2.1.4. Order & Escrow Service (Luồng giao dịch thần kinh tọa)
- **`POST /orders`**: Khởi tạo phòng giao dịch (Tạo Order) -> Hệ thống tự động tính tiền và khóa Escrow.
  - **Request Body:** `{ "listing_id": "uuid..." }` *(Bảo mật: Tuyệt đối FE không gửi số tiền `amount`. Java phải tự chui vào DB lấy `price` * `estimated_quantity` để tránh Hacker dùng Postman sửa giá)*.
  - **Response (201 Created):** `{ "status": "success", "data": { "order_id": "uuid...", "locked_amount": 1000000, "status": "ESCROW_LOCKED" } }`

- **`WS /ws/orders/{order_id}/count-ai`**: (WebSocket) Frontend băm luồng Video Call thành 3 khung hình/giây và truyền liên tục cho Server duyệt AI (Dynamic Streaming) cho đến khi bắt được ngưỡng đỉnh chốt số lượng.
  - **Payload gửi đi (từ FE):** Từng frame ảnh tĩnh được encode chuỗi `Base64`.
  - **Payload nhận về liên tục (từ BE):** `{"status": "PROCESSING", "current_count": 89}`
  - **Payload nhận về cuối cùng (Khi thuật toán YOLO + 95th Percentile tìm thấy Đỉnh ổn định):** `{"status": "DONE", "max_count": 105, "digital_proof_id": "uuid...", "best_frame_url": "https..."}` (Sau đó Java tự động ngắt kết nối WebSocket).

- **`PUT /orders/{order_id}/finalize`**: Người mua chốt nhận kết quả từ Phòng đếm AI để xác nhận xong giao dịch.
  - **Request Body:** `{ "agreed_quantity": 105, "digital_proof_id": "uuid..." }`
  - **Response (200 OK):** Cập nhật trạng thái `COMPLETED`. **Logic Backend:** Đối soát số lượng thực tế với số lượng đã khóa cọc. Nếu đếm Hụt (vắng 5 con) -> Backend nhảy lệnh `REFUND` tiền thừa cho Buyer. Phần còn lại lệnh `ESCROW_RELEASE` nhả vào ví Seller.

- **`POST /orders/{order_id}/disputes`**: Bắn tín hiệu khiếu nại (Report).
  - **Request Body:** `{ "reason": "Cá chết nhiều, sai kích cỡ cam kết" }`
  - **Response (200 OK):** Chuyển Order sang `DISPUTED`, sinh ra Dispute DB, tự động kích hoạt Webhook đẩy về hệ thống n8n.

## 2.2. Giao tiếp giữa Java Core Backend và AI Service (Server-to-Server)
AI Service hoạt động bí mật phía sau, Frontend không bao giờ được gọi trực tiếp AI Service để bảo mật model. Java Backend sẽ gửi hình ảnh cho Python FastAPI xử lý.

*AI Service Internal URL:* `http://localhost:8000/api/v1/predict`

### 2.2.1. Đếm cá mảng động bảo vệ Ngưỡng đỉnh (Dynamic AI Streaming)
- **`WS /ws/api/v1/predict`**
  - **Mô tả:** Java Backend mở một luồng WebSocket Server-to-Server tới Python FastAPI để relay (chuyển tiếp) các khung hình Base64 mà Frontend đang bơm lên.
  - **Payload Python trả về Java khi chưa đạt đỉnh:** `{"plateau_reached": false, "current_count": 89}`
  - **Payload Python trả về Java CÚP CẦU DAO (Khi tìm thấy Ngưỡng Đỉnh 95th Percentile):**
    ```json
    {
       "confidence_score": 0.98,
       "fish_count_max": 105,
       "best_image_base64": "iVBO...",
       "duration_ms": 4200,
       "plateau_reached": true
    }
    ```
  - **Xử lý bên Backend sau khi nhận:** 
    1. Java nhận biến `image_base64` (ảnh đã được AI vẽ khung).
    2. Java nén và lưu ảnh lên **Cloud Object Storage (Amazon S3 / MinIO hoặc Cloudinary)** để đảm bảo hệ thống duy trì tính Stateless (Phi trạng thái). Lấy đường dẫn URL tuyệt đối.
    3. Java tạo một bản ghi `DigitalProof` (bằng chứng số) trong DB chứa số đếm, URL ảnh tuyệt đối và sinh mã Hash (chữ ký số) cực kỳ bảo mật. Trả cái này về cho Frontend hiển thị.

## 2.3. Giao tiếp Thời gian thực (WebRTC & WebSocket)
- **WebRTC Signalling (Trung gian P2P):** 
  Sử dụng WebSocket trên Spring Boot đễ chuyển thông điệp (SDP) "Offer", "Answer", và "Ice Candidates" giữa Người mua và Người Bán. Sau khi kết nối P2P thành công, Video Streaming chảy **trực tiếp** giữa 2 trình duyệt không thông qua Backend.
- **WebSocket (Realtime Noti):** 
  Sau khi AI xử lý xong, Spring Boot sẽ truyền thông điệp Socket: `{"type": "AI_RESULT_READY", "order_id": "...", "count": 105}` để cả người mua và bán đều thấy kết quả nháy lên màn hình cùng một phần nghìn giây.
