package com.smartbuild.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalBuildings;

    private long totalFloors;

    private long totalUnits;

    private long occupiedUnits;

    private long availableUnits;

    private long maintenanceUnits;

    private long totalDevices;

    private long activeDevices;

    private long totalMaintenanceRequests;

    private long openMaintenanceRequests;

    private long inProgressMaintenanceRequests;

    private long completedMaintenanceRequests;

    private double totalEnergyConsumptionKwh;
}