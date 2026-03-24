package com.reservations.reservation_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "room-service")
public interface RoomClient {

    @PatchMapping("/api/rooms/{id}/availability")
    void updateAvailability(@PathVariable("id") Long roomId, @RequestParam("available") boolean available);
}
