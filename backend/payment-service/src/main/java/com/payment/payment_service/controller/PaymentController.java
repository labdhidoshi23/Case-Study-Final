package com.payment.payment_service.controller;

import com.payment.payment_service.dto.PaymentDto;
import com.payment.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/order")
    public ResponseEntity<PaymentDto.OrderResponse> createOrder(@Valid @RequestBody PaymentDto.OrderRequest req) {
        return ResponseEntity.ok(paymentService.createOrder(req));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentDto.Response> verify(@Valid @RequestBody PaymentDto.VerifyRequest req) {
        return ResponseEntity.ok(paymentService.verifyPayment(req));
    }

    @GetMapping
    public ResponseEntity<List<PaymentDto.Response>> getAll() {
        return ResponseEntity.ok(paymentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getById(id));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<PaymentDto.Response> getInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getById(id));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<PaymentDto.Response>> getByReservation(@PathVariable String reservationId) {
        return ResponseEntity.ok(paymentService.getByReservation(reservationId));
    }
}
