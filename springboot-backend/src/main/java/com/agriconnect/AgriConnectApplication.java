package com.agriconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AgriConnectApplication {
    public static void main(String[] args) {
        SpringApplication.run(AgriConnectApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  AgriConnect API is running on port 8080");
        System.out.println("  Farmer-Customer Marketplace");
        System.out.println("========================================\n");
    }
}
