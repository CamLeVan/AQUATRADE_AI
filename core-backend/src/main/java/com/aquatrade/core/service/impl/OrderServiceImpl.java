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
import com.aquatrade.core.domain.SystemTreasury;
import com.aquatrade.core.repository.SystemTreasuryRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final SystemTreasuryRepository systemTreasuryRepository;

    @Override
    @Transactional
    public OrderDto.OrderResponse createOrder(OrderDto.CreateOrderRequest request) {
        Listing listing = listingRepository.findById(UUID.fromString(request.getListingId()))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin đăng"));

        if (listing.getStatus() == com.aquatrade.core.domain.enums.ListingStatus.SOLD) {
            throw new IllegalArgumentException("Rất tiếc, lô hàng này đã bán hết!");
        }

        if (request.getQuantity() > listing.getAvailableQuantity()) {
            throw new IllegalArgumentException("Số lượng mua (" + request.getQuantity() + ") vượt quá số lượng cá còn lại trong kho (" + listing.getAvailableQuantity() + " con)");
        }

        // Lấy Buyer từ JWT SecurityContext (DỮ LIỆU THẬT)
        UUID buyerId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user buyer"));

        // BE tự tính giá từ DB theo Số lượng KHÁCH MUỐN MUA
        BigDecimal totalPrice = listing.getPricePerFish()
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        // Check số dư
        if (buyer.getWalletBalance().compareTo(totalPrice) < 0) {
            throw new IllegalArgumentException("Số dư trong ví không đủ để thanh toán tạm giữ Escrow. Vui lòng nạp thêm.");
        }

        // Tự động khóa Escrow bằng cách trừ tiền trong ví người mua
        buyer.setWalletBalance(buyer.getWalletBalance().subtract(totalPrice));
        userRepository.save(buyer);

        // TRỪ KHO BÃI & CHỐT TRẠNG THÁI (Concurrency by @Version inherited in BaseObject)
        listing.setAvailableQuantity(listing.getAvailableQuantity() - request.getQuantity());
        if (listing.getAvailableQuantity() <= 0) {
            listing.setStatus(com.aquatrade.core.domain.enums.ListingStatus.SOLD);
        }
        listingRepository.save(listing);

        Order order = Order.builder()
                .buyer(buyer)
                .listing(listing)
                .status(OrderStatus.ESCROW_LOCKED)
                .unitPriceAtPurchase(listing.getPricePerFish())
                .finalQuantity(request.getQuantity())
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

    @Override
    @Transactional
    public void completeOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id));

        // Kiểm tra quyền: Chỉ Buyer mới được quyền bấm xác nhận (hoặc hệ thống AI tự động gọi)
        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!order.getBuyer().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Chỉ người mua mới được phép xác nhận hoàn thành đơn hàng.");
        }

        if (order.getStatus() != OrderStatus.ESCROW_LOCKED) {
            throw new IllegalArgumentException("Đơn hàng không ở trạng thái Tạm giữ Escrow.");
        }

        // Đóng vòng đời Order
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        // Chuyển hóa dòng tiền (End-Game): 5% Platform, 95% Seller
        BigDecimal total = order.getTotalPrice();
        BigDecimal commission = total.multiply(new BigDecimal("0.05"));
        BigDecimal sellerPayout = total.subtract(commission);

        // 1. Chuyển tiền cho Seller
        User seller = order.getListing().getSeller();
        seller.setWalletBalance(seller.getWalletBalance().add(sellerPayout));
        userRepository.save(seller);

        // Sinh hoá đơn thu nhập cho Seller
        Transaction txSeller = Transaction.builder()
                .order(order)
                .user(seller)
                .amount(sellerPayout)
                .postBalance(seller.getWalletBalance())
                .type(TransactionType.ORDER_PAYOUT)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(txSeller);

        // 2. Chuyển tiền cho Platform (Treasury)
        SystemTreasury treasury = systemTreasuryRepository.findById(1)
                .orElse(SystemTreasury.builder().id(1).totalRevenue(BigDecimal.ZERO).build());
        treasury.setTotalRevenue(treasury.getTotalRevenue().add(commission));
        systemTreasuryRepository.save(treasury);

        // Sinh hoá đơn hoa hồng cho Platform (gắn vào thẻ User = Admin hoặc null, ở đây tạm gắn cho Seller nhưng Type là PLATFORM_COMMISSION)
        // MVP: Để dễ Audit, có thể logging tx này bằng một bảng riêng, hoặc lưu vào bảng Transaction.
        Transaction txPlatform = Transaction.builder()
                .order(order)
                .user(seller) // Đánh dấu nguồn gốc giao dịch là từ đơn hàng của Seller này
                .amount(commission)
                .postBalance(treasury.getTotalRevenue())
                .type(TransactionType.PLATFORM_COMMISSION)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(txPlatform);

        log.info("Order COMPLETED: {} - Payout to Seller: {} - Commission: {}", order.getId(), sellerPayout, commission);
    }
}
