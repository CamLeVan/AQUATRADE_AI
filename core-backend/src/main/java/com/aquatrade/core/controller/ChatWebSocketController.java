package com.aquatrade.core.controller;

import com.aquatrade.core.dto.ChatDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    // (Inject ChatMessageRepository tại đây để lưu DB)

    // Lắng nghe đường dẫn từ client: Gửi tới /app/chat/{orderId}/send
    @MessageMapping("/chat/{orderId}/send")
    @Transactional
    public void sendMessage(@DestinationVariable UUID orderId, @Payload ChatDto.ChatMessage payload) {
        log.info("Nhận tin nhắn socket vào room Order {}: {}", orderId, payload.getContent());

        // TODO: Lưu vào DB thông qua Repository

        // Broadcast (phát thanh) lập tức lại vào kênh cho người kia nghe thấy
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, payload);
    }
}
