package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.ReportSummaryDTO;
import com.app.FinTrack.domain.dto.TransactionReportDTO;
import com.app.FinTrack.domain.entity.Expense;
import com.app.FinTrack.domain.entity.Income;
import com.app.FinTrack.domain.enums.ReportType;
import com.app.FinTrack.repository.ExpenseRepository;
import com.app.FinTrack.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service responsável por gerar relatórios financeiros.
 * Consolida receitas e despesas para visualização e exportação.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReportService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    /**
     * Gera relatório de transações (receitas e despesas) por período.
     *
     * @param userId    ID do usuário
     * @param startDate Data inicial (inclusiva)
     * @param endDate   Data final (inclusiva)
     * @param type      Tipo de transação: ALL, INCOME ou EXPENSE
     * @return Resumo do relatório com transações e totais
     */
    public ReportSummaryDTO generateReport(UUID userId, LocalDate startDate, LocalDate endDate, ReportType type) {
        log.info("Gerando relatório para usuário {} - Período: {} a {} - Tipo: {}", userId, startDate, endDate, type);

        List<TransactionReportDTO> transactions = new ArrayList<>();
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        int incomeCount = 0;
        int expenseCount = 0;

        // Buscar receitas se necessário
        if (type == ReportType.ALL || type == ReportType.INCOME) {
            List<Income> incomes = incomeRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
            incomeCount = incomes.size();
            totalIncome = incomes.stream()
                    .map(Income::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            transactions.addAll(incomes.stream()
                    .map(income -> TransactionReportDTO.fromIncome(
                            income.getId().toString(),
                            income.getDate(),
                            income.getCategory().name(),
                            income.getCategory().getDisplayName(),
                            income.getDescription(),
                            income.getAmount(),
                            income.getNotes(),
                            income.getCreatedAt()
                    ))
                    .collect(Collectors.toList()));
        }

        // Buscar despesas se necessário
        if (type == ReportType.ALL || type == ReportType.EXPENSE) {
            List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
            expenseCount = expenses.size();
            totalExpense = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            transactions.addAll(expenses.stream()
                    .map(expense -> TransactionReportDTO.fromExpense(
                            expense.getId().toString(),
                            expense.getDate(),
                            expense.getDueDate(),
                            expense.getCategory().name(),
                            expense.getCategory().getDisplayName(),
                            expense.getDescription(),
                            expense.getAmount(),
                            expense.getNotes(),
                            expense.getCreatedAt()
                    ))
                    .collect(Collectors.toList()));
        }

        // Ordenar por data (mais recente primeiro)
        transactions.sort(Comparator.comparing(TransactionReportDTO::date).reversed());

        BigDecimal balance = totalIncome.subtract(totalExpense);

        log.info("Relatório gerado: {} transações - Receitas: {} - Despesas: {} - Saldo: {}",
                transactions.size(), totalIncome, totalExpense, balance);

        return new ReportSummaryDTO(
                startDate,
                endDate,
                type,
                transactions,
                totalIncome,
                totalExpense,
                balance,
                incomeCount,
                expenseCount
        );
    }

    /**
     * Gera relatório do mês atual.
     */
    public ReportSummaryDTO generateCurrentMonthReport(UUID userId, ReportType type) {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
        return generateReport(userId, startOfMonth, endOfMonth, type);
    }

    /**
     * Gera relatório dos últimos 30 dias.
     */
    public ReportSummaryDTO generateLast30DaysReport(UUID userId, ReportType type) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        return generateReport(userId, startDate, endDate, type);
    }
}
