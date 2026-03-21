package com.reservations.reservation_service.service;

import com.reservations.reservation_service.dto.GuestDto;
import com.reservations.reservation_service.entity.Guest;
import com.reservations.reservation_service.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;

    public GuestDto.Response create(GuestDto.Request req) {
        Guest guest = new Guest();
        guest.setGuestFirstName(req.getGuestFirstName());
        guest.setGuestLastName(req.getGuestLastName());
        guest.setGuestEmail(req.getGuestEmail());
        guest.setGuestPhoneNo(req.getGuestPhoneNo());
        guest.setReservationId(req.getReservationId());
        return toResponse(guestRepository.save(guest));
    }

    public List<GuestDto.Response> getAll() {
        return guestRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public GuestDto.Response getById(String id) {
        return guestRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
    }

    public List<GuestDto.Response> getByReservation(String reservationId) {
        return guestRepository.findByReservationId(reservationId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    private GuestDto.Response toResponse(Guest g) {
        GuestDto.Response r = new GuestDto.Response();
        r.setGuestId(g.getGuestId());
        r.setGuestFirstName(g.getGuestFirstName());
        r.setGuestLastName(g.getGuestLastName());
        r.setGuestEmail(g.getGuestEmail());
        r.setGuestPhoneNo(g.getGuestPhoneNo());
        r.setReservationId(g.getReservationId());
        return r;
    }
}
