package com.aquatrade.core.domain.enums;

public enum OrderStatus {
    ESCROW_LOCKED,         // Tiền đã khóa trong ví hệ thống (Ký quỹ)
    PREPARING,             // Người bán đang chuẩn bị hàng (múc cá, đóng thùng)
    COUNTING_AI,           // Đang thực hiện quay video và đợi AI đếm số lượng
    AI_VERIFIED,           // AI đã xử lý xong và có kết quả giám định
    READY_TO_PAYOUT,       // Hai bên đã đối soát xong, sẵn sàng giải ngân
    COMPLETED,             // Đơn hàng hoàn tất, tiền đã về túi người bán
    DISPUTED,              // Đơn hàng xảy ra tranh chấp (sai lệch số lượng > 10%)
    CANCELLED              // Đơn hàng đã bị hủy
}
