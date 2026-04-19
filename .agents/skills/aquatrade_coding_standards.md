---
name: AquaTrade AI Coding Standards
description: Quy chuẩn viết code chung cho toàn bộ dự án AquaTrade AI (Frontend, Backend, AI). Trợ lý AI khi code dự án này MẶC ĐỊNH phải tuân theo chuẩn này.
---

# AQUATRADE AI - TEAM CODING STANDARDS (SKILL FILE)

File này quy định các tiêu chuẩn bắt buộc khi thực hiện lập trình cho dự án "AquaTrade AI", đảm bảo tính thống nhất trong môi trường Microservices Monorepo.

## 1. QUY CHUẨN CHUNG (GENERAL RULES)
- **Ngôn ngữ cam kết:** Mọi commmit message phải sử dụng định dạng chuẩn (Conventional Commits): `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`.
- **Tên biến, hàm:** 
  - `camelCase` cho biến, hàm (Java, JavaScript/TypeScript).
  - `snake_case` cho biến, hàm trong Python, PostgreSQL.
  - `PascalCase` cho tên Class, Interface, Component React.
  - `UPPER_SNAKE_CASE` cho hằng số (Constants).

## 2. CHUẨN BACKEND (JAVA SPRING BOOT)
*Thư mục: `core-backend`*
- **Kiến trúc vạn năng:** Controller -> Service -> Repository -> Entity. KHÔNG viết logic nghiệp vụ (business logic) ở trong Controller.
- **DTO (Data Transfer Object):** Bắt buộc sử dụng DTO để trao đổi dữ liệu với Frontend. Không trực tiếp trả về Entity ra API để tránh lộ dữ liệu nhạy cảm (như `password_hash`). Lớp Mapping dùng MapStruct hoặc thủ công.
- **Response Wrapper:** Mọi API phải trả về dữ liệu được gói trong một class chuẩn chung `ApiResponse<T>`:
  ```json
  {
    "status": "success/error",
    "message": "Nội dung thông báo",
    "data": { ... }
  }
  ```
- **Xử lý ngoại lệ (Exception Handling):** Dùng `@RestControllerAdvice` để bắt các Exception (như văng DataNotFoundException thì trả về HTTP 404 chuẩn API).

## 3. CHUẨN FRONTEND (REACTJS + VITE)
*Thư mục: `web-frontend`*
- **Functional Components:** 100% sử dụng React Functional Component và Hooks (`useState`, `useEffect`). Không dùng Class Component.
- **CSS:** Sử dụng hoàn toàn **TailwindCSS** thông qua thuộc tính `className`. Không viết CSS file riêng hoặc Inline Styles trừ khi cần tính toán vị trí động. Ráp giao diện phải tuân thủ responsive (mobile-first).
- **Gọi API:** Sử dụng thư viện `axios` có cài đặt `Interceptors` để tự động đính kèm JWT Token vào Header của mọi Request.
- **Cấu trúc thư mục:**
  - `/src/components`: Component dùng chung (Button, Modal, Input).
  - `/src/pages`: Component là một màn hình trọn vẹn (Login, Room, Homepage).
  - `/src/services`: Chứa file định nghĩa API gọi đến Backend.

## 4. CHUẨN AI SERVICE (PYTHON FASTAPI)
*Thư mục: `ai-service`*
- **Typing:** Bắt buộc sử dụng Type Hints của Python (VD: `def process(image: bytes) -> dict:`).
- **Pydantic Models:** Request và Response phải được định nghĩa bằng thư viện Pydantic.
- **AI Model Performance:** Mô hình phân tích ảnh tải sẵn trong bộ nhớ RAM lúc khởi chạy server (Global variable), KHÔNG nạp lại mô hình `YOLOv8` (load model) trong mỗi lần gọi API để tránh Timeout (delay).

## 5. BẢO MẬT & API
- **Không lưu credentials dạng Plantext:** Token, Secret keys, Database Password TẤT CẢ phải cấu hình qua file `.env` hoặc `application.properties` và bị loại khỏi tính năng theo dõi của Git (`.gitignore`).
- Các đường dẫn API Backend bắt buộc prefix dạng `/api/v1/`.
