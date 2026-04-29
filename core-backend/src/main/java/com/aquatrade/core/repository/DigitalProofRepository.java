package com.aquatrade.core.repository;

import com.aquatrade.core.domain.DigitalProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DigitalProofRepository extends JpaRepository<DigitalProof, UUID> {
}
