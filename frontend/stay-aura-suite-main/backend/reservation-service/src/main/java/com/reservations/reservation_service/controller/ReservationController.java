package com.reservations.reservation_service.controller;

import com.reservations.reservation_service.dto.ReservationDto;
import com.reservations.reservation_service.entity.Reservation;
import com.reservations.reservation_service.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationDto.Response> create(@Valid @RequestBody ReservationDto.Request req) {
        return ResponseEntity.ok(reservationService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<ReservationDto.Response>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDto.Response>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getByUser(userId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable String id) {
        reservationService.cancel(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/check-in")
    public ResponseEntity<ReservationDto.Response> checkIn(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.updateStatus(id, Reservation.ReservationStatus.CHECKED_IN));
    }

    @PutMapping("/{id}/check-out")
    public ResponseEntity<ReservationDto.Response> checkOut(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.updateStatus(id, Reservation.ReservationStatus.CHECKED_OUT));
    }
}
