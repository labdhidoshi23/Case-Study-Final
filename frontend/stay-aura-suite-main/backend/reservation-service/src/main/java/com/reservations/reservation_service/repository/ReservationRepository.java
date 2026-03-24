package com.reservations.reservation_service.repository;

import com.reservations.reservation_service.entity.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByRoomId(Long roomId);
    List<Reservation> findByStatus(Reservation.ReservationStatus status);
}
