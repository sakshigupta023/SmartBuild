package com.smartbuild.service;

import com.smartbuild.dto.request.UnitRequest;
import com.smartbuild.dto.response.UnitResponse;
import com.smartbuild.entity.Floor;
import com.smartbuild.entity.Unit;
import com.smartbuild.exception.DuplicateResourceException;
import com.smartbuild.exception.ResourceNotFoundException;
import com.smartbuild.mapper.UnitMapper;
import com.smartbuild.repository.FloorRepository;
import com.smartbuild.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;
    private final FloorRepository floorRepository;
    private final UnitMapper unitMapper;

    @Transactional
    public UnitResponse create(UnitRequest request) {

        Floor floor = floorRepository.findById(request.getFloorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Floor not found with id: " + request.getFloorId()
                ));

        if (unitRepository.existsByFloorIdAndUnitNumber(
                request.getFloorId(),
                request.getUnitNumber())) {

            throw new DuplicateResourceException(
                    "Unit number " + request.getUnitNumber()
                            + " already exists on this floor"
            );
        }

        Unit unit = Unit.builder()
                .floor(floor)
                .unitNumber(request.getUnitNumber())
                .unitType(request.getUnitType())
                .areaSqFt(request.getAreaSqFt())
                .status(request.getStatus())
                .build();

        return unitMapper.toResponse(unitRepository.save(unit));
    }

    @Transactional(readOnly = true)
    public List<UnitResponse> getAll() {

        return unitRepository.findAll()
                .stream()
                .map(unitMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UnitResponse> getByFloorId(UUID floorId) {

        if (!floorRepository.existsById(floorId)) {
            throw new ResourceNotFoundException(
                    "Floor not found with id: " + floorId
            );
        }

        return unitRepository.findByFloorId(floorId)
                .stream()
                .map(unitMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UnitResponse getById(UUID id) {

        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + id
                ));

        return unitMapper.toResponse(unit);
    }

    @Transactional
    public UnitResponse update(UUID id, UnitRequest request) {

        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + id
                ));

        Floor floor = floorRepository.findById(request.getFloorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Floor not found with id: " + request.getFloorId()
                ));

        boolean floorChanged =
                !unit.getFloor().getId().equals(request.getFloorId());

        boolean unitNumberChanged =
                !unit.getUnitNumber().equals(request.getUnitNumber());

        if ((floorChanged || unitNumberChanged)
                && unitRepository.existsByFloorIdAndUnitNumber(
                        request.getFloorId(),
                        request.getUnitNumber())) {

            throw new DuplicateResourceException(
                    "Unit number " + request.getUnitNumber()
                            + " already exists on this floor"
            );
        }

        unit.setFloor(floor);
        unit.setUnitNumber(request.getUnitNumber());
        unit.setUnitType(request.getUnitType());
        unit.setAreaSqFt(request.getAreaSqFt());
        unit.setStatus(request.getStatus());

        return unitMapper.toResponse(unitRepository.save(unit));
    }

    @Transactional
    public void delete(UUID id) {

        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + id
                ));

        unitRepository.delete(unit);
    }
}