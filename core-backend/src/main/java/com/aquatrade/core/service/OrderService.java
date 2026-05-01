package com.aquatrade.core.service;

import com.aquatrade.core.dto.OrderDto;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderDto.OrderResponse createOrder(OrderDto.CreateOrderRequest request);
    OrderDto.OrderResponse getOrderById(UUID id);
    List<OrderDto.OrderResponse> getMyOrders();
    void confirmOrderQuantity(UUID id);
    void updateDigitalProof(UUID id, UUID proofId, com.aquatrade.core.dto.AIDetectionDto.DonePayload aiResult);
    void startAiAnalysis(UUID id, String videoUrl, String batchName);
    List<OrderDto.OrderResponse> getSellerOrders(UUID sellerId);
    void completeOrder(UUID id);
    void adminReviewOrder(UUID orderId, Integer finalQuantity);
    void updateOrderStatus(UUID orderId, com.aquatrade.core.domain.enums.OrderStatus newStatus);
}
