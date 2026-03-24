package com.room.room_service.service;

import com.room.room_service.dto.RoomDto;
import com.room.room_service.entity.Room;
import com.room.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomDto.Response create(RoomDto.Request req) {
        Room room = new Room();
        mapToEntity(req, room);
        return RoomDto.Response.from(roomRepository.save(room));
    }

    public List<RoomDto.Response> getAll() {
        return roomRepository.findAll().stream().map(RoomDto.Response::from).collect(Collectors.toList());
    }

    public List<RoomDto.Response> getAvailable() {
        return roomRepository.findByAvailabilityTrue().stream().map(RoomDto.Response::from).collect(Collectors.toList());
    }

    public RoomDto.Response getById(Long id) {
        return roomRepository.findById(id)
                .map(RoomDto.Response::from)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public RoomDto.Response update(Long id, RoomDto.Request req) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        mapToEntity(req, room);
        return RoomDto.Response.from(roomRepository.save(room));
    }

    public void delete(Long id) {
        if (!roomRepository.existsById(id)) throw new RuntimeException("Room not found");
        roomRepository.deleteById(id);
    }

    public void updateAvailability(Long id, boolean available) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setAvailability(available);
        room.setStatus(available ? Room.RoomStatus.AVAILABLE : Room.RoomStatus.OCCUPIED);
        roomRepository.save(room);
    }

    private void mapToEntity(RoomDto.Request req, Room room) {
        room.setType(req.getType());
        room.setPrice(req.getPrice());
        room.setAvailability(req.isAvailability());
        room.setStatus(req.getStatus() != null ? req.getStatus() : Room.RoomStatus.AVAILABLE);
        room.setDescription(req.getDescription());
        room.setCapacity(req.getCapacity());
        room.setImageUrl(req.getImageUrl());
    }
}
