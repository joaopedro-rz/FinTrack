package com.app.FinTrack.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private long expiresIn;

    /**
     * Dados do usuário autenticado
     */
    private UUID userId;
    private String name;
    private String email;
    private LocalDateTime createdAt;
}
