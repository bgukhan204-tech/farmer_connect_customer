package com.agriconnect.controller;

import com.agriconnect.dto.OrderDto;
import com.agriconnect.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getUserOrders(auth.getName()));
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<OrderDto>> getFarmerOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getFarmerOrders(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String deliveryAddress   = body.get("deliveryAddress");
        String razorpayOrderId   = body.get("razorpayOrderId");
        String razorpayPaymentId = body.get("razorpayPaymentId");
        return ResponseEntity.ok(
                orderService.placeOrder(auth.getName(), deliveryAddress, razorpayOrderId, razorpayPaymentId));
    }

    @PostMapping("/direct")
    public ResponseEntity<OrderDto> placeDirectOrder(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long productId = Long.valueOf(body.get("productId").toString());
        Integer quantity = Integer.valueOf(body.get("quantity").toString());
        String deliveryAddress = body.get("deliveryAddress").toString();
        String razorpayOrderId = body.get("razorpayOrderId").toString();
        String razorpayPaymentId = body.get("razorpayPaymentId").toString();

        return ResponseEntity.ok(orderService.placeDirectOrder(
                auth.getName(), productId, quantity, deliveryAddress, razorpayOrderId, razorpayPaymentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, body.get("status"), auth.getName()));
    }
}
