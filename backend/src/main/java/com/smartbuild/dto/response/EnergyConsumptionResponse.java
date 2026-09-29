package com.smartbuild.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnergyConsumptionResponse {

    private UUID id;

    private UUID unitId;

    private String unitNumber;

    private Double consumptionKwh;

    private LocalDateTime recordedAt;

    private LocalDateTime createdAt;
}