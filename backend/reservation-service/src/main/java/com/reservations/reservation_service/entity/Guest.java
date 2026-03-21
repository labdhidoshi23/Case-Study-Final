package com.reservations.reservation_service.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "guests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guest {

    @Id
    private String guestId;
    private String guestFirstName;
    private String guestLastName;
    private String guestEmail;
    private String guestPhoneNo;
    private String reservationId;
}
