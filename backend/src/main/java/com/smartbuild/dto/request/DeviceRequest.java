package com.smartbuild.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceRequest {

    @NotNull(message = "Unit ID is required")
    private UUID unitId;

    @NotBlank(message = "Device name is required")
    private String deviceName;

    @NotBlank(message = "Device type is required")
    private String deviceType;

    @NotBlank(message = "Device status is required")
    private String status;

    @NotNull(message = "Power consumption is required")
    @DecimalMin(value = "0.0", message = "Power consumption cannot be negative")
    private Double powerConsumptionWatts;
}