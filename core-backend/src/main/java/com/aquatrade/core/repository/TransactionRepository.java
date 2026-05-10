package com.aquatrade.core.repository;

import com.aquatrade.core.domain.Transaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    @EntityGraph(attributePaths = {"order"})
    List<Transaction> findTop10ByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = :type AND t.status = 'SUCCESS'")
    BigDecimal sumAmountByType(@Param("type") com.aquatrade.core.domain.enums.TransactionType type);
}
