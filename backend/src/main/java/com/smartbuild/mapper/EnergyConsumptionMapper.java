package com.smartbuild.mapper;

import com.smartbuild.dto.response.EnergyConsumptionResponse;
import com.smartbuild.entity.EnergyConsumption;
import org.springframework.stereotype.Component;

@Component
public class EnergyConsumptionMapper {

    public EnergyConsumptionResponse toResponse(
            EnergyConsumption energyConsumption) {

        return EnergyConsumptionResponse.builder()
                .id(energyConsumption.getId())
                .unitId(energyConsumption.getUnit().getId())
                .unitNumber(energyConsumption.getUnit().getUnitNumber())
                .consumptionKwh(energyConsumption.getConsumptionKwh())
                .recordedAt(energyConsumption.getRecordedAt())
                .createdAt(energyConsumption.getCreatedAt())
                .build();
    }
}