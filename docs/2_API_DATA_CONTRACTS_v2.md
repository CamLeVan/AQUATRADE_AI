# 📦 API DATA CONTRACTS — AquaTrade AI (v2 — Đã thống nhất FE ↔ BE)

> **Base URL:** `http://localhost:8080/api/v1`
> **Auth Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 🔑 QUY ƯỚC CHUNG

| Quy ước | Chi tiết |
|---|---|
| **ID** | UUID string (VD: `"550e8400-e29b-41d4-a716-446655440000"`) |
| **Đơn vị số lượng** | **SỐ CON** (cá giống đếm từng con bằng AI) — **không** phải kg |
| **Giá tiền** | VNĐ, kiểu `Decimal` |
| **Thời gian** | ISO 8601: `"2026-04-03T15:00:00"` |
| **Auth** | Đăng nhập bằng **email** |

---

## 1. AuthDTO (Xác thực)

### 1.1. LoginRequest — `POST /api/v1/auth/login`

```json
{
  "email": "seller@example.com",
  "password": "123456",
  "rememberMe": true
}
```

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `email` | `String` | ✅ | Email đăng nhập |
| `password` | `String` | ✅ | Mật khẩu |
| `rememberMe` | `Boolean` | ❌ | `false` → JWT 1 giờ / `true` → 30 ngày |

**Response (200 OK):**
```json
{
  "status": "success",
  "data": { "token": "eyJ...", "role": "SELLER", "userId": "uuid..." }
}
```

### 1.2. RegisterRequest — `POST /api/v1/auth/register`

```json
{
  "fullName": "Nguyễn Văn A",
  "companyName": "Trại Giống Miền Tây",
  "email": "a@example.com",
  "password": "securePass123",
  "role": "SELLER"
}
```

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `fullName` | `String` | ✅ | Họ và tên |
| `companyName` | `String` | ❌ | Tên công ty/trại giống |
| `email` | `String` | ✅ | Email (unique) |
| `password` | `String` | ✅ | Mật khẩu |
| `role` | `Enum` | ✅ | `BUYER` hoặc `SELLER` (ADMIN không tự đăng ký) |

---

## 2. UserDTO (Người dùng)
**Endpoint:** `GET /api/v1/users/me` | Admin: `GET /api/v1/admin/users`

| Field | Kiểu | Mô tả | Ghi chú |
|---|---|---|---|
| `id` | `String (UUID)` | Mã định danh | |
| `fullName` | `String` | Họ và tên | |
| `email` | `String` | Email | |
| `username` | `String` | Display handle | Nullable |
| `phoneNumber` | `String` | SĐT | Nullable |
| `avatarUrl` | `String` | Ảnh đại diện | Nullable |
| `companyName` | `String` | Tên công ty | Nullable |
| `role` | `Enum` | `BUYER` / `SELLER` / `ADMIN` | |
| `status` | `Enum` | `ACTIVE` / `INACTIVE` / `PENDING` | |
| `createdAt` | `ISO Date` | Ngày tạo | FE hiển thị "Ngày tham gia" |

> ℹ️ **Thay đổi so với bản FE gốc:**
> - `id`: UUID thay vì "AQ-00124"
> - `joinDate` → `createdAt` (FE tự đổi label)
> - `status`: bỏ `OFFLINE` (trạng thái Socket realtime, không lưu DB)
> - `role`: bỏ `INVESTOR` (phi logic), giữ `TECHNICIAN` để có thể thêm sau

---

## 3. ListingDTO (Sản phẩm / Lô hàng)
**Endpoint:** `GET /api/v1/listings` | `GET /api/v1/listings/{id}`

> ℹ️ **FE gọi là ProductDTO** → BE đổi thành **ListingDTO** (đúng nghĩa "tin đăng bán")

