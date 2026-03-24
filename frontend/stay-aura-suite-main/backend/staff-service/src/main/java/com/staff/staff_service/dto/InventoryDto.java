package com.staff.staff_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class InventoryDto {

    @Data
    public static class Request {
        @NotBlank private String itemName;
        private String category;
        private Integer quantity;
        private String unit;
        private String description;
    }

    @Data
    public static class Response {
        private Long itemId;
        private String itemName;
        private String category;
        private Integer quantity;
        private String unit;
        private String description;
    }
}
