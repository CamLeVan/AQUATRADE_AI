package com.aquatrade.core.service.impl;

import com.aquatrade.core.domain.Listing;
import com.aquatrade.core.domain.enums.ListingStatus;
import com.aquatrade.core.dto.AdminDto;
import com.aquatrade.core.dto.ListingDto;
import com.aquatrade.core.repository.ListingRepository;
import com.aquatrade.core.repository.UserRepository;
import com.aquatrade.core.repository.OrderRepository;
import com.aquatrade.core.repository.DisputeRepository;
import com.aquatrade.core.repository.SystemTreasuryRepository;
import com.aquatrade.core.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final DisputeRepository disputeRepository;
    private final SystemTreasuryRepository systemTreasuryRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(ListingRepository listingRepository, 
                            UserRepository userRepository, 
                            OrderRepository orderRepository, 
                            DisputeRepository disputeRepository, 
                            SystemTreasuryRepository systemTreasuryRepository, 
                            PasswordEncoder passwordEncoder) {
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.disputeRepository = disputeRepository;
        this.systemTreasuryRepository = systemTreasuryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AdminDto.UserSummary createUser(com.aquatrade.core.dto.AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
        }

        com.aquatrade.core.domain.User user = new com.aquatrade.core.domain.User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(com.aquatrade.core.domain.enums.UserStatus.ACTIVE);
        user.setWalletBalance(BigDecimal.ZERO);
        
        userRepository.save(user);

        AdminDto.UserSummary summary = new AdminDto.UserSummary();
        summary.setId(user.getId());
        summary.setFullName(user.getFullName());
        summary.setEmail(user.getEmail());
        summary.setRole(user.getRole().name());
        summary.setAvatarUrl(user.getAvatarUrl());
        summary.setStatus(user.getStatus());
        summary.setCreatedAt(user.getCreatedAt());
        return summary;
    }

    @Override
    public List<AdminDto.UserSummary> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            AdminDto.UserSummary summary = new AdminDto.UserSummary();
            summary.setId(u.getId());
            summary.setFullName(u.getFullName());
            summary.setEmail(u.getEmail());
            summary.setRole(u.getRole() != null ? u.getRole().name() : "BUYER");
            summary.setAvatarUrl(u.getAvatarUrl());
            summary.setStatus(u.getStatus());
            summary.setCreatedAt(u.getCreatedAt());
            return summary;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ListingDto> getAllPendingListings() {
        List<Listing> pendingListings = listingRepository.findByStatus(ListingStatus.PENDING_REVIEW);
        log.info(">>> [DEBUG] Tìm thấy {} tin đăng đang ở trạng thái PENDING_REVIEW", pendingListings.size());
        
        return pendingListings.stream()
                .map(l -> new ListingDto(
                        l.getId().toString(),
                        l.getTitle(),
                        l.getCategory(),
                        l.getSpecies(),
                        l.getProvince(),
                        l.getSizeMin(),
                        l.getSizeMax(),
                        l.getPricePerFish(),
                        l.getEstimatedQuantity(),
                        l.getAvailableQuantity(),
                        l.getThumbnailUrl(),
                        l.getStatus(),
                        l.getSeller().getFullName(),
                        true,
                        95,
                        "Tốt",
                        false,
                        l.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void moderateListing(String listingId, AdminDto.ModerateListingRequest request) {
        Listing listing = listingRepository.findById(UUID.fromString(listingId))
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        
        listing.setStatus(request.getModerationStatus());
        listing.setModerationNote(request.getModerationNote());
        listingRepository.save(listing);
    }

    @Override
    public void toggleUserStatus(String userId, AdminDto.ToggleUserStatusRequest request) {
        com.aquatrade.core.domain.User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setStatus(request.getNewStatus());
        userRepository.save(user);
    }

    @Override
    public List<AdminDto.OrderSummary> getAllOrders() {
        return orderRepository.findAll().stream().map(o -> {
            AdminDto.OrderSummary summary = new AdminDto.OrderSummary();
            summary.setId(o.getId());
            summary.setBuyerName(o.getBuyer().getFullName());
            summary.setSellerName(o.getListing().getSeller().getFullName());
            summary.setListingStatus(o.getListing().getStatus());
            summary.setOrderStatus(o.getStatus());
            summary.setTotalPrice(o.getTotalPrice());
            summary.setCreatedAt(o.getCreatedAt());
            return summary;
        }).collect(Collectors.toList());
    }

    @Override
    public List<AdminDto.DisputeSummary> getAllOpenDisputes() {
        return disputeRepository.findByStatus(com.aquatrade.core.domain.enums.DisputeStatus.OPEN).stream().map(d -> {
            AdminDto.DisputeSummary summary = new AdminDto.DisputeSummary();
            summary.setId(d.getId());
            summary.setOrderId(d.getOrder().getId().toString());
            summary.setComplainerName(d.getComplainer().getFullName());
            summary.setStatus(d.getStatus());
            summary.setCreatedAt(d.getCreatedAt());
            return summary;
        }).collect(Collectors.toList());
    }

    @Override
    public AdminDto.TreasurySummary getTreasury() {
        BigDecimal revenue = systemTreasuryRepository.findAll().stream()
                .map(com.aquatrade.core.domain.SystemTreasury::getTotalRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new AdminDto.TreasurySummary(revenue);
    }

    @Override
    public AdminDto.SystemStatsSummary getSystemStats() {
        BigDecimal revenue = systemTreasuryRepository.findAll().stream()
                .map(com.aquatrade.core.domain.SystemTreasury::getTotalRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long userCount = userRepository.count();
        long disputeCount = disputeRepository.countByStatus(com.aquatrade.core.domain.enums.DisputeStatus.OPEN);
        long activeListingCount = listingRepository.countByStatus(ListingStatus.AVAILABLE);
        long totalListingCount = listingRepository.count();
        long pendingListingCount = listingRepository.countByStatus(ListingStatus.PENDING_REVIEW);
        
        List<AdminDto.DailyStat> dailyStats = new java.util.ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            long count = orderRepository.countByCreatedAtBetween(date.withHour(0).withMinute(0), date.withHour(23).withMinute(59));
            dailyStats.add(new AdminDto.DailyStat(date.toLocalDate().toString(), count));
        }
        
        return new AdminDto.SystemStatsSummary(revenue, userCount, disputeCount, 99.98, activeListingCount, totalListingCount, pendingListingCount, dailyStats);
    }

    @Override
    public List<ListingDto> getAllListings() {
        List<Listing> allListings = listingRepository.findAll();
        log.info(">>> [DEBUG] Tổng số tin đăng trong database: {}", allListings.size());
        
        return allListings.stream()
                .map(l -> new ListingDto(
                        l.getId().toString(),
                        l.getTitle(),
                        l.getCategory(),
                        l.getSpecies(),
                        l.getProvince(),
                        l.getSizeMin(),
                        l.getSizeMax(),
                        l.getPricePerFish(),
                        l.getEstimatedQuantity(),
                        l.getAvailableQuantity(),
                        l.getThumbnailUrl(),
                        l.getStatus(),
                        l.getSeller().getFullName(),
                        true, // aiVerified mock
                        95,   // aiHealthScore mock
                        "Tốt", // qualityLabel mock
                        false, // isFavorite mock
                        l.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
