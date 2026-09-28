package com.smartbuild.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingResponse {

    private UUID id;
    private String name;
    private String address;
    private Integer totalFloors;
    private Integer totalUnits;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}