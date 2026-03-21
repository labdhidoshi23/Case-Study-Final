package com.staff.staff_service.repository;

import com.staff.staff_service.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByStaffDept(String dept);
    List<Staff> findByStaffStatus(Staff.StaffStatus status);
}
