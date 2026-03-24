package com.reservations.reservation_service.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "email-service")
public interface EmailClient {

    @PostMapping("/api/emails/reservation")
    void sendReservationEmail(@RequestBody EmailRequest request);

    @Data
    class EmailRequest {
        private String to;
        private String reservationId;
        private String guestName;
    }
}
