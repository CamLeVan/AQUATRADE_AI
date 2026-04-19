package com.aquatrade.core.service;

import com.aquatrade.core.dto.AdminDto;

public interface AdminService {
    void moderateListing(String listingId, AdminDto.ModerateListingRequest request);

    // [NEW] Quản lý Users
    java.util.List<AdminDto.UserSummary> getAllUsers();
    void toggleUserStatus(String userId, AdminDto.ToggleUserStatusRequest request);

    // [NEW] Giám sát Orders
    java.util.List<AdminDto.OrderSummary> getAllOrders();

    // [NEW] Giám sát Disputes
    java.util.List<AdminDto.DisputeSummary> getAllOpenDisputes();

    // [NEW] Xem Treasury
    AdminDto.TreasurySummary getTreasury();
}
