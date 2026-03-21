package com.email_service.email_service.controller;

import com.email_service.email_service.dto.EmailDto;
import com.email_service.email_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/reservation")
    public ResponseEntity<Void> sendReservation(@RequestBody EmailDto.ReservationEmailRequest req) {
        emailService.sendReservationConfirmation(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/invoice")
    public ResponseEntity<Void> sendInvoice(@RequestBody EmailDto.InvoiceEmailRequest req) {
        emailService.sendInvoice(req);
        return ResponseEntity.ok().build();
    }
}
