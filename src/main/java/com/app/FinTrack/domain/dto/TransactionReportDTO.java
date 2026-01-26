package com.app.FinTrack.domain.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para representar uma transação financeira no relatório.
 * Unifica receitas e despesas em um único formato.
 */
public record TransactionReportDTO(
        String id,
        LocalDate date,
        String type,              // "INCOME" ou "EXPENSE"
        String typeDisplayName,   // "Receita" ou "Despesa"
        String category,
        String categoryDisplayName,
        String description,
        BigDecimal amount,
        String notes
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
            String notes) {
        return new TransactionReportDTO(
                id,
                date,
                "INCOME",
                "Receita",
                category,
                categoryDisplayName,
                description,
                amount,
                notes
        );
    }

    /**
     * Cria um DTO de despesa.
     */
    public static TransactionReportDTO fromExpense(
            String id,
            LocalDate date,
            String category,
            String categoryDisplayName,
            String description,
            BigDecimal amount,
            String notes) {
        return new TransactionReportDTO(
                id,
                date,
                "EXPENSE",
                "Despesa",
                category,
                categoryDisplayName,
                description,
                amount,
                notes
        );
    }
}
