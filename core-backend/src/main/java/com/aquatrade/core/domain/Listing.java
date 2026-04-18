package com.aquatrade.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.aquatrade.core.domain.base.BaseObject;
import com.aquatrade.core.domain.enums.ListingCategory;
import com.aquatrade.core.domain.enums.ListingStatus;

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

    // [THỐNG NHẤT FE-BE] FE gọi là "name" — BE giữ "title" (semantic đúng hơn cho "tin đăng")
    @Column(name = "title", nullable = false)
    private String title;

    // [THÊM MỚI] Danh mục lọc nhanh (CA / TOM / CUA / KHAC)
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private ListingCategory category;

    @Column(name = "species", nullable = false)
    private String species;

    // [SỬA] Đổi size_cm (1 field) → size_min + size_max (khoảng kích thước cm) theo DB Design
    @Column(name = "size_min", precision = 5, scale = 2)
    private BigDecimal sizeMin;

    @Column(name = "size_max", precision = 5, scale = 2)
    private BigDecimal sizeMax;

    // [THỐNG NHẤT FE-BE] FE gọi là "pricePerUnit" — BE giữ "pricePerFish" (đúng nghiệp vụ đếm CON)
    @Column(name = "price_per_fish", nullable = false, precision = 15, scale = 2)
    private BigDecimal pricePerFish;

    @Column(name = "estimated_quantity")
    private Integer estimatedQuantity;

    // [THÊM MỚI] FE gọi là "origin" — BE giữ "province" (đúng nghĩa địa lý, dùng tính logistics)
    @Column(name = "province", nullable = false)
    private String province;

    // [THÊM MỚI] Ghi chú của Admin khi từ chối hoặc yêu cầu Seller chỉnh sửa tin đăng
    @Column(name = "moderation_note", columnDefinition = "TEXT")
    private String moderationNote;

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

