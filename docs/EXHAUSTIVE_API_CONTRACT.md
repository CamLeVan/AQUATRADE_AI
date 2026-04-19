# 📖 EXHAUSTIVE API SPECIFICATION – AquaTrade AI Backend
*Version: 1.0 – 2026‑04‑20*

> **Scope:** All public, protected, and internal endpoints that exist in the current Spring‑Boot code‑base (`core‑backend`).
> **Audience:** Front‑end developers (React / Flutter), Mobile engineers, Python AI service team, QA automation engineers, and external integrators.

---

## 1️⃣ Technical Standards

| Item | Value |
|------|-------|
| **Base URL (Staging)** | `http://localhost:8080/api/v1` |
| **Base URL (Production)** | `https://api.aquatrade.com/api/v1` |
| **Authentication** | JWT **Access‑Token** (15 min) + **Refresh‑Token** (30 days, opaque, stored in DB). |
| **Headers (protected calls)** | `Authorization: Bearer <accessToken>`<br>`Content-Type: application/json`<br>`Accept-Language: vi-VN` |
| **Global Error Schema** | ```json { "status":"error", "message":"<detail>", "data":null } ``` |
| **Date‑Time format** | ISO‑8601 UTC (`yyyy‑MM‑dd'T'HH:mm:ss'Z'`) |
| **Numeric type** | All monetary values are `java.math.BigDecimal` expressed in **VND** (no decimal places after rounding). |
| **Security** | `SecurityConfig` enforces `anyRequest().authenticated()` for all non‑public paths. Internal AI webhook protected by `InternalApiKeyFilter` (Header `X‑Internal‑Secret`). |
| **Optimistic Locking** | Entities `Order`, `Dispute`, `Listing` contain `@Version` field; concurrent updates return **409 Conflict**. |

---

## 2️⃣ Detailed Endpoint Specifications

### 2.1 Authentication & Users

| Method | Path | Role | Summary | Request Body | Success (200) | Errors |
|--------|------|------|---------|--------------|---------------|--------|
| **POST** | `/auth/login` | PUBLIC | Validate credentials, issue Access + Refresh tokens. | `{ "email": "string", "password":"string", "rememberMe":true/false }` | `{ "accessToken":"...", "refreshToken":"...", "expiresIn":900 }` | `400` Missing fields, `401` Invalid credentials, `403` Account disabled |
| **POST** | `/auth/register` | PUBLIC | Create new user (Buyer or Seller). | `{ "fullName":"string", "email":"string", "password":"string", "role":"BUYER|SELLER" }` | `{ "id":"UUID", "email":"...", "role":"BUYER|SELLER" }` | `400` Validation, `409` Duplicate email |
| **POST** | `/auth/refresh` | PUBLIC | Exchange a valid Refresh‑Token for a new Access + Refresh pair. | `{ "refreshToken":"string" }` | Same payload as `/login` (new tokens) | `401` Invalid/expired refresh token |
| **POST** | `/auth/logout` | AUTHENTICATED | Invalidate current Refresh‑Token. | `{ "refreshToken":"string" }` | `{ "message":"Logged out" }` | `401` Invalid token |
| **GET** | `/users/me` | AUTHENTICATED | Return logged‑in user profile. | – | `{ "id":"UUID","fullName":"...","email":"...","role":"BUYER|SELLER|ADMIN","status":"ACTIVE|BANNED|UNVERIFIED","createdAt":"..." }` | `401` Missing/invalid JWT |
| **PUT** | `/users/me` | AUTHENTICATED | Update mutable profile fields (fullName, email, password). | `{ "fullName":"string","email":"string","password":"string" }` | Updated user object | `400` Validation, `409` Email conflict |
| **GET** | `/users/{id}` | ADMIN | Retrieve any user (admin only). | – | Same as `/users/me` | `403` Insufficient role, `404` User not found |

---

### 2.2 Wallet (Ví)

| Method | Path | Role | Summary | Request Body | Success | Errors |
|--------|------|------|---------|--------------|---------|--------|
| **GET** | `/users/me/wallet` | AUTHENTICATED | Current balance + recent transaction list (max 10). | – | `{ "balance":12345678, "transactions":[ { "id":"UUID","type":"TOP_UP|WITHDRAW|ESCROW_LOCK|ORDER_PAYOUT|PLATFORM_COMMISSION|REFUND","amount":500000,"postBalance":12845678,"createdAt":"..." }, … ] }` | `401` Invalid JWT |
| **POST** | `/users/me/wallet/deposit` | AUTHENTICATED | Add funds to wallet (mocked; real gateway later). | `{ "amount":5000000 }` | `{ "balance":<newBalance>, "message":"Deposit successful" }` | `400` Negative amount, `422` Unprocessable entity |

