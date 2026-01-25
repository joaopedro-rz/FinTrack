package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.AuthResponseDTO;
import com.app.FinTrack.domain.dto.LoginRequestDTO;
import com.app.FinTrack.domain.dto.RegisterRequestDTO;
import com.app.FinTrack.domain.entity.User;
import com.app.FinTrack.exception.EmailAlreadyExistsException;
import com.app.FinTrack.repository.UserRepository;
import com.app.FinTrack.security.JwtService;
import com.app.FinTrack.util.EmailUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        log.info("Registrando novo usuário: {}", request.getEmail());

        String normalizedEmail = EmailUtils.normalize(request.getEmail());

        // Valida email único
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException("Email já cadastrado: " + request.getEmail());
        }

        // Cria usuário
        User user = User.builder()
                .name(request.getName())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        log.info("Usuário registrado com sucesso. ID: {}", savedUser.getId());

        // Gera token
        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail());

        return buildAuthResponse(savedUser, token);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        log.info("Tentativa de login: {}", request.getEmail());

        String normalizedEmail = EmailUtils.normalize(request.getEmail());

        // Autentica via Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );

        // Busca usuário
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        log.info("Login realizado com sucesso: {}", user.getEmail());

        // Gera token
        String token = jwtService.generateToken(user.getId(), user.getEmail());

        return buildAuthResponse(user, token);
    }

    /**
     * Constrói o DTO de resposta de autenticação.
     */
    private AuthResponseDTO buildAuthResponse(User user, String token) {
        return AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationInSeconds())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
