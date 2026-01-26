package com.app.FinTrack.domain.dto;

import com.app.FinTrack.domain.entity.Income;
import com.app.FinTrack.domain.enums.IncomeCategory;
import com.app.FinTrack.domain.enums.RecurrenceType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para respostas de Income.
 * Não expõe dados sensíveis e formata dados para o frontend.
 */
public record IncomeResponseDTO(
        UUID id,
        String description,
        BigDecimal amount,
        IncomeCategory category,
        String categoryDisplayName,
        LocalDate date,
        RecurrenceType recurrence,
        String recurrenceDisplayName,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static IncomeResponseDTO fromEntity(Income income) {
        return new IncomeResponseDTO(
                income.getId(),
                income.getDescription(),
                income.getAmount(),
                income.getCategory(),
                income.getCategory().getDisplayName(),
                income.getDate(),
                income.getRecurrence(),
                income.getRecurrence().getDisplayName(),
                income.getNotes(),
                income.getCreatedAt(),
                income.getUpdatedAt()
        );
    }
}
