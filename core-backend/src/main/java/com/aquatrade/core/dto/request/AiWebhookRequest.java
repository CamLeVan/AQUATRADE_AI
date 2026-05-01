package com.aquatrade.core.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.Instant;

/**
 * Body từ AI service theo §3 (camelCase). Optional {@code originalVideoHash} (Sprint 3.1).
 */
@Data
public class AiWebhookRequest {

    @NotBlank
    @JsonProperty("ticketId")
    private String ticketId;

    @NotBlank
    @JsonProperty("orderId")
    private String orderId;

    @NotNull
    @Min(0)
    @JsonProperty("fishCount")
    private Integer fishCount;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @JsonProperty("healthScore")
    private Double healthScore;

    @NotBlank
    @JsonProperty("resultVideoUrl")
    private String resultVideoUrl;

    @NotNull
    @JsonProperty("timestamp")
    private Instant timestamp;

    /** SHA-256 hex của video gốc (audit / dispute). */
    @JsonProperty("originalVideoHash")
    private String originalVideoHash;
}