---

### 2.3 Marketplace – Listings, Reviews & Blog

| Method | Path | Role | Summary | Request Body | Success | Errors |
|--------|------|------|---------|--------------|---------|--------|
| **GET** | `/listings` | PUBLIC | Paginated list, optional filters (`title`, `minPrice`, `maxPrice`, `status`). | Query params | `{ "content":[{ "id":"UUID","title":"...","pricePerFish":20000,"availableQuantity":150,"status":"ACTIVE|HIDDEN|SOLD","sellerName":"...","createdAt":"..." }], "page":0,"size":20,"totalElements":123 }` | – |
| **GET** | `/listings/{id}` | PUBLIC | Detail of a single listing. | – | Full listing object (see above) | `404` Not found |
| **POST** | `/listings` | SELLER | Create a new listing. | `{ "title":"string","description":"string","pricePerFish":12345,"availableQuantity":100,"images":["url1","url2"] }` | Created listing object (status=`PENDING` → AI processing) | `400` Validation, `403` Wrong role |
| **PUT** | `/listings/{id}` | SELLER | Update own listing (only if status != `SOLD`). | Same as POST (partial allowed) | Updated listing | `403` Not owner, `409` Optimistic lock conflict |
| **DELETE** | `/listings/{id}` | SELLER | Remove own listing (must be `ACTIVE` or `PENDING`). | – | `{ "message":"Listing deleted" }` | `403` Not owner, `409` Already sold |
| **POST** | `/listings/{id}/moderate` | ADMIN | Approve (`AVAILABLE`) or reject (`REJECTED`) a pending listing. | `{ "moderationStatus":"AVAILABLE|REJECTED","moderationNote":"string (required if REJECTED)" }` | `{ "message":"Listing moderated" }` | `400` Invalid status/note, `404` Not found |
| **POST** | `/reviews` | BUYER | Create a review for the seller of a completed order. | `{ "orderId":"UUID","rating":1‑5,"comment":"string" }` | `{ "id":"UUID","orderId":"...","rating":5,"comment":"...","createdAt":"..." }` | `400` Order not completed, `403` Not buyer of order |
| **GET** | `/posts` | PUBLIC | Retrieve CMS blog/news posts (public marketing). | – | Array of `{ "id":"UUID","title":"...","content":"...","author":"ADMIN","createdAt":"..." }` | – |
| **POST** | `/posts` | ADMIN | Create a new blog post. | `{ "title":"string","content":"string" }` | Created post object | `400` Validation, `403` Insufficient role |

---

### 2.4 Order & Escrow Lifecycle

| Method | Path | Role | Summary | Request Body | Success | Errors |
|--------|------|------|---------|--------------|---------|--------|
| **POST** | `/orders` | BUYER | Create an order → lock buyer funds in escrow, decrement listing stock. | `{ "listingId":"UUID","quantity":10,"shippingAddress":"string" }` | `{ "id":"UUID","orderStatus":"ESCROW_LOCKED","totalPrice":200000,"createdAt":"...","buyerId":"...","sellerId":"..."}` | `400` Invalid qty/stock, `409` Optimistic lock conflict, `403` Not buyer |
| **GET** | `/orders/{id}` | AUTHENTICATED | Retrieve order details (buyer sees own, seller sees theirs, admin sees all). | – | Full order object + `transactions` array | `404` Not found, `403` Forbidden |
| **GET** | `/orders` | BUYER | List own orders (paginated). | Query params (`status`) | Paginated list of orders | – |
| **POST** | `/orders/{id}/complete` | BUYER | Release escrow → 95 % to seller, 5 % commission to platform treasury. | – | `{ "message":"Order completed", "sellerPayout":950000, "commission":50000 }` | `400` Wrong status, `403` Not order owner |
| **POST** | `/orders/{orderId}/disputes` | BUYER, SELLER | Open a dispute on an order that is still in escrow. | `{ "reason":"string","evidenceUrl":"string" }` | `{ "id":"UUID","status":"OPEN","createdAt":"..." }` | `400` Order not in escrow, `403` Not participant |
| **GET** | `/orders/{orderId}/disputes` | AUTHENTICATED | Retrieve dispute(s) for an order. | – | Array of dispute objects | `404` No dispute, `403` Forbidden |

