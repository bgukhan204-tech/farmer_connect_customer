package com.agriconnect.controller;

import com.agriconnect.dto.CartItemDto;
import com.agriconnect.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<CartItemDto> addToCart(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long productId = Long.valueOf(body.get("productId").toString());
        Integer quantity = body.containsKey("quantity")
                ? Integer.valueOf(body.get("quantity").toString()) : 1;
        return ResponseEntity.ok(cartService.addToCart(productId, quantity, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDto> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body,
            Authentication auth) {
        return ResponseEntity.ok(cartService.updateQuantity(id, body.get("quantity"), auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id, Authentication auth) {
        cartService.removeFromCart(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication auth) {
        cartService.clearCart(auth.getName());
        return ResponseEntity.noContent().build();
    }
}
