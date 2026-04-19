package com.aquatrade.core.dto;

import com.aquatrade.core.domain.enums.UserStatus;
import com.aquatrade.core.domain.enums.ListingStatus;
import com.aquatrade.core.domain.enums.DisputeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Các DTO dùng cho Admin Panel.
 */
public class AdminDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ModerateListingRequest {
        private ListingStatus moderationStatus; // AVAILABLE or REJECTED
        private String moderationNote; // required when REJECTED
    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ToggleUserStatusRequest {
        private UserStatus newStatus; // ACTIVE, INACTIVE, PENDING
    }
@Data
@AllArgsConstructor
@NoArgsConstructor
public static class UserSummary {
    private UUID id;
    private String fullName;
    private String email;
    private UserStatus status;
    private LocalDateTime createdAt;
}


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderSummary {
        private UUID id;
        private String buyerName;
        private String sellerName;
        private ListingStatus listingStatus;
        private com.aquatrade.core.domain.enums.OrderStatus orderStatus;
        private BigDecimal totalPrice;
        private LocalDateTime createdAt;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DisputeSummary {
        private UUID id;
        private String orderId;
        private String complainerName;
        private DisputeStatus status;
        private LocalDateTime createdAt;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TreasurySummary {
        private BigDecimal totalRevenue; // 5% commission đã thu được
    }
}