| Field | Kiểu | Mô tả | Ghi chú so với FE gốc |
|---|---|---|---|
| `id` | `String (UUID)` | ID lô hàng | |
| `title` | `String` | Tiêu đề tin đăng | FE gốc: `name` → đổi tên |
| `category` | `Enum` | `CA` / `TOM` / `CUA` / `KHAC` | |
| `species` | `String` | Tên giống cụ thể | Thêm mới — chi tiết hơn category |
| `province` | `String` | Tỉnh xuất xứ | FE gốc: `origin` → đổi tên |
| `sizeMin` | `Decimal` | Kích thước nhỏ nhất (cm) | Thêm mới |
| `sizeMax` | `Decimal` | Kích thước lớn nhất (cm) | Thêm mới |
| `pricePerFish` | `Decimal` | Đơn giá **(VNĐ/CON)** | FE gốc: `pricePerUnit` → đổi tên |
| `estimatedQuantity` | `Integer` | Số lượng ước tính (CON) | Thêm mới |
| `thumbnailUrl` | `String` | Ảnh bìa | FE gốc: `imageUrl` → đổi tên |
| `status` | `Enum` | Xem bảng ListingStatus | |
| `sellerName` | `String` | Tên người bán | |
| `aiVerified` | `Boolean` | AI đã xác thực chưa | 🔜 Thêm bảng/logic sau |
| `aiHealthScore` | `Integer` | Điểm chất lượng AI (0-100) | 🔜 Thêm bảng/logic sau |
| `qualityLabel` | `String` | "Premium", "AI Verified" | 🔜 Thêm bảng/logic sau |
| `isFavorite` | `Boolean` | Trạng thái yêu thích | 🔜 Cần thêm bảng `user_favorites` |
| `createdAt` | `ISO Date` | Ngày đăng | |

> ❌ **Xóa (phi logic):** `unit: "kg"` — hệ thống chỉ tính theo **CON**, không phải kg

**ListingStatus:** `PENDING_REVIEW` | `AVAILABLE` | `SOLD` | `HIDDEN` | `REJECTED`

### 3.1. CreateListingRequest — `POST /api/v1/listings`

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `title` | `String` | ✅ | Tiêu đề |
| `category` | `Enum` | ✅ | `CA` / `TOM` / `CUA` / `KHAC` |
| `species` | `String` | ✅ | Tên giống |
| `province` | `String` | ✅ | Tỉnh trại giống |
| `sizeMin` | `Decimal` | ❌ | Kích thước min (cm) |
| `sizeMax` | `Decimal` | ❌ | Kích thước max (cm) |
| `pricePerFish` | `Decimal` | ✅ | Đơn giá (VNĐ/con) |
| `estimatedQuantity` | `Integer` | ✅ | Số con ước tính |

---

## 4. OrderDTO (Đơn hàng / Phòng giao dịch)

### 4.1. CreateOrderRequest — `POST /api/v1/orders`

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `listingId` | `String (UUID)` | ✅ | ID lô hàng muốn mua |
| `shippingAddress` | `String` | ✅ | Địa chỉ giao nhận |

> ⚠️ FE **không** gửi `amount`/`price`. BE tự tính từ DB chống gian lận.

### 4.2. OrderResponse — `GET /api/v1/orders/{id}`

| Field | Kiểu | Mô tả | Ghi chú so với FE gốc |
|---|---|---|---|
| `id` | `String (UUID)` | ID đơn hàng | FE gốc: `transactionId` → đổi tên |
| `listingTitle` | `String` | Tên sản phẩm | FE gốc: `productName` → đổi tên |
| `buyerName` | `String` | Tên người mua | Thêm mới |
| `sellerName` | `String` | Tên người bán | Thêm mới |
| `unitPriceAtPurchase` | `Decimal` | Giá chốt (VNĐ/con) | Thêm mới — chống gian lận |
| `finalQuantity` | `Integer` | Số CON AI đếm | FE gốc: `weight` → **THAY THẾ (phi logic)** |
| `totalPrice` | `Decimal` | Tổng tiền | FE gốc: `totalAmount` → đổi tên |
| `shippingAddress` | `String` | Địa chỉ giao nhận | |
| `status` | `Enum` | Xem bảng OrderStatus | 7 trạng thái (đầy đủ hơn FE gốc 3) |
| `createdAt` | `ISO Date` | Thời gian | FE gốc: `timestamp` → đổi tên |
| `digitalProof` | `Object` | Bằng chứng số AI | Xem AIDetectionDTO |

