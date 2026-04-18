package com.aquatrade.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

import com.aquatrade.core.domain.base.BaseObject;
import com.aquatrade.core.domain.enums.PaymentMethod;
import com.aquatrade.core.domain.enums.TransactionStatus;
import com.aquatrade.core.domain.enums.TransactionType;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction extends BaseObject {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order; // Nullable đối với lệnh nạp rút thuần

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    // [THÊM MỚI] Số dư sổ cái ngay sau khi giao dịch — tối ưu đối soát tài chính
    @Column(name = "post_balance", precision = 15, scale = 2)
    private BigDecimal postBalance;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    // [THÊM MỚI] Phương thức nạp tiền — chỉ có giá trị khi type = TOP_UP
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    // [THÊM MỚI] Mã tham chiếu từ cổng VNPay để đối soát — chỉ có giá trị khi paymentMethod = VNPAY
    @Column(name = "vnpay_reference")
    private String vnpayReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;
}

