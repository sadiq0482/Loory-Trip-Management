package com.lorry;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "trips")
public class Trip {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long userId;
    public long createdAt;

    public LocalDate tripDate;   // date of the trip

    public String pickup;        // Wagon | Godown
    public String lorryNumber;
    public String fromAddr;
    public String toAddr;
    public String type;          // DIP | Delivery
    public Integer trips;        // used when type = DIP
    public Double amount;        // used when type = Delivery
    public String payer;
    public String status = "active";   // active | paid
}