package com.smartbuild.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceResponse {

    private UUID id;

    private UUID unitId;

    private String unitNumber;

    private String deviceName;

    private String deviceType;

    private String status;

    private Double powerConsumptionWatts;

    private LocalDateTime installedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}