package com.smartbuild.controller;

import com.smartbuild.dto.request.DeviceRequest;
import com.smartbuild.dto.response.ApiResponse;
import com.smartbuild.dto.response.DeviceResponse;
import com.smartbuild.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    public ResponseEntity<ApiResponse<DeviceResponse>> create(
            @Valid @RequestBody DeviceRequest request) {

        DeviceResponse response = deviceService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Device created successfully",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeviceResponse>>> getAll() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Devices fetched successfully",
                        deviceService.getAll()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeviceResponse>> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Device fetched successfully",
                        deviceService.getById(id)
                )
        );
    }

    @GetMapping("/unit/{unitId}")
    public ResponseEntity<ApiResponse<List<DeviceResponse>>> getByUnitId(
            @PathVariable UUID unitId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Unit devices fetched successfully",
                        deviceService.getByUnitId(unitId)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DeviceResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody DeviceRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Device updated successfully",
                        deviceService.update(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id) {

        deviceService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Device deleted successfully",
                        null
                )
        );
    }
}