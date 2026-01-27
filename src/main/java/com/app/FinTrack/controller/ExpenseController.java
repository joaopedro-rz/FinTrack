package com.app.FinTrack.controller;

import com.app.FinTrack.domain.dto.ExpenseRequestDTO;
import com.app.FinTrack.domain.dto.ExpenseResponseDTO;
import com.app.FinTrack.domain.enums.ExpenseCategory;
import com.app.FinTrack.domain.enums.PaymentMethod;
import com.app.FinTrack.service.ExpenseService;
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
 * Controller REST para gerenciamento de Despesas (Expense).
 * Todas as rotas são protegidas e operam sobre os dados do usuário autenticado.
 */
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Slf4j
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AuthUtils authUtils;

    //  CRUD

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> create(@Valid @RequestBody ExpenseRequestDTO request) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Criando despesa para usuário: {}", userId);

        ExpenseResponseDTO response = expenseService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponseDTO>> findAll() {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Listando despesas do usuário: {}", userId);

        List<ExpenseResponseDTO> response = expenseService.findAllByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> findById(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Buscando despesa {} do usuário: {}", id, userId);

        ExpenseResponseDTO response = expenseService.findById(userId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ExpenseRequestDTO request) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Atualizando despesa {} do usuário: {}", id, userId);

        ExpenseResponseDTO response = expenseService.update(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.warn("Deletando despesa {} do usuário: {}", id, userId);

        expenseService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    // FILTROS

    @GetMapping("/period")
    public ResponseEntity<List<ExpenseResponseDTO>> findByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID userId = authUtils.getCurrentUserId();
        List<ExpenseResponseDTO> response = expenseService.findByPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseResponseDTO>> findByCategory(@PathVariable ExpenseCategory category) {
        UUID userId = authUtils.getCurrentUserId();
        List<ExpenseResponseDTO> response = expenseService.findByCategory(userId, category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/payment-method/{paymentMethod}")
    public ResponseEntity<List<ExpenseResponseDTO>> findByPaymentMethod(@PathVariable PaymentMethod paymentMethod) {
        UUID userId = authUtils.getCurrentUserId();
        List<ExpenseResponseDTO> response = expenseService.findByPaymentMethod(userId, paymentMethod);
        return ResponseEntity.ok(response);
    }

    /**
     * Busca despesas pendentes (não pagas).
     * GET /api/expenses/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ExpenseResponseDTO>> findPending() {
        UUID userId = authUtils.getCurrentUserId();
        List<ExpenseResponseDTO> response = expenseService.findPending(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ExpenseResponseDTO>> search(@RequestParam("q") String searchTerm) {
        UUID userId = authUtils.getCurrentUserId();
        List<ExpenseResponseDTO> response = expenseService.searchByDescription(userId, searchTerm);
        return ResponseEntity.ok(response);
    }

    //  AÇÕES

    @PatchMapping("/{id}/pay")
    public ResponseEntity<ExpenseResponseDTO> markAsPaid(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Marcando despesa {} como paga para usuário: {}", id, userId);

        ExpenseResponseDTO response = expenseService.markAsPaid(userId, id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/unpay")
    public ResponseEntity<ExpenseResponseDTO> markAsPending(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Marcando despesa {} como pendente para usuário: {}", id, userId);

        ExpenseResponseDTO response = expenseService.markAsPending(userId, id);
        return ResponseEntity.ok(response);
    }

    //  RELATÓRIOS

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotal() {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = expenseService.getTotalAmount(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/period")
    public ResponseEntity<BigDecimal> getTotalByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = expenseService.getTotalAmountByPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/pending")
    public ResponseEntity<BigDecimal> getTotalPending() {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = expenseService.getTotalPending(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        UUID userId = authUtils.getCurrentUserId();
        long count = expenseService.count(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * Busca despesas por período de vencimento com ordenação prioritária.
     * Ordem: 1) Pendentes, 2) Recorrentes, 3) Pagas
     */
    @GetMapping("/due-date/period")
    public ResponseEntity<List<ExpenseResponseDTO>> findByDueDatePeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID userId = authUtils.getCurrentUserId();
        List<ExpenseResponseDTO> response = expenseService.findByDueDatePeriodWithPriority(userId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Busca despesas por período de vencimento e status de pagamento.
     */
    @GetMapping("/due-date/status")
    public ResponseEntity<List<ExpenseResponseDTO>> findByDueDateAndStatus(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Boolean isPaid) {
        UUID userId = authUtils.getCurrentUserId();
        List<ExpenseResponseDTO> response = expenseService.findByDueDateAndStatus(userId, isPaid, startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
