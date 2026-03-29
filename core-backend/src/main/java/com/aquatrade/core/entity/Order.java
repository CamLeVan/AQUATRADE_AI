package com.aquatrade.core.entity;

import com.aquatrade.core.entity.base.BaseObject;
import com.aquatrade.core.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseObject {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status;

    @Column(name = "final_quantity")
    private Integer finalQuantity;

    @Column(name = "total_price", precision = 15, scale = 2)
    private BigDecimal totalPrice;
    
    // Liên kết 1-1 với bằng chứng số do AI xuất ra (nạp Lazy để khỏi lụt)
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private DigitalProof digitalProof;
}
