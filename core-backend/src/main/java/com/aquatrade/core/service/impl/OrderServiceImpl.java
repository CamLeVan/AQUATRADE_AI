package com.aquatrade.core.service.impl;

import com.aquatrade.core.domain.Listing;
import com.aquatrade.core.domain.Order;
import com.aquatrade.core.domain.User;
import com.aquatrade.core.domain.enums.OrderStatus;
import com.aquatrade.core.dto.OrderDto;
import com.aquatrade.core.repository.ListingRepository;
import com.aquatrade.core.repository.OrderRepository;
import com.aquatrade.core.repository.UserRepository;
import com.aquatrade.core.repository.DigitalProofRepository;
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
import java.util.List;
import java.util.UUID;
import com.aquatrade.core.domain.SystemTreasury;
import com.aquatrade.core.repository.SystemTreasuryRepository;
import com.aquatrade.core.domain.DigitalProof;
import com.aquatrade.core.dto.AIDetectionDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final SystemTreasuryRepository systemTreasuryRepository;
    private final DigitalProofRepository digitalProofRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;
    private final RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${ai.service.url:http://localhost:8000/ai/v1/jobs}")
    private String aiServiceUrl;

    @org.springframework.beans.factory.annotation.Value("${app.baseUrl:http://localhost:8080}")
    private String appBaseUrl;

    @org.springframework.beans.factory.annotation.Value("${app.commission.rate:0.05}")
    private BigDecimal commissionRate;

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
        try {
            listingRepository.save(listing);
        } catch (org.springframework.dao.OptimisticLockingFailureException ex) {
            throw new IllegalStateException("Hệ thống đang xử lý giao dịch khác cho lô hàng này, vui lòng thử lại sau.", ex);
        }

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

        // IDOR Check: Chỉ người mua, người bán, hoặc admin mới được phép xem đơn hàng
        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isBuyer = order.getBuyer().getId().equals(currentUserId);
        boolean isSeller = order.getListing().getSeller().getId().equals(currentUserId);
        
        // MVP: Assuming ADMIN can bypass this if needed in the future, for now strict to participants
        if (!isBuyer && !isSeller) {
            throw new org.springframework.security.access.AccessDeniedException("Bạn không có quyền xem đơn hàng này");
        }

        return mapToDto(order);
    }

    @Override
    public List<OrderDto.OrderResponse> getMyOrders() {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(currentUserId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private OrderDto.OrderResponse mapToDto(Order entity) {
        java.util.List<OrderDto.DigitalProofSummary> proofSummaries = entity.getProofs() == null ? new java.util.ArrayList<>() :
                entity.getProofs().stream().map(p -> OrderDto.DigitalProofSummary.builder()
                        .id(p.getId().toString())
                        .proofRole(p.getProofRole())
                        .batchName(p.getBatchName())
                        .aiFishCount(p.getAiFishCount())
                        .confidenceScore(p.getConfidenceScore())
                        .aiImageUrl(p.getAiImageUrl())
                        .proofHash(p.getProofHash())
                        .createdAt(p.getCreatedAt())
                        .build()).toList();

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
                .proofs(proofSummaries)
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

        if (order.getStatus() != OrderStatus.ESCROW_LOCKED && order.getStatus() != OrderStatus.READY_TO_PAYOUT) {
            throw new IllegalArgumentException("Đơn hàng không ở trạng thái hợp lệ để hoàn thành.");
        }

        // Đóng vòng đời Order
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        // Publish event để xử lý dòng tiền thay vì code cứng vào đây (Event-Driven Architecture)
        eventPublisher.publishEvent(new com.aquatrade.core.domain.event.OrderCompletedEvent(order));
    }

    @Override
    @Transactional
    public void confirmOrderQuantity(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!order.getBuyer().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Chỉ người mua mới có quyền đối soát số lượng cho đơn hàng này.");
        }

        if (order.getStatus() != OrderStatus.AI_VERIFIED) {
            throw new IllegalStateException("Đơn hàng chưa ở trạng thái chờ xác nhận (AI_VERIFIED).");
        }

        List<DigitalProof> proofs = order.getProofs();
        if (proofs == null || proofs.isEmpty()) {
            throw new IllegalStateException("Đơn hàng thiếu Bằng chứng số học (DigitalProof).");
        }

        int sellerTotal = proofs.stream()
                .filter(p -> "SELLER".equals(p.getProofRole()) && p.getAiFishCount() != null)
                .mapToInt(DigitalProof::getAiFishCount).sum();

        int buyerTotal = proofs.stream()
                .filter(p -> "BUYER".equals(p.getProofRole()) && p.getAiFishCount() != null)
                .mapToInt(DigitalProof::getAiFishCount).sum();
                
        if (sellerTotal == 0) {
            throw new IllegalStateException("Bên bán chưa có dữ liệu đếm AI hợp lệ.");
        }
        if (buyerTotal == 0) {
            throw new IllegalStateException("Bên mua chưa thực hiện đếm AI để đối soát.");
        }

        double discrepancy = Math.abs(sellerTotal - buyerTotal) / (double) sellerTotal;

        if (discrepancy > 0.10) {
            order.setStatus(OrderStatus.DISPUTED);
            log.warn("[DISCREPANCY ALERT] Order {}: Seller Total = {}, Buyer Total = {}. Discrepancy = {}%. Status -> DISPUTED.", 
                    orderId, sellerTotal, buyerTotal, String.format("%.2f", discrepancy * 100));
        } else {
            order.setStatus(OrderStatus.READY_TO_PAYOUT);
            order.setFinalQuantity(buyerTotal); // Lấy số lượng thực nhận để tính tiền
            log.info("[CONFIRMATION SUCCESS] Order {}: Seller Total = {}, Buyer Total = {}. Status -> READY_TO_PAYOUT.", 
                    orderId, sellerTotal, buyerTotal);
        }

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateDigitalProof(UUID orderId, UUID proofId, AIDetectionDto.DonePayload aiResult) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        DigitalProof proof = digitalProofRepository.findById(proofId)
                .orElseThrow(() -> new IllegalArgumentException("Proof not found"));

        if (!proof.getOrder().getId().equals(order.getId())) {
             throw new IllegalArgumentException("Proof does not belong to this order");
        }

        double lat1 = order.getListing().getLatitude() != null ? order.getListing().getLatitude().doubleValue() : 0.0;
        double lon1 = order.getListing().getLongitude() != null ? order.getListing().getLongitude().doubleValue() : 0.0;
        double lat2 = aiResult.getGpsLatitude() != null ? aiResult.getGpsLatitude().doubleValue() : 0.0;
        double lon2 = aiResult.getGpsLongitude() != null ? aiResult.getGpsLongitude().doubleValue() : 0.0;
        
        // Dùng GpsUtils để tính khoảng cách chuẩn theo công thức Haversine
        double distance = com.aquatrade.core.utils.GpsUtils.calculateDistance(lat1, lon1, lat2, lon2);
        
        if (lat1 != 0.0 && distance > 0.5) { // 0.5 km
            log.error("GPS Mismatch! Proof location too far from Pond location. Distance: {} km", distance);
        }

        proof.setAiFishCount(aiResult.getAiFishCount());
        proof.setConfidenceScore(aiResult.getConfidenceScore());
        proof.setProofHash(aiResult.getProofHash());
        proof.setAiImageUrl(aiResult.getAiImageUrl());
        proof.setGpsLatitude(aiResult.getGpsLatitude());
        proof.setGpsLongitude(aiResult.getGpsLongitude());
        
        digitalProofRepository.save(proof);
        
        if (order.getStatus() == OrderStatus.COUNTING_AI) {
            order.setStatus(OrderStatus.AI_VERIFIED);
            orderRepository.save(order);
        }

        messagingTemplate.convertAndSend("/topic/orders/" + orderId, aiResult);
    }

    @Override
    @Transactional
    public void startAiAnalysis(UUID orderId, String videoUrl, String batchName) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() != OrderStatus.ESCROW_LOCKED && order.getStatus() != OrderStatus.COUNTING_AI && order.getStatus() != OrderStatus.AI_VERIFIED) {
            throw new IllegalStateException("Đơn hàng không ở trạng thái hợp lệ để gọi AI.");
        }

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isBuyer = order.getBuyer().getId().equals(currentUserId);
        boolean isSeller = order.getListing().getSeller().getId().equals(currentUserId);
        
        if (!isBuyer && !isSeller) {
             throw new IllegalArgumentException("Chỉ người mua hoặc người bán mới được gọi AI.");
        }
        
        String role = isBuyer ? "BUYER" : "SELLER";

        DigitalProof proof = new DigitalProof();
        proof.setOrder(order);
        proof.setAiImageUrl(videoUrl);
        proof.setProofHash("PENDING"); 
        proof.setProofRole(role);
        proof.setBatchName(batchName);
        proof = digitalProofRepository.save(proof); // save to get ID

        if (order.getStatus() == OrderStatus.ESCROW_LOCKED) {
             order.setStatus(OrderStatus.COUNTING_AI);
             orderRepository.save(order);
        }

        // Gọi AI Service
        String callbackUrl = appBaseUrl + "/api/v1/internal/orders/" + orderId + "/proofs/" + proof.getId() + "/ai-result";

        Map<String, String> aiRequest = new HashMap<>();
        aiRequest.put("orderId", orderId.toString());
        aiRequest.put("proofId", proof.getId().toString());
        aiRequest.put("videoUrl", videoUrl);
        aiRequest.put("callbackUrl", callbackUrl);

        try {
            Map<String, Object> response = restTemplate.postForObject(aiServiceUrl, aiRequest, Map.class);
            if (response != null && response.containsKey("ticketId")) {
                log.info("AI Job started successfully for proof {}. Ticket ID: {}", proof.getId(), response.get("ticketId"));
            }
        } catch (Exception e) {
            log.error("Failed to trigger AI Service for proof {}: {}", proof.getId(), e.getMessage());
            throw new RuntimeException("Hệ thống kiểm định AI đang bận hoặc gặp sự cố.");
        }
    }
}
