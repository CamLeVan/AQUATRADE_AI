package com.aquatrade.core.repository;

import com.aquatrade.core.domain.Transaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    @EntityGraph(attributePaths = {"order"})
    List<Transaction> findTop10ByUserIdOrderByCreatedAtDesc(UUID userId);
}
