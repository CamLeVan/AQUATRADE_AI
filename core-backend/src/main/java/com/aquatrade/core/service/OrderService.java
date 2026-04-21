package com.aquatrade.core.service;

import com.aquatrade.core.dto.OrderDto;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderDto.OrderResponse createOrder(OrderDto.CreateOrderRequest request);
    OrderDto.OrderResponse getOrderById(UUID id);
    List<OrderDto.OrderResponse> getMyOrders();
    void completeOrder(UUID id);
}
