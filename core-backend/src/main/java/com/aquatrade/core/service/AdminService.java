package com.aquatrade.core.service;

import com.aquatrade.core.dto.AdminDto;

public interface AdminService {
    void moderateListing(String listingId, AdminDto.ModerateListingRequest request);
}
