package com.smartbuild.repository;

import com.smartbuild.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MaintenanceRequestRepository
        extends JpaRepository<MaintenanceRequest, UUID> {

    List<MaintenanceRequest> findByUnitId(UUID unitId);
}