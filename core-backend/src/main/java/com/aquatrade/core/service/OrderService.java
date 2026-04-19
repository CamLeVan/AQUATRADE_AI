package com.aquatrade.core.service;

import com.aquatrade.core.dto.OrderDto;
import java.util.UUID;

public interface OrderService {
    OrderDto.OrderResponse createOrder(OrderDto.CreateOrderRequest request);
    OrderDto.OrderResponse getOrderById(UUID id);
    void completeOrder(UUID id);
}
