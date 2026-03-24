package com.room.room_service.repository;

import com.room.room_service.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByAvailabilityTrue();
    List<Room> findByType(Room.RoomType type);
    List<Room> findByStatus(Room.RoomStatus status);
}
