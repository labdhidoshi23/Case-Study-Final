package com.reservations.reservation_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class GuestDto {

    @Data
    public static class Request {
        @NotBlank private String guestFirstName;
        @NotBlank private String guestLastName;
        @Email private String guestEmail;
        private String guestPhoneNo;
        private String reservationId;
    }

    @Data
    public static class Response {
        private String guestId;
        private String guestFirstName;
        private String guestLastName;
        private String guestEmail;
        private String guestPhoneNo;
        private String reservationId;
    }
}
