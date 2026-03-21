package com.reservations.reservation_service.dto;

import com.reservations.reservation_service.entity.Reservation;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class ReservationDto {

    @Data
    public static class Request {
        @NotNull private Long userId;
        @NotNull private Long roomId;
        @NotNull private LocalDate checkIn;
        @NotNull private LocalDate checkOut;
        private String guestId;
        private String userEmail;
        private String userName;
    }

    @Data
    public static class Response {
        private String reservationId;
        private Long userId;
        private Long roomId;
        private LocalDate checkIn;
        private LocalDate checkOut;
        private Reservation.ReservationStatus status;
        private String guestId;

        public static Response from(Reservation r) {
            Response res = new Response();
            res.reservationId = r.getReservationId();
            res.userId = r.getUserId();
            res.roomId = r.getRoomId();
            res.checkIn = r.getCheckIn();
            res.checkOut = r.getCheckOut();
            res.status = r.getStatus();
            res.guestId = r.getGuestId();
            return res;
        }
    }
}
