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
    private final com.aquatrade.core.repository.ListingRepository listingRepository;
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
        User seller;
        if (userRepository.findByEmail("seller@gmail.com").isEmpty()) {
            seller = User.builder()
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
        } else {
            seller = userRepository.findByEmail("seller@gmail.com").get();
        }

        // Tạo Listings mẫu nếu chưa có bài nào
        if (listingRepository.count() == 0) {
            com.aquatrade.core.domain.Listing listing1 = com.aquatrade.core.domain.Listing.builder()
                    .title("Tôm Thẻ Chân Trắng - Size 40 con/kg")
                    .category(com.aquatrade.core.domain.enums.ListingCategory.TOM)
                    .species("Tôm Thẻ")
                    .province("Sóc Trăng")
                    .sizeMin(BigDecimal.valueOf(3.5))
                    .sizeMax(BigDecimal.valueOf(4.2))
                    .pricePerFish(BigDecimal.valueOf(1500))
                    .estimatedQuantity(50000)
                    .availableQuantity(50000)
                    .status(com.aquatrade.core.domain.enums.ListingStatus.PENDING_REVIEW)
                    .seller(seller)
                    .thumbnailUrl("https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&q=80&w=200")
                    .build();

            com.aquatrade.core.domain.Listing listing2 = com.aquatrade.core.domain.Listing.builder()
                    .title("Cá Tra Giống Miền Tây - Khỏe Mạnh")
                    .category(com.aquatrade.core.domain.enums.ListingCategory.CA)
                    .species("Cá Tra")
                    .province("An Giang")
                    .sizeMin(BigDecimal.valueOf(10.0))
                    .sizeMax(BigDecimal.valueOf(12.5))
                    .pricePerFish(BigDecimal.valueOf(800))
                    .estimatedQuantity(100000)
                    .availableQuantity(100000)
                    .status(com.aquatrade.core.domain.enums.ListingStatus.PENDING_REVIEW)
                    .seller(seller)
                    .thumbnailUrl("https://images.unsplash.com/photo-1524704659690-3f7a3fe41baa?auto=format&fit=crop&q=80&w=200")
                    .build();

            listingRepository.save(listing1);
            listingRepository.save(listing2);
            log.info(">>> Đã tạo 2 bài đăng mẫu đang chờ duyệt.");
        }
    }
}
