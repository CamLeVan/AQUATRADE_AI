package com.aquatrade.core.repository;

import com.aquatrade.core.domain.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<Listing, UUID> {
    List<Listing> findByStatus(ListingStatus status);
    List<Listing> findByProvinceAndSpeciesAndStatus(String province, String species, ListingStatus status);
    List<Listing> findByProvinceAndStatus(String province, ListingStatus status);
    List<Listing> findBySpeciesAndStatus(String species, ListingStatus status);
}
