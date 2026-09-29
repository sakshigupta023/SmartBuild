package com.smartbuild.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FloorRequest {

    @NotNull(message = "Building ID is required")
    private UUID buildingId;

    @NotNull(message = "Floor number is required")
    @Min(value = 1, message = "Floor number must be at least 1")
    private Integer floorNumber;

    @NotBlank(message = "Floor name is required")
    private String name;

    @NotNull(message = "Total units is required")
    @Min(value = 0, message = "Total units cannot be negative")
    private Integer totalUnits;
}