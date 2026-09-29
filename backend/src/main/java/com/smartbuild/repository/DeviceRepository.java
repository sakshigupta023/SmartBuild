package com.smartbuild.repository;

import com.smartbuild.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

    List<Device> findByUnitId(UUID unitId);

    boolean existsByUnitIdAndDeviceName(UUID unitId, String deviceName);
}