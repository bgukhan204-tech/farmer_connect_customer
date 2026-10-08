package com.agriconnect.controller;

import com.agriconnect.dto.ProductDto;
import com.agriconnect.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.getAllProducts(category, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<ProductDto>> getByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(productService.getProductsByFarmer(farmerId));
    }

    @PostMapping
    public ResponseEntity<ProductDto> create(
            @RequestBody ProductDto dto,
            Authentication auth) {
        return ResponseEntity.ok(productService.createProduct(dto, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> update(
            @PathVariable Long id,
            @RequestBody ProductDto dto,
            Authentication auth) {
        return ResponseEntity.ok(productService.updateProduct(id, dto, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        productService.deleteProduct(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
