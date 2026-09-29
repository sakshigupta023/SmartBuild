package com.smartbuild.controller;

import com.smartbuild.dto.request.FloorRequest;
import com.smartbuild.dto.response.FloorResponse;
import com.smartbuild.dto.response.ApiResponse;
import com.smartbuild.service.FloorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/floors")
@RequiredArgsConstructor
public class FloorController {

    private final FloorService floorService;

    @PostMapping
    public ResponseEntity<ApiResponse<FloorResponse>> create(
            @Valid @RequestBody FloorRequest request) {

        FloorResponse response = floorService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Floor created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FloorResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.success("Floors fetched successfully", floorService.getAll())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FloorResponse>> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                ApiResponse.success("Floor fetched successfully", floorService.getById(id))
        );
    }

    @GetMapping("/building/{buildingId}")
    public ResponseEntity<ApiResponse<List<FloorResponse>>> getByBuildingId(
            @PathVariable UUID buildingId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Building floors fetched successfully",
                        floorService.getByBuildingId(buildingId)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FloorResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody FloorRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Floor updated successfully",
                        floorService.update(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id) {

        floorService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success("Floor deleted successfully", null)
        );
    }
}