package com.aquatrade.core.controller;

import com.aquatrade.core.dto.ListingDto;
import com.aquatrade.core.dto.response.ApiResponse;
import com.aquatrade.core.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ListingDto>>> getAllListings(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String species) {
        return ResponseEntity.ok(ApiResponse.success(listingService.getAllListings(province, species)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ListingDto>> getListingById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(listingService.getListingById(UUID.fromString(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<ListingDto>> createListing(
            @Valid @RequestBody ListingDto.CreateListingRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                listingService.createListing(request), "Tạo tin đăng thành công và đang chờ duyệt"));
    }
}
