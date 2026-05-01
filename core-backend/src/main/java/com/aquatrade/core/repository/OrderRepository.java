package com.aquatrade.core.repository;

import com.aquatrade.core.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = :status")
    java.math.BigDecimal sumTotalPriceByStatus(@org.springframework.data.repository.query.Param("status") com.aquatrade.core.domain.enums.OrderStatus status);

    List<Order> findByBuyerIdOrderByCreatedAtDesc(UUID buyerId);

    List<Order> findByListingSellerIdOrderByCreatedAtDesc(UUID sellerId);

    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    long countByListingSellerId(UUID sellerId);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.listing.seller.id = :sellerId AND o.status = com.aquatrade.core.domain.enums.OrderStatus.COMPLETED")
    java.math.BigDecimal sumRevenueBySellerId(@org.springframework.data.repository.query.Param("sellerId") UUID sellerId);
}
