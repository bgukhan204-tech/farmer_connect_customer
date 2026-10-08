package com.agriconnect.dto;

import lombok.Data;

@Data
public class PaymentOrderRequest {
    private Double amount;      // in INR
    private String currency;    // "INR"
    private String receipt;     // e.g. "order_1"
}
