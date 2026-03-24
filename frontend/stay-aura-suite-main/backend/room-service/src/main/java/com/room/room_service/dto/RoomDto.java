package com.room.room_service.dto;

import com.room.room_service.entity.Room;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

public class RoomDto {

    @Data
    public static class Request {
        @NotNull private Room.RoomType type;
        @NotNull private BigDecimal price;
        private boolean availability = true;
        private Room.RoomStatus status = Room.RoomStatus.AVAILABLE;
        private String description;
        private Integer capacity;
        private String imageUrl;
    }

    @Data
    public static class Response {
        private Long roomId;
        private String type;
        private BigDecimal price;
        private boolean availability;
        private Room.RoomStatus status;
        private String description;
        private Integer capacity;
        private String imageUrl;

        public static Response from(Room room) {
            Response r = new Response();
            r.roomId = room.getRoomId();
            r.type = room.getType().name();
            r.price = room.getPrice();
            r.availability = room.isAvailability();
            r.status = room.getStatus();
            r.description = room.getDescription();
            r.capacity = room.getCapacity();
            r.imageUrl = room.getImageUrl();
            return r;
        }
    }
}
