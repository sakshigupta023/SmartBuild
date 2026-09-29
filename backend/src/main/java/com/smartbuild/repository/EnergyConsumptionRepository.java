package com.smartbuild.repository;

import com.smartbuild.entity.EnergyConsumption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EnergyConsumptionRepository
        extends JpaRepository<EnergyConsumption, UUID> {

    List<EnergyConsumption> findByUnitId(UUID unitId);
}