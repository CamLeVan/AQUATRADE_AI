package com.aquatrade.core.controller;

import com.aquatrade.core.dto.OrderDto;
import com.aquatrade.core.dto.response.ApiResponse;
import com.aquatrade.core.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> createOrder(
            @Valid @RequestBody OrderDto.CreateOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.createOrder(request), "Khởi tạo Order và khóa ví Escrow thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> getOrder(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(UUID.fromString(id))));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderDto.OrderResponse>>> getMyOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getMyOrders()));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    public ResponseEntity<ApiResponse<String>> completeOrder(@PathVariable String id) {
        orderService.completeOrder(UUID.fromString(id));
        return ResponseEntity.ok(ApiResponse.success("Đơn hàng đã hoàn thành. Tiền đã được chuyển vào ví người bán."));
    }
}
