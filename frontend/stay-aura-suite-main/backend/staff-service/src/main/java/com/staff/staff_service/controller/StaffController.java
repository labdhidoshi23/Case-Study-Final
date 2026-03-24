package com.staff.staff_service.controller;

import com.staff.staff_service.dto.StaffDto;
import com.staff.staff_service.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    public ResponseEntity<StaffDto.Response> create(@Valid @RequestBody StaffDto.Request req) {
        return ResponseEntity.ok(staffService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<StaffDto.Response>> getAll() {
        return ResponseEntity.ok(staffService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffDto.Response> update(@PathVariable Long id,
                                                     @Valid @RequestBody StaffDto.Request req) {
        return ResponseEntity.ok(staffService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        staffService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
