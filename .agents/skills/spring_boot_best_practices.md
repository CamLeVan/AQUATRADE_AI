---
name: Spring Boot Best Practices
description: Cẩm nang tinh hoa dự án Spring Boot, chứa các kỹ thuật, thủ thuật và tư duy gỡ rối (troubleshooting) chuẩn Enterprise.
---


## 1. Thiết kế Entity chuẩn Hibernate / JPA

### 1.1. Kế thừa `BaseObject`
Thay vì khai báo lặp đi lặp lại các trường rác (Id, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) ở mọi Entity, việc sử dụng cơ chế kế thừa `BaseObject` giúp code cực kỳ gọn gàng.
```java
@MappedSuperclass
public abstract class BaseObject { 
    @Id
    @GeneratedValue... 
}

@Entity
@Table(name = "tbl_employee")
public class Employee extends BaseObject { ... }
```

### 1.2. Chiến thuật Fetching (Lazy Load)
Đây là "vũ khí tối thượng" chống lại lỗi **N+1 Query** khét tiếng trong JPA:
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "province_id")
private Province province;
```
> [!TIP]
> Luôn luôn đặt `fetch = FetchType.LAZY` cho các config `@ManyToOne` và `@OneToOne`. Chỉ Load data khi thực sự gọi đến thuộc tính đó (Proxy Object).

### 1.3. Thủ thuật xử lý Set/List để không mất Track của Hibernate
Khi bạn có Relationship OneToMany, việc gọi `this.certificates = newCertificates;` sẽ làm rớt Proxy List của Hibernate, sinh ra lỗi `A collection with cascade="all-delete-orphan" was no longer referenced`. Bạn đã fix điều này cực đỉnh bằng cách `clear()` và `addAll()`:
```java
public void setCertificates(List<EmployeeCertificate> certificates) {
    if (this.certificates == null) {
        this.certificates = certificates;
    } else {
        this.certificates.clear(); // Xóa sạch item cũ nhưng vẫn giữ vỏ Proxy của Hibernate
        if (certificates != null) {
            this.certificates.addAll(certificates); // Thêm phần tử mới nạp vào
        }
    }
}
```

---

## 2. API Response Wrapper & Global Exception Handler

### 2.1. Chuẩn hóa Output API
Thay vì trả về cấu trúc lộn xộn, mọi Response từ RestController đều bọc trong `ApiResponse<T>`, chứa thống nhất mã Code, Message và Dữ liệu trả về (Data). Giúp Front-end dễ xử lý logic hiện thông báo.

### 2.2. Bắt lỗi tập trung (@RestControllerAdvice)
Thay vì code Try-Catch lắt nhắt ở mọi hàm Controler, bạn chặn lỗi vòng ngoài cùng với file `GlobalExceptionHandler`. Code của bạn đã convert mượt mà các lỗi từ `@Valid` annotaion thành String báo lỗi trực quan:
```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    // Duyệt danh sách FieldError
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
        errors.add(error.getDefaultMessage());
    }
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
}
```

---

## 3. Kiến trúc Validation Nghiệp vụ (Business Rules)

Thay vì gộp hết code validate vào Service làm Service phình to cỡ nghìn dòng, bạn đã tách hẳn ra một Class `@Component` riêng là `EmployeeValidator.java`. 

### 3.1. Các Business Rule nổi bật đã xử lý:
1. **Kiểm tra hợp lệ ID hệ thống cha - con**: Check Huyện phải thuộc Tỉnh, Xã phải thuộc Huyện (Giảm rớt data rác).
2. **Kiểm tra trùng lặp trong List Request ngay tại Runtime**: Sử dụng thuật toán `HashMap` để thiết lập Composite Key (`cId_pId` - Trùng bằng + Trùng tỉnh).
```java
String localKey = cId.toString() + "_" + pId.toString();
if (requestDuplicatesMap.containsKey(localKey)) {
    return new ApiResponse<>(null, "ERR_CERT_03", "Trùng lặp dữ liệu...");
}
requestDuplicatesMap.put(localKey, 1);
```
3. **Logic tính toán đếm cấp độ Global Constraint**: 
Kiểm tra tổng số lượng văn bằng đang Active trong DB (`dbGlobalCount`) cộng với số lượng định thêm mới (`requestCount`). Nếu > 3 thì chặn. Đây là một logic siêu khó trong các phần mềm thi tuyển / hồ sơ nhân sự thật sự.

---

## 4. Nghệ thuật Xử lý File Excel khối lượng lớn

Đây là chức năng đỉnh cao nhất của dự án. Bình thường, với 10,000 dòng Excel, nếu for-loop và Query DB bằng JPA, server có thể gãy (Crash). Bạn đã làm quy trình chuẩn Enterprise:

1. **Caching Validation (Time Complexity: $O(1)$)**
Load tất, nhét vào bộ nhớ đệm `Map` và `Set` trước khi start loop:
```java
List<Province> provinces = provinceRepository.findAll();
Map<String, Province> provinceMap = new HashMap<>();
// Lưu vào Map để O(1) Fetch time, bỏ qua DB query
for (Province p : provinces) { 
    if (p.getCode() != null) provinceMap.put(p.getCode().toLowerCase(), p); 
}
```

2. **Dừng loop khi rớt dòng trống liên tiếp (Empty Row Break):**
Việc dùng thuật toán check Cell Type BLANK. Nếu dòng có 9 ô trống liên tiếp, Auto bỏ qua để tránh rác sinh ra bởi thuật toán Apache POI.

3. **Cơ chế Batch Storage:**
Tạo list `validEmployeesToSave.add(emp)` và saveAll đồng loạt cuối tác vụ để tránh quá tải kết nối connection DB (I/O).

---

## 5. Kỹ thuật Thao tác Dữ liệu & Phân trang

Trong Service `searchByPage`, thay vì lệ thuộc JPA Repository cơ bản, bạn tự String-append JPQL Query:

> Dùng 2 câu Query song song:
> - `sqlCount`: Để tính tổng số record thoả mãn điều kiện Filter -> ra cục `count`.
> - `sql`: Để load ra DTO trực tiếp thông qua lệnh Constructor Expression:
> `select new com.globits.da.dto.EmployeeDto(entity) from Employee as entity`
> - `q.setFirstResult(startPosition)` & `q.setMaxResults(pageSize)` là 2 keyword đắt giá giới hạn số bản ghi móc từ Database thay vì Load toàn bộ và cắt tại Memory.

---

## 6. Lộ trình Nâng cấp lên Chuẩn Enterprise Toàn diện
Để Base Project này thực sự vươn tầm "Hoàn hảo 100%" làm Core Backend cho bất kỳ công ty nào, hệ thống cần bổ sung thêm các mảnh ghép cực kỳ quan trọng sau:
<!-- 
### 6.1. Quản lý phiên bản Database (Flyway / Liquibase)
> [!WARNING]
> Hiện tại dự án phụ thuộc vào lệnh `spring.jpa.hibernate.ddl-auto=update`. Ở môi trường Production thực tế, lệnh này siêu nguy hiểm (có thể vô tình làm drop cột, thay đổi kiểu dữ liệu gây lỗi).

**Giải pháp**: Nhúng thư viện **Flyway**. Thay vì để Hibernate tự sinh bảng CSDL, bạn sẽ viết các file SQL script (VD: `V1__init_db.sql`, `V2__add_index.sql`). Spring Boot sẽ tự động track lịch sử chạy file DB vào bảng `flyway_schema_history`. Từ đó quản lý đồng bộ DB giữa toàn bộ team dev. -->

### 6.2. Thay thế System.out.println bằng Logging (SLF4J & Logback)
Ở file `GlobalExceptionHandler.java`, bạn có dòng lệnh `System.out.println("Tổng hợp lỗi...")`. Cách này chỉ chạy in ra cửa sổ debug tạm thời. Nếu code deploy lên server Linux, bạn sẽ mất hoàn toàn dấu vết các lỗi này.
> [!TIP]
> **Giải pháp**: Tích hợp Lombok `@Slf4j`. 
> Lúc này bạn dùng `log.error("Chi tiết hệ thống lỗi: {}", errorMessage)`. Spring framework sẽ gắn thêm Timestamp (Ngày giờ), Thread-ID và tự động đẩy ra file text `.log` chuyên dụng theo ngày để lưu trữ bằng Logback.

### 6.3. Tự động Map DTO với thư viện MapStruct
Ở code hiện tại, bạn map dữ liệu bằng tay thông qua Constructor `new EmployeeDto(entity)` hoặc các hàm gán `entity.setName(dto.getName())`. Tuy chạy đúng, nhưng nếu Entity có tầm khoảng trăm field thì code sẽ rất cồng kềnh và dễ có bug do quên gán trường.

**Giải pháp**: Dùng thư viện **MapStruct**. Nó sẽ thay bạn sinh code gán 2 chiều (Entity <-> DTO) bằng Auto Generation lúc compile cực kỳ nhanh, bỏ qua reflection chậm chạp như ModelMapper. File config chỉ vài dòng Interface.

### 6.4. Redis Caching cho Danh mục dùng chung
Các Table như **Province (Tỉnh), District (Huyện), Commune (Xã)** là dữ liệu tĩnh. Thế nhưng trong quy trình tạo nhân viên mới hoặc import/export, ta vẫn phải đụng vào CSDL làm tốn connection.

**Giải pháp**: Gắn Annotion `@Cacheable` cho các hàm lấy danh mục này (kết hợp **Spring Cache + Redis**). Kết quả từ DB sẽ ghi vào bộ nhớ đệm RAM. Lần thứ 2 trở đi, API sẽ móc data từ RAM về với tốc độ chưa tới 1ms thay vì tốn công chờ phản hồi từ DB.

### 6.5. Tích hợp Spring Security & JWT Token
Đây là yếu tố "bắt buộc". API hiện tại đang mở toang, tức là ai cũng có thể vào update, xoá nhân viên.
**Giải pháp**: Tích hợp bảo mật 2 rào cản:
1. **Authentication**: Phát hành cấu trúc đăng nhập sinh ra JWT Token (JSON Web Token). Bất kỳ Request nào gọi vào nhóm API cũng chèn Token này lên vòng Header.
2. **Authorization**: Cấu hình phân quyền `@PreAuthorize("hasRole('ADMIN')")`. Chỉ Role Admin mới được phép gọi hàm `importExcel()`.

### 6.6. Swagger / OpenAPI 3.0 Documentation
Làm sao để team Frontend biết API có truyền bao nhiêu params vào?

**Giải pháp**: Cài đặt dependency `springdoc-openapi-ui`. Khi chạy Server, Spring Boot sẽ tự động gen ra một trang Web UI liệt kê rõ từng endpoint, danh sách params, error status code rất đẹp. Nhờ Web UI này, Frontend Engineer có view test API trực tiếp không cần rườm rà qua thiết lập ở Postman nữa.

### 6.7. Tách File Cấu Hình (Environment Profiles)
Base project sẽ cần 3 loại file config là `application-dev.yml` (cho lúc code local), `application-test.yml` (dữ liệu mock lên server test) và `application-prod.yml` (Chèn credentials bảo mật để deploy). Việc chuyển đổi chỉ bằng 1 câu lệnh `spring.profiles.active`.

---
**Tổng kết:** Dự án gốc mà bạn tự xây này đã sở hữu độ sạch sẽ về Logic, Entity, và Exception. Việc ốp thêm các bộ thư viện từ Phần 6 vào dự án sẽ giúp nó chuẩn mực để tham gia thực chiến trong mọi bài test năng lực vào các tập đoàn lớn! Mọi thứ đều đã có nền móng vô cùng bền vững.
