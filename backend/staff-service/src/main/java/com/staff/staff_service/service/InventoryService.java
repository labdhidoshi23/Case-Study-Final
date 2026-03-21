package com.staff.staff_service.service;

import com.staff.staff_service.dto.InventoryDto;
import com.staff.staff_service.entity.Inventory;
import com.staff.staff_service.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryDto.Response create(InventoryDto.Request req) {
        Inventory item = new Inventory();
        item.setItemName(req.getItemName());
        item.setCategory(req.getCategory());
        item.setQuantity(req.getQuantity());
        item.setUnit(req.getUnit());
        item.setDescription(req.getDescription());
        return toResponse(inventoryRepository.save(item));
    }

    public List<InventoryDto.Response> getAll() {
        return inventoryRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InventoryDto.Response getById(Long id) {
        return inventoryRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public InventoryDto.Response update(Long id, InventoryDto.Request req) {
        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setItemName(req.getItemName());
        item.setCategory(req.getCategory());
        item.setQuantity(req.getQuantity());
        item.setUnit(req.getUnit());
        item.setDescription(req.getDescription());
        return toResponse(inventoryRepository.save(item));
    }

    public void delete(Long id) {
        if (!inventoryRepository.existsById(id)) throw new RuntimeException("Item not found");
        inventoryRepository.deleteById(id);
    }

    private InventoryDto.Response toResponse(Inventory i) {
        InventoryDto.Response r = new InventoryDto.Response();
        r.setItemId(i.getItemId());
        r.setItemName(i.getItemName());
        r.setCategory(i.getCategory());
        r.setQuantity(i.getQuantity());
        r.setUnit(i.getUnit());
        r.setDescription(i.getDescription());
        return r;
    }
}
