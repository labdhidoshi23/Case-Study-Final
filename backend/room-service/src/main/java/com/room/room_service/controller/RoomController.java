package com.room.room_service.controller;

import com.room.room_service.dto.RoomDto;
import com.room.room_service.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDto.Response> create(@Valid @RequestBody RoomDto.Request req) {
        return ResponseEntity.ok(roomService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<RoomDto.Response>> getAll() {
        return ResponseEntity.ok(roomService.getAll());
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomDto.Response>> getAvailable() {
        return ResponseEntity.ok(roomService.getAvailable());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDto.Response> update(@PathVariable Long id,
                                                    @Valid @RequestBody RoomDto.Request req) {
        return ResponseEntity.ok(roomService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Void> updateAvailability(@PathVariable Long id,
                                                    @RequestParam boolean available) {
        roomService.updateAvailability(id, available);
        return ResponseEntity.ok().build();
    }
}
