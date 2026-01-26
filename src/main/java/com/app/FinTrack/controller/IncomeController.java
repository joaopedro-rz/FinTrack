package com.app.FinTrack.controller;

import com.app.FinTrack.domain.dto.IncomeRequestDTO;
import com.app.FinTrack.domain.dto.IncomeResponseDTO;
import com.app.FinTrack.domain.enums.IncomeCategory;
import com.app.FinTrack.service.IncomeService;
import com.app.FinTrack.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Controller REST para gerenciamento de Receitas (Income).
 * Todas as rotas são protegidas e operam sobre os dados do usuário autenticado.
 */
@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
@Slf4j
public class IncomeController {

    private final IncomeService incomeService;
    private final AuthUtils authUtils;

    //  CRUD
    @PostMapping
    public ResponseEntity<IncomeResponseDTO> create(@Valid @RequestBody IncomeRequestDTO request) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Criando receita para usuário: {}", userId);

        IncomeResponseDTO response = incomeService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponseDTO>> findAll() {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Listando receitas do usuário: {}", userId);

        List<IncomeResponseDTO> response = incomeService.findAllByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponseDTO> findById(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Buscando receita {} do usuário: {}", id, userId);

        IncomeResponseDTO response = incomeService.findById(userId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody IncomeRequestDTO request) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Atualizando receita {} do usuário: {}", id, userId);

        IncomeResponseDTO response = incomeService.update(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.warn("Deletando receita {} do usuário: {}", id, userId);

        incomeService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    // FILTROS
    @GetMapping("/period")
    public ResponseEntity<List<IncomeResponseDTO>> findByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Buscando receitas do período {} a {} do usuário: {}", startDate, endDate, userId);

        List<IncomeResponseDTO> response = incomeService.findByPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<IncomeResponseDTO>> findByCategory(@PathVariable IncomeCategory category) {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Buscando receitas da categoria {} do usuário: {}", category, userId);

        List<IncomeResponseDTO> response = incomeService.findByCategory(userId, category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<IncomeResponseDTO>> search(@RequestParam("q") String searchTerm) {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Buscando receitas com termo '{}' do usuário: {}", searchTerm, userId);

        List<IncomeResponseDTO> response = incomeService.searchByDescription(userId, searchTerm);
        return ResponseEntity.ok(response);
    }

    // RELATÓRIOS
    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotal() {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = incomeService.getTotalAmount(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/period")
    public ResponseEntity<BigDecimal> getTotalByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = incomeService.getTotalAmountByPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        UUID userId = authUtils.getCurrentUserId();
        long count = incomeService.count(userId);
        return ResponseEntity.ok(count);
    }
}
