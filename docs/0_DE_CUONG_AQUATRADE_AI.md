TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN
VÀ TRUYỀN THÔNG VIỆT- HÀN
KHOA KHOA HỌC MÁY TÍNH


CỘNG HOÀ XÃ HỘI CHỦ NGHĨA 
VIỆT NAM
                   Độc lập - Tự do - Hạnh phúc

Đà Nẵng, ngày 14  tháng 3  năm 2026


ĐỀ CƯƠNG ĐỒ ÁN CHUYÊN NGÀNH 1
Thông tin người thực hiện:
Họ và tên sinh viên: Lê Văn Cảm
Ngành: Công nghệ thông tin
Điện thoại: 0344 574 050
MSSV: 23IT.B016
Lớp: 23SE5
Email: camlv.23itb@vku.udn.vn
Họ và tên sinh viên: Lý Thành Long
Ngành: Công nghệ thông tin
Điện thoại: 0888 354 357
MSSV: 23IT045
Lớp: 23SE1
Email: longlt.23it@vku.udn.vn
Họ và tên sinh viên: Phạm Mai Gia Huy
Ngành: Công nghệ thông tin
Điện thoại: 0762 512 544
MSSV: 23IT.B081
Lớp: 23SE5
Email:huypmg.23itb@vku.udn.vn
Giảng viên hướng dẫn: ThS. Lê Thành Công




Tên đồ án: PHÁT TRIỂN SÀN THƯƠNG MẠI ĐIỆN TỬ CÁ GIỐNG AQUATRADE DỰA TRÊN KIẾN TRÚC MICROSERVICES TÍCH HỢP AI (YOLOv8) 
Mô tả:
Tổng quan đề tài
Trong cấu trúc chuỗi giá trị nông nghiệp, ngành thủy sản đóng vai trò trụ cột nhưng đang bị kìm hãm bởi "điểm nghẽn" tại thị trường thượng nguồn: con giống. Rào cản lớn nhất là sự bất cân xứng thông tin giữa người nuôi và trại giống. Phương pháp kiểm đếm thủ công gây sai số từ 10-20% và làm cá chết do stress. Các nền tảng TMĐT hiện nay thiếu công cụ xác thực định lượng minh bạch. 
Xuất phát từ thực tế đó, dự án "AquaTrade AI" được đề xuất nhằm xây dựng mô hình Managed Marketplace (Sàn có quản lý) thiết lập "Kiến trúc 3 Lớp Niềm Tin". Hệ thống áp dụng nhận diện hình ảnh (YOLOv8) để cấp "Biên bản nghiệm thu điện tử", kết hợp giao thức gọi Video P2P (WebRTC) và thanh toán tạm giữ để số hóa hoàn toàn giao dịch thủy sản.
Mục tiêu dự kiến
Thiết lập kiến trúc "3 Lớp Niềm Tin": Chuyển hóa đánh giá định tính (xem cá bơi lội qua video) thành định lượng (AI chụp ảnh đếm tự động) với Bằng chứng số bảo mật bất biến.
Giải quyết rào cản phần cứng bằng Server-Assisted AI: Đưa các tác vụ xử lý đồ họa AI nặng nề lên máy chủ (FastAPI), giúp thiết bị điện thoại cấu hình thấp của nông dân vẫn có thể đếm cá nhanh chóng, độ chính xác >95%.
Giao tiếp thời gian thực: Tích hợp WebRTC cung cấp tính năng Video Call trực tiếp giữa người mua và bán với độ trễ cực thấp.
Giao dịch an toàn và tự động hóa: Quản lý thanh toán qua cơ chế Ví tạm giữ (Escrow) bằng Java Spring Boot và hệ thống tự động hóa n8n xử lý tranh chấp hiệu quả.
Kết quả đạt được
Hệ thống Web App Microservices hoàn chỉnh:* Gồm Frontend (ReactJS), Core Backend (Java Spring Boot), và AI Service (Python FastAPI) hoạt động độc lập và liên kết chặt chẽ.
Lưu trữ hồ sơ nghiệm thu điện tử pháp lý: Tự động sinh biên bản gồm ảnh chụp AI có bounding box, thời gian (timestamp), tọa độ GPS, và mã băm Hash chống giả mạo.
Giải bài toán đếm cá giống chồng lấp: Thuật toán dựa trên 95th Percentile kết hợp YOLOv8 loại bỏ nhiễu và đếm chính xác số lượng trong môi trường thực.
Giao diện tối ưu cho 3 Role Users: Buyer (Người mua), Seller (Người bán), và Admin (Quản trị viên / Trọng tài phân xử).
Nội dung thực hiện: 
Nghiên cứu và phân tích yêu cầu
Phân tích bài toán "bất cân xứng thông tin" và nghiệp vụ của mô hình Escrow.
Nghiên cứu kiến trúc Microservices và cơ chế mạng lai (Hybrid Network: WebRTC kết nối P2P và REST API gửi xử lý ảnh tập trung).
Lựa chọn giải pháp kỹ thuật: ReactJS/Vite (UI), Java Spring Boot (Xử lý giao dịch ACID), FastAPI + YOLOv8 (Nhận diện), PostgreSQL (Lưu trữ).
Thiết kế hệ thống
Thiết kế trải nghiệm UX/UI: Trang chủ, Phòng giao dịch AI (Video Call + Nút chụp đếm), Bảng điều khiển quản lý đơn hàng.
Thiết kế Cơ sở dữ liệu: Các thực thể Users, Listings (Sản phẩm), Orders, Transactions (Ví Escrow), Digital_Proofs (Bằng chứng số).
Thiết kế kiến trúc mạng lưới và luồng Dữ liệu: Giao tiếp giữa React -> Spring Boot -> FastAPI thông qua REST API và WebSocket.
Dự kiến nội dung đồ án
CHƯƠNG 1: CƠ SỞ LÝ THUYẾT
1.1. Tổng quan về Ngành Thủy sản và Thương mại Điện tử
1.1.1. Thực trạng, điểm nghẽn "bất cân xứng thông tin"
1.1.2. Mô hình Managed Marketplace và cơ chế Escrow
1.2. Công nghệ phát triển Hệ thống lõi (Core Backend)
1.2.1. Framework Java Spring Boot
1.2.2. Cơ sở dữ liệu PostgreSQL và tính chất ACID
1.2.3. Bảo mật JWT Token và Mã băm (Hash)
1.3. Công nghệ Trí tuệ Nhân tạo và Xử lý Thị giác Máy tính
1.3.1. Kiến trúc Server-Assisted AI
1.3.2. Mạng nơ-ron tích chập và mô hình YOLOv8
1.3.3. Framework FastAPI (Python)
1.4. Công nghệ phát triển Giao diện và Đa phương tiện
1.4.1. Framework ReactJS, Vite và TailwindCSS
1.4.2. Giao thức Video Peer-to-Peer (WebRTC) và WebSocket
CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
2.1. Phân tích yêu cầu
2.1.1. Yêu cầu chức năng 
2.1.2. Yêu cầu phi chức năng 
2.2. Tổng quan các tác nhân trong hệ thống
2.2.1. Người mua
2.2.2. Người bán
2.2.3. Quản trị viên
2.3. Đặc tả quy trình (Quy trình chuẩn SOP khay nghiệm thu)
2.4. Danh sách và Sơ đồ Usecase
2.5. Biểu đồ Tuần tự (Sequence Diagram) luồng giao dịch số
2.6. Biểu đồ Lớp (Class Diagram) và Thiết kế CSDL (ERD Diagram)
2.7. Sequence Diagram
2.8. Communication Diagram
2.9. Cơ sở dữ liệu
2.10. Sơ đồ Kiến trúc Hệ thống đa tầng (Microservices Deployment Diagram)
CHƯƠNG 3: CÀI ĐẶT, KIỂM THỬ VÀ KẾT QUẢ
3.1. Môi trường và công cụ phát triển
3.2. Kết quả xây dựng Mô hình Nhận diện Cá giống 
3.3. Giao diện thực tế và Kết quả đạt được theo tác nhân
3.4. Kiểm thử tích hợp hệ thống
3.5. Kết quả phân tích rủi ro và an toàn dữ liệu
KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
A. Kết luận
B. Hướng phát triển
TÀI LIỆU THAM KHẢO

