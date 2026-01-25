package com.app.FinTrack.controller;

import com.app.FinTrack.domain.dto.UserRequestDTO;
import com.app.FinTrack.domain.dto.UserResponseDTO;
import com.app.FinTrack.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO request) {
        log.info("Requisição para criar usuário: {}", request.getEmail());

        UserResponseDTO response = userService.createUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable UUID id) {
        log.debug("Requisição para buscar usuário por ID: {}", id);

        UserResponseDTO response = userService.findById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        log.debug("Requisição para listar todos os usuários");

        List<UserResponseDTO> response = userService.findAll();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@PathVariable String email) {
        log.debug("Requisição para buscar usuário por email: {}", email);

        UserResponseDTO response = userService.findByEmail(email);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserRequestDTO request) {
        log.info("Requisição para atualizar usuário ID: {}", id);

        UserResponseDTO response = userService.updateUser(id, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        log.warn("Requisição para deletar usuário ID: {}", id);

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable UUID id) {
        log.debug("Requisição para verificar existência do usuário ID: {}", id);

        boolean exists = userService.existsById(id);

        return ResponseEntity.ok(exists);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        log.debug("Requisição para contar usuários");

        long count = userService.countUsers();

        return ResponseEntity.ok(count);
    }
}
