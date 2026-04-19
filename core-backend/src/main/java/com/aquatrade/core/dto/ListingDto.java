package com.aquatrade.core.dto;

import com.aquatrade.core.domain.enums.ListingCategory;
import com.aquatrade.core.domain.enums.ListingStatus;
import lombok.Builder;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ListingDto {
    private String id;
    private String title;
    private ListingCategory category;
    private String species;
    private String province;
    private BigDecimal sizeMin;
    private BigDecimal sizeMax;
    private BigDecimal pricePerFish;
    private Integer estimatedQuantity;
    private Integer availableQuantity;
    private String thumbnailUrl;
    private ListingStatus status;
    private String sellerName;
    private Boolean aiVerified;
    private Integer aiHealthScore;
    private String qualityLabel;
    private Boolean isFavorite;
    private LocalDateTime createdAt;

    @Data
    public static class CreateListingRequest {
        @NotBlank(message = "Title required")
        private String title;
        
        @NotNull
        private ListingCategory category;
        
        @NotBlank
        private String species;
        
        @NotBlank
        private String province;
        
        @Positive
        private BigDecimal sizeMin;
        
        @Positive
        private BigDecimal sizeMax;
        
        @NotNull @Positive
        private BigDecimal pricePerFish;
        
        @NotNull @Positive
        private Integer estimatedQuantity;
    }
}
