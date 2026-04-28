# Đặc tả Use-Case, Frontend Mapping & Dữ liệu thực tế (AquaTrade AI)

Tài liệu này mô tả chi tiết toàn bộ các Use-Case trong hệ thống AquaTrade AI, liên kết trực tiếp với các giao diện Frontend (React) và cấu trúc dữ liệu thực tế (JSON) được trao đổi qua API.

---

## 1. Nhóm Use-Case: Xác thực & Quản lý Tài khoản (Auth)

### UC1.1: Đăng ký tài khoản (Register)
*   **Mô tả:** Người dùng (Người mua/Người bán/Nhà đầu tư) tạo tài khoản mới trên nền tảng.
*   **Frontend Component:** `src/features/auth/Registration.jsx`
*   **Trạng thái UI:** Form nhập liệu gồm Tên, Tên công ty, Email, Mật khẩu, Chọn vai trò (Role). Thanh tiến trình (Progress bar) khi điền form.
*   **API Endpoint:** `POST /api/v1/auth/register`
*   **Dữ liệu thật (Request JSON):**
    ```json
    {
      "fullName": "Lý Thanh Long",
      "companyName": "Aqua Logistics",
      "email": "longly@aquatrade.ai",
      "password": "Password123!@#",
      "role": "BUYER"
    }
    ```
*   **Dữ liệu thật (Response JSON):**
    ```json
    {
      "status": "success",
      "message": "Đăng ký thành công",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "c9a6f3b0-4e5a-4b7c-9d8e-1f2a3b4c5d6e",
        "role": "BUYER",
        "userId": "123e4567-e89b-12d3-a456-426614174000"
      }
    }
    ```

### UC1.2: Đăng nhập hệ thống (Login)
*   **Mô tả:** Người dùng đăng nhập để lấy phiên làm việc (Access Token).
*   **Frontend Component:** `src/features/auth/Login.jsx`
*   **Trạng thái UI:** Form nhập Email, Password. Thông báo lỗi nếu sai thông tin. Chuyển hướng về Dashboard nếu thành công.
*   **API Endpoint:** `POST /api/v1/auth/login`
*   **Dữ liệu thật (Request JSON):**
    ```json
    {
      "email": "longly@aquatrade.ai",
      "password": "Password123!@#",
      "rememberMe": true
    }
    ```

---

## 2. Nhóm Use-Case: Quản lý Ví & Thanh toán (Wallet)

### UC2.1: Xem thông tin ví và Lịch sử giao dịch
*   **Mô tả:** Người dùng xem số dư khả dụng và các giao dịch gần đây.
*   **Frontend Component:** `src/features/wallet/Wallet.jsx`
*   **Trạng thái UI:** Hiển thị số dư lớn (`walletBalance`), Card gợi ý nạp tiền AI, Bảng danh sách `recentTransactions` (Mã giao dịch, Thời gian, Phương thức, Trạng thái).
*   **API Endpoint:** `GET /api/v1/users/me/wallet`
*   **Dữ liệu thật (Response JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "walletBalance": 45250000.00,
        "userLevel": "DIAMOND",
        "recentTransactions": [
          {
            "id": "AQ_TR_22901",
            "orderId": null,
            "amount": 5000000.00,
            "postBalance": 45250000.00,
            "type": "TOP_UP",
            "paymentMethod": "BANK_TRANSFER",
            "status": "SUCCESS",
            "createdAt": "2024-05-20T14:20:00"
          }
        ]
      }
    }
    ```

### UC2.2: Nạp tiền vào ví hệ thống (Deposit)
*   **Mô tả:** Người dùng chọn số tiền và phương thức nạp (Ngân hàng, QR, Ví điện tử).
*   **Frontend Component:** `src/features/wallet/Wallet.jsx` (Phần Amount Selection & Payment Methods).
*   **Trạng thái UI:** Chọn mức giá (500k, 1tr, 5tr), hiển thị QR Code để chuyển khoản ngân hàng với nội dung tự động.
*   **API Endpoint:** `POST /api/v1/users/me/wallet/deposit`
*   **Dữ liệu thật (Request JSON):**
    ```json
    {
      "amount": 5000000,
      "paymentMethod": "BANK_TRANSFER"
    }
    ```

---

## 3. Nhóm Use-Case: Sàn Giao Dịch & Đăng Tin (Marketplace)

### UC3.1: Đăng tin bán thủy sản (Seller)
*   **Mô tả:** Người bán (SELLER) tạo một tin đăng bán sản phẩm (cá, tôm...).
*   **Frontend Component:** `src/features/marketplace/` (Module tạo mới tin đăng)
*   **Trạng thái UI:** Form nhập Tên, Loại (Cá/Tôm), Tỉnh thành, Kích thước (min/max), Giá mỗi con, Số lượng dự kiến.
*   **API Endpoint:** `POST /api/v1/listings`
*   **Dữ liệu thật (Request JSON):**
    ```json
    {
      "title": "Cá Tra giống chất lượng cao - An Giang",
      "category": "CA",
      "species": "Cá Tra",
      "province": "An Giang",
      "sizeMin": 5.0,
      "sizeMax": 8.0,
      "pricePerFish": 1500,
      "estimatedQuantity": 10000
    }
    ```
*   **Kết quả:** Tin được tạo với trạng thái `PENDING_REVIEW`.

### UC3.2: Admin Kiểm duyệt tin đăng (Moderation)
*   **Mô tả:** Quản trị viên (ADMIN) duyệt để tin hiển thị công khai hoặc từ chối tin.
*   **Frontend Component:** Dashboard Admin -> Quản lý Tin đăng.
*   **API Endpoint:** `PUT /api/v1/admin/listings/{id}/moderate`
*   **Dữ liệu thật (Request JSON - Duyệt):**
    ```json
    {
      "moderationStatus": "AVAILABLE",
      "moderationNote": ""
    }
    ```

### UC3.3: Tìm kiếm & Lọc sản phẩm (Buyer)
*   **Mô tả:** Xem danh sách các tin đăng `AVAILABLE` với bộ lọc (Khu vực, Loài).
*   **API Endpoint:** `GET /api/v1/listings?province=An Giang&species=Cá Tra`
*   **Dữ liệu thật (Response List JSON):**
    ```json
    [
      {
        "id": "list-uuid-1234",
        "title": "Cá Tra giống chất lượng cao - An Giang",
        "pricePerFish": 1500,
        "availableQuantity": 10000,
        "status": "AVAILABLE",
        "sellerName": "Trại giống A"
      }
    ]
    ```

---

## 4. Nhóm Use-Case: Đặt Hàng, Escrow & Xác thực AI (Orders)

### UC4.1: Đặt hàng & Khóa tiền tạm giữ (Escrow)
*   **Mô tả:** Người mua đặt hàng. Số tiền (`quantity` * `pricePerFish`) bị trừ khỏi ví và chuyển vào trạng thái tạm giữ (LOCKED).
*   **Frontend Component:** `src/features/orders/Checkout.jsx` (Hoặc Modal đặt hàng)
*   **Trạng thái UI:** Xác nhận địa chỉ nhận hàng, tính tổng tiền. Nếu số dư ví không đủ -> Chặn đặt hàng.
*   **API Endpoint:** `POST /api/v1/orders`
*   **Dữ liệu thật (Request JSON):**
    ```json
    {
      "listingId": "list-uuid-1234",
      "shippingAddress": "123 Đường Sông, TP Long Xuyên",
      "quantity": 2000
    }
    ```
*   **Dữ liệu thật (Response JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "order-uuid-5678",
        "totalPrice": 3000000,
        "status": "PENDING_SHIPMENT",
        "buyerName": "Lý Thanh Long"
      }
    }
    ```

