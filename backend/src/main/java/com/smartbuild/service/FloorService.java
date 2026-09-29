package com.smartbuild.service;

import com.smartbuild.dto.request.FloorRequest;
import com.smartbuild.dto.response.FloorResponse;
import com.smartbuild.entity.Building;
import com.smartbuild.entity.Floor;
import com.smartbuild.exception.DuplicateResourceException;
import com.smartbuild.exception.ResourceNotFoundException;
import com.smartbuild.mapper.FloorMapper;
import com.smartbuild.repository.BuildingRepository;
import com.smartbuild.repository.FloorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FloorService {

    private final FloorRepository floorRepository;
    private final BuildingRepository buildingRepository;
    private final FloorMapper floorMapper;

    public FloorResponse create(FloorRequest request) {

        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Building not found with id: " + request.getBuildingId()
                ));

        if (floorRepository.existsByBuildingIdAndFloorNumber(
                request.getBuildingId(),
                request.getFloorNumber())) {

            throw new DuplicateResourceException(
                    "Floor number " + request.getFloorNumber()
                            + " already exists in this building"
            );
        }

        Floor floor = Floor.builder()
                .building(building)
                .floorNumber(request.getFloorNumber())
                .name(request.getName())
                .totalUnits(request.getTotalUnits())
                .build();

        return floorMapper.toResponse(floorRepository.save(floor));
    }

    @Transactional(readOnly = true)
    public List<FloorResponse> getAll() {

        return floorRepository.findAll()
                .stream()
                .map(floorMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FloorResponse> getByBuildingId(UUID buildingId) {

        if (!buildingRepository.existsById(buildingId)) {
            throw new ResourceNotFoundException(
                    "Building not found with id: " + buildingId
            );
        }

        return floorRepository.findByBuildingId(buildingId)
                .stream()
                .map(floorMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FloorResponse getById(UUID id) {

        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Floor not found with id: " + id
                ));

        return floorMapper.toResponse(floor);
    }

    @Transactional
    public FloorResponse update(UUID id, FloorRequest request) {

        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Floor not found with id: " + id
                ));

        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Building not found with id: " + request.getBuildingId()
                ));

        boolean buildingChanged =
                !floor.getBuilding().getId().equals(request.getBuildingId());

        boolean floorNumberChanged =
                !floor.getFloorNumber().equals(request.getFloorNumber());

        if ((buildingChanged || floorNumberChanged)
                && floorRepository.existsByBuildingIdAndFloorNumber(
                        request.getBuildingId(),
                        request.getFloorNumber())) {

            throw new DuplicateResourceException(
                    "Floor number " + request.getFloorNumber()
                            + " already exists in this building"
            );
        }

        floor.setBuilding(building);
        floor.setFloorNumber(request.getFloorNumber());
        floor.setName(request.getName());
        floor.setTotalUnits(request.getTotalUnits());

        return floorMapper.toResponse(floorRepository.save(floor));
    }

    @Transactional
    public void delete(UUID id) {

        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Floor not found with id: " + id
                ));

        floorRepository.delete(floor);
    }
}