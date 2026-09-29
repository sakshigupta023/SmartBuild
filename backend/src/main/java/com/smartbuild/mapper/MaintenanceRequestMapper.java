package com.smartbuild.mapper;

import com.smartbuild.dto.response.MaintenanceRequestResponse;
import com.smartbuild.entity.MaintenanceRequest;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceRequestMapper {

    public MaintenanceRequestResponse toResponse(
            MaintenanceRequest maintenanceRequest) {

        return MaintenanceRequestResponse.builder()
                .id(maintenanceRequest.getId())
                .unitId(maintenanceRequest.getUnit().getId())
                .unitNumber(maintenanceRequest.getUnit().getUnitNumber())
                .title(maintenanceRequest.getTitle())
                .description(maintenanceRequest.getDescription())
                .priority(maintenanceRequest.getPriority())
                .status(maintenanceRequest.getStatus())
                .assignedTo(maintenanceRequest.getAssignedTo())
                .createdAt(maintenanceRequest.getCreatedAt())
                .updatedAt(maintenanceRequest.getUpdatedAt())
                .build();
    }
}