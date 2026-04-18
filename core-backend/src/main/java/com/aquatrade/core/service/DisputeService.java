package com.aquatrade.core.service;

import com.aquatrade.core.dto.DisputeDto;

public interface DisputeService {
    DisputeDto.DisputeResponse createDispute(String orderId, DisputeDto.CreateDisputeRequest request);
}
