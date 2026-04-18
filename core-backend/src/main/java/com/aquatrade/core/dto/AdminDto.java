package com.aquatrade.core.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import com.aquatrade.core.domain.enums.ListingStatus;

public class AdminDto {
    
    @Data
    public static class ModerateListingRequest {
        private ListingStatus moderationStatus; // AVAILABLE or REJECTED
        private String moderationNote; // Rút kinh nghiệm, bắt buộc nếu REJECTED
    }
}
