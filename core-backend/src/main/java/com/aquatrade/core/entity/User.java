package com.aquatrade.core.entity;

import com.aquatrade.core.entity.base.BaseObject;
import com.aquatrade.core.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseObject {

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "wallet_balance", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal walletBalance = BigDecimal.ZERO;

    // Cơ chế Optimistic Locking chống lỗi tính sai lệch giao dịch song song cho Ví hệ thống Escrow
    @Version
    @Column(name = "version")
    private Integer version;
}
