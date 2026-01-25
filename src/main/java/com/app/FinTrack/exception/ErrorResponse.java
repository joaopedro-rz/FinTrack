package com.app.FinTrack.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * Timestamp do erro.
     */
    private LocalDateTime timestamp;

    /**
     * Código HTTP (404, 409, 500, etc).
     */
    private int status;

    /**
     * Tipo de erro (Not Found, Conflict, etc).
     */
    private String error;

    /**
     * Mensagem descritiva do erro.
     */
    private String message;
}
