package com.smartbuild.service;

import com.smartbuild.dto.request.MaintenanceRequestRequest;
import com.smartbuild.dto.response.MaintenanceRequestResponse;
import com.smartbuild.entity.MaintenanceRequest;
import com.smartbuild.entity.Unit;
import com.smartbuild.exception.ResourceNotFoundException;
import com.smartbuild.mapper.MaintenanceRequestMapper;
import com.smartbuild.repository.MaintenanceRequestRepository;
import com.smartbuild.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final UnitRepository unitRepository;
    private final MaintenanceRequestMapper maintenanceRequestMapper;

    @Transactional
    public MaintenanceRequestResponse create(
            MaintenanceRequestRequest request) {

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + request.getUnitId()
                ));

        MaintenanceRequest maintenanceRequest =
                MaintenanceRequest.builder()
                        .unit(unit)
                        .title(request.getTitle())
                        .description(request.getDescription())
                        .priority(request.getPriority())
                        .status(request.getStatus())
                        .assignedTo(request.getAssignedTo())
                        .build();

        return maintenanceRequestMapper.toResponse(
                maintenanceRequestRepository.save(maintenanceRequest)
        );
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponse> getAll() {

        return maintenanceRequestRepository.findAll()
                .stream()
                .map(maintenanceRequestMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponse> getByUnitId(UUID unitId) {

        if (!unitRepository.existsById(unitId)) {
            throw new ResourceNotFoundException(
                    "Unit not found with id: " + unitId
            );
        }

        return maintenanceRequestRepository.findByUnitId(unitId)
                .stream()
                .map(maintenanceRequestMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MaintenanceRequestResponse getById(UUID id) {

        MaintenanceRequest maintenanceRequest =
                maintenanceRequestRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Maintenance request not found with id: " + id
                        ));

        return maintenanceRequestMapper.toResponse(maintenanceRequest);
    }

    @Transactional
    public MaintenanceRequestResponse update(
            UUID id,
            MaintenanceRequestRequest request) {

        MaintenanceRequest maintenanceRequest =
                maintenanceRequestRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Maintenance request not found with id: " + id
                        ));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Unit not found with id: " + request.getUnitId()
                ));

        maintenanceRequest.setUnit(unit);
        maintenanceRequest.setTitle(request.getTitle());
        maintenanceRequest.setDescription(request.getDescription());
        maintenanceRequest.setPriority(request.getPriority());
        maintenanceRequest.setStatus(request.getStatus());
        maintenanceRequest.setAssignedTo(request.getAssignedTo());

        return maintenanceRequestMapper.toResponse(
                maintenanceRequestRepository.save(maintenanceRequest)
        );
    }

    @Transactional
    public void delete(UUID id) {

        MaintenanceRequest maintenanceRequest =
                maintenanceRequestRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Maintenance request not found with id: " + id
                        ));

        maintenanceRequestRepository.delete(maintenanceRequest);
    }
}