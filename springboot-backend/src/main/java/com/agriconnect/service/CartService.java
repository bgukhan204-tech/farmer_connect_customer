package com.agriconnect.service;

import com.agriconnect.dto.CartItemDto;
import com.agriconnect.entity.CartItem;
import com.agriconnect.entity.Product;
import com.agriconnect.entity.User;
import com.agriconnect.repository.CartItemRepository;
import com.agriconnect.repository.ProductRepository;
import com.agriconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<CartItemDto> getCart(String username) {
        User user = getUser(username);
        return cartItemRepository.findByUserId(user.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public CartItemDto addToCart(Long productId, Integer quantity, String username) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        User user = getUser(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!Boolean.TRUE.equals(product.getIsAvailable())) {
            throw new RuntimeException("Product is not available");
        }

        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(user.getId(), productId);

        CartItem cartItem;
        if (existing.isPresent()) {
            cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
        }
        return toDto(cartItemRepository.save(cartItem));
    }

    public CartItemDto updateQuantity(Long cartItemId, Integer quantity, String username) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!item.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        item.setQuantity(quantity);
        return toDto(cartItemRepository.save(item));
    }

    public void removeFromCart(Long cartItemId, String username) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!item.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(String username) {
        User user = getUser(username);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private CartItemDto toDto(CartItem item) {
        Product p = item.getProduct();
        return CartItemDto.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productImageUrl(p.getImageUrl())
                .productPrice(p.getPrice())
                .category(p.getCategory())
                .quantity(item.getQuantity())
                .subtotal(p.getPrice() * item.getQuantity())
                .build();
    }
}
