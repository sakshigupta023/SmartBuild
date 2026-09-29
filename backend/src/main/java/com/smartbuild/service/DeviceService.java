package com.smartbuild.service;

import com.smartbuild.dto.request.DeviceRequest;
import com.smartbuild.dto.response.DeviceResponse;
import com.smartbuild.entity.Device;
import com.smartbuild.entity.Unit;
import com.smartbuild.exception.DuplicateResourceException;
import com.smartbuild.exception.ResourceNotFoundException;
import com.smartbuild.mapper.DeviceMapper;
import com.smartbuild.repository.DeviceRepository;
import com.smartbuild.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UnitRepository unitRepository;
    private final DeviceMapper deviceMapper;

    @Transactional
    public DeviceResponse create(DeviceRequest request) {

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + request.getUnitId()
                ));

        if (deviceRepository.existsByUnitIdAndDeviceName(
                request.getUnitId(),
                request.getDeviceName())) {

            throw new DuplicateResourceException(
                    "Device name " + request.getDeviceName()
                            + " already exists in this unit"
            );
        }

        Device device = Device.builder()
                .unit(unit)
                .deviceName(request.getDeviceName())
                .deviceType(request.getDeviceType())
                .status(request.getStatus())
                .powerConsumptionWatts(request.getPowerConsumptionWatts())
                .build();

        return deviceMapper.toResponse(deviceRepository.save(device));
    }

    @Transactional(readOnly = true)
    public List<DeviceResponse> getAll() {

        return deviceRepository.findAll()
                .stream()
                .map(deviceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DeviceResponse> getByUnitId(UUID unitId) {

        if (!unitRepository.existsById(unitId)) {
            throw new ResourceNotFoundException(
                    "Unit not found with id: " + unitId
            );
        }

        return deviceRepository.findByUnitId(unitId)
                .stream()
                .map(deviceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DeviceResponse getById(UUID id) {

        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device not found with id: " + id
                ));

        return deviceMapper.toResponse(device);
    }

    @Transactional
    public DeviceResponse update(UUID id, DeviceRequest request) {

        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device not found with id: " + id
                ));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + request.getUnitId()
                ));

        boolean unitChanged =
                !device.getUnit().getId().equals(request.getUnitId());

        boolean deviceNameChanged =
                !device.getDeviceName().equals(request.getDeviceName());

        if ((unitChanged || deviceNameChanged)
                && deviceRepository.existsByUnitIdAndDeviceName(
                        request.getUnitId(),
                        request.getDeviceName())) {

            throw new DuplicateResourceException(
                    "Device name " + request.getDeviceName()
                            + " already exists in this unit"
            );
        }

        device.setUnit(unit);
        device.setDeviceName(request.getDeviceName());
        device.setDeviceType(request.getDeviceType());
        device.setStatus(request.getStatus());
        device.setPowerConsumptionWatts(request.getPowerConsumptionWatts());

        return deviceMapper.toResponse(deviceRepository.save(device));
    }

    @Transactional
    public void delete(UUID id) {

        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Device not found with id: " + id
                ));

        deviceRepository.delete(device);
    }
}