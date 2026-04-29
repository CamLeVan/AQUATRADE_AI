# AI Service API Extension (Draft for BE review)

This document **does not change** existing webhook contract section §2.6 / §3.
It only documents inbound endpoints BE uses to submit jobs to AI service.

## Compatibility promise

- 6 required fields of `POST /api/v1/internal/ai-webhook` remain unchanged.
- `WebhookPayload` in `src/api/schemas.py` always sends:
  `ticketId`, `orderId`, `fishCount`, `healthScore`, `resultVideoUrl`, `timestamp`.
- Sprint 3.1 adds **optional** field `originalVideoHash` (SHA-256 hex digest of
  the original video AI downloaded). BE can ignore it for backward compatibility.
- Recommended: BE persist `originalVideoHash` into `DigitalProof` table for
  dispute/legal audit (verify file gốc không bị sửa).

## Inbound endpoints (BE -> AI)

### 1) Submit job

- **POST** `/ai/v1/jobs`
- **Header:** `X-Internal-Secret: <shared-secret>`
- **Body:**
  ```json
  {
    "orderId": "string",
    "videoUrl": "https://... or file://...",
    "callbackUrl": "optional",
    "fishProfile": "slow|normal|fast",
    "expectedCount": 200
  }
  ```
- **Response:** `202 Accepted`
  ```json
  {
    "status": "success",
    "message": "Job accepted",
    "data": {
      "ticketId": "uuid",
      "status": "QUEUED",
      "acceptedAt": "ISO-8601",
      "estimatedSeconds": 90
    }
  }
  ```

### 2) Get job status (polling fallback)

- **GET** `/ai/v1/jobs/{ticketId}`
- **Header:** `X-Internal-Secret: <shared-secret>`
- **Response:** `200`
  ```json
  {
    "status": "success",
    "data": {
      "ticketId": "uuid",
      "orderId": "uuid",
      "status": "QUEUED|PROCESSING|DONE|FAILED",
      "progress": 0.42,
      "createdAt": "ISO-8601",
      "startedAt": "ISO-8601|null",
      "completedAt": "ISO-8601|null",
      "result": {},
      "error": null
    }
  }
  ```

### 3) Health

- **GET** `/ai/v1/health` (public)

### 4) Models

- **GET** `/ai/v1/models`
- **Header:** `X-Internal-Secret: <shared-secret>`

## Sprint 3 rollout notes

- **Queue backend** (env `QUEUE_BACKEND`):
  - `background` (default, in-process; backward-compatible)
  - `arq` (Redis worker, scale ngang)
- **Job state store** (env `JOB_STORE_BACKEND`):
  - `memory` (default, in-process dict)
  - `redis` (share giữa API + worker process). **Bắt buộc khi `QUEUE_BACKEND=arq`**
- **Object storage** (env `OBJECT_STORAGE_ENABLED`):
  - `false` -> `file://...` URL (dev/test)
  - `true` -> MinIO presigned HTTP URL (prod)

## Sprint 3.1 changes (additive only)

- `WebhookPayload` adds **optional** `originalVideoHash` (SHA-256 hex). BE
  parsers ignore unknown fields by default → no breaking change.
- HealthScore now penalises -30 points when Smart Stop did not trigger
  (video không ổn định → bằng chứng kém tin cậy).
- New `RedisJobStore` so `ai-api` and `ai-worker` share state correctly when
  `QUEUE_BACKEND=arq`.

