package com.agriconnect.controller;

import com.agriconnect.dto.PaymentVerifyRequest;
import com.agriconnect.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Double> body) {
        try {
            double amount = body.get("amount");
            Map<String, Object> response = paymentService.createOrder(amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to create Razorpay order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody PaymentVerifyRequest req) {
        boolean valid = paymentService.verifySignature(
                req.getRazorpayOrderId(),
                req.getRazorpayPaymentId(),
                req.getRazorpaySignature()
        );
        if (valid) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment verified successfully"));
        }
        return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Payment signature verification failed"));
    }
}
