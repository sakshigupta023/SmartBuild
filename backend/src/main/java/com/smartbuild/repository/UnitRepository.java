package com.smartbuild.repository;

import com.smartbuild.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UnitRepository extends JpaRepository<Unit, UUID> {

    List<Unit> findByFloorId(UUID floorId);

    boolean existsByFloorIdAndUnitNumber(UUID floorId, String unitNumber);
}