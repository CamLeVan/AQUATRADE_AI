package com.aquatrade.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import com.aquatrade.core.domain.enums.ProofRole;

import com.aquatrade.core.domain.base.BaseObject;

@Entity
@Table(name = "digital_proofs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalProof extends BaseObject {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "proof_role", nullable = false)
    private ProofRole proofRole; // SELLER or BUYER

    @Column(name = "batch_name")
    private String batchName;

    @Column(name = "ai_image_url")
    private String aiImageUrl;

    @Column(name = "ai_fish_count")
    private Integer aiFishCount;

    @Column(name = "health_score")
    private Integer healthScore;

    @Column(name = "proof_hash", nullable = false)
    private String proofHash;

    @Builder.Default
    @Column(name = "status")
    private String status = "PENDING"; // PENDING, SUCCESS, FAILED

    @Column(name = "error_message")
    private String errorMessage;
}
