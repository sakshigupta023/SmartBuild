package com.smartbuild.service;

import com.smartbuild.dto.request.BuildingRequest;
import com.smartbuild.dto.response.BuildingResponse;
import com.smartbuild.entity.Building;
import com.smartbuild.exception.ResourceNotFoundException;
import com.smartbuild.mapper.BuildingMapper;
import com.smartbuild.repository.BuildingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final BuildingMapper buildingMapper;

    public BuildingService(BuildingRepository buildingRepository,
                           BuildingMapper buildingMapper) {
        this.buildingRepository = buildingRepository;
        this.buildingMapper = buildingMapper;
    }

    public BuildingResponse createBuilding(BuildingRequest request) {
        Building building = buildingMapper.toEntity(request);
        Building savedBuilding = buildingRepository.save(building);

        return buildingMapper.toResponse(savedBuilding);
    }

    public List<BuildingResponse> getAllBuildings() {
        return buildingRepository.findAll()
                .stream()
                .map(buildingMapper::toResponse)
                .toList();
    }

    public BuildingResponse getBuildingById(UUID id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Building not found with id: " + id));

        return buildingMapper.toResponse(building);
    }

    public BuildingResponse updateBuilding(UUID id, BuildingRequest request) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Building not found with id: " + id));

        buildingMapper.updateEntity(building, request);

        Building updatedBuilding = buildingRepository.save(building);

        return buildingMapper.toResponse(updatedBuilding);
    }

    public void deleteBuilding(UUID id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Building not found with id: " + id));

        buildingRepository.delete(building);
    }
}