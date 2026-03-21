package com.reservations.reservation_service.repository;

import com.reservations.reservation_service.entity.Guest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GuestRepository extends MongoRepository<Guest, String> {
    List<Guest> findByReservationId(String reservationId);
}
