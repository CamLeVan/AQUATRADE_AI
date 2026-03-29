package com.aquatrade.core.entity;

import com.aquatrade.core.entity.base.BaseObject;
import com.aquatrade.core.entity.enums.ListingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Listing extends BaseObject {

    // Áp dụng Best Practice FetchType.LAZY chống N+1 Query triệt để
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "species", nullable = false)
    private String species;

    @Column(name = "size_cm")
    private BigDecimal sizeCm;

    @Column(name = "price_per_fish", nullable = false, precision = 15, scale = 2)
    private BigDecimal pricePerFish;

    @Column(name = "estimated_quantity")
    private Integer estimatedQuantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ListingStatus status;

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ListingImage> images = new ArrayList<>();

    // Helper method đồng bộ Entity hai chiều Hibernate
    public void addImage(ListingImage image) {
        images.add(image);
        image.setListing(this);
    }
}
