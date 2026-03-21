package com.staff.staff_service.dto;

import com.staff.staff_service.entity.Staff;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

public class StaffDto {

    @Data
    public static class Request {
        @NotBlank private String staffName;
        @NotBlank private String staffDept;
        private Staff.StaffStatus staffStatus = Staff.StaffStatus.ACTIVE;
        private BigDecimal salary;
    }

    @Data
    public static class Response {
        private Long staffId;
        private String staffName;
        private String staffDept;
        private Staff.StaffStatus staffStatus;
        private BigDecimal salary;

        public static Response from(Staff s) {
            Response r = new Response();
            r.staffId = s.getStaffId();
            r.staffName = s.getStaffName();
            r.staffDept = s.getStaffDept();
            r.staffStatus = s.getStaffStatus();
            r.salary = s.getSalary();
            return r;
        }
    }
}
