package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.InvestmentRequestDTO;
import com.app.FinTrack.domain.dto.InvestmentResponseDTO;
import com.app.FinTrack.domain.entity.Investment;
import com.app.FinTrack.domain.entity.User;
import com.app.FinTrack.domain.enums.InvestmentType;
import com.app.FinTrack.exception.ResourceNotFoundException;
import com.app.FinTrack.repository.InvestmentRepository;
import com.app.FinTrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

//Service responsável pela lógica de negócio de Investimentos.
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class InvestmentService {

    /** Escala decimal para preços (2 casas decimais para moeda). */
    private static final int PRICE_SCALE = 2;

    private final InvestmentRepository investmentRepository;
    private final UserRepository userRepository;

    //CRUD
    @Transactional
    public InvestmentResponseDTO create(UUID userId, InvestmentRequestDTO request) {
        log.info("Criando investimento para usuário: {}", userId);

        User user = findUserById(userId);

        Investment investment = Investment.builder()
                .user(user)
                .name(request.name())
                .type(request.type())
                .ticker(request.ticker())
                .quantity(request.quantity())
                .purchasePrice(request.purchasePrice())
                .currentPrice(request.currentPrice())
                .purchaseDate(request.purchaseDate())
                .broker(request.broker())
                .notes(request.notes())
                .build();

        Investment saved = investmentRepository.save(investment);
        log.info("Investimento criado com ID: {}", saved.getId());

        return InvestmentResponseDTO.fromEntity(saved);
    }

    public List<InvestmentResponseDTO> findAllByUser(UUID userId) {
        log.debug("Buscando investimentos do usuário: {}", userId);
        return investmentRepository.findByUserIdOrderByPurchaseDateDesc(userId)
                .stream()
                .map(InvestmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public InvestmentResponseDTO findById(UUID userId, UUID investmentId) {
        Investment investment = findInvestmentByIdAndUser(investmentId, userId);
        return InvestmentResponseDTO.fromEntity(investment);
    }

    @Transactional
    public InvestmentResponseDTO update(UUID userId, UUID investmentId, InvestmentRequestDTO request) {
        log.info("Atualizando investimento: {} do usuário: {}", investmentId, userId);

        Investment investment = findInvestmentByIdAndUser(investmentId, userId);

        investment.setName(request.name());
        investment.setType(request.type());
        investment.setTicker(request.ticker());
        investment.setQuantity(request.quantity());
        investment.setPurchasePrice(request.purchasePrice());
        investment.setCurrentPrice(request.currentPrice());
        investment.setPurchaseDate(request.purchaseDate());
        investment.setBroker(request.broker());
        investment.setNotes(request.notes());

        Investment updated = investmentRepository.save(investment);
        log.info("Investimento atualizado: {}", investmentId);

        return InvestmentResponseDTO.fromEntity(updated);
    }

    @Transactional
    public void delete(UUID userId, UUID investmentId) {
        log.info("Deletando investimento: {} do usuário: {}", investmentId, userId);

        Investment investment = findInvestmentByIdAndUser(investmentId, userId);
        investmentRepository.delete(investment);

        log.info("Investimento deletado: {}", investmentId);
    }

    //FILTROS
    public List<InvestmentResponseDTO> findByType(UUID userId, InvestmentType type) {
        return investmentRepository.findByUserIdAndType(userId, type)
                .stream()
                .map(InvestmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InvestmentResponseDTO> findByTicker(UUID userId, String ticker) {
        return investmentRepository.findByUserIdAndTickerIgnoreCase(userId, ticker)
                .stream()
                .map(InvestmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InvestmentResponseDTO> findByBroker(UUID userId, String broker) {
        return investmentRepository.findByUserIdAndBrokerIgnoreCase(userId, broker)
                .stream()
                .map(InvestmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InvestmentResponseDTO> searchByName(UUID userId, String searchTerm) {
        return investmentRepository.findByUserIdAndNameContainingIgnoreCase(userId, searchTerm)
                .stream()
                .map(InvestmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //AÇÕES
    @Transactional
    public InvestmentResponseDTO updateCurrentPrice(UUID userId, UUID investmentId, BigDecimal newPrice) {
        Investment investment = findInvestmentByIdAndUser(investmentId, userId);
        investment.setCurrentPrice(newPrice);
        return InvestmentResponseDTO.fromEntity(investmentRepository.save(investment));
    }

    @Transactional
    public InvestmentResponseDTO addQuantity(UUID userId, UUID investmentId,
                                             BigDecimal additionalQuantity, BigDecimal purchasePrice) {
        Investment investment = findInvestmentByIdAndUser(investmentId, userId);

        // Calcula novo preço médio: (qtd_atual * preço_médio + qtd_nova * preço_novo) / (qtd_atual + qtd_nova)
        BigDecimal currentTotal = investment.getQuantity().multiply(investment.getPurchasePrice());
        BigDecimal newTotal = additionalQuantity.multiply(purchasePrice);
        BigDecimal totalQuantity = investment.getQuantity().add(additionalQuantity);

        BigDecimal newAveragePrice = currentTotal.add(newTotal)
                .divide(totalQuantity, PRICE_SCALE, java.math.RoundingMode.HALF_UP);

        investment.setQuantity(totalQuantity);
        investment.setPurchasePrice(newAveragePrice);

        return InvestmentResponseDTO.fromEntity(investmentRepository.save(investment));
    }

    // RELATÓRIO
    public BigDecimal getTotalInvested(UUID userId) {
        return investmentRepository.sumTotalInvestedByUserId(userId);
    }

    public BigDecimal getCurrentTotalValue(UUID userId) {
        return investmentRepository.sumCurrentValueByUserId(userId);
    }

    public BigDecimal getTotalInvestedByType(UUID userId, InvestmentType type) {
        return investmentRepository.sumTotalInvestedByUserIdAndType(userId, type);
    }

    public long count(UUID userId) {
        return investmentRepository.countByUserId(userId);
    }

    //MÉTODOS AUXILIARES
    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + userId));
    }

    private Investment findInvestmentByIdAndUser(UUID investmentId, UUID userId) {
        Investment investment = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Investimento não encontrado: " + investmentId));

        if (!investment.getUser().getId().equals(userId)) {
            log.warn("Tentativa de acesso não autorizado ao investimento {} pelo usuário {}", investmentId, userId);
            throw new ResourceNotFoundException("Investimento não encontrado: " + investmentId);
        }

        return investment;
    }
}
