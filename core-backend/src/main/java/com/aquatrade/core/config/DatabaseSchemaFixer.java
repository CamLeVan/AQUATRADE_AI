package com.aquatrade.core.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseSchemaFixer {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixListingStatusConstraint() {
        try {
            log.info(">>> Đang cập nhật ràng buộc listings_status_check trong Database...");
            
            // Xóa ràng buộc cũ nếu tồn tại
            jdbcTemplate.execute("ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check");
            
            // Thêm ràng buộc mới bao gồm cả DELETED
            jdbcTemplate.execute("ALTER TABLE listings ADD CONSTRAINT listings_status_check CHECK (status IN ('PENDING_REVIEW', 'AVAILABLE', 'SOLD', 'HIDDEN', 'REJECTED', 'DELETED'))");
            
            log.info(">>> Cập nhật Database thành công! Trạng thái DELETED hiện đã khả dụng.");
        } catch (Exception e) {
            log.warn(">>> Không thể cập nhật ràng buộc Database (có thể nó đã được cập nhật hoặc có tên khác): {}", e.getMessage());
        }
    }
}
