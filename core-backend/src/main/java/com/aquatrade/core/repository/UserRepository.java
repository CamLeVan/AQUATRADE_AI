package com.aquatrade.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aquatrade.core.domain.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByIdAndStatus(UUID id, com.aquatrade.core.domain.enums.UserStatus status);
    long countByRoleAndStatus(com.aquatrade.core.domain.enums.Role role, com.aquatrade.core.domain.enums.UserStatus status);
}
