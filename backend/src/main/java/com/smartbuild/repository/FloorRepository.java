package com.smartbuild.repository;

import com.smartbuild.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FloorRepository extends JpaRepository<Floor, UUID> {

    List<Floor> findByBuildingId(UUID buildingId);

    boolean existsByBuildingIdAndFloorNumber(UUID buildingId, Integer floorNumber);
}