Kế hoạch thực hiện:
Thời gian
Nội dung thực hiện
Người thực hiện
Tuần 1
(21/03/2026 – 28/03/2026)
- Phân tích bài toán, xác định yêu cầu hệ thống và luồng giao dịch.
-  Khởi tạo kiến trúc Git Monorepo cho 3 phân hệ.
- Triển khai mô hình YOLOv8 lên server FastAPI độc lập.
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy
Tuần 2
(21/03/2026 – 28/03/2026)
- Xây dựng cơ sở dữ liệu PostgreSQL
- Cấu hình khung dự án (Spring Boot) và xác thực JWT.
- Phác thảo giao diện cơ bản
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy
Tuần 3
(29/03/2026 – 05/04/2026)
- Hoàn thiện Module Quản lý tin đăng (Listings) và Tài khoản ở Backend. 
- Code Giao diện Homepage, Đăng nhập/Đăng ký ReactJS.
- Tối ưu thuật toán đếm chuỗi thời gian thực (Dynamic Streaming) trên FastAPI với YOLOv8 + Kalman.
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy
Tuần 4
(06/04/2026 – 13/04/2026)
- Cài đặt cơ chế Video Call Peer-to-Peer (WebRTC) ở Frontend.
- Viết logic Escrow_Locked cho đơn hàng ở Backend Java.
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy
Tuần 5
(14/04/2026 – 21/04/2026)
- Tích hợp Core Tính năng: Nút "Chụp ảnh" trên trình duyệt, nén gửi về máy chủ Java, Java gọi API sang Python để nhận kết quả.
- Thiết kế chức năng sinh "Biên bản nghiệm thu điện tử".
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy
Tuần 6
(22/04/2026 – 29/04/2026)
- Cấu hình n8n kết nối Backend để xử lý tranh chấp (Arbitration) bắn thông báo qua Telegram.
-  Tích hợp WebSocket báo kết quả thời gian thực về Frontend.
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy
Tuần 7
(30/04/2026 – 06/05/2026)
- Hoàn thiện giao diện, làm mịn trải nghiệm (UI/UX) cho cả 3 Role.
- Khảo sát và chạy thực địa AI trên khay nghiệm thu chuẩn.
- Kiểm thử chức năng của hệ thống
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy
Tuần 8
(07/05/2026 – 14/05/2026)
- Rà soát bảo mật truy cập dữ liệu.
- Viết tài liệu hướng dẫn sử dụng
- Hoàn thành báo cáo đồ án
- Chuẩn bị bài thuyết trình
- Lê Văn Cảm
- Lý Thành Long
- Phạm Mai Gia Huy


Ngày 14 tháng 3  năm 2026
Giảng viên hướng dẫn
(ký và ghi rõ họ tên)




Ngày 14 tháng 3 năm 2026
Sinh viên thực hiện
(ký và ghi rõ họ tên)




