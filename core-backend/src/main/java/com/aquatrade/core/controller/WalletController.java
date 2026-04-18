package com.aquatrade.core.controller;

import com.aquatrade.core.dto.WalletDto;
import com.aquatrade.core.dto.response.ApiResponse;
import com.aquatrade.core.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<ApiResponse<WalletDto>> getMyWallet() {
        return ResponseEntity.ok(ApiResponse.success(walletService.getMyWallet()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<String>> deposit(@RequestBody WalletDto.DepositRequest request) {
        walletService.deposit(request);
        return ResponseEntity.ok(ApiResponse.success("Nạp tiền thành công"));
    }
}
