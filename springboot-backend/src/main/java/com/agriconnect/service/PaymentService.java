package com.agriconnect.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${payments.demo.enabled:false}")
    private boolean demoPaymentsEnabled;

    public Map<String, Object> createOrder(double amountInRupees) throws RazorpayException {
        if (isDemoMode()) {
            int amountInPaise = (int) Math.round(amountInRupees * 100);
            return Map.of(
                    "razorpayOrderId", "order_demo_" + System.currentTimeMillis(),
                    "amount", amountInPaise,
                    "currency", "INR",
                    "keyId", "demo",
                    "demo", true
            );
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int)(amountInRupees * 100)); // convert to paise
        options.put("currency", "INR");
        options.put("receipt", "ac_receipt_" + System.currentTimeMillis());
        options.put("payment_capture", 1);

        com.razorpay.Order order = client.orders.create(options);

        return Map.of(
            "razorpayOrderId", order.get("id").toString(),
            "amount", order.get("amount").toString(),
            "currency", "INR",
            "keyId", keyId
        );
    }

    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String signature) {
        try {
            if (isDemoMode() && razorpayOrderId != null && razorpayOrderId.startsWith("order_demo_")) {
                return true;
            }

            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String generated = HexFormat.of().formatHex(hash);
            return generated.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isDemoMode() {
        return demoPaymentsEnabled && (keyId == null || keySecret == null
                || keyId.isBlank() || keySecret.isBlank()
                || keyId.contains("YOUR_KEY") || keySecret.contains("YOUR_KEY")
                || "demo".equalsIgnoreCase(keyId));
    }
}
