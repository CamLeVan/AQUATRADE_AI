package com.aquatrade.core.service.impl;

import com.aquatrade.core.domain.Dispute;
import com.aquatrade.core.domain.Order;
import com.aquatrade.core.domain.User;
import com.aquatrade.core.domain.enums.DisputeStatus;
import com.aquatrade.core.dto.DisputeDto;
import com.aquatrade.core.repository.DisputeRepository;
import com.aquatrade.core.repository.OrderRepository;
import com.aquatrade.core.repository.UserRepository;
import com.aquatrade.core.service.DisputeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisputeServiceImpl implements DisputeService {

    private final DisputeRepository disputeRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public DisputeDto.DisputeResponse createDispute(String orderId, DisputeDto.CreateDisputeRequest request) {
        Order order = orderRepository.findById(UUID.fromString(orderId))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User complainer = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user"));

        // Lưu Dispute vào DB thật
        Dispute dispute = Dispute.builder()
                .order(order)
                .complainer(complainer)
                .reasonText(request.getReason())
                .status(DisputeStatus.OPEN)
                .build();

        dispute = disputeRepository.save(dispute);
        log.info("Dispute mới: {} - Order: {} - By: {}", dispute.getId(), orderId, complainer.getFullName());

        return DisputeDto.DisputeResponse.builder()
                .id(dispute.getId().toString())
                .orderId(orderId)
                .status(dispute.getStatus().name())
                .reasonText(dispute.getReasonText())
                .createdAt(dispute.getCreatedAt())
                .build();
    }
}
