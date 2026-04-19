# Hướng Dẫn Cài Đặt và Cấu Hình PostgreSQL Cơ Bản (Cho Backend AquaTrade AI)

Dự án AquaTrade AI sử dụng PostgreSQL làm hệ quản trị Cơ sở dữ liệu chính. Nhờ vào việc dùng Spring Data JPA với `ddl-auto=update`, backend sẽ **tự động** khởi tạo tất cả các bảng (tables) nếu bạn thiết lập Database PostgreSQL đúng cách.

Dưới đây là các bước quy chuẩn để bạn thiết lập và kích hoạt chạy backend hoàn hảo.

---

## Bước 1: Tải và Cài Đặt PostgreSQL
1. Truy cập [Trang Chủ Tải PostgreSQL (dành cho Windows)](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Tải phiên bản mới nhất (khuyến nghị `PostgreSQL 15` hoặc `16`).
3. Mở file `.exe` vừa tải về để cài đặt.
4. **LƯU Ý QUAN TRỌNG KHI CÀI ĐẶT:**
   - Khi được hỏi **Password**, hãy nhập: `123456` *(Đây là password mặc định được gắn sẵn trong file cấu hình `application.properties` của ứng dụng)*.
   - Để nguyên **Port mặc định** là `5432`.
   - Chọn cài đặt thêm công cụ **pgAdmin 4** (nó thường tích hợp sẵn trong trình cài đặt). Đây là công cụ Giao diện Đồ hoạ để nhìn vào Database.

---

## Bước 2: Tạo Database cho Dự Án

Sau khi cài xong, bạn cần tạo một Database rỗng để Spring Boot gắn các Table vào.

### CÁCH 1: DÙNG GIAO DIỆN PGADMIN 4 (QUEN THUỘC)
1. Mở **pgAdmin 4** lên từ thanh tìm kiếm Windows. Nó sẽ mở ra trên trình duyệt Web.
2. Nhập master password (là `123456`) để đăng nhập.
3. Nhìn thanh Menu bên trái (`Browser`), ấn xổ `Servers -> PostgreSQL 15...` sẽ hiện ra mục **Databases**.
4. Click chuột phải vào **Databases** -> Chọn **Create** -> **Database...**
5. Ở ô **Database**, nhập đúng tên sau (chữ thường): `aquatrade_db`
6. Nhấn **Save**.

### CÁCH 2: DÙNG DÒNG LỆNH (SQL SHELL/psql)
1. Tìm và mở `SQL Shell (psql)` trên máy tính.
2. Ấn Enter liên tục cho đến khi nó hỏi `Password for user postgres:`, thì nhập `123456` và ấn Enter (lúc gõ sẽ không hiện dấu sao đâu, cứ gõ đúng là được).
3. Gõ lệnh sau để tạo DB mới:
   ```sql
   CREATE DATABASE aquatrade_db;
   ```
4. Thoát ra: `\q`

---

## Bước 3: Chạy & Xác nhận Cơ sở dữ liệu trong Spring Boot
Hiện tại, file cấu hình kết nối DB đã nằm sẵn tại đường dẫn: 
`core-backend/src/main/resources/application.properties` với nội dung như sau:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/aquatrade_db
spring.datasource.username=postgres
spring.datasource.password=123456
spring.jpa.hibernate.ddl-auto=update
```

**Khởi chạy dự án:**
Mở Terminal, trỏ vào đường dẫn chứa backend:
```bash
cd core-backend
mvn clean compile -DskipTests
mvn spring-boot:run
```

**Dấu hiệu thành công:** 
Tại cửa sổ log của Spring Boot, nếu bạn nhìn thấy các dòng chữ như `Hibernate: create table users (...)`, `Hibernate: create table orders (...)` có nghĩa là Spring Boot đã liên kết với PostgreSQL thành công và đang **tự động sinh CSDL tự động hóa** dựa vào các domain Object mình đã viết.
