package com.smartbuild.dto.request;

import com.smartbuild.entity.UnitStatus;
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
public class UnitRequest {

    @NotNull(message = "Floor ID is required")
    private UUID floorId;

    @NotBlank(message = "Unit number is required")
    private String unitNumber;

    @NotBlank(message = "Unit type is required")
    private String unitType;

    @NotNull(message = "Area is required")
    @DecimalMin(value = "1.0", message = "Area must be greater than 0")
    private Double areaSqFt;

    @NotNull(message = "Unit status is required")
    private UnitStatus status;
}