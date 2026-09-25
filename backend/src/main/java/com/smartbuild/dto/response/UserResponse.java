package com.smartbuild.dto.response;

import com.smartbuild.entity.enums.Role;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class UserResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
}
