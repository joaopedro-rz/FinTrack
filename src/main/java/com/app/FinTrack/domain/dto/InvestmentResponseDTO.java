package com.app.FinTrack.domain.dto;

import com.app.FinTrack.domain.entity.Investment;
import com.app.FinTrack.domain.enums.InvestmentType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para respostas de Investment.
 * Inclui campos calculados para facilitar visualização no frontend.
 */
public record InvestmentResponseDTO(
        UUID id,
        String name,
        InvestmentType type,
        String typeDisplayName,
        String ticker,
        BigDecimal quantity,
        BigDecimal purchasePrice,
        BigDecimal currentPrice,
        LocalDate purchaseDate,
        String broker,
        String notes,

        // Campos calculados
        BigDecimal totalInvested,
        BigDecimal currentValue,
        BigDecimal profitLoss,
        BigDecimal profitLossPercentage,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static InvestmentResponseDTO fromEntity(Investment investment) {
        return new InvestmentResponseDTO(
                investment.getId(),
                investment.getName(),
                investment.getType(),
                investment.getType().getDisplayName(),
                investment.getTicker(),
                investment.getQuantity(),
                investment.getPurchasePrice(),
                investment.getCurrentPrice(),
                investment.getPurchaseDate(),
                investment.getBroker(),
                investment.getNotes(),

                // Campos calculados
                investment.getTotalInvested(),
                investment.getCurrentValue(),
                investment.getProfitLoss(),
                investment.getProfitLossPercentage(),

                investment.getCreatedAt(),
                investment.getUpdatedAt()
        );
    }
}
