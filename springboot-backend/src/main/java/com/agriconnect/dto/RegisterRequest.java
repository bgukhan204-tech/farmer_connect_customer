package com.agriconnect.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private String role; // "FARMER" or "CUSTOMER"
}
