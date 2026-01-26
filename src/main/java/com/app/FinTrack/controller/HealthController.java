package com.app.FinTrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Controller para Health Check da aplicação.
 *
 * Utilizado para:
 * - Verificação de saúde pelo Docker
 * - Monitoramento de uptime
 * - Load balancers verificarem se a API está respondendo
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * Endpoint simples de health check.
     * Retorna status 200 OK se a aplicação está funcionando.
     *
     * Exemplo de resposta:
     * {
     *   "status": "UP",
     *   "timestamp": "2024-01-25T10:30:00",
     *   "service": "FinTrack API"
     * }
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now().toString(),
            "service", "FinTrack API"
        ));
    }
}
