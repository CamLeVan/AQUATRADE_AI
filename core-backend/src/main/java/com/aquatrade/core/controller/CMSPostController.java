package com.aquatrade.core.controller;

import com.aquatrade.core.dto.CMSPostDto;
import com.aquatrade.core.dto.response.ApiResponse;
import com.aquatrade.core.service.impl.CMSPostServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class CMSPostController {

    private final CMSPostServiceImpl cmsPostService;

    // Ai cũng đọc được tin tức (Trang chủ Marketing)
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAllPosts() {
        return ResponseEntity.ok(ApiResponse.success(cmsPostService.getAllPosts()));
    }

    // Chỉ Admin mới được quyền đăng bài
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CMSPostDto>> createPost(@RequestBody CMSPostDto dto) {
        return ResponseEntity.ok(ApiResponse.success(cmsPostService.createPost(dto)));
    }
}
