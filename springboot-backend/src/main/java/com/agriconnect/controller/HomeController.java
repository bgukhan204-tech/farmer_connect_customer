package com.agriconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "AgriConnect Backend API",
                "version", "1.0.0",
                "message", "AgriConnect backend is live and running successfully.",
                "endpoints", Map.of(
                        "products", "/api/products",
                        "auth", "/api/auth"
                )
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy"));
    }
}
