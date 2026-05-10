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

    @Value("${cloudinary.video-preset}")
    private String videoPreset;

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
        params.put("upload_preset", videoPreset);
        params.put("folder", "aquatrade/videos");

        String signature = cloudinary.apiSignRequest(params, apiSecret);

        return CloudinarySignatureResponse.builder()
                .signature(signature)
                .timestamp(timestamp)
                .apiKey(apiKey)
                .cloudName(cloudName)
                .uploadPreset(videoPreset)
                .build();
    }
}
