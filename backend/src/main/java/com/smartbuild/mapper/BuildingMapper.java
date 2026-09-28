package com.smartbuild.mapper;

import com.smartbuild.dto.request.BuildingRequest;
import com.smartbuild.dto.response.BuildingResponse;
import com.smartbuild.entity.Building;
import org.springframework.stereotype.Component;

@Component
public class BuildingMapper {

    public Building toEntity(BuildingRequest request) {
        return Building.builder()
                .name(request.getName())
                .address(request.getAddress())
                .totalFloors(request.getTotalFloors())
                .totalUnits(request.getTotalUnits())
                .build();
    }

    public BuildingResponse toResponse(Building building) {
        return BuildingResponse.builder()
                .id(building.getId())
                .name(building.getName())
                .address(building.getAddress())
                .totalFloors(building.getTotalFloors())
                .totalUnits(building.getTotalUnits())
                .createdAt(building.getCreatedAt())
                .updatedAt(building.getUpdatedAt())
                .build();
    }

    public void updateEntity(Building building, BuildingRequest request) {
        building.setName(request.getName());
        building.setAddress(request.getAddress());
        building.setTotalFloors(request.getTotalFloors());
        building.setTotalUnits(request.getTotalUnits());
    }
}