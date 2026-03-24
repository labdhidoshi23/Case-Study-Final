package com.emailservice.email_service.dto;

import lombok.Data;

public class EmailDto {

    @Data
    public static class ReservationEmailRequest {
        private String to;
        private String reservationId;
        private String guestName;
    }

    @Data
    public static class InvoiceEmailRequest {
        private String to;
        private String reservationId;
        private String billId;
        private String amount;
    }
}
