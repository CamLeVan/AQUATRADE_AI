package com.aquatrade.core.service.impl;

import com.aquatrade.core.domain.Listing;
import com.aquatrade.core.domain.Order;
import com.aquatrade.core.domain.User;
import com.aquatrade.core.domain.enums.OrderStatus;
import com.aquatrade.core.dto.OrderDto;
import com.aquatrade.core.repository.ListingRepository;
import com.aquatrade.core.repository.OrderRepository;
import com.aquatrade.core.repository.UserRepository;
import com.aquatrade.core.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import com.aquatrade.core.domain.Transaction;
import com.aquatrade.core.domain.enums.TransactionType;
import com.aquatrade.core.domain.enums.TransactionStatus;
import com.aquatrade.core.repository.TransactionRepository;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public OrderDto.OrderResponse createOrder(OrderDto.CreateOrderRequest request) {
        Listing listing = listingRepository.findById(UUID.fromString(request.getListingId()))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin đăng"));

        // Lấy Buyer từ JWT SecurityContext (DỮ LIỆU THẬT)
        UUID buyerId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user buyer"));

        // BE tự tính giá từ DB — chống gian lận
        BigDecimal totalPrice = listing.getPricePerFish()
                .multiply(BigDecimal.valueOf(listing.getEstimatedQuantity()));

        // Check số dư
        if (buyer.getWalletBalance().compareTo(totalPrice) < 0) {
            throw new IllegalArgumentException("Số dư trong ví không đủ để thanh toán tạm giữ Escrow. Vui lòng nạp thêm.");
        }

        // Tự động khóa Escrow bằng cách trừ tiền trong ví người mua
        buyer.setWalletBalance(buyer.getWalletBalance().subtract(totalPrice));
        userRepository.save(buyer);

        Order order = Order.builder()
                .buyer(buyer)
                .listing(listing)
                .status(OrderStatus.ESCROW_LOCKED)
                .unitPriceAtPurchase(listing.getPricePerFish())
                .totalPrice(totalPrice)
                .shippingAddress(request.getShippingAddress())
                .build();

        order = orderRepository.save(order);

        // Lưu log Transaction cho đối soát dòng tiền
        Transaction tx = Transaction.builder()
                .order(order)
                .user(buyer)
                .amount(totalPrice)
                .postBalance(buyer.getWalletBalance())
                .type(TransactionType.ESCROW_LOCK)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(tx);
        log.info("Order mới: {} - Buyer: {} - Listing: {}", order.getId(), buyer.getFullName(), listing.getTitle());

        return mapToDto(order);
    }

    @Override
    public OrderDto.OrderResponse getOrderById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id));
        return mapToDto(order);
    }

    private OrderDto.OrderResponse mapToDto(Order entity) {
        return OrderDto.OrderResponse.builder()
                .id(entity.getId().toString())
                .listingTitle(entity.getListing().getTitle())
                .buyerName(entity.getBuyer().getFullName())
                .sellerName(entity.getListing().getSeller().getFullName())
                .unitPriceAtPurchase(entity.getUnitPriceAtPurchase())
                .finalQuantity(entity.getFinalQuantity())
                .totalPrice(entity.getTotalPrice())
                .shippingAddress(entity.getShippingAddress())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
