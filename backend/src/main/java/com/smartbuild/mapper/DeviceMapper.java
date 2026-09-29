package com.smartbuild.mapper;

import com.smartbuild.dto.response.DeviceResponse;
import com.smartbuild.entity.Device;
import org.springframework.stereotype.Component;

@Component
public class DeviceMapper {

    public DeviceResponse toResponse(Device device) {

        return DeviceResponse.builder()
                .id(device.getId())
                .unitId(device.getUnit().getId())
                .unitNumber(device.getUnit().getUnitNumber())
                .deviceName(device.getDeviceName())
                .deviceType(device.getDeviceType())
                .status(device.getStatus())
                .powerConsumptionWatts(device.getPowerConsumptionWatts())
                .installedAt(device.getInstalledAt())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .build();
    }
}