package com.smartbuild.mapper;

import com.smartbuild.dto.request.FloorRequest;
import com.smartbuild.dto.response.FloorResponse;
import com.smartbuild.entity.Floor;
import org.springframework.stereotype.Component;

@Component
public class FloorMapper {

    public FloorResponse toResponse(Floor floor) {
        return FloorResponse.builder()
                .id(floor.getId())
                .buildingId(floor.getBuilding().getId())
                .buildingName(floor.getBuilding().getName())
                .floorNumber(floor.getFloorNumber())
                .name(floor.getName())
                .totalUnits(floor.getTotalUnits())
                .build();
    }
}