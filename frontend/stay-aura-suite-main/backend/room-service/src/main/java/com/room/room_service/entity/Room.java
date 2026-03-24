package com.room.room_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @NotNull
    @Enumerated(EnumType.STRING)
    private RoomType type;

    @NotNull
    private BigDecimal price;

    private boolean availability = true;

    @Enumerated(EnumType.STRING)
    private RoomStatus status = RoomStatus.AVAILABLE;

    private String description;
    private Integer capacity;
    private String imageUrl;

    public enum RoomStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
    }

    public enum RoomType {
        DELUXE, SUITE, PENTHOUSE, STANDARD
    }
}
