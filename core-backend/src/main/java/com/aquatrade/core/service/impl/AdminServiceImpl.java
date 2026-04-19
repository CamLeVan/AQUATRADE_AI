package com.aquatrade.core.service.impl;

import com.aquatrade.core.domain.Listing;
import com.aquatrade.core.domain.enums.ListingStatus;
import com.aquatrade.core.dto.AdminDto;
import com.aquatrade.core.repository.ListingRepository;
import com.aquatrade.core.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ListingRepository listingRepository;
    private final com.aquatrade.core.repository.UserRepository userRepository;
    private final com.aquatrade.core.repository.OrderRepository orderRepository;
    private final com.aquatrade.core.repository.DisputeRepository disputeRepository;
    private final com.aquatrade.core.repository.SystemTreasuryRepository systemTreasuryRepository;

    @Override
    public void moderateListing(String listingId, AdminDto.ModerateListingRequest request) {
        Listing listing = listingRepository.findById(UUID.fromString(listingId))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin đăng"));
        // Validate status
        ListingStatus newStatus = request.getModerationStatus();
        if (newStatus != ListingStatus.AVAILABLE && newStatus != ListingStatus.REJECTED) {
            throw new IllegalArgumentException("Chỉ được duyệt (AVAILABLE) hoặc từ chối (REJECTED)");
        }
        if (newStatus == ListingStatus.REJECTED && (request.getModerationNote() == null || request.getModerationNote().isBlank())) {
            throw new IllegalArgumentException("Phải ghi lý do từ chối (moderationNote)");
        }
        listing.setStatus(newStatus);
        listing.setModerationNote(request.getModerationNote());
        listingRepository.save(listing);
        log.info("Admin moderate listing {}: {} - Note: {}", listingId, newStatus, request.getModerationNote());
    }

    @Override
    public java.util.List<AdminDto.UserSummary> getAllUsers() {
        return userRepository.findAll().stream().map(u -> new AdminDto.UserSummary(
                u.getId(), u.getFullName(), u.getEmail(), u.getStatus(), u.getCreatedAt()))
                .toList();
    }

    @Override
    public void toggleUserStatus(String userId, AdminDto.ToggleUserStatusRequest request) {
        com.aquatrade.core.domain.User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(request.getNewStatus());
        userRepository.save(user);
    }

    @Override
    public java.util.List<AdminDto.OrderSummary> getAllOrders() {
        return orderRepository.findAll().stream().map(o -> new AdminDto.OrderSummary(
                o.getId(),
                o.getBuyer().getFullName(),
                o.getListing().getSeller().getFullName(),
                o.getListing().getStatus(),
                o.getStatus(),
                o.getTotalPrice(),
                o.getCreatedAt()))
                .toList();
    }

    @Override
    public java.util.List<AdminDto.DisputeSummary> getAllOpenDisputes() {
        return disputeRepository.findByStatus(com.aquatrade.core.domain.enums.DisputeStatus.OPEN)
                .stream().map(d -> new AdminDto.DisputeSummary(
                        d.getId(),
                        d.getOrder().getId().toString(),
                        d.getComplainer().getFullName(),
                        d.getStatus(),
                        d.getCreatedAt()))
                .toList();
    }

    @Override
    public AdminDto.TreasurySummary getTreasury() {
        com.aquatrade.core.domain.SystemTreasury treasury = systemTreasuryRepository.findById(1)
                .orElse(com.aquatrade.core.domain.SystemTreasury.builder().id(1).totalRevenue(java.math.BigDecimal.ZERO).build());
        return new AdminDto.TreasurySummary(treasury.getTotalRevenue());
    }
}