---

### 2.5 Admin Panel

| Method | Path | Role | Summary | Request Body | Success | Errors |
|--------|------|------|---------|--------------|---------|--------|
| **GET** | `/admin/dashboard/stats` | ADMIN | Global statistics (active users, sellers, total revenue, etc.). | – | `{ "activeBuyers":123,"activeSellers":45,"totalRevenue":123456789,"totalOrders":567 }` | `403` Insufficient role |
| **GET** | `/admin/users` | ADMIN | List all users (paginated). | – | Paginated `UserSummary` objects (see `AdminDto.UserSummary`). | – |
| **PUT** | `/admin/users/{userId}/status` | ADMIN | Change user status (`ACTIVE`, `INACTIVE`, `PENDING`). | `{ "newStatus":"ACTIVE|INACTIVE|PENDING" }` | `{ "message":"Status updated" }` | `404` User not found, `400` Invalid status |
| **GET** | `/admin/orders` | ADMIN | List all orders (paginated). | – | Paginated `OrderSummary` objects (see `AdminDto.OrderSummary`). | – |
| **GET** | `/admin/disputes/open` | ADMIN | List all **OPEN** disputes. | – | Paginated `DisputeSummary` objects (see `AdminDto.DisputeSummary`). | – |
| **GET** | `/admin/treasury` | ADMIN | Current platform treasury balance. | – | `{ "totalRevenue":12345678 }` | – |
| **POST** | `/admin/disputes/{disputeId}/refund` | ADMIN | Refund escrow to **Buyer** (buyer wins). | – | `{ "message":"Refund successful", "refundedAmount":<total> }` | `400` Dispute not open, `404` Not found |
| **POST** | `/admin/disputes/{disputeId}/force-complete` | ADMIN | Force‑complete dispute → seller receives 95 %, platform 5 %. | – | `{ "message":"Force complete successful", "sellerPayout":<95%>, "commission":<5%> }` | `400` Dispute not open, `404` Not found |
| **GET** | `/admin/users/{userId}` | ADMIN | Retrieve a single user (full object). | – | Full `User` DTO | `404` Not found |
| **GET** | `/admin/orders/{orderId}` | ADMIN | Retrieve a single order (full object). | – | Full `Order` DTO | `404` Not found |

---

### 2.6 AI‑Webhook (Internal)

| Method | Path | Role | Summary | Request Body | Success | Errors |
|--------|------|------|---------|--------------|---------|--------|
| **POST** | `/internal/ai-webhook` | INTERNAL (`SYSTEM_AI`) | Receive AI result for a ticket/order (asynchronous). | ```json { "ticketId":"string","orderId":"UUID","fishCount":2980,"healthScore":96.5,"resultVideoUrl":"https://.../result.mp4","timestamp":"2026-04-19T10:00:00Z" }``` | `{ "message":"Webhook processed", "orderId":"...","newTotalPrice":<calculated> }` | `401` Missing/invalid `X-Internal-Secret`, `400` Invalid payload, `409` Idempotent duplicate (already processed) |
| **Header required** | `X-Internal-Secret: <value‑from‑application.yml>` | – | – | – | – | – |

*Idempotency:* If the same `ticketId` is received twice, the service returns **200** with message *“Already processed”* and **does not** modify order or treasury.

---

### 2.7 Test & Health

| Method | Path | Role | Summary |
|--------|------|------|---------|
| **GET** | `/test/ping` | PUBLIC | Simple health‑check (`{ "status":"UP" }`). |
| **GET** | `/actuator/health` | PUBLIC (Spring Actuator) | Full Spring Boot health endpoints (optional). |

---

## 3️⃣ AI‑Webhook Protocol Details

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `ticketId` | String (UUID) | ✅ | Unique identifier generated by the AI service when the job is queued. |
| `orderId` | String (UUID) | ✅ | The order that the AI analysis belongs to. |
| `fishCount` | Integer | ✅ | Number of fish counted by the AI. |
| `healthScore` | Number (0‑100) | ✅ | Overall health metric (higher = healthier). |
| `resultVideoUrl` | String (URL) | ✅ | Link to the processed video for audit. |
| `timestamp` | String (ISO‑8601) | ✅ | When the AI finished processing. |

