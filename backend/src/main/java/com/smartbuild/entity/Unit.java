package com.smartbuild.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
    name = "units",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"floor_id", "unit_number"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;

    @Column(name = "unit_number", nullable = false)
    private String unitNumber;

    @Column(name = "unit_type", nullable = false)
    private String unitType;

    @Column(name = "area_sq_ft")
    private Double areaSqFt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitStatus status;
}