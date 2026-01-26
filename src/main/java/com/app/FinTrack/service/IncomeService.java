package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.IncomeRequestDTO;
import com.app.FinTrack.domain.dto.IncomeResponseDTO;
import com.app.FinTrack.domain.entity.Income;
import com.app.FinTrack.domain.entity.User;
import com.app.FinTrack.domain.enums.IncomeCategory;
import com.app.FinTrack.exception.ResourceNotFoundException;
import com.app.FinTrack.repository.IncomeRepository;
import com.app.FinTrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

//Service responsável pela lógica de negócio de Receitas (Income).
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    //CRUD
    @Transactional
    public IncomeResponseDTO create(UUID userId, IncomeRequestDTO request) {
        log.info("Criando receita para usuário: {}", userId);

        User user = findUserById(userId);

        Income income = Income.builder()
                .user(user)
                .description(request.description())
                .amount(request.amount())
                .category(request.category())
                .date(request.date())
                .recurrence(request.recurrence())
                .notes(request.notes())
                .build();

        Income saved = incomeRepository.save(income);
        log.info("Receita criada com ID: {}", saved.getId());

        return IncomeResponseDTO.fromEntity(saved);
    }

    public List<IncomeResponseDTO> findAllByUser(UUID userId) {
        log.debug("Buscando receitas do usuário: {}", userId);
        return incomeRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(IncomeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public IncomeResponseDTO findById(UUID userId, UUID incomeId) {
        Income income = findIncomeByIdAndUser(incomeId, userId);
        return IncomeResponseDTO.fromEntity(income);
    }

    @Transactional
    public IncomeResponseDTO update(UUID userId, UUID incomeId, IncomeRequestDTO request) {
        log.info("Atualizando receita: {} do usuário: {}", incomeId, userId);

        Income income = findIncomeByIdAndUser(incomeId, userId);

        income.setDescription(request.description());
        income.setAmount(request.amount());
        income.setCategory(request.category());
        income.setDate(request.date());
        income.setRecurrence(request.recurrence());
        income.setNotes(request.notes());

        Income updated = incomeRepository.save(income);
        log.info("Receita atualizada: {}", incomeId);

        return IncomeResponseDTO.fromEntity(updated);
    }

    @Transactional
    public void delete(UUID userId, UUID incomeId) {
        log.info("Deletando receita: {} do usuário: {}", incomeId, userId);

        Income income = findIncomeByIdAndUser(incomeId, userId);
        incomeRepository.delete(income);

        log.info("Receita deletada: {}", incomeId);
    }

    // FILTROS
    public List<IncomeResponseDTO> findByPeriod(UUID userId, LocalDate startDate, LocalDate endDate) {
        log.debug("Buscando receitas do período {} a {} do usuário: {}", startDate, endDate, userId);
        return incomeRepository.findByUserIdAndDateBetween(userId, startDate, endDate)
                .stream()
                .map(IncomeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<IncomeResponseDTO> findByCategory(UUID userId, IncomeCategory category) {
        return incomeRepository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(IncomeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<IncomeResponseDTO> searchByDescription(UUID userId, String searchTerm) {
        return incomeRepository.findByUserIdAndDescriptionContainingIgnoreCase(userId, searchTerm)
                .stream()
                .map(IncomeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //RELATÓRIOS
    public BigDecimal getTotalAmount(UUID userId) {
        return incomeRepository.sumAmountByUserId(userId);
    }

    public BigDecimal getTotalAmountByPeriod(UUID userId, LocalDate startDate, LocalDate endDate) {
        return incomeRepository.sumAmountByUserIdAndDateBetween(userId, startDate, endDate);
    }

    public long count(UUID userId) {
        return incomeRepository.countByUserId(userId);
    }

    /**
     * Conta receitas em um período específico.
     */
    public long countByPeriod(UUID userId, LocalDate startDate, LocalDate endDate) {
        return incomeRepository.countByUserIdAndDateBetween(userId, startDate, endDate);
    }

    //MÉTODOS AUXILIARES
    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + userId));
    }

    private Income findIncomeByIdAndUser(UUID incomeId, UUID userId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Receita não encontrada: " + incomeId));

        // Verifica se a receita pertence ao usuário (segurança)
        if (!income.getUser().getId().equals(userId)) {
            log.warn("Tentativa de acesso não autorizado à receita {} pelo usuário {}", incomeId, userId);
            throw new ResourceNotFoundException("Receita não encontrada: " + incomeId);
        }

        return income;
    }
}
