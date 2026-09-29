package com.smartbuild.mapper;

import com.smartbuild.dto.response.UnitResponse;
import com.smartbuild.entity.Unit;
import org.springframework.stereotype.Component;

@Component
public class UnitMapper {

    public UnitResponse toResponse(Unit unit) {

        return UnitResponse.builder()
                .id(unit.getId())
                .floorId(unit.getFloor().getId())
                .floorNumber(unit.getFloor().getFloorNumber())
                .floorName(unit.getFloor().getName())
                .unitNumber(unit.getUnitNumber())
                .unitType(unit.getUnitType())
                .areaSqFt(unit.getAreaSqFt())
                .status(unit.getStatus())
                .build();
    }
}