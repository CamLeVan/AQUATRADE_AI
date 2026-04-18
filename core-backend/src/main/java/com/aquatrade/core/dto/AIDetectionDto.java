package com.aquatrade.core.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO cho kết quả kiểm định AI — nhận qua WebSocket.
 * Kênh: /ws/orders/{orderId}/count-ai
 */
public class AIDetectionDto {

    /**
     * Payload trung gian — FE nhận liên tục mỗi frame để cập nhật real-time.
     */
    @Data
    @Builder
    public static class ProcessingPayload {
        private String status;     // luôn = "PROCESSING"
        private String orderId;
        private Integer currentCount; // Số con đang đếm tạm thời (chưa chốt)
    }

    /**
     * Payload cuối cùng — BE tự ngắt WebSocket sau khi gửi.
     */
    @Data
    @Builder
    public static class DonePayload {
        private String status;     // luôn = "DONE"
        private String orderId;
        private Integer aiFishCount;       // Số con chính thức (kết quả 95th Percentile)
        private BigDecimal confidenceScore; // Độ chính xác (0.00 → 1.00)
        private String aiImageUrl;          // Link ảnh có bounding box
        private String proofHash;           // SHA-256 chống giả mạo
        private BigDecimal gpsLatitude;
        private BigDecimal gpsLongitude;

        // 🔜 Mở rộng sau khi AI model hỗ trợ
        private BigDecimal averageSize;     // Kích thước trung bình (cm)
        private Integer impuritiesCount;    // Số tạp chất phát hiện
        private Integer colorUniformity;    // Độ đồng nhất màu (%)
        private String aiNotes;             // Cảnh báo từ AI

        private LocalDateTime createdAt;
    }
}