**Behaviour:**
1. If `fishCount` differs from the quantity originally ordered, the service **re‑calculates** `totalPrice = fishCount * pricePerFish`.
2. If the new total is **lower**, the surplus is **refunded** instantly to the buyer’s wallet (creates a `REFUND` transaction).
3. If the new total is **higher**, the buyer must **re‑confirm** (out of scope for current API – will return `409` with a message).

---

## 4️⃣ Money Flow & Treasury Audit

| Step | Actor | Action | Ledger Transaction (type) | Amount | Post‑Balance |
|------|-------|--------|---------------------------|--------|--------------|
| 1 | Buyer | **Create Order** → escrow lock | `ESCROW_LOCK` | `-totalPrice` | Buyer wallet decreased |
| 2 | Platform | **Order Completed** (Buyer calls `/orders/{id}/complete`) | `ORDER_PAYOUT` (to Seller) | `95 % of total` | Seller wallet increased |
| 2b | Platform | **Commission** | `PLATFORM_COMMISSION` | `5 % of total` | Treasury `totalRevenue` increased |
| 3 | Admin | **Refund** (buyer wins) | `REFUND` (to Buyer) | `totalPrice` | Buyer wallet restored, escrow cleared |
| 4 | Admin | **Force‑Complete** (seller wins) | Same as step 2 (payout + commission) | – | Same as normal completion |
| 5 | AI Webhook (price adjustment) | **Refund surplus** (if AI count < ordered) | `REFUND` | `surplusAmount` | Buyer wallet increased |
| 6 | Any operation | **Transaction Log** | `TOP_UP`, `WITHDRAW`, `ESCROW_LOCK`, `ORDER_PAYOUT`, `PLATFORM_COMMISSION`, `REFUND` | – | **Every** monetary movement creates a row in `Transaction` table (immutable). |

*All monetary calculations use `BigDecimal#setScale(0, RoundingMode.HALF_UP)` to avoid rounding errors.*

---

## 5️⃣ Data Dictionaries & Status Codes

| Enum | Values | Meaning |
|------|--------|---------|
| **UserStatus** | `ACTIVE`, `BANNED`, `UNVERIFIED` | Determines if JWT filter allows login. |
| **UserRole** | `BUYER`, `SELLER`, `ADMIN` | Role used by `@PreAuthorize`. |
| **ListingStatus** | `PENDING`, `ACTIVE`, `HIDDEN`, `SOLD`, `REJECTED` | Lifecycle of a listing. |
| **OrderStatus** | `ESCROW_LOCKED`, `COMPLETED`, `CANCELLED` | Order state machine. |
| **DisputeStatus** | `OPEN`, `RESOLVED`, `REJECTED` | Dispute lifecycle. |
| **TransactionType** | `ESCROW_LOCK`, `ESCROW_RELEASE`, `ORDER_PAYOUT`, `PLATFORM_COMMISSION`, `REFUND`, `TOP_UP`, `WITHDRAW` | Tag for audit queries. |

### Common HTTP Status Codes

| Code | When used |
|------|-----------|
| **200 OK** | Successful GET/POST (with body). |
| **201 Created** | Resource created (`/listings`, `/posts`, `/orders`). |
| **400 Bad Request** | Validation error, missing required fields, or business rule violation (e.g., insufficient stock). |
| **401 Unauthorized** | Missing/invalid JWT or internal API key. |
| **403 Forbidden** | Correct authentication but insufficient role/ownership. |
| **404 Not Found** | Resource does not exist. |
| **409 Conflict** | Optimistic‑locking version conflict or duplicate webhook processing. |
| **422 Unprocessable Entity** | Semantic errors (e.g., deposit negative amount). |
| **500 Internal Server Error** | Unexpected server exception (global handler returns error schema). |

---

## 6️⃣ Example Error Responses

| Scenario | Status | Body |
|----------|--------|------|
| **Insufficient stock** (POST `/orders`) | `400` | `{ "status":"error","message":"Insufficient stock: only 3 items left","data":null }` |
| **Wrong role (Seller posting order)** | `403` | `{ "status":"error","message":"Access denied: BUYER role required","data":null }` |
| **Optimistic lock conflict** | `409` | `{ "status":"error","message":"Concurrent modification detected – please retry","data":null }` |
| **Missing internal secret** | `401` | `{ "status":"error","message":"Invalid or missing X-Internal-Secret header","data":null }` |
| **Duplicate AI webhook** | `200` (idempotent) | `{ "status":"success","message":"Already processed","data":null }` |

---

## 7️⃣ Postman Collection Tips

1. **Environment Variables** – `accessToken`, `refreshToken`, `buyerId`, `sellerId`, `listingId`, `orderId`, `disputeId`, `internalSecret`.
2. **Pre‑request Scripts** – automatically attach `Authorization` and `X-Internal-Secret` when needed.
3. **Tests Tab** – copy the `pm.test` snippets below for each category (see **Appendix A**).
4. **Data‑Driven Runner** – use a CSV/JSON file to iterate over different amounts (e.g., 1 000 000 VND, 1 234 567 VND) and quantities (partial/full purchase).

---

## Appendix A – Postman `pm.test` Snippets

### Authentication
```javascript
// AUTH‑01 – token expiry
pm.test("Access token must be expired after 15 min", function () {
    pm.response.to.have.status(401);
});

// AUTH‑02 – refresh rotation
pm.test("Refresh returns new tokens", function () {
    const json = pm.response.json();
    pm.expect(json).to.have.property('accessToken');
    pm.expect(json).to.have.property('refreshToken');
    pm.environment.set('accessToken', json.accessToken);
    pm.environment.set('refreshToken', json.refreshToken);
});
```

### Financial / Escrow
```javascript
// FIN‑01 – escrow lock
pm.test("Buyer balance deducted, seller unchanged", function () {
    const beforeBuyer = pm.environment.get('buyerBalanceBefore');
    const afterBuyer  = pm.response.json().buyerBalance;
    pm.expect(afterBuyer).to.equal(beforeBuyer - 1000000);
});

// FIN‑02 – commission split
pm.test("Commission split 95/5", function () {
    const json = pm.response.json();
    pm.expect(json.sellerPayout).to.equal(950000);
    pm.expect(json.commission).to.equal(50000);
    pm.expect(json.treasury.totalRevenue).to.be.above(0);
});

// FIN‑03 – double‑entry transaction log
pm.test("Two transaction rows created", function () {
    const tx = pm.response.json().transactions;
    pm.expect(tx).to.have.length(2);
    const types = tx.map(t => t.type);
    pm.expect(types).to.include.members(['ORDER_PAYOUT','PLATFORM_COMMISSION']);
});
```

### Inventory & Concurrency
```javascript
// INV‑01 – partial purchase
pm.test("Partial purchase reduces quantity correctly", function () {
    const listing = pm.response.json();
    pm.expect(listing.availableQuantity).to.equal(80);
    pm.expect(listing.status).to.equal("ACTIVE");
});

// INV‑02 – sold‑out transition
pm.test("Exact stock purchase flips status to SOLD_OUT", function () {
    const listing = pm.response.json();
    pm.expect(listing.availableQuantity).to.equal(0);
    pm.expect(listing.status).to.equal("SOLD_OUT");
});

// INV‑04 – race condition handling (run two requests in parallel)
pm.test("Only one request succeeds, the other fails with 409", function () {
    const status = pm.response.code;
    pm.expect([200,409]).to.include(status);
});
```

### AI Webhook
```javascript
// WEB‑01 – successful AI approval
pm.test("Listing becomes ACTIVE after AI approval", function () {
    const listing = pm.response.json();
    pm.expect(listing.status).to.equal("ACTIVE");
    pm.expect(listing.moderationStatus).to.equal("AVAILABLE");
});

// WEB‑03 – missing internal secret
pm.test("Webhook without secret is rejected", function () {
    pm.response.to.have.status(401); // or 403 depending on filter config
});

// WEB‑05 – idempotent duplicate webhook
pm.test("Duplicate webhook does not change state", function () {
    const json = pm.response.json();
    pm.expect(json.message).to.match(/already processed/i);
});
```

### Dispute & Admin
```javascript
// DIS‑02 – refund moves money back to buyer
pm.test("Buyer receives escrow refund", function () {
    const before = pm.environment.get('buyerBalanceBefore');
    const after  = pm.response.json().buyerBalance;
    const orderTotal = pm.environment.get('orderTotal');
    pm.expect(after).to.equal(before + orderTotal);
    pm.expect(pm.response.json().transactions).to.have.length(1);
    pm.expect(pm.response.json().transactions[0].type).to.equal('REFUND');
});

// DIS‑05 – non‑admin cannot invoke admin endpoint
pm.test("Non‑admin is forbidden from admin actions", function () {
    pm.response.to.have.status(403);
});
```

---

*This document is the single source of truth for the AquaTrade AI backend API. Keep it in sync with code changes and version it alongside the repository.*
