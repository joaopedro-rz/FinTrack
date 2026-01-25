package com.app.FinTrack.controller;

import com.app.FinTrack.domain.dto.AuthResponseDTO;
import com.app.FinTrack.domain.dto.LoginRequestDTO;
import com.app.FinTrack.domain.dto.RegisterRequestDTO;
import com.app.FinTrack.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        log.info("Requisição de registro: {}", request.getEmail());

        AuthResponseDTO response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        log.info("Requisição de login: {}", request.getEmail());

        AuthResponseDTO response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}
