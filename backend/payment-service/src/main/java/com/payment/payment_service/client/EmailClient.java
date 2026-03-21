package com.payment.payment_service.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "email-service")
public interface EmailClient {

    @PostMapping("/api/emails/invoice")
    void sendInvoice(@RequestBody InvoiceRequest request);

    @Data
    class InvoiceRequest {
        private String to;
        private String reservationId;
        private String billId;
        private String amount;
    }
}
