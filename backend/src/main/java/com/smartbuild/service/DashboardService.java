package com.smartbuild.service;

import com.smartbuild.dto.response.DashboardResponse;
import com.smartbuild.entity.UnitStatus;
import com.smartbuild.repository.BuildingRepository;
import com.smartbuild.repository.DeviceRepository;
import com.smartbuild.repository.EnergyConsumptionRepository;
import com.smartbuild.repository.FloorRepository;
import com.smartbuild.repository.MaintenanceRequestRepository;
import com.smartbuild.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final UnitRepository unitRepository;
    private final DeviceRepository deviceRepository;
    private final EnergyConsumptionRepository energyConsumptionRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {

        long totalBuildings = buildingRepository.count();

        long totalFloors = floorRepository.count();

        long totalUnits = unitRepository.count();

        long occupiedUnits = unitRepository.findAll()
                .stream()
                .filter(unit -> unit.getStatus() == UnitStatus.OCCUPIED)
                .count();

        long availableUnits = unitRepository.findAll()
                .stream()
                .filter(unit -> unit.getStatus() == UnitStatus.AVAILABLE)
                .count();

        long maintenanceUnits = unitRepository.findAll()
                .stream()
                .filter(unit -> unit.getStatus() == UnitStatus.MAINTENANCE)
                .count();

        long totalDevices = deviceRepository.count();

        long activeDevices = deviceRepository.findAll()
                .stream()
                .filter(device -> "ON".equalsIgnoreCase(device.getStatus()))
                .count();

        long totalMaintenanceRequests = maintenanceRequestRepository.count();

        long openMaintenanceRequests = maintenanceRequestRepository.findAll()
                .stream()
                .filter(request -> "OPEN".equalsIgnoreCase(request.getStatus()))
                .count();

        long inProgressMaintenanceRequests = maintenanceRequestRepository.findAll()
                .stream()
                .filter(request -> "IN_PROGRESS".equalsIgnoreCase(request.getStatus()))
                .count();

        long completedMaintenanceRequests = maintenanceRequestRepository.findAll()
                .stream()
                .filter(request -> "COMPLETED".equalsIgnoreCase(request.getStatus()))
                .count();

        double totalEnergyConsumptionKwh =
                energyConsumptionRepository.findAll()
                        .stream()
                        .mapToDouble(energy -> energy.getConsumptionKwh())
                        .sum();

        return DashboardResponse.builder()
                .totalBuildings(totalBuildings)
                .totalFloors(totalFloors)
                .totalUnits(totalUnits)
                .occupiedUnits(occupiedUnits)
                .availableUnits(availableUnits)
                .maintenanceUnits(maintenanceUnits)
                .totalDevices(totalDevices)
                .activeDevices(activeDevices)
                .totalMaintenanceRequests(totalMaintenanceRequests)
                .openMaintenanceRequests(openMaintenanceRequests)
                .inProgressMaintenanceRequests(inProgressMaintenanceRequests)
                .completedMaintenanceRequests(completedMaintenanceRequests)
                .totalEnergyConsumptionKwh(totalEnergyConsumptionKwh)
                .build();
    }
}