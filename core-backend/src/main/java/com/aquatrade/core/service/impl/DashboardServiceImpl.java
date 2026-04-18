package com.aquatrade.core.service.impl;

import com.aquatrade.core.dto.DashboardStatsDto;
import com.aquatrade.core.repository.ListingRepository;
import com.aquatrade.core.repository.UserRepository;
import com.aquatrade.core.domain.enums.Role;
import com.aquatrade.core.domain.enums.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getSystemStats() {
        long activeSellers = userRepository.countByRoleAndStatus(Role.SELLER, UserStatus.ACTIVE);
        long activeBuyers = userRepository.countByRoleAndStatus(Role.BUYER, UserStatus.ACTIVE);
        long totalListings = listingRepository.count();

        return DashboardStatsDto.builder()
                .activeSellers((int) activeSellers)
                .activeBuyers((int) activeBuyers)
                .totalListings((int) totalListings)
                .aiNetworkHealth(98)
                .build();
    }
}
