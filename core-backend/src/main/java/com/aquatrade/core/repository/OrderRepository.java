package com.aquatrade.core.repository;

import com.aquatrade.core.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = :status")
    java.math.BigDecimal sumTotalPriceByStatus(@org.springframework.data.repository.query.Param("status") com.aquatrade.core.domain.enums.OrderStatus status);
}
