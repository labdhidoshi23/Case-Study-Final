package com.reservations.reservation_service.controller;

import com.reservations.reservation_service.dto.GuestDto;
import com.reservations.reservation_service.service.GuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    @PostMapping
    public ResponseEntity<GuestDto.Response> create(@Valid @RequestBody GuestDto.Request req) {
        return ResponseEntity.ok(guestService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<GuestDto.Response>> getAll() {
        return ResponseEntity.ok(guestService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(guestService.getById(id));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<GuestDto.Response>> getByReservation(@PathVariable String reservationId) {
        return ResponseEntity.ok(guestService.getByReservation(reservationId));
    }
}
