package com.smartbuild.controller;

import com.smartbuild.dto.request.UnitRequest;
import com.smartbuild.dto.response.ApiResponse;
import com.smartbuild.dto.response.UnitResponse;
import com.smartbuild.service.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @PostMapping
    public ResponseEntity<ApiResponse<UnitResponse>> create(
            @Valid @RequestBody UnitRequest request) {

        UnitResponse response = unitService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Unit created successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UnitResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Units fetched successfully",
                        unitService.getAll()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UnitResponse>> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Unit fetched successfully",
                        unitService.getById(id)
                )
        );
    }

    @GetMapping("/floor/{floorId}")
    public ResponseEntity<ApiResponse<List<UnitResponse>>> getByFloorId(
            @PathVariable UUID floorId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Floor units fetched successfully",
                        unitService.getByFloorId(floorId)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UnitResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UnitRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Unit updated successfully",
                        unitService.update(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id) {

        unitService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Unit deleted successfully",
                        null
                )
        );
    }
}