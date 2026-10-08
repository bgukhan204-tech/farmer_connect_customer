package com.agriconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private Integer stockQty;
    private Long farmerId;
    private String farmerName;
    private Double rating;
    private Integer reviewCount;
    private Boolean isAvailable;
    private String unit;
}
