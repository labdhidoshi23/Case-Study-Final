package com.payment.payment_service.dto;

import com.payment.payment_service.entity.Payment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {

    @Data
    public static class OrderRequest {
        @NotBlank private String reservationId;
        @NotNull private BigDecimal amount;
        private String currency = "INR";
    }

    @Data
    public static class OrderResponse {
        private String razorpayOrderId;
        private BigDecimal amount;
        private String currency;
        private Long billId;
    }

    @Data
    public static class VerifyRequest {
        @NotBlank private String razorpayOrderId;
        @NotBlank private String razorpayPaymentId;
        @NotBlank private String razorpaySignature;
        private String customerEmail;
    }

    @Data
    public static class Response {
        private Long billId;
        private String reservationId;
        private BigDecimal amount;
        private Payment.PaymentStatus status;
        private String paymentMethod;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private LocalDateTime createdAt;

        public static Response from(Payment p) {
            Response r = new Response();
            r.billId = p.getBillId();
            r.reservationId = p.getReservationId();
            r.amount = p.getAmount();
            r.status = p.getStatus();
            r.paymentMethod = p.getPaymentMethod();
            r.razorpayOrderId = p.getRazorpayOrderId();
            r.razorpayPaymentId = p.getRazorpayPaymentId();
            r.createdAt = p.getCreatedAt();
            return r;
        }
    }
}
