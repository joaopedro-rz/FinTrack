package com.app.FinTrack.domain.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para representar uma transação financeira no relatório.
 * Unifica receitas e despesas em um único formato.
 */
public record TransactionReportDTO(
        String id,
        LocalDate date,
        LocalDate dueDate,
        String type,
        String typeDisplayName,
        String category,
        String categoryDisplayName,
        String description,
        BigDecimal amount,
        String notes,
        LocalDateTime createdAt
) {
    /**
     * Cria um DTO de receita.
     */
    public static TransactionReportDTO fromIncome(
            String id,
            LocalDate date,
            String category,
            String categoryDisplayName,
            String description,
            BigDecimal amount,
            String notes,
            LocalDateTime createdAt) {
        return new TransactionReportDTO(
                id,
                date,
                null,
                "INCOME",
                "Receita",
                category,
                categoryDisplayName,
                description,
                amount,
                notes,
                createdAt
        );
    }

    /**
     * Cria um DTO de despesa.
     */
    public static TransactionReportDTO fromExpense(
            String id,
            LocalDate date,
            LocalDate dueDate,
            String category,
            String categoryDisplayName,
            String description,
            BigDecimal amount,
            String notes,
            LocalDateTime createdAt) {
        return new TransactionReportDTO(
                id,
                date,
                dueDate,
                "EXPENSE",
                "Despesa",
                category,
                categoryDisplayName,
                description,
                amount,
                notes,
                createdAt
        );
    }
}
