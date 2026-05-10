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
import org.springframework.scheduling.annotation.Scheduled;
import java.time.LocalDateTime;

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
        
        // [INTEGRITY CHECK] Không cho phép Seller tự mua hàng của chính mình
        if (listing.getSeller().getId().equals(buyerId)) {
            throw new IllegalArgumentException("Hệ thống không cho phép bạn tự mua hàng từ bài đăng của chính mình.");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user buyer"));

        // [INTEGRITY CHECK] Admin không được mua bán
        if (buyer.getRole() == com.aquatrade.core.domain.enums.Role.ADMIN) {
            throw new IllegalArgumentException("Tài khoản Quản trị viên không có quyền thực hiện giao dịch mua bán.");
        }

        // BE tự tính giá từ DB theo Số lượng KHÁCH MUỐN MUA
        BigDecimal subtotal = listing.getPricePerFish()
                .multiply(BigDecimal.valueOf(request.getQuantity()));
        
        // CỘNG THÊM PHÍ GIAO HÀNG (50k) VÀ PHÍ AI (25k) để khớp với FE
        BigDecimal shippingFee = new BigDecimal("50000");
        BigDecimal aiFee = new BigDecimal("25000");
        BigDecimal totalPrice = subtotal.add(shippingFee).add(aiFee);

        // Check số dư
        if (buyer.getWalletBalance().compareTo(totalPrice) < 0) {
            throw new IllegalArgumentException("Số dư trong ví không đủ (Cần " + totalPrice.toPlainString() + "đ). Vui lòng nạp thêm.");
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
        
        if (!isBuyer && !isSeller) {
            throw new org.springframework.security.access.AccessDeniedException("Bạn không có quyền xem đơn hàng này");
        }

        return mapToDto(order);
    }

    @Override
    public List<OrderDto.OrderResponse> getMyOrders() {
        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Order> boughtOrders = orderRepository.findByBuyerIdOrderByCreatedAtDesc(currentUserId);
        List<Order> soldOrders = orderRepository.findByListingSellerIdOrderByCreatedAtDesc(currentUserId);

        java.util.List<Order> allOrders = new java.util.ArrayList<>();
        allOrders.addAll(boughtOrders);
        allOrders.addAll(soldOrders);
        allOrders.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return allOrders.stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public List<OrderDto.OrderResponse> getSellerOrders(UUID sellerId) {
        return orderRepository.findByListingSellerIdOrderByCreatedAtDesc(sellerId)
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
                        .status(p.getStatus())
                        .errorMessage(p.getErrorMessage())
                        .aiImageUrl(p.getAiImageUrl())
                        .proofHash(p.getProofHash())
                        .createdAt(p.getCreatedAt())
                        .build()).toList();

        String thumbnailUrl = entity.getListing().getThumbnailUrl();
        if ((thumbnailUrl == null || thumbnailUrl.isEmpty()) && !entity.getListing().getImages().isEmpty()) {
            thumbnailUrl = entity.getListing().getImages().get(0).getImageUrl();
        }

        return OrderDto.OrderResponse.builder()
                .id(entity.getId().toString())
                .listingTitle(entity.getListing().getTitle())
                .listingThumbnailUrl(thumbnailUrl)
                .buyerName(entity.getBuyer().getFullName())
                .sellerName(entity.getListing().getSeller().getFullName())
                .unitPriceAtPurchase(entity.getUnitPriceAtPurchase())
                .finalQuantity(entity.getFinalQuantity())
                .totalPrice(entity.getTotalPrice())
                .shippingAddress(entity.getShippingAddress())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .proofs(proofSummaries)
                .disputeReason(entity.getDisputeReason())
                .sellerResponse(entity.getSellerResponse())
                .build();
    }

    @Override
    @Transactional
    public void completeOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id));

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!order.getBuyer().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Chỉ người mua mới được phép xác nhận hoàn thành đơn hàng.");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Bạn chỉ có thể xác nhận hoàn tất sau khi đơn hàng đã được giao tới (DELIVERED).");
        }

        order.setStatus(com.aquatrade.core.domain.enums.OrderStatus.READY_TO_PAYOUT);
        orderRepository.save(order);
        log.info("Order {} đã được Buyer xác nhận nhận hàng. Đang chờ Admin duyệt chi (READY_TO_PAYOUT).", id);
    }

    @Override
    @Transactional
    public void approvePayout(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id));

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserId).get();
        if (currentUser.getRole() != com.aquatrade.core.domain.enums.Role.ADMIN) {
            throw new SecurityException("Chỉ Quản trị viên mới có quyền duyệt giải ngân tiền.");
        }

        if (order.getStatus() != OrderStatus.READY_TO_PAYOUT) {
            throw new IllegalArgumentException("Đơn hàng phải ở trạng thái READY_TO_PAYOUT mới có thể duyệt chi.");
        }

        // --- LOGIC TÍNH TIỀN ---
        BigDecimal totalWithFees = order.getTotalPrice();
        BigDecimal shippingFee = new BigDecimal("50000");
        BigDecimal aiFee = new BigDecimal("25000");
        BigDecimal subtotal = totalWithFees.subtract(shippingFee).subtract(aiFee);
        
        BigDecimal commission = subtotal.multiply(new BigDecimal("0.05"))
                .setScale(0, java.math.RoundingMode.HALF_UP);
        BigDecimal sellerPayout = subtotal.subtract(commission);

        // 1. Cộng tiền cho Người bán
        User seller = order.getListing().getSeller();
        BigDecimal currentSellerBalance = seller.getWalletBalance() != null ? seller.getWalletBalance() : BigDecimal.ZERO;
        seller.setWalletBalance(currentSellerBalance.add(sellerPayout));
        userRepository.save(seller);

        // 2. Chuyển tiền cho Platform (Treasury)
        SystemTreasury treasury = systemTreasuryRepository.findById(1)
                .orElse(SystemTreasury.builder().id(1).totalRevenue(BigDecimal.ZERO).build());
        
        BigDecimal platformIncome = commission.add(shippingFee).add(aiFee);
        treasury.setTotalRevenue(treasury.getTotalRevenue().add(platformIncome));
        systemTreasuryRepository.save(treasury);

        // 3. Log Transaction cho Seller
        Transaction sellerTx = Transaction.builder()
                .order(order)
                .user(seller)
                .amount(sellerPayout)
                .postBalance(seller.getWalletBalance())
                .type(TransactionType.ORDER_PAYOUT)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(sellerTx);

        // 4. Chốt trạng thái Order
        order.setStatus(com.aquatrade.core.domain.enums.OrderStatus.COMPLETED);
        orderRepository.save(order);

        log.info("Admin đã duyệt giải ngân cho Order {}. Seller {} nhận: {}đ. Platform nhận: {}đ", 
                id, seller.getFullName(), sellerPayout, platformIncome);

        eventPublisher.publishEvent(new com.aquatrade.core.domain.event.OrderCompletedEvent(order));
    }

    @Override
    @Transactional
    public void cancelOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + id));

        if (order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Đơn hàng không thể hủy trong trạng thái hiện tại.");
        }

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!order.getBuyer().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Chỉ người mua (hoặc Admin) mới được quyền hủy đơn.");
        }

        BigDecimal refundAmount = order.getTotalPrice();
        User buyer = order.getBuyer();
        buyer.setWalletBalance(buyer.getWalletBalance().add(refundAmount));
        userRepository.save(buyer);

        Transaction refundTx = Transaction.builder()
                .order(order)
                .user(buyer)
                .amount(refundAmount)
                .postBalance(buyer.getWalletBalance())
                .type(TransactionType.REFUND)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(refundTx);

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        log.info("Order {} cancelled. Refunded {} to Buyer {}.", order.getId(), refundAmount, buyer.getId());
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
            order.setFinalQuantity(buyerTotal); 
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

        if ("FAILED".equals(aiResult.getStatus())) {
            proof.setStatus("FAILED");
            proof.setErrorMessage(aiResult.getErrorMessage());
            digitalProofRepository.save(proof);
            messagingTemplate.convertAndSend("/topic/orders/" + orderId, aiResult);
            return;
        }

        proof.setAiFishCount(aiResult.getAiFishCount());
        proof.setProofHash(aiResult.getProofHash());
        proof.setAiImageUrl(aiResult.getAiImageUrl());
        proof.setStatus("SUCCESS");
        
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
        proof = digitalProofRepository.save(proof); 

        if (order.getStatus() == OrderStatus.ESCROW_LOCKED) {
             order.setStatus(OrderStatus.COUNTING_AI);
             orderRepository.save(order);
        }

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

    @Scheduled(fixedDelay = 300000) 
    @Transactional
    public void cleanupPendingProofs() {
        LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(10);
        List<DigitalProof> stuckProofs = digitalProofRepository.findByStatusAndCreatedAtBefore("PENDING", tenMinutesAgo);
        
        if (!stuckProofs.isEmpty()) {
            log.info("Found {} stuck AI proofs. Marking as FAILED.", stuckProofs.size());
            for (DigitalProof proof : stuckProofs) {
                proof.setStatus("FAILED");
                proof.setErrorMessage("AI Service timeout (10 minutes). Please try again.");
                digitalProofRepository.save(proof);
                
                AIDetectionDto.DonePayload failPayload = AIDetectionDto.DonePayload.builder()
                        .status("FAILED")
                        .orderId(proof.getOrder().getId().toString())
                        .errorMessage(proof.getErrorMessage())
                        .build();
                messagingTemplate.convertAndSend("/topic/orders/" + proof.getOrder().getId(), failPayload);
            }
        }
    }

    @Override
    @Transactional
    public void adminReviewOrder(UUID orderId, Integer finalQuantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        BigDecimal unitPrice = order.getUnitPriceAtPurchase();
        BigDecimal shippingFee = new BigDecimal("50000");
        BigDecimal aiFee = new BigDecimal("25000");
        
        BigDecimal newSubtotal = unitPrice.multiply(BigDecimal.valueOf(finalQuantity));
        BigDecimal newTotal = newSubtotal.add(shippingFee).add(aiFee);

        if (newTotal.compareTo(order.getTotalPrice()) < 0) {
            BigDecimal refundAmount = order.getTotalPrice().subtract(newTotal);
            User buyer = order.getBuyer();
            buyer.setWalletBalance(buyer.getWalletBalance().add(refundAmount));
            userRepository.save(buyer);
            
            Transaction refundTx = Transaction.builder()
                    .order(order)
                    .user(buyer)
                    .amount(refundAmount)
                    .postBalance(buyer.getWalletBalance())
                    .type(TransactionType.ORDER_PAYOUT) 
                    .status(TransactionStatus.SUCCESS)
                    .build();
            transactionRepository.save(refundTx);
            log.info("Admin điều chỉnh giảm số lượng: Hoàn trả {}đ cho Buyer {}", refundAmount, buyer.getFullName());
        }

        order.setFinalQuantity(finalQuantity);
        order.setTotalPrice(newTotal);
        order.setStatus(OrderStatus.PREPARING); 
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateOrderStatus(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new IllegalArgumentException("Đơn hàng đã hoàn tất vĩnh viễn, không thể thay đổi trạng thái!");
        }

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
        boolean isOwnerSeller = order.getListing().getSeller().getId().equals(currentUserId);

        if (!isAdmin && !isOwnerSeller) {
            throw new SecurityException("Bạn không có quyền cập nhật trạng thái cho đơn hàng này!");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
        log.info("Order {} status updated to {} by {}", orderId, newStatus, currentUser.getUsername());
    }

    @Override
    @Transactional
    public void disputeOrder(UUID orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!order.getBuyer().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Chỉ người mua mới được quyền khiếu nại.");
        }

        if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.COMPLETED) {
            throw new IllegalArgumentException("Đơn hàng chưa ở trạng thái có thể khiếu nại (Cần DELIVERED hoặc COMPLETED).");
        }

        order.setStatus(OrderStatus.DISPUTED);
        order.setDisputeReason(reason);
        orderRepository.save(order);
        log.info("Order {} bị khiếu nại bởi Buyer {}. Lý do: {}", orderId, order.getBuyer().getFullName(), reason);
    }

    @Override
    @Transactional
    public void respondToDispute(UUID orderId, String response) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!order.getListing().getSeller().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Chỉ người bán mới được quyền phản hồi khiếu nại.");
        }

        if (order.getStatus() != OrderStatus.DISPUTED) {
            throw new IllegalArgumentException("Đơn hàng này không ở trạng thái khiếu nại.");
        }

        order.setSellerResponse(response);
        orderRepository.save(order);
        log.info("Seller {} đã phản hồi khiếu nại cho Order {}: {}", order.getListing().getSeller().getFullName(), orderId, response);
    }

    @Override
    @Transactional
    public void refundOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        UUID currentUserId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserId).get();

        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
        boolean isSeller = order.getListing().getSeller().getId().equals(currentUserId);

        if (!isAdmin && !isSeller) {
            throw new IllegalArgumentException("Chỉ Admin hoặc Người bán mới được quyền phê duyệt hoàn tiền.");
        }

        if (order.getStatus() != OrderStatus.DISPUTED) {
            throw new IllegalArgumentException("Đơn hàng phải ở trạng thái khiếu nại mới có thể hoàn tiền.");
        }

        BigDecimal totalPrice = order.getTotalPrice();
        BigDecimal refundAmount = totalPrice.multiply(new BigDecimal("0.90"))
                .setScale(0, java.math.RoundingMode.DOWN);

        User buyer = order.getBuyer();
        buyer.setWalletBalance(buyer.getWalletBalance().add(refundAmount));
        userRepository.save(buyer);

        BigDecimal totalWithFees = order.getTotalPrice();
        BigDecimal shippingFee = new BigDecimal("50000");
        BigDecimal aiFee = new BigDecimal("25000");
        BigDecimal subtotal = totalWithFees.subtract(shippingFee).subtract(aiFee);
        BigDecimal commission = subtotal.multiply(new BigDecimal("0.05")).setScale(0, java.math.RoundingMode.HALF_UP);
        BigDecimal sellerPayout = subtotal.subtract(commission);

        User seller = order.getListing().getSeller();
        seller.setWalletBalance(seller.getWalletBalance().subtract(sellerPayout));
        userRepository.save(seller);

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        Transaction refundTx = Transaction.builder()
                .order(order)
                .user(buyer)
                .amount(refundAmount)
                .postBalance(buyer.getWalletBalance())
                .type(TransactionType.REFUND)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(refundTx);

        log.info("Hoàn tiền Order {}: Buyer nhận lại {}đ (đã trừ 10% phí).", orderId, refundAmount);
    }
}
