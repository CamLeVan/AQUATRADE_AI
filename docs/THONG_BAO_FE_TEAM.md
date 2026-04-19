# 📋 Thông báo thay đổi từ Backend — Gửi bạn Frontend

> **Ngày:** 2026-04-03 | **Backend dev:** Lê Văn Cảm

Sau khi review kỹ các DTO bạn gửi, team Backend đã thống nhất và implement xong.
Bên dưới là những thay đổi **bạn cần cập nhật ở Frontend** để đồng nhất.

---

## 🔴 THAY ĐỔI QUAN TRỌNG NHẤT

### AquaTrade KHÔNG giao dịch theo "kg"

Hệ thống giao dịch **cá giống đếm từng CON** bằng AI YOLOv8.

| FE đang dùng | Phải đổi thành | Lý do |
|---|---|---|
| `pricePerUnit` | `pricePerFish` | Giá tính theo từng con cá |
| `unit: "kg"` | bỏ field này | Đơn vị duy nhất là CON |
| `weight` trong TransactionDTO | `finalQuantity` | Kết quả AI là số con đếm được |

Ví dụ đúng: Lô 500 con Tôm Thẻ x 1.200 VND/con = 600.000 VND

---

## 🟠 NAMING ĐỒNG NHẤT

| FE muốn dùng | Field name BE trả về | Bạn làm gì ở FE |
|---|---|---|
| `name` | `title` | Dùng response.title, label UI vẫn là "Tên sản phẩm" |
| `origin` | `province` | Dùng response.province, label UI vẫn là "Xuất xứ" |
| `imageUrl` (1 anh) | `thumbnailUrl` | BE tu trich 1 anh bia, tra ve san |
| `joinDate` | `createdAt` | Dùng response.createdAt, label UI là "Ngày tham gia" |
| `totalAmount` | `totalPrice` | Đổi tên field khi map |
| `transactionId` "#AQ-123" | `id` (UUID string) | UUID là chuẩn |

---

## 🟡 ENUM ĐỒNG NHẤT

### Role
- Hợp lệ: BUYER / SELLER / ADMIN
- BỎ: TECHNICIAN (không trong scope)
- BỎ: INVESTOR (không trong scope)
- NOTE: Trang Register chỉ cho chọn BUYER hoặc SELLER. ADMIN không tự đăng ký được.

### UserStatus (thay thế isActive: Boolean)
- Hợp lệ: ACTIVE / INACTIVE / PENDING
- BỎ: OFFLINE (trạng thái Socket realtime, FE tự quản lý, không lưu DB)

### ListingCategory (MỚI)
- CA / TOM / CUA / KHAC

### PaymentMethod (MỚI — dùng cho Wallet)
- Hợp lệ: VNPAY / MOMO / BANK_TRANSFER
- BỎ: QR_PAY (cover trong MOMO/VNPAY)
- BỎ: E_WALLET (quá chung chung)

### OrderStatus — 7 trạng thái
```
PENDING -> ESCROW_LOCKED -> IN_VIDEO_CALL -> COUNTING_AI -> COMPLETED
                                                          -> DISPUTED
                                          -> CANCELLED
```
Gợi ý mapping hiển thị:
- COMPLETED => "Hoàn thành"
- PENDING / ESCROW_LOCKED => "Đang xử lý"
- CANCELLED / DISPUTED => "Đã hủy / Tranh chấp"

---

## 🟢 AUTH — Đăng nhập bằng EMAIL

Endpoint đăng nhập:
```
POST /api/v1/auth/login
{ "email": "...", "password": "...", "rememberMe": true }
```
- rememberMe = false => JWT hết hạn sau 1 giờ
- rememberMe = true => JWT hết hạn sau 30 ngày

Endpoint đăng ký:
```
POST /api/v1/auth/register
{ "fullName": "...", "email": "...", "password": "...", "role": "SELLER", "companyName": "..." }
```

---

## 📅 NHỮNG DTO BỊ DEFER (không làm trong 8 tuần)

| DTO | Lý do |
|---|---|
| InventoryDTO | Ca giống là sinh vật sống, không có khái niệm lưu kho |
| ChatAndNegotiationDTO | Cần bảng DB mới — defer sau Tuần 4+ |
| CMSPostDTO | Không phải core business |
| SupportDTO / ContactRequestDTO | Nice-to-have |
| UserSettingsDTO (2FA, login history) | Security nâng cao — defer |
| AIAnalyticsDTO nâng cao | AI model cần hỗ trợ thêm |

---

## ✅ API ĐÃ / SẮP SẴN SÀNG

| Method | Endpoint | Trả về |
|---|---|---|
| GET | /api/v1/ping | Health check (đã có) |
| POST | /api/v1/auth/login | token + role + userId |
| POST | /api/v1/auth/register | UserResponse |
| GET | /api/v1/listings | List of ListingResponse |
| GET | /api/v1/listings/{id} | ListingResponse |
| GET | /api/v1/users/me | UserResponse |
| GET | /api/v1/users/me/wallet | walletBalance |

Nhắn Cảm nếu có thắc mắc!
