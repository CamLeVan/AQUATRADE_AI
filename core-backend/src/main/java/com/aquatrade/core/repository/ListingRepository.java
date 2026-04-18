package com.aquatrade.core.repository;

import com.aquatrade.core.domain.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<Listing, UUID> {
    List<Listing> findByProvinceAndSpecies(String province, String species);
    List<Listing> findByProvince(String province);
    List<Listing> findBySpecies(String species);
}
