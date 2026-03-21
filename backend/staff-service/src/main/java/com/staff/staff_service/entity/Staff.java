package com.staff.staff_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staffId;

    @NotBlank
    private String staffName;

    @NotBlank
    private String staffDept;

    @Enumerated(EnumType.STRING)
    private StaffStatus staffStatus = StaffStatus.ACTIVE;

    private BigDecimal salary;

    public enum StaffStatus {
        ACTIVE, INACTIVE, ON_LEAVE
    }
}
