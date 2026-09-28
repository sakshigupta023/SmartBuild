package com.smartbuild.controller;

import com.smartbuild.dto.request.BuildingRequest;
import com.smartbuild.dto.response.ApiResponse;
import com.smartbuild.dto.response.BuildingResponse;
import com.smartbuild.service.BuildingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/buildings")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BuildingResponse>> createBuilding(
            @Valid @RequestBody BuildingRequest request) {

        BuildingResponse building = buildingService.createBuilding(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Building created successfully", building));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BuildingResponse>>> getAllBuildings() {

        List<BuildingResponse> buildings = buildingService.getAllBuildings();

        return ResponseEntity.ok(
                ApiResponse.success("Buildings retrieved successfully", buildings)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BuildingResponse>> getBuildingById(
            @PathVariable UUID id) {

        BuildingResponse building = buildingService.getBuildingById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Building retrieved successfully", building)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BuildingResponse>> updateBuilding(
            @PathVariable UUID id,
            @Valid @RequestBody BuildingRequest request) {

        BuildingResponse building = buildingService.updateBuilding(id, request);

        return ResponseEntity.ok(
                ApiResponse.success("Building updated successfully", building)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBuilding(
            @PathVariable UUID id) {

        buildingService.deleteBuilding(id);

        return ResponseEntity.ok(
                ApiResponse.success("Building deleted successfully", null)
        );
    }
}