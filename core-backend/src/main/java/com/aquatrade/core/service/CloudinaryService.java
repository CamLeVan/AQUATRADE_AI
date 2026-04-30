package com.aquatrade.core.service;

import com.aquatrade.core.dto.CloudinarySignatureResponse;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    /**
     * Tạo chữ ký bảo mật để Frontend có thể upload trực tiếp lên Cloudinary.
     * @return DTO chứa signature và timestamp
     */
    public CloudinarySignatureResponse generateSignature() {
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));

        long timestamp = System.currentTimeMillis() / 1000L;
        
        Map<String, Object> params = new HashMap<>();
        params.put("timestamp", timestamp);
        // Folder mặc định cho video cá để dễ quản lý trên Cloudinary Dashboard
        params.put("folder", "aquatrade/fish_videos");

        String signature = cloudinary.apiSignRequest(params, apiSecret);

        return CloudinarySignatureResponse.builder()
                .signature(signature)
                .timestamp(timestamp)
                .apiKey(apiKey)
                .cloudName(cloudName)
                .build();
    }
}