> ❌ **Xóa (phi logic):** `weight` → thay bằng `finalQuantity` (CON, không phải kg)
> ❌ **Xóa (phi logic):** `currency` → chỉ dùng VNĐ, hardcode ở FE
>
> ℹ️ **Đổi tên:** `aiMatchScore` → `digitalProof.confidenceScore`, `evidenceUrl` → `digitalProof.aiImageUrl`
> ℹ️ **Derive:** `isEscrow` → tính từ `status` (nếu ≠ COMPLETED/CANCELLED → đang escrow)

**OrderStatus:** `PENDING` | `ESCROW_LOCKED` | `IN_VIDEO_CALL` | `COUNTING_AI` | `COMPLETED` | `DISPUTED` | `CANCELLED`

---

## 5. WalletDTO (Ví hệ thống)
**Endpoint:** `GET /api/v1/users/me/wallet`

| Field | Kiểu | Mô tả | Ghi chú |
|---|---|---|---|
| `walletBalance` | `Decimal` | Số dư khả dụng | FE gốc: `balance` → đổi tên |
| `userLevel` | `String` | Cấp thành viên | 🔜 Thêm bảng `membership_tiers` sau |
| `recentTransactions` | `List` | Danh sách giao dịch gần nhất | |

**Mỗi Transaction:**

| Field | Kiểu | Mô tả |
|---|---|---|
| `id` | `String (UUID)` | ID giao dịch |
| `orderId` | `String (UUID)` | Đơn hàng liên quan (nullable) |
| `amount` | `Decimal` | Số tiền |
| `postBalance` | `Decimal` | Số dư sau giao dịch |
| `type` | `Enum` | `ESCROW_LOCK` / `ESCROW_RELEASE` / `REFUND` / `TOP_UP` / `WITHDRAW` |
| `paymentMethod` | `Enum` | `VNPAY` / `MOMO` / `BANK_TRANSFER` (khi type=TOP_UP) |
| `status` | `Enum` | `SUCCESS` / `PENDING` / `FAILED` |
| `createdAt` | `ISO Date` | Thời gian |

---

## 6. AIDetectionDTO (Kết quả kiểm định AI)
**Kênh nhận:** WebSocket `/ws/orders/{orderId}/count-ai`

**6.1. Payload PROCESSING** (FE nhận liên tục):
```json
{ "status": "PROCESSING", "orderId": "uuid...", "currentCount": 89 }
```

**6.2. Payload DONE** (BE tự ngắt WebSocket sau khi gửi):
```json
{
  "status": "DONE", "orderId": "uuid...",
  "aiFishCount": 487, "confidenceScore": 0.97,
  "aiImageUrl": "https://s3.../proof.jpg",
  "proofHash": "sha256:abc123...",
  "gpsLatitude": 10.762622, "gpsLongitude": 106.660172,
  "createdAt": "2026-04-02T09:05:00"
}
```

| Field | Có ở | Kiểu | Mô tả | Ghi chú so với FE gốc |
|---|---|---|---|---|
| `status` | Cả 2 | `String` | `PROCESSING` / `DONE` | |
| `orderId` | Cả 2 | `UUID` | Đơn hàng | FE gốc: `batchId` → đổi tên |
| `currentCount` | PROCESSING | `Integer` | Số đếm tạm | Thêm mới |
| `aiFishCount` | DONE | `Integer` | Số con chính thức | FE gốc: `objectCount` → đổi tên |
| `confidenceScore` | DONE | `Decimal` | Độ chính xác (0→1) | FE gốc: `accuracy` → đổi tên |
| `aiImageUrl` | DONE | `String` | Ảnh bounding box | |
| `proofHash` | DONE | `String` | SHA-256 chống giả mạo | |
| `gpsLatitude` | DONE | `Decimal` | GPS | |
| `gpsLongitude` | DONE | `Decimal` | GPS | |
| `averageSize` | DONE | `Decimal` | Kích thước TB (cm) | 🔜 Thêm vào AI output sau |
| `impuritiesCount` | DONE | `Integer` | Số tạp chất | 🔜 Thêm vào AI output sau |
| `colorUniformity` | DONE | `Integer` | Đồng nhất màu (%) | 🔜 Thêm vào AI output sau |
| `aiNotes` | DONE | `String` | Cảnh báo AI | 🔜 Thêm vào AI output sau |
| `createdAt` | DONE | `ISO Date` | Thời điểm | |

