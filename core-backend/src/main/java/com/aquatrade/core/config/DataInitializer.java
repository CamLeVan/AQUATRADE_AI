package com.aquatrade.core.config;

import com.aquatrade.core.domain.User;
import com.aquatrade.core.domain.enums.Role;
import com.aquatrade.core.domain.enums.UserStatus;
import com.aquatrade.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra nếu chưa có Admin thì tạo mặc định
        if (userRepository.countByRoleAndStatus(Role.ADMIN, UserStatus.ACTIVE) == 0) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@gmail.com")
                    .passwordHash(passwordEncoder.encode("admin@123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .walletBalance(BigDecimal.valueOf(1000000))
                    .build();

            userRepository.save(admin);
            log.info(">>> Đã tạo tài khoản Admin mặc định: admin@gmail.com / admin@123");
        }

        // Tạo thêm một Seller mẫu nếu cần
        if (userRepository.findByEmail("seller@gmail.com").isEmpty()) {
            User seller = User.builder()
                    .fullName("Aqua Farm Seller")
                    .email("seller@gmail.com")
                    .passwordHash(passwordEncoder.encode("seller@123"))
                    .role(Role.SELLER)
                    .status(UserStatus.ACTIVE)
                    .walletBalance(BigDecimal.ZERO)
                    .companyName("Mekong Delta Seafood")
                    .build();
            userRepository.save(seller);
            log.info(">>> Đã tạo tài khoản Seller mẫu: seller@gmail.com / seller@123");
        }
    }
}
