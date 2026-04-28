package com.aquatrade.core.controller;

import com.aquatrade.core.dto.AdminDto;
import com.aquatrade.core.dto.response.ApiResponse;
import com.aquatrade.core.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ---------- Users ----------
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminDto.UserSummary>>> getAllUsers() {
        List<AdminDto.UserSummary> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(@PathVariable String userId,
                                                                @RequestBody AdminDto.ToggleUserStatusRequest request) {
        adminService.toggleUserStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.success("User status updated"));
    }

    // ---------- Orders ----------
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminDto.OrderSummary>>> getAllOrders() {
        List<AdminDto.OrderSummary> orders = adminService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    // ---------- Disputes ----------
    @GetMapping("/disputes/open")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AdminDto.DisputeSummary>>> getOpenDisputes() {
        List<AdminDto.DisputeSummary> disputes = adminService.getAllOpenDisputes();
        return ResponseEntity.ok(ApiResponse.success(disputes));
    }

    // ---------- Treasury ----------
    @GetMapping("/treasury")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDto.TreasurySummary>> getTreasury() {
        AdminDto.TreasurySummary summary = adminService.getTreasury();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    // ---------- Listings Moderation ----------
    @GetMapping("/listings/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<com.aquatrade.core.dto.ListingDto>>> getPendingListings() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllPendingListings()));
    }

    @PutMapping("/listings/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> moderateListing(@PathVariable String id,
                                                               @RequestBody AdminDto.ModerateListingRequest request) {
        adminService.moderateListing(id, request);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật trạng thái tin đăng thành công"));
    }
}