---

## 7. MarketplaceModerationDTO (Duyệt tin đăng — Admin)
**Endpoint:** `PUT /api/v1/admin/listings/{id}/moderate`

> 📌 `{id}` là **path parameter** — không gửi trong body.

| Field (body) | Kiểu | Mô tả |
|---|---|---|
| `moderationStatus` | `Enum` | `AVAILABLE` (duyệt) / `REJECTED` (từ chối) |
| `moderationNote` | `String` | Ghi chú (bắt buộc khi REJECTED) |

> ❌ **Xóa (phi logic):** `APPROVED` → dùng `AVAILABLE` cho nhất quán với ListingStatus
> ❌ **Xóa (phi logic):** `FLAGGED` → không có trong flow hiện tại
> 🔜 `aiWarningReason` — thêm sau khi AI hỗ trợ auto-moderation

---

## 8. DisputeDTO (Khiếu nại)
**Endpoint:** `POST /api/v1/orders/{orderId}/disputes`

**Request:** `{ "reason": "Cá chết nhiều, sai kích cỡ." }`

**Response:** `{ id, orderId, status, reasonText, createdAt }`

**DisputeStatus:** `OPEN` | `RESOLVED` | `REJECTED`

---

## 9. ReviewDTO (Đánh giá — sau COMPLETED)
**Endpoint:** `POST /api/v1/orders/{orderId}/reviews`

| Field | Kiểu | Mô tả |
|---|---|---|
| `rating` | `Integer` | 1 → 5 sao |
| `comment` | `String` | Nhận xét |

---

## 10. DashboardStatsDTO (Thống kê — Admin/User)
🔜 *Implement khi có dữ liệu thực*

| Field | Kiểu | Mô tả |
|---|---|---|
| `totalUsers` | `Object` | Tổng user + % tăng trưởng |
| `activeSellers` | `Integer` | Số seller đang hoạt động |
| `activeBuyers` | `Integer` | Số buyer đang hoạt động |
| `totalListings` | `Integer` | Tổng lô hàng trên sàn |
| `lowStockAlertCount` | `Integer` | Số mặt hàng sắp hết |
| `aiNetworkHealth` | `Integer` | Sức khỏe AI (0-100) |

---

## 11. ChatAndNegotiationDTO (Tin nhắn & Thương lượng)
🔜 *Cần thêm bảng `messages`, `negotiations`*

| Field | Kiểu | Mô tả |
|---|---|---|
| `chatId` | `String` | ID cuộc hội thoại |
| `senderName` | `String` | Người gửi |
| `content` | `String` | Nội dung |
| `messageType` | `Enum` | `TEXT` / `FILE` / `OFFER` / `AI_INSIGHT` |
| `timestamp` | `ISO Date` | Thời gian |
| `offerPrice` | `Decimal` | Giá đề xuất (nếu OFFER) |
| `offerStatus` | `Enum` | `PENDING` / `ACCEPTED` / `DECLINED` / `EXPIRED` |
| `aiRecommendedPrice` | `Decimal` | Giá gợi ý AI |

---

## 12. AIAnalyticsDTO (Phân tích nâng cao — Admin)
🔜 *Cần AI model hỗ trợ thêm*

| Field | Mô tả |
|---|---|
| `healthForecast` | % dự báo sức khỏe lô hàng |
| `qualityConsistency` | Điểm đồng nhất (0-10) |
| `predictivePriceIndex` | Chỉ số giá dự báo |
| `gradingEfficiency` | Số lô đã phân loại tự động |
| `qualityDistribution` | Tỷ lệ Grade A/B/C |
| `anomalyLogs` | Cảnh báo bất thường |

