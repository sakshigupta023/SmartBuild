package com.smartbuild.dto.response;

import com.smartbuild.entity.UnitStatus;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitResponse {

    private UUID id;

    private UUID floorId;

    private Integer floorNumber;

    private String floorName;

    private String unitNumber;

    private String unitType;

    private Double areaSqFt;

    private UnitStatus status;
}