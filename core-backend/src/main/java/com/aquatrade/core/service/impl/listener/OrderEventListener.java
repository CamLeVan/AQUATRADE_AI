package com.aquatrade.core.service.impl.listener;

import com.aquatrade.core.domain.Order;
import com.aquatrade.core.domain.SystemTreasury;
import com.aquatrade.core.domain.Transaction;
import com.aquatrade.core.domain.User;
import com.aquatrade.core.domain.enums.TransactionStatus;
import com.aquatrade.core.domain.enums.TransactionType;
import com.aquatrade.core.domain.event.OrderCompletedEvent;
import com.aquatrade.core.repository.SystemTreasuryRepository;
import com.aquatrade.core.repository.TransactionRepository;
import com.aquatrade.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventListener {

    private final UserRepository userRepository;
    private final SystemTreasuryRepository systemTreasuryRepository;
    private final TransactionRepository transactionRepository;

    @Value("${app.commission.rate:0.05}")
    private BigDecimal commissionRate;

    @EventListener
    @Transactional
    public void handleOrderCompleted(OrderCompletedEvent event) {
        Order order = event.getOrder();
        log.info("Processing financial settlement for Order: {}", order.getId());

        // 1. Tính toán số tiền thực nhận và phí sàn
        BigDecimal totalAmount = order.getTotalPrice();
        BigDecimal serviceFee = totalAmount.multiply(commissionRate);
        BigDecimal sellerReceive = totalAmount.subtract(serviceFee);

        // 2. Cộng tiền cho Seller
        User seller = order.getListing().getSeller();
        seller.setWalletBalance(seller.getWalletBalance().add(sellerReceive));
        userRepository.save(seller);

        // Ghi lại lịch sử (Log) - Thanh toán cho Seller
        Transaction payoutTx = Transaction.builder()
                .order(order)
                .user(seller)
                .amount(sellerReceive)
                .postBalance(seller.getWalletBalance())
                .type(TransactionType.ORDER_PAYOUT)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(payoutTx);

        // 3. Cộng phí vào Kho bạc (System Treasury)
        SystemTreasury treasury = systemTreasuryRepository.findById(1)
                .orElse(SystemTreasury.builder().id(1).totalRevenue(BigDecimal.ZERO).build());
        treasury.setTotalRevenue(treasury.getTotalRevenue().add(serviceFee));
        systemTreasuryRepository.save(treasury);

        // Ghi lại lịch sử (Log) - Thu phí sàn
        Transaction feeTx = Transaction.builder()
                .order(order)
                .user(seller) // Gắn với Seller để biết khoản phí này thu từ đơn của ai
                .amount(serviceFee)
                .postBalance(treasury.getTotalRevenue())
                .type(TransactionType.PLATFORM_COMMISSION)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(feeTx);

        log.info("Settlement done for Order: {}. Seller received: {}, Fee collected: {}", 
                 order.getId(), sellerReceive, serviceFee);
    }
}
