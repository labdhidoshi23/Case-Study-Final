package com.payment.payment_service.service;

import com.payment.payment_service.client.EmailClient;
import com.payment.payment_service.dto.PaymentDto;
import com.payment.payment_service.entity.Payment;
import com.payment.payment_service.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final EmailClient emailClient;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public PaymentDto.OrderResponse createOrder(PaymentDto.OrderRequest req) {
        try {
            JSONObject options = new JSONObject();
            options.put("amount", req.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
            options.put("currency", req.getCurrency());
            options.put("receipt", "rcpt_" + req.getReservationId());

            Order order = razorpayClient.orders.create(options);

            Payment payment = new Payment();
            payment.setReservationId(req.getReservationId());
            payment.setAmount(req.getAmount());
            payment.setRazorpayOrderId(order.get("id"));
            payment.setStatus(Payment.PaymentStatus.PENDING);
            Payment saved = paymentRepository.save(payment);

            PaymentDto.OrderResponse response = new PaymentDto.OrderResponse();
            response.setRazorpayOrderId(order.get("id"));
            response.setAmount(req.getAmount());
            response.setCurrency(req.getCurrency());
            response.setBillId(saved.getBillId());
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    public PaymentDto.Response verifyPayment(PaymentDto.VerifyRequest req) {
        try {
            String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String generated = HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));

            Payment payment = paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            if (generated.equals(req.getRazorpaySignature())) {
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
                payment.setRazorpayPaymentId(req.getRazorpayPaymentId());
                payment.setPaymentMethod("RAZORPAY");
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
            }
            Payment saved = paymentRepository.save(payment);
            if (saved.getStatus() == Payment.PaymentStatus.SUCCESS && req.getCustomerEmail() != null && !req.getCustomerEmail().isBlank()) {
                try {
                    EmailClient.InvoiceRequest emailReq = new EmailClient.InvoiceRequest();
                    emailReq.setTo(req.getCustomerEmail());
                    emailReq.setReservationId(saved.getReservationId());
                    emailReq.setBillId(String.valueOf(saved.getBillId()));
                    emailReq.setAmount(saved.getAmount().toPlainString());
                    emailClient.sendInvoice(emailReq);
                } catch (Exception e) {
                    log.warn("Could not send invoice email: {}", e.getMessage());
                }
            }
            return PaymentDto.Response.from(saved);
        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    public List<PaymentDto.Response> getAll() {
        return paymentRepository.findAll().stream().map(PaymentDto.Response::from).collect(Collectors.toList());
    }

    public PaymentDto.Response getById(Long id) {
        return paymentRepository.findById(id)
                .map(PaymentDto.Response::from)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public List<PaymentDto.Response> getByReservation(String reservationId) {
        return paymentRepository.findByReservationId(reservationId).stream()
                .map(PaymentDto.Response::from).collect(Collectors.toList());
    }
}