### UC4.2: Dịch vụ AI (AI Vision - Đếm cá & Khối lượng)
*   **Mô tả:** Khi nhận hàng, người dùng chụp ảnh/video và gửi lên hệ thống AI để đếm số lượng thực tế (Digital Proof).
*   **Frontend Component:** `src/features/Ai/` (Giao diện camera/upload hình ảnh).
*   **API Endpoint (AI Python Server):** `POST http://localhost:8000/predict/snapshot`
*   **Dữ liệu thật (Response từ AI Python Server):**
    ```json
    {
      "status": "success",
      "filename": "camera_capture.jpg",
      "data": {
        "count": 1980,
        "total_biomass": 15.5,
        "details": [
          { "box": [10, 20, 50, 60], "confidence": 0.98, "estimated_weight": 0.007 },
          // ... 1979 object khác
        ]
      }
    }
    ```

### UC4.3: Xác nhận hoàn thành đơn hàng (Complete Order)
*   **Mô tả:** Người mua đồng ý nhận hàng. Hệ thống giải ngân 95% cho Seller, 5% cho Admin (Treasury).
*   **Frontend Component:** Trạng thái đơn hàng -> Nút "Đã nhận hàng & Thanh toán".
*   **API Endpoint:** `POST /api/v1/orders/{orderId}/complete`

---

## 5. Nhóm Use-Case: Quản Trị Hệ Thống (Admin Portal)

### UC5.1: Quản lý Người dùng (User Management)
*   **Frontend Component:** Admin Sidebar -> User Management
*   **API (List):** `GET /api/v1/admin/users`
*   **API (Khóa/Mở tài khoản):** `PUT /api/v1/admin/users/{userId}/status`
    ```json
    { "newStatus": "INACTIVE" }
    ```

### UC5.2: Báo cáo Doanh thu (Treasury/Stats)
*   **Mô tả:** Admin xem tổng phí sàn đã thu được từ các đơn hàng thành công.
*   **Frontend Component:** Admin Dashboard (Chart & Cards).
*   **API Endpoint:** `GET /api/v1/admin/treasury`
*   **Dữ liệu thật:**
    ```json
    {
      "status": "success",
      "data": {
        "totalRevenue": 150000.00 
      }
    }
    ```

### UC5.3: Xử lý Khiếu nại (Dispute Resolution)
*   **Mô tả:** Nếu AI đếm thiếu số lượng đáng kể, Buyer mở tranh chấp. Admin sẽ xem bằng chứng và quyết định.
*   **API (Danh sách khiếu nại):** `GET /api/v1/admin/disputes/open`
*   **API (Hoàn tiền cho Buyer):** `POST /api/v1/admin/disputes/{disputeId}/refund`
*   **API (Ép hoàn thành, trả tiền Seller):** `POST /api/v1/admin/disputes/{disputeId}/force-complete`

---
*Tài liệu được thiết kế nhằm đồng bộ toàn diện giữa Frontend (UI/UX) và Backend (API Contracts & Business Logic) cho dự án AquaTrade AI.*
