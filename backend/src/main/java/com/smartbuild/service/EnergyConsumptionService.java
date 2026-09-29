package com.smartbuild.service;

import com.smartbuild.dto.request.EnergyConsumptionRequest;
import com.smartbuild.dto.response.EnergyConsumptionResponse;
import com.smartbuild.entity.EnergyConsumption;
import com.smartbuild.entity.Unit;
import com.smartbuild.mapper.EnergyConsumptionMapper;
import com.smartbuild.repository.EnergyConsumptionRepository;
import com.smartbuild.repository.UnitRepository;
import com.smartbuild.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnergyConsumptionService {

    private final EnergyConsumptionRepository energyConsumptionRepository;
    private final UnitRepository unitRepository;
    private final EnergyConsumptionMapper energyConsumptionMapper;

    @Transactional
    public EnergyConsumptionResponse create(EnergyConsumptionRequest request) {

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + request.getUnitId()
                ));

        EnergyConsumption energyConsumption = EnergyConsumption.builder()
                .unit(unit)
                .consumptionKwh(request.getConsumptionKwh())
                .recordedAt(request.getRecordedAt())
                .build();

        return energyConsumptionMapper.toResponse(
                energyConsumptionRepository.save(energyConsumption)
        );
    }

    @Transactional(readOnly = true)
    public List<EnergyConsumptionResponse> getAll() {

        return energyConsumptionRepository.findAll()
                .stream()
                .map(energyConsumptionMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EnergyConsumptionResponse> getByUnitId(UUID unitId) {

        if (!unitRepository.existsById(unitId)) {
            throw new ResourceNotFoundException(
                    "Unit not found with id: " + unitId
            );
        }

        return energyConsumptionRepository.findByUnitId(unitId)
                .stream()
                .map(energyConsumptionMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EnergyConsumptionResponse getById(UUID id) {

        EnergyConsumption energyConsumption =
                energyConsumptionRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Energy consumption not found with id: " + id
                        ));

        return energyConsumptionMapper.toResponse(energyConsumption);
    }

    @Transactional
    public EnergyConsumptionResponse update(
            UUID id,
            EnergyConsumptionRequest request) {

        EnergyConsumption energyConsumption =
                energyConsumptionRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Energy consumption not found with id: " + id
                        ));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + request.getUnitId()
                ));

        energyConsumption.setUnit(unit);
        energyConsumption.setConsumptionKwh(request.getConsumptionKwh());
        energyConsumption.setRecordedAt(request.getRecordedAt());

        return energyConsumptionMapper.toResponse(
                energyConsumptionRepository.save(energyConsumption)
        );
    }

    @Transactional
    public void delete(UUID id) {

        EnergyConsumption energyConsumption =
                energyConsumptionRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Energy consumption not found with id: " + id
                        ));

        energyConsumptionRepository.delete(energyConsumption);
    }
}