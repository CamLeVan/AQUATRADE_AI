# 🐟 AquaTrade AI - Sàn Thương Mại Điện Tử Cá Giống
*Kiến trúc Microservices tích hợp Trí tuệ Nhân tạo (YOLOv8) để minh bạch hóa và tự động đếm số lượng định lượng trong giao dịch thủy sản thượng nguồn.*

## 📂 Phân hệ Mã nguồn (Microservices)
Dự án được triển khai thành 3 thư mục độc lập:
- 🖥️ **[web-frontend](./web-frontend)**: Giao diện người dùng (ReactJS / Vite / TailwindCSS).
- ⚙️ **[core-backend](./core-backend)**: Máy chủ quản lý đơn hàng & Ví tự động Escrow (Java Spring Boot / PostgreSQL).
- 🧠 **[ai-service](./ai-service)**: Máy chủ Xử lý Thị giác Máy tính đếm cá giống (Python FastAPI / YOLOv8).

## 📚 Bảng tra cứu Tài liệu (Documentation)
Để không gian mã nguồn gọn gàng, toàn bộ các file `.md` đã được dọn dẹp và phân loại vào mục `docs/`.

**1. Phân tích Thiết kế & Kiến trúc**
- [Đề cương Đồ án Tổng quan](./docs/0_DE_CUONG_AQUATRADE_AI.md)
- [Thiết kế Cơ sở dữ liệu (Database ERD)](./docs/1_DATABASE_DESIGN.md)
- [Sơ đồ Luồng Tuần tự & Usecase (Chương 2)](./docs/4_CHAPTER_2_SYSTEM_DESIGN.md)
- [Cơ chế Giao tiếp Hệ thống (API Contracts)](./docs/3_API_CONTRACTS.md)

**2. Hướng dẫn & Tiêu chuẩn Team**
- [Nhiệm vụ lập trình Sprint 1](./docs/TASK_LIST_SPRINT_1.md)
- [Luật sử dụng Git cho Team 3 người](./docs/TEAM_GUIDE_GIT.md)
- [Quy chuẩn định dạng Code chung](./.agents/skills/aquatrade_coding_standards.md)
- [Cẩm nang Best Practices cho Backend Spring Boot](./.agents/skills/spring_boot_best_practices.md)