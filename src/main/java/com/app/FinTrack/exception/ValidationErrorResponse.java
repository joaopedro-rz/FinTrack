package com.app.FinTrack.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {

    /**
     * Timestamp do erro.
     */
    private LocalDateTime timestamp;

    /**
     * Código HTTP (sempre 400 para validação).
     */
    private int status;

    /**
     * Tipo de erro (Bad Request).
     */
    private String error;

    /**
     * Mensagem geral.
     */
    private String message;

    /**
     * Mapa de campo → mensagem de erro.
     * Exemplo: {"email": "E-mail deve ser válido"}
     */
    private Map<String, String> errors;
}
