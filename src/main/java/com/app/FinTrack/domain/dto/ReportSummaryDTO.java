package com.app.FinTrack.domain.dto;

import com.app.FinTrack.domain.enums.ReportType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO para o resumo do relatório financeiro.
 * Contém as transações e métricas consolidadas.
 */
public record ReportSummaryDTO(
        LocalDate startDate,
        LocalDate endDate,
        ReportType filterType,
        List<TransactionReportDTO> transactions,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        int incomeCount,
        int expenseCount
) {
}
