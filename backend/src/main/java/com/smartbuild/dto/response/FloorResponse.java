package com.smartbuild.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FloorResponse {

    private UUID id;

    private UUID buildingId;

    private String buildingName;

    private Integer floorNumber;

    private String name;

    private Integer totalUnits;
}