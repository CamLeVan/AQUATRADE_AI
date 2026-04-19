package com.aquatrade.core.dto;

import com.aquatrade.core.domain.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDto {

    @Data
    public static class CreateOrderRequest {
        @NotBlank(message = "Thiếu Listing ID")
        private String listingId;

        @NotBlank(message = "Thiếu địa chỉ giao hàng")
        private String shippingAddress;

        @jakarta.validation.constraints.NotNull(message = "Phải nhập số lượng muốn mua")
        @jakarta.validation.constraints.Positive(message = "Số lượng mua phải lớn hơn 0")
        private Integer quantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderResponse {
        private String id;
        private String listingTitle;
        private String buyerName;
        private String sellerName;
        private BigDecimal unitPriceAtPurchase;

        // [THỐNG NHẤT v2] Số CON cá — không phải kg. FE gốc gọi là "weight" → đổi thành finalQuantity
        private Integer finalQuantity;
        private BigDecimal totalPrice;
        private String shippingAddress;
        private OrderStatus status;
        private LocalDateTime createdAt;

        // [FIX] Thay Object → DigitalProofSummary để FE truy cập trực tiếp các field
        // aiMatchScore → digitalProof.confidenceScore
        // evidenceUrl  → digitalProof.aiImageUrl
        private DigitalProofSummary digitalProof;
    }

    /**
     * Bản tóm tắt bằng chứng số nhúng vào OrderResponse.
     * Toàn bộ chi tiết (GPS, hash...) trả về qua WebSocket /ws/orders/{id}/count-ai khi DONE.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DigitalProofSummary {
        private String id;
        private Integer aiFishCount;
        private BigDecimal confidenceScore; // 0.00 → 1.00
        private String aiImageUrl;          // Link ảnh bounding box (bằng chứng)
        private String proofHash;           // SHA-256 chống giả mạo (hiển thị 8 ký tự đầu)
        private LocalDateTime createdAt;
    }
}
