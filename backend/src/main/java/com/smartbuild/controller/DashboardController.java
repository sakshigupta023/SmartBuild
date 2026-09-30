package com.smartbuild.controller;

import com.smartbuild.dto.response.ApiResponse;
import com.smartbuild.dto.response.DashboardResponse;
import com.smartbuild.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dashboard data fetched successfully",
                        dashboardService.getDashboard()
                )
        );
    }
}