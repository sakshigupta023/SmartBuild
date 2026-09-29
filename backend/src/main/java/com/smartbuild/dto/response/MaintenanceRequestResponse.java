package com.smartbuild.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequestResponse {

    private UUID id;

    private UUID unitId;

    private String unitNumber;

    private String title;

    private String description;

    private String priority;

    private String status;

    private String assignedTo;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}