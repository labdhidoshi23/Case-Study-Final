package com.reservations.reservation_service.service;

import com.reservations.reservation_service.client.EmailClient;
import com.reservations.reservation_service.client.RoomClient;
import com.reservations.reservation_service.dto.ReservationDto;
import com.reservations.reservation_service.entity.Reservation;
import com.reservations.reservation_service.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomClient roomClient;
    private final EmailClient emailClient;

    public ReservationDto.Response create(ReservationDto.Request req) {
        Reservation reservation = new Reservation();
        reservation.setUserId(req.getUserId());
        reservation.setRoomId(req.getRoomId());
        reservation.setCheckIn(req.getCheckIn());
        reservation.setCheckOut(req.getCheckOut());
        reservation.setGuestId(req.getGuestId());
        reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
        Reservation saved = reservationRepository.save(reservation);
        try {
            roomClient.updateAvailability(req.getRoomId(), false);
        } catch (Exception e) {
            log.warn("Could not update room availability: {}", e.getMessage());
        }
        if (req.getUserEmail() != null && !req.getUserEmail().isBlank()) {
            try {
                EmailClient.EmailRequest emailReq = new EmailClient.EmailRequest();
                emailReq.setTo(req.getUserEmail());
                emailReq.setReservationId(saved.getReservationId());
                emailReq.setGuestName(req.getUserName() != null ? req.getUserName() : "Guest");
                emailClient.sendReservationEmail(emailReq);
            } catch (Exception e) {
                log.warn("Could not send reservation confirmation email: {}", e.getMessage());
            }
        }
        return ReservationDto.Response.from(saved);
    }

    public List<ReservationDto.Response> getAll() {
        return reservationRepository.findAll().stream()
                .map(ReservationDto.Response::from).collect(Collectors.toList());
    }

    public ReservationDto.Response getById(String id) {
        return reservationRepository.findById(id)
                .map(ReservationDto.Response::from)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    public List<ReservationDto.Response> getByUser(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(ReservationDto.Response::from).collect(Collectors.toList());
    }

    public ReservationDto.Response updateStatus(String id, Reservation.ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(status);
        if (status == Reservation.ReservationStatus.CANCELLED ||
            status == Reservation.ReservationStatus.CHECKED_OUT) {
            try {
                roomClient.updateAvailability(reservation.getRoomId(), true);
            } catch (Exception e) {
                log.warn("Could not update room availability: {}", e.getMessage());
            }
        }
        return ReservationDto.Response.from(reservationRepository.save(reservation));
    }

    public void cancel(String id) {
        updateStatus(id, Reservation.ReservationStatus.CANCELLED);
    }
}
