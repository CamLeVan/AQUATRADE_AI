package com.aquatrade.core.service.impl;

import com.aquatrade.core.domain.Listing;
import com.aquatrade.core.domain.User;
import com.aquatrade.core.domain.enums.ListingStatus;
import com.aquatrade.core.dto.ListingDto;
import com.aquatrade.core.repository.ListingRepository;
import com.aquatrade.core.repository.UserRepository;
import com.aquatrade.core.repository.OrderRepository;
import com.aquatrade.core.service.ListingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    public List<ListingDto> getAllListings(String province, String species) {
        List<Listing> listings;
        ListingStatus activeStatus = ListingStatus.AVAILABLE;

        if (province != null && species != null) {
            listings = listingRepository.findByProvinceAndSpeciesAndStatus(province, species, activeStatus);
        } else if (province != null) {
            listings = listingRepository.findByProvinceAndStatus(province, activeStatus);
        } else if (species != null) {
            listings = listingRepository.findBySpeciesAndStatus(species, activeStatus);
        } else {
            listings = listingRepository.findByStatus(activeStatus);
        }

        return listings.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ListingDto getListingById(UUID id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin đăng với ID: " + id));
        return mapToDto(listing);
    }

    @Override
    public ListingDto createListing(ListingDto.CreateListingRequest request) {
        // Lấy Seller từ JWT SecurityContext (DỮ LIỆU THẬT)
        UUID sellerId = (UUID) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user seller"));

        Listing listing = Listing.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .species(request.getSpecies())
                .province(request.getProvince())
                .sizeMin(request.getSizeMin())
                .sizeMax(request.getSizeMax())
                .pricePerFish(request.getPricePerFish())
                .estimatedQuantity(request.getEstimatedQuantity())
                .availableQuantity(request.getEstimatedQuantity())
                .thumbnailUrl(request.getThumbnailUrl())
                .status(ListingStatus.PENDING_REVIEW)
                .seller(seller)
                .build();

        listing = listingRepository.saveAndFlush(listing);
        log.info("Listing mới: {} - Seller: {}", listing.getTitle(), seller.getFullName());

        return mapToDto(listing);
    }

    @Override
    public List<ListingDto> getSellerListings(UUID sellerId) {
        log.info(">>> Đang tìm danh sách bài đăng cho Seller ID: {}", sellerId);
        List<Listing> results = listingRepository.findBySeller_IdAndStatusNot(sellerId, ListingStatus.DELETED);
        log.info(">>> Kết quả tìm kiếm: {} bài đăng (không tính DELETED) cho Seller ID: {}", results.size(), sellerId);
        
        return results.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ListingDto updatePrice(UUID listingId, java.math.BigDecimal newPrice) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));
        
        listing.setPricePerFish(newPrice);
        return mapToDto(listingRepository.save(listing));
    }

    private ListingDto mapToDto(Listing entity) {
        return ListingDto.builder()
                .id(entity.getId().toString())
                .title(entity.getTitle())
                .category(entity.getCategory())
                .species(entity.getSpecies())
                .province(entity.getProvince())
                .sizeMin(entity.getSizeMin())
                .sizeMax(entity.getSizeMax())
                .pricePerFish(entity.getPricePerFish())
                .estimatedQuantity(entity.getEstimatedQuantity())
                .availableQuantity(entity.getAvailableQuantity())
                .thumbnailUrl(entity.getThumbnailUrl())
                .status(entity.getStatus())
                .sellerName(entity.getSeller().getFullName())
                .sellerId(entity.getSeller().getId().toString())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    @Override
    public void deleteListing(UUID id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tin đăng với ID: " + id));
        
        // Kiểm tra xem tin đăng này đã có đơn hàng nào chưa
        boolean hasOrders = orderRepository.existsByListingId(id);
        
        if (hasOrders) {
            // Nếu đã có đơn hàng, chỉ xóa mềm (Soft Delete) bằng cách đổi trạng thái
            listing.setStatus(ListingStatus.DELETED);
            listingRepository.save(listing);
            log.info("Đã chuyển trạng thái tin đăng ID: {} sang DELETED (do đã có đơn hàng liên kết)", id);
        } else {
            // Nếu chưa có đơn hàng, cho phép xóa cứng (Hard Delete)
            listingRepository.delete(listing);
            log.info("Đã xóa vĩnh viễn tin đăng ID: {}", id);
        }
    }
}
