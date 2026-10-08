package com.agriconnect.repository;

import com.agriconnect.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    List<Order> findByItemsProductFarmerIdOrderByCreatedAtDesc(Long farmerId);
}
