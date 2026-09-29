package com.smartbuild.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnergyConsumptionRequest {

    @NotNull(message = "Unit ID is required")
    private UUID unitId;

    @NotNull(message = "Consumption is required")
    @DecimalMin(value = "0.0", message = "Consumption cannot be negative")
    private Double consumptionKwh;

    private LocalDateTime recordedAt;
}