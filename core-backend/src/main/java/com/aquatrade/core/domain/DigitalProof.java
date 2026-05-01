package com.aquatrade.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

import com.aquatrade.core.domain.base.BaseObject;

@Entity
@Table(name = "digital_proofs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalProof extends BaseObject {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(name = "ai_image_url")
    private String aiImageUrl;

    @Column(name = "ai_fish_count")
    private Integer aiFishCount;

    @Column(name = "confidence_score", precision = 5, scale = 4)
    private BigDecimal confidenceScore;

    @Column(name = "gps_latitude", precision = 10, scale = 7)
    private BigDecimal gpsLatitude;

    @Column(name = "gps_longitude", precision = 10, scale = 7)
    private BigDecimal gpsLongitude;

    @Column(name = "proof_hash", nullable = false)
    private String proofHash;

    /** UUID ticket từ AI job — dùng để idempotent webhook (§2.6). */
    @Column(name = "ai_ticket_id", unique = true, length = 64)
    private String aiTicketId;
}
