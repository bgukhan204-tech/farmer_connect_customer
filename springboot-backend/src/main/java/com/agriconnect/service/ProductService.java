package com.agriconnect.service;

import com.agriconnect.dto.ProductDto;
import com.agriconnect.entity.Product;
import com.agriconnect.entity.User;
import com.agriconnect.repository.ProductRepository;
import com.agriconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ProductDto> getAllProducts(String category, String search) {
        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.searchProducts(search);
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            products = productRepository.findByCategoryAndIsAvailableTrue(category);
        } else {
            products = productRepository.findByIsAvailableTrue();
        }
        return products.stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        return toDto(product);
    }

    public List<ProductDto> getProductsByFarmer(Long farmerId) {
        return productRepository.findByFarmerId(farmerId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProductDto createProduct(ProductDto dto, String username) {
        User farmer = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .stockQty(dto.getStockQty())
                .unit(dto.getUnit())
                .isAvailable(true)
                .farmer(farmer)
                .build();

        return toDto(productRepository.save(product));
    }

    public ProductDto updateProduct(Long id, ProductDto dto, String username) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getFarmer().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: not your product");
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setStockQty(dto.getStockQty());
        product.setUnit(dto.getUnit());
        if (dto.getIsAvailable() != null) product.setIsAvailable(dto.getIsAvailable());

        return toDto(productRepository.save(product));
    }

    public void deleteProduct(Long id, String username) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getFarmer().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: not your product");
        }
        productRepository.delete(product);
    }

    public ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .category(p.getCategory())
                .imageUrl(p.getImageUrl())
                .stockQty(p.getStockQty())
                .farmerId(p.getFarmer() != null ? p.getFarmer().getId() : null)
                .farmerName(p.getFarmer() != null ? p.getFarmer().getFullName() : null)
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .isAvailable(p.getIsAvailable())
                .unit(p.getUnit())
                .build();
    }
}
