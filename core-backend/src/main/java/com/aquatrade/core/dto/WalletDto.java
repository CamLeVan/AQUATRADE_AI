package com.aquatrade.core.dto;

import com.aquatrade.core.domain.enums.TransactionType;
import com.aquatrade.core.domain.enums.TransactionStatus;
import com.aquatrade.core.domain.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WalletDto {

    @Data
    @Builder
    public static class DepositRequest {
        private BigDecimal amount;
        private PaymentMethod paymentMethod;
    }
    private BigDecimal walletBalance;
    private String userLevel;
    private List<TransactionDto> recentTransactions;

    @Data
    @Builder
    public static class TransactionDto {
        private String id;
        private String orderId;
        private BigDecimal amount;
        private BigDecimal postBalance;
        private TransactionType type;
        private PaymentMethod paymentMethod;
        private TransactionStatus status;
        private LocalDateTime createdAt;
    }
}
