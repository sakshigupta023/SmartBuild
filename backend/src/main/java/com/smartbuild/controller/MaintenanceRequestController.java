package com.smartbuild.controller;

import com.smartbuild.dto.request.MaintenanceRequestRequest;
import com.smartbuild.dto.response.ApiResponse;
import com.smartbuild.dto.response.MaintenanceRequestResponse;
import com.smartbuild.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/maintenance-requests")
@RequiredArgsConstructor
public class MaintenanceRequestController {

    private final MaintenanceRequestService maintenanceRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceRequestResponse>> create(
            @Valid @RequestBody MaintenanceRequestRequest request) {

        MaintenanceRequestResponse response =
                maintenanceRequestService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Maintenance request created successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceRequestResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Maintenance requests fetched successfully",
                        maintenanceRequestService.getAll()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceRequestResponse>> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Maintenance request fetched successfully",
                        maintenanceRequestService.getById(id)
                )
        );
    }

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestResponse>>> getByUnitId(
            @PathVariable UUID unitId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Unit maintenance requests fetched successfully",
                        maintenanceRequestService.getByUnitId(unitId)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceRequestResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody MaintenanceRequestRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Maintenance request updated successfully",
                        maintenanceRequestService.update(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id) {

        maintenanceRequestService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Maintenance request deleted successfully",
                        null
                )
        );
    }
}