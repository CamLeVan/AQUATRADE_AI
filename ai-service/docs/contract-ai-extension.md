# AI Service ↔ core-backend Integration Contract

Tài liệu này mô tả contract chính xác giữa **ai-service** (Python/FastAPI)
và **core-backend** (Java/Spring Boot, branch `develop`) — đã thay thế
contract §3 cũ (`POST /api/v1/internal/ai-webhook` với 6 trường).

## 1) Tổng quan luồng

```
[FE/Mobile]  ── upload video ──▶  Cloudinary
     │                                │
     │  POST /api/v1/orders/{id}/start-ai
     ▼
[core-backend] ── tạo DigitalProof (proofId) ───┐
     │                                          │
     │  POST {aiServiceUrl}/ai/v1/jobs          │
     │  Body: { orderId, proofId, videoUrl,     │
     │          callbackUrl }                   │
     ▼                                          │
[ai-service] ── 202 { ticketId } ◀──────────────┘
     │
     │  (background) tải video, đếm cá, build best frame, upload Cloudinary
     │
     │  POST {callbackUrl}
     │  Header: X-Internal-Secret
     │  Body: AIDetectionDto.DonePayload
     ▼
[core-backend] ── lưu DigitalProof, broadcast WebSocket /topic/orders/{id}
```

## 2) BE → AI: Submit job

| Mục | Giá trị |
|---|---|
| Method | `POST` |
| URL | `{aiServiceUrl}/ai/v1/jobs` (default `http://localhost:8000/ai/v1/jobs`) |
| Auth | Không bắt buộc (BE → AI internal); AI có thể optional verify nếu cần |
| Body | JSON dưới |

```json
{
  "orderId": "uuid",
  "proofId": "uuid",
  "videoUrl": "https://res.cloudinary.com/.../v1.mp4",
  "callbackUrl": "http://be:8080/api/v1/internal/orders/{orderId}/proofs/{proofId}/ai-result",
  "fishProfile": "slow|normal|fast (optional)",
  "expectedCount": 200
}
```

**AI response**: `202 Accepted` với `ticketId` ở **root** (BE develop check `response.containsKey("ticketId")`):

```json
{
  "status": "success",
  "message": "Job accepted",
  "data": {
    "ticketId": "uuid",
    "proofId": "uuid",
    "status": "QUEUED",
    "acceptedAt": "ISO-8601",
    "estimatedSeconds": 90
  },
  "ticketId": "uuid"
}
```

**Idempotency** (Sprint 6): theo `proofId`.
- Cùng `proofId` + cùng `videoUrl` → trả lại ticket cũ (202).
- Cùng `proofId` + khác `videoUrl` → **409 Conflict**.

## 3) AI → BE: Callback kết quả

| Mục | Giá trị |
|---|---|
| Method | `POST` |
| URL | `{callbackUrl}` (BE cấp khi gọi /ai/v1/jobs) |
| Header bắt buộc | `X-Internal-Secret: <shared-secret>` (default `AquaTrade-AI-Secret-Key-2026`) |
| Body | `AIDetectionDto.DonePayload` |

### 3.1) DONE payload

```json
{
  "status": "DONE",
  "orderId": "uuid",
  "aiFishCount": 150,
  "healthScore": 82,
  "qualityStatus": "NORMAL",
  "aiImageUrl": "https://res.cloudinary.com/.../order_proof_<ticketId>.jpg",
  "proofHash": "sha256_hex (64 chars)",
  "aiNotes": "smart_stop_not_triggered; dead_fish_detected=2 (nullable)",
  "averageSize": null,
  "impuritiesCount": null,
  "colorUniformity": null,
  "createdAt": "ISO-8601 UTC Z"
}
```

**Mapping logic** (AI side, file `src/api/service.py`):
- `aiFishCount` = `result.fish_count` (int).
- `healthScore` = `int(round(result.health_score))` (0..100).
- `qualityStatus` = "NORMAL" nếu Smart Stop trigger và video có dữ liệu, "LOW" còn lại.
- `aiImageUrl` = URL Cloudinary của best-frame image (nếu Cloudinary enabled), hoặc `file://...` local (dev fallback).
- `proofHash` = SHA-256 hex của video gốc đã download.
- `aiNotes` = các tín hiệu phụ ("dead_fish_detected", "smart_stop_not_triggered"...).
- `averageSize`/`impuritiesCount`/`colorUniformity` = null (chưa hỗ trợ, BE đã ghi rõ "mở rộng sau").

### 3.2) FAILED payload

```json
{
  "status": "FAILED",
  "orderId": "uuid",
  "errorMessage": "VideoValidationError: ...",
  "createdAt": "ISO-8601 UTC Z"
}
```

AI gửi `FAILED` callback khi:
- Pipeline raise lỗi terminal (validation, file not found, payload sai).
- Hết retries cho lỗi transient (`JOB_MAX_ATTEMPTS=3`).

BE cleanup task chạy mỗi 5 phút sẽ tự mark FAILED nếu AI không gửi callback trong 10 phút (defense-in-depth).

## 4) Endpoint AI service nội bộ

| Endpoint | Auth | Mô tả |
|---|---|---|
| `POST /ai/v1/jobs` | `X-Internal-Secret` + rate-limit | Submit job |
| `GET /ai/v1/jobs/{ticketId}` | `X-Internal-Secret` | Polling status (BE fallback nếu webhook fail) |
| `GET /ai/v1/health` | public | Health + dependency status |
| `GET /ai/v1/models` | `X-Internal-Secret` | Liệt kê model active |
| `GET /ai/v1/dead-letters?limit=N` | `X-Internal-Secret` | Vận hành check job FAILED nhiều lần |
| `GET /metrics` | public | Prometheus metrics |

## 5) Cloudinary integration (Cách A — AI có credentials đầy đủ)

| Asset | Cloudinary type | Mục đích | URL ở đâu |
|---|---|---|---|
| Video gốc user quay | `upload` (public) | Source of truth | FE upload qua signed-upload BE cấp |
| Best-frame image (AI) | `upload` (public, preset) | `aiImageUrl` cho buyer xem | AI upload, trả URL về BE |

AI dùng env:
```
CLOUDINARY_ENABLED=true
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_IMAGE_UPLOAD_PRESET=aquatrade_ai_image_preset
CLOUDINARY_IMAGE_FOLDER=aquatrade/ai-results
```

> **Cảnh báo bảo mật**: Cloudinary credentials đang ở `application.properties`
> public repo. BE team **phải rotate API_SECRET + chuyển sang `.env`/secret manager**
> trước khi go-live.

## 6) Sprint history (additive cumulative)

- **Sprint 0**: cleanup dead code, fix NMS threshold (0.7 thay vì 1).
- **Sprint 1**: tách core modules `types`, `biomass`, `video_writer`, `pipeline`.
- **Sprint 2**: FastAPI app + Job API + webhook client.
- **Sprint 3**: Queue (Arq), MinIO storage (optional), JobStore Redis.
- **Sprint 3.1**: `originalVideoHash` (SHA-256), Smart Stop penalty -30 điểm.
- **Sprint 4**: structured logging (structlog), Prometheus metrics, health detail.
- **Sprint 5**: secret rotation, HMAC outbound (Standard Webhooks v1), idempotency mạnh, dead-letter, rate limit, video validation chặt hơn.
- **Sprint 6 (current)**: integrate với BE develop schema:
  - `JobRequest` thêm `proofId` (idempotency key).
  - `WebhookPayload` (§3 cũ) → `AiResultPayload` khớp `AIDetectionDto.DonePayload`.
  - Endpoint callback từ cố định → động (BE cấp `callbackUrl`).
  - AI gửi cả callback `DONE` lẫn `FAILED`.
  - Cloudinary uploader cho best-frame image.

## 7) Việc BE phải làm

| Việc | Trạng thái |
|---|---|
| Endpoint `POST /api/v1/internal/orders/{orderId}/proofs/{proofId}/ai-result` | ✅ Đã có (`InternalOrderController`) |
| `InternalApiKeyFilter` verify `X-Internal-Secret` | ✅ Đã có |
| `DigitalProof` multi-batch (`@ManyToOne`, `proofRole`, `batchName`, `status`) | ✅ Đã có |
| `OrderServiceImpl.startAiAnalysis` gọi AI với `proofId` | ✅ Đã có |
| Cleanup task PENDING > 10' → FAILED | ✅ Đã có (`@Scheduled`) |
| **Rotate Cloudinary API_SECRET** (đã leak public repo) | ⚠️ TODO trước go-live |
| Move credentials sang `.env`/secret manager | ⚠️ TODO trước go-live |
| (Optional) verify HMAC outbound từ AI | ⚠️ Chỉ cần ở production |