---

## 13. CMSPostDTO (Quản lý nội dung — Admin)
🔜 *Cần thêm bảng `posts`*

| Field | Mô tả |
|---|---|
| `id`, `title`, `content` | Nội dung bài viết |
| `category` | `MARKETING` / `TECH` / `NEWS` |
| `status` | `PUBLISHED` / `DRAFT` / `PENDING` |
| `featuredImageUrl` | Ảnh đại diện |
| `author`, `viewCount` | Metadata |

---

## 14. SupportDTO (Hỗ trợ)
🔜 *Cần thêm bảng `support_tickets`*

| Field | Mô tả |
|---|---|
| `ticketId` | ID phiếu |
| `subject` | Chủ đề |
| `ticketStatus` | `OPEN` / `RESOLVED` / `CLOSED` |
| `messageHistory` | Danh sách tin nhắn trao đổi |

---

## 15. UserSettingsDTO (Cài đặt người dùng)
🔜 *Cần thêm bảng `user_settings`*

| Field | Mô tả |
|---|---|
| `username`, `phone` | Thông tin cơ bản |
| `twoFactorEnabled` | 2FA Boolean |
| `loginHistory` | device, location, lastActive |
| `notificationPreferences` | QUALITY_ALERT, PRICE_CHART... |
| `paymentMethods` | cardType, last4, expiryDate... |

---

## 16. ContactRequestDTO & SystemHealthDTO
🔜 *Thêm sau*

**ContactRequest:** `fullName`, `email`, `subject`, `message`
**SystemHealth:** `serverHealth`, `latencyMs`, `lastSyncAt`

---

## 🔗 DANH SÁCH ENUM CHUẨN (Backend định nghĩa)

```
Role:              BUYER | SELLER | ADMIN
UserStatus:        ACTIVE | INACTIVE | PENDING
ListingStatus:     PENDING_REVIEW | AVAILABLE | SOLD | HIDDEN | REJECTED
ListingCategory:   CA | TOM | CUA | KHAC
OrderStatus:       PENDING | ESCROW_LOCKED | IN_VIDEO_CALL | COUNTING_AI | COMPLETED | DISPUTED | CANCELLED
TransactionType:   ESCROW_LOCK | ESCROW_RELEASE | REFUND | TOP_UP | WITHDRAW
TransactionStatus: SUCCESS | FAILED | PENDING
PaymentMethod:     VNPAY | MOMO | BANK_TRANSFER
DisputeStatus:     OPEN | RESOLVED | REJECTED
```

---

## 📋 TÓM TẮT THAY ĐỔI SO VỚI BẢN FE GỐC

### ❌ Xóa vĩnh viễn (phi logic):
- `unit: "kg"`, `weight` → hệ thống đếm CON, không phải kg
- `InventoryDTO` toàn bộ → cá giống sống không lưu kho
- `status: OFFLINE` → trạng thái Socket, không lưu DB
- `role: INVESTOR` → không có flow nghiệp vụ
- `moderationStatus: APPROVED/FLAGGED` → inconsistent, dùng `AVAILABLE/REJECTED`
- `currency` → chỉ dùng VNĐ

### ✏️ Đổi tên (logic đúng, chuẩn hóa naming):
- `name` → `title` | `origin` → `province` | `pricePerUnit` → `pricePerFish`
- `imageUrl` → `thumbnailUrl` | `joinDate` → `createdAt` | `totalAmount` → `totalPrice`
- `transactionId` → `id (UUID)` | `weight` → `finalQuantity`

### 🔜 Giữ nguyên, thêm bảng/logic sau:
- `aiVerified`, `aiHealthScore`, `qualityLabel`, `isFavorite`
- `userLevel`, `averageSize`, `impuritiesCount`, `colorUniformity`
- ChatDTO, CMSPostDTO, SupportDTO, UserSettingsDTO, AIAnalyticsDTO, DashboardStatsDTO
