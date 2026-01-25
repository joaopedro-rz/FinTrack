package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.UserRequestDTO;
import com.app.FinTrack.domain.dto.UserResponseDTO;
import com.app.FinTrack.domain.entity.User;
import com.app.FinTrack.exception.EmailAlreadyExistsException;
import com.app.FinTrack.exception.UserNotFoundException;
import com.app.FinTrack.repository.UserRepository;
import com.app.FinTrack.util.EmailUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO request) {
        log.info("Iniciando criação de usuário com email: {}", request.getEmail());

        // Validação: Email único
        validateEmailNotExists(request.getEmail());

        // Conversão DTO -> Entidade
        User user = request.toEntity();

        // Criptografia de senha
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        // Persistência
        User savedUser = userRepository.save(user);

        log.info("Usuário criado com sucesso. ID: {}", savedUser.getId());

        // Conversão Entidade -> DTO de resposta
        return UserResponseDTO.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO findById(UUID id) {
        log.debug("Buscando usuário por ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com ID: " + id));

        return UserResponseDTO.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO findByEmail(String email) {
        log.debug("Buscando usuário por email: {}", email);

        String normalizedEmail = EmailUtils.normalize(email);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com email: " + email));

        return UserResponseDTO.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> findAll() {
        log.debug("Listando todos os usuários");

        return userRepository.findAll().stream()
                .map(UserResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUser(UUID id, UserRequestDTO request) {
        log.info("Atualizando usuário ID: {}", id);

        // Busca usuário existente
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com ID: " + id));

        // Validação: Se email mudou, verificar unicidade
        String normalizedNewEmail = EmailUtils.normalize(request.getEmail());
        if (!user.getEmail().equals(normalizedNewEmail)) {
            validateEmailNotExists(normalizedNewEmail);
        }

        // Atualização de campos
        user.setName(request.getName());
        user.setEmail(normalizedNewEmail);

        // Senha: só atualiza se fornecida
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            String encryptedPassword = passwordEncoder.encode(request.getPassword());
            user.setPassword(encryptedPassword);
        }

        User updatedUser = userRepository.save(user);

        log.info("Usuário atualizado com sucesso. ID: {}", updatedUser.getId());

        return UserResponseDTO.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(UUID id) {
        log.warn("Deletando usuário ID: {}", id);

        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Usuário não encontrado com ID: " + id);
        }

        userRepository.deleteById(id);

        log.info("Usuário deletado com sucesso. ID: {}", id);
    }

    private void validateEmailNotExists(String email) {
        String normalizedEmail = EmailUtils.normalize(email);

        if (userRepository.existsByEmail(normalizedEmail)) {
            log.warn("Tentativa de cadastro com email duplicado: {}", email);
            throw new EmailAlreadyExistsException("Email já cadastrado: " + email);
        }
    }

    @Transactional(readOnly = true)
    public boolean existsById(UUID id) {
        return userRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        String normalizedEmail = EmailUtils.normalize(email);
        return userRepository.existsByEmail(normalizedEmail);
    }

    @Transactional(readOnly = true)
    public long countUsers() {
        return userRepository.count();
    }
}
