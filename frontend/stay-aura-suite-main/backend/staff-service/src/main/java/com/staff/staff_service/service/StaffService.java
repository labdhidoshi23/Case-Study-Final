package com.staff.staff_service.service;

import com.staff.staff_service.dto.StaffDto;
import com.staff.staff_service.entity.Staff;
import com.staff.staff_service.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffDto.Response create(StaffDto.Request req) {
        Staff staff = new Staff();
        staff.setStaffName(req.getStaffName());
        staff.setStaffDept(req.getStaffDept());
        staff.setStaffStatus(req.getStaffStatus());
        staff.setSalary(req.getSalary());
        return StaffDto.Response.from(staffRepository.save(staff));
    }

    public List<StaffDto.Response> getAll() {
        return staffRepository.findAll().stream().map(StaffDto.Response::from).collect(Collectors.toList());
    }

    public StaffDto.Response getById(Long id) {
        return staffRepository.findById(id)
                .map(StaffDto.Response::from)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    public StaffDto.Response update(Long id, StaffDto.Request req) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        staff.setStaffName(req.getStaffName());
        staff.setStaffDept(req.getStaffDept());
        staff.setStaffStatus(req.getStaffStatus());
        staff.setSalary(req.getSalary());
        return StaffDto.Response.from(staffRepository.save(staff));
    }

    public void delete(Long id) {
        if (!staffRepository.existsById(id)) throw new RuntimeException("Staff not found");
        staffRepository.deleteById(id);
    }
}
