package com.aquatrade.core.controller;

import com.aquatrade.core.dto.AdminDto;
import com.aquatrade.core.dto.response.ApiResponse;
import com.aquatrade.core.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/listings/{id}/moderate")
    public ResponseEntity<ApiResponse<String>> moderateListing(
            @PathVariable String id,
            @RequestBody AdminDto.ModerateListingRequest request) {
        adminService.moderateListing(id, request);
        return ResponseEntity.ok(ApiResponse.success("Đã duyệt/từ chối tin đăng thành công"));
    }
}
