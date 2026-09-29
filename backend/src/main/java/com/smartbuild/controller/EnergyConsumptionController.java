package com.smartbuild.controller;

import com.smartbuild.dto.request.EnergyConsumptionRequest;
import com.smartbuild.dto.response.ApiResponse;
import com.smartbuild.dto.response.EnergyConsumptionResponse;
import com.smartbuild.service.EnergyConsumptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/energy-consumption")
@RequiredArgsConstructor
public class EnergyConsumptionController {

    private final EnergyConsumptionService energyConsumptionService;

    @PostMapping
    public ResponseEntity<ApiResponse<EnergyConsumptionResponse>> create(
            @Valid @RequestBody EnergyConsumptionRequest request) {

        EnergyConsumptionResponse response =
                energyConsumptionService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Energy consumption recorded successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EnergyConsumptionResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Energy consumption records fetched successfully",
                        energyConsumptionService.getAll()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EnergyConsumptionResponse>> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Energy consumption record fetched successfully",
                        energyConsumptionService.getById(id)
                )
        );
    }

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<ApiResponse<List<EnergyConsumptionResponse>>> getByUnitId(
            @PathVariable UUID unitId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Unit energy consumption fetched successfully",
                        energyConsumptionService.getByUnitId(unitId)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EnergyConsumptionResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody EnergyConsumptionRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Energy consumption updated successfully",
                        energyConsumptionService.update(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id) {

        energyConsumptionService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Energy consumption deleted successfully",
                        null
                )
        );
    }
}