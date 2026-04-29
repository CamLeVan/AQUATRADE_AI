package com.aquatrade.core.service.impl;

import com.aquatrade.core.domain.Transaction;
import com.aquatrade.core.domain.User;
import com.aquatrade.core.dto.WalletDto;
import com.aquatrade.core.repository.TransactionRepository;
import com.aquatrade.core.repository.UserRepository;
import com.aquatrade.core.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public WalletDto getMyWallet() {
        // Lấy user từ JWT (DỮ LIỆU THẬT)
        UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user"));

        // Query 10 giao dịch gần nhất từ DB
        List<Transaction> transactions = transactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);

        List<WalletDto.TransactionDto> txDtos = transactions.stream()
                .map(tx -> WalletDto.TransactionDto.builder()
                        .id(tx.getId().toString())
                        .orderId(tx.getOrder() != null ? tx.getOrder().getId().toString() : null)
                        .amount(tx.getAmount())
                        .postBalance(tx.getPostBalance())
                        .type(tx.getType())
                        .paymentMethod(tx.getPaymentMethod())
                        .status(tx.getStatus())
                        .createdAt(tx.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return WalletDto.builder()
                .walletBalance(user.getWalletBalance())
                .recentTransactions(txDtos)
                .build();
    }

    @Override
    @Transactional
    public void deposit(WalletDto.DepositRequest request) {
        UUID userId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user"));

        if (request.getAmount() == null || request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền nạp phải lớn hơn 0");
        }

        // Cập nhật số dư
        java.math.BigDecimal newBalance = user.getWalletBalance().add(request.getAmount());
        user.setWalletBalance(newBalance);
        userRepository.save(user);

        // Lưu lịch sử giao dịch
        Transaction tx = Transaction.builder()
                .user(user)
                .amount(request.getAmount())
                .postBalance(newBalance)
                .type(com.aquatrade.core.domain.enums.TransactionType.TOP_UP)
                .paymentMethod(request.getPaymentMethod())
                .status(com.aquatrade.core.domain.enums.TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(tx);
    }
}
