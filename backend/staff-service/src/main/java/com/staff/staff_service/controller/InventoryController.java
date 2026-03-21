package com.staff.staff_service.controller;

import com.staff.staff_service.dto.InventoryDto;
import com.staff.staff_service.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<InventoryDto.Response> create(@Valid @RequestBody InventoryDto.Request req) {
        return ResponseEntity.ok(inventoryService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<InventoryDto.Response>> getAll() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryDto.Response> update(@PathVariable Long id,
                                                         @Valid @RequestBody InventoryDto.Request req) {
        return ResponseEntity.ok(inventoryService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
