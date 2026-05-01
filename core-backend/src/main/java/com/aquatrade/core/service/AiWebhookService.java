package com.aquatrade.core.service;

import com.aquatrade.core.dto.request.AiWebhookRequest;
import com.aquatrade.core.dto.response.ApiResponse;

import java.util.Map;

public interface AiWebhookService {

    /**
     * Xác thực secret, lưu {@link com.aquatrade.core.domain.DigitalProof}, idempotent theo ticketId.
     */
    ApiResponse<Map<String, Object>> handleWebhook(String internalSecret, AiWebhookRequest request);
}
