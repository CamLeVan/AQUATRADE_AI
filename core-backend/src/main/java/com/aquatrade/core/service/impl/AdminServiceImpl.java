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

    @Override
    public void moderateListing(String listingId, AdminDto.ModerateListingRequest request) {
        Listing listing = listingRepository.findById(UUID.fromString(listingId))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin đăng"));

        // Validate: chỉ AVAILABLE hoặc REJECTED
        ListingStatus newStatus = request.getModerationStatus();
        if (newStatus != ListingStatus.AVAILABLE && newStatus != ListingStatus.REJECTED) {
            throw new IllegalArgumentException("Chỉ được duyệt (AVAILABLE) hoặc từ chối (REJECTED)");
        }

        // Nếu REJECTED thì bắt buộc có ghi chú
        if (newStatus == ListingStatus.REJECTED &&
                (request.getModerationNote() == null || request.getModerationNote().isBlank())) {
            throw new IllegalArgumentException("Phải ghi lý do từ chối (moderationNote)");
        }

        listing.setStatus(newStatus);
        listing.setModerationNote(request.getModerationNote());
        listingRepository.save(listing);

        log.info("Admin moderate listing {}: {} - Note: {}",
                listingId, newStatus, request.getModerationNote());
    }
}
