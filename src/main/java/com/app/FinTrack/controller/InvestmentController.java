package com.app.FinTrack.controller;

import com.app.FinTrack.domain.dto.InvestmentRequestDTO;
import com.app.FinTrack.domain.dto.InvestmentResponseDTO;
import com.app.FinTrack.domain.enums.InvestmentType;
import com.app.FinTrack.service.InvestmentService;
import com.app.FinTrack.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Controller REST para gerenciamento de Investimentos.
 * Todas as rotas são protegidas e operam sobre os dados do usuário autenticado.
 */
@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
@Slf4j
public class InvestmentController {

    private final InvestmentService investmentService;
    private final AuthUtils authUtils;

    //  CRUD
    @PostMapping
    public ResponseEntity<InvestmentResponseDTO> create(@Valid @RequestBody InvestmentRequestDTO request) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Criando investimento para usuário: {}", userId);

        InvestmentResponseDTO response = investmentService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<InvestmentResponseDTO>> findAll() {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Listando investimentos do usuário: {}", userId);

        List<InvestmentResponseDTO> response = investmentService.findAllByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentResponseDTO> findById(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.debug("Buscando investimento {} do usuário: {}", id, userId);

        InvestmentResponseDTO response = investmentService.findById(userId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody InvestmentRequestDTO request) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Atualizando investimento {} do usuário: {}", id, userId);

        InvestmentResponseDTO response = investmentService.update(userId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        UUID userId = authUtils.getCurrentUserId();
        log.warn("Deletando investimento {} do usuário: {}", id, userId);

        investmentService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    //  FILTROS
    @GetMapping("/type/{type}")
    public ResponseEntity<List<InvestmentResponseDTO>> findByType(@PathVariable InvestmentType type) {
        UUID userId = authUtils.getCurrentUserId();
        List<InvestmentResponseDTO> response = investmentService.findByType(userId, type);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ticker/{ticker}")
    public ResponseEntity<List<InvestmentResponseDTO>> findByTicker(@PathVariable String ticker) {
        UUID userId = authUtils.getCurrentUserId();
        List<InvestmentResponseDTO> response = investmentService.findByTicker(userId, ticker);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/broker/{broker}")
    public ResponseEntity<List<InvestmentResponseDTO>> findByBroker(@PathVariable String broker) {
        UUID userId = authUtils.getCurrentUserId();
        List<InvestmentResponseDTO> response = investmentService.findByBroker(userId, broker);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<InvestmentResponseDTO>> search(@RequestParam("q") String searchTerm) {
        UUID userId = authUtils.getCurrentUserId();
        List<InvestmentResponseDTO> response = investmentService.searchByName(userId, searchTerm);
        return ResponseEntity.ok(response);
    }

    // AÇÕES
    @PatchMapping("/{id}/price")
    public ResponseEntity<InvestmentResponseDTO> updatePrice(
            @PathVariable UUID id,
            @RequestParam BigDecimal price) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Atualizando preço do investimento {} para {} - usuário: {}", id, price, userId);

        InvestmentResponseDTO response = investmentService.updateCurrentPrice(userId, id, price);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/add")
    public ResponseEntity<InvestmentResponseDTO> addQuantity(
            @PathVariable UUID id,
            @RequestParam BigDecimal quantity,
            @RequestParam BigDecimal price) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Adicionando {} unidades ao investimento {} por R${} - usuário: {}",
                quantity, id, price, userId);

        InvestmentResponseDTO response = investmentService.addQuantity(userId, id, quantity, price);
        return ResponseEntity.ok(response);
    }

    //  RELATÓRIOS
    @GetMapping("/total/invested")
    public ResponseEntity<BigDecimal> getTotalInvested() {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = investmentService.getTotalInvested(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/current")
    public ResponseEntity<BigDecimal> getCurrentTotalValue() {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = investmentService.getCurrentTotalValue(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/type/{type}")
    public ResponseEntity<BigDecimal> getTotalByType(@PathVariable InvestmentType type) {
        UUID userId = authUtils.getCurrentUserId();
        BigDecimal total = investmentService.getTotalInvestedByType(userId, type);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        UUID userId = authUtils.getCurrentUserId();
        long count = investmentService.count(userId);
        return ResponseEntity.ok(count);
    }
}
