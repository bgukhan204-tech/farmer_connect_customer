package com.agriconnect.repository;

import com.agriconnect.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsAvailableTrue();

    List<Product> findByCategoryAndIsAvailableTrue(String category);

    @Query("SELECT p FROM Product p WHERE p.isAvailable = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%',:q,'%')))")
    List<Product> searchProducts(@Param("q") String query);

    List<Product> findByFarmerIdAndIsAvailableTrue(Long farmerId);

    List<Product> findByFarmerId(Long farmerId);
}
