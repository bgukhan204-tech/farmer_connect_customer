package com.agriconnect.service;

import com.agriconnect.dto.OrderDto;
import com.agriconnect.entity.*;
import com.agriconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDto placeOrder(String username, String deliveryAddress,
                               String razorpayOrderId, String razorpayPaymentId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        double total = cartItems.stream()
                .mapToDouble(ci -> ci.getProduct().getPrice() * ci.getQuantity())
                .sum();

        cartItems.forEach(ci -> {
            Product p = ci.getProduct();
            if (!Boolean.TRUE.equals(p.getIsAvailable())) {
                throw new RuntimeException(p.getName() + " is not available");
            }
            if (p.getStockQty() < ci.getQuantity()) {
                throw new RuntimeException("Only " + p.getStockQty() + " " + p.getUnit() + " available for " + p.getName());
            }
        });

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status(OrderStatus.PAID)
                .deliveryAddress(deliveryAddress)
                .paymentMethod("RAZORPAY")
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .build();

        List<OrderItem> orderItems = cartItems.stream().map(ci -> {
            Product p = ci.getProduct();
            // Reduce stock
            p.setStockQty(p.getStockQty() - ci.getQuantity());
            productRepository.save(p);

            return OrderItem.builder()
                    .order(order)
                    .product(p)
                    .quantity(ci.getQuantity())
                    .price(p.getPrice())
                    .productName(p.getName())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        // Clear the cart
        cartItemRepository.deleteByUserId(user.getId());

        return toDto(saved);
    }

    @Transactional
    public OrderDto placeDirectOrder(String username, Long productId, Integer quantity,
                                     String deliveryAddress, String razorpayOrderId,
                                     String razorpayPaymentId) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!Boolean.TRUE.equals(product.getIsAvailable())) {
            throw new RuntimeException("Product is not available");
        }
        if (product.getStockQty() < quantity) {
            throw new RuntimeException("Only " + product.getStockQty() + " " + product.getUnit() + " available");
        }

        double total = product.getPrice() * quantity;
        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status(OrderStatus.PAID)
                .deliveryAddress(deliveryAddress)
                .paymentMethod("RAZORPAY")
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .build();

        product.setStockQty(product.getStockQty() - quantity);
        productRepository.save(product);

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(quantity)
                .price(product.getPrice())
                .productName(product.getName())
                .build();
        order.setItems(List.of(item));

        return toDto(orderRepository.save(order));
    }

    public List<OrderDto> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<OrderDto> getFarmerOrders(String username) {
        User farmer = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByItemsProductFarmerIdOrderByCreatedAtDesc(farmer.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String status, String farmerUsername) {
        User farmer = userRepository.findByUsername(farmerUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        boolean containsFarmerProduct = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(farmer.getId()));
        if (!containsFarmerProduct) {
            throw new RuntimeException("Unauthorized: order does not contain your products");
        }

        OrderStatus nextStatus;
        try {
            nextStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid order status");
        }

        order.setStatus(nextStatus);
        return toDto(orderRepository.save(order));
    }

    private OrderDto toDto(Order o) {
        List<OrderDto.OrderItemDto> items = o.getItems().stream()
                .map(i -> OrderDto.OrderItemDto.builder()
                        .productId(i.getProduct().getId())
                        .productName(i.getProductName())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .productImageUrl(i.getProduct().getImageUrl())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(o.getId())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus().name())
                .deliveryAddress(o.getDeliveryAddress())
                .paymentMethod(o.getPaymentMethod())
                .razorpayOrderId(o.getRazorpayOrderId())
                .razorpayPaymentId(o.getRazorpayPaymentId())
                .createdAt(o.getCreatedAt())
                .items(items)
                .build();
    }
}
