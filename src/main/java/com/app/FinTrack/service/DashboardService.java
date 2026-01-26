package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.DashboardDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Service responsável por gerar o resumo financeiro (Dashboard).
 * Consolida dados de Income, Expense e Investment.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final InvestmentService investmentService;

    /** Fator para converter para percentual. */
    private static final BigDecimal HUNDRED = new BigDecimal("100");

    /**
     * Gera o resumo financeiro completo do usuário (todos os dados).
     */
    public DashboardDTO getDashboard(UUID userId) {
        log.info("Gerando dashboard para usuário: {}", userId);

        // Receitas (total)
        BigDecimal totalIncome = incomeService.getTotalAmount(userId);
        long incomeCount = incomeService.count(userId);

        // Despesas (total)
        BigDecimal totalExpense = expenseService.getTotalAmount(userId);
        BigDecimal pendingExpense = expenseService.getTotalPending(userId);
        long expenseCount = expenseService.count(userId);

        // Investimentos (sempre total, não filtrado por período)
        InvestmentSummary investmentSummary = calculateInvestmentSummary(userId);

        // Balanço e taxa de poupança
        BigDecimal balance = DashboardDTO.calculateBalance(totalIncome, totalExpense);
        BigDecimal savingsRate = DashboardDTO.calculateSavingsRate(totalIncome, totalExpense);

        return buildDashboardDTO(
                totalIncome, incomeCount,
                totalExpense, pendingExpense, expenseCount,
                investmentSummary,
                balance, savingsRate
        );
    }

    /**
     * Gera o resumo financeiro de um período específico (mensal, por exemplo).
     * Receitas e despesas são filtradas pelo período.
     * Investimentos mostram o valor total (não filtrado por período).
     */
    public DashboardDTO getDashboardByPeriod(UUID userId, LocalDate startDate, LocalDate endDate) {
        log.info("Gerando dashboard para usuário: {} - período: {} a {}", userId, startDate, endDate);

        // Receitas do período
        BigDecimal totalIncome = incomeService.getTotalAmountByPeriod(userId, startDate, endDate);
        long incomeCount = incomeService.countByPeriod(userId, startDate, endDate);

        // Despesas do período
        BigDecimal totalExpense = expenseService.getTotalAmountByPeriod(userId, startDate, endDate);
        BigDecimal pendingExpense = expenseService.getTotalPending(userId); // Pendente é sempre total
        long expenseCount = expenseService.countByPeriod(userId, startDate, endDate);

        // Investimentos (sempre total, não filtrado por período)
        InvestmentSummary investmentSummary = calculateInvestmentSummary(userId);

        // Balanço e taxa de poupança (baseados no período)
        BigDecimal balance = DashboardDTO.calculateBalance(totalIncome, totalExpense);
        BigDecimal savingsRate = DashboardDTO.calculateSavingsRate(totalIncome, totalExpense);

        return buildDashboardDTO(
                totalIncome, incomeCount,
                totalExpense, pendingExpense, expenseCount,
                investmentSummary,
                balance, savingsRate
        );
    }

    // ==================== MÉTODOS AUXILIARES ====================

    /**
     * Calcula o resumo de investimentos (valor investido, atual, lucro/prejuízo).
     * Extrai a lógica duplicada para um método privado (DRY).
     */
    private InvestmentSummary calculateInvestmentSummary(UUID userId) {
        BigDecimal totalInvested = investmentService.getTotalInvested(userId);
        BigDecimal currentValue = investmentService.getCurrentTotalValue(userId);
        long count = investmentService.count(userId);

        BigDecimal profitLoss = BigDecimal.ZERO;
        BigDecimal profitLossPercentage = BigDecimal.ZERO;

        if (currentValue != null && currentValue.compareTo(BigDecimal.ZERO) > 0) {
            profitLoss = currentValue.subtract(totalInvested);
            if (totalInvested.compareTo(BigDecimal.ZERO) > 0) {
                profitLossPercentage = profitLoss
                        .divide(totalInvested, DashboardDTO.CALCULATION_SCALE, RoundingMode.HALF_UP)
                        .multiply(HUNDRED);
            }
        }

        return new InvestmentSummary(
                totalInvested,
                currentValue != null ? currentValue : BigDecimal.ZERO,
                profitLoss,
                profitLossPercentage,
                count
        );
    }

    /**
     * Constrói o DTO do Dashboard com os dados fornecidos.
     */
    private DashboardDTO buildDashboardDTO(
            BigDecimal totalIncome, long incomeCount,
            BigDecimal totalExpense, BigDecimal pendingExpense, long expenseCount,
            InvestmentSummary investment,
            BigDecimal balance, BigDecimal savingsRate) {

        return new DashboardDTO(
                totalIncome, incomeCount,
                totalExpense, pendingExpense, expenseCount,
                investment.totalInvested,
                investment.currentValue,
                investment.profitLoss,
                investment.profitLossPercentage,
                investment.count,
                balance, savingsRate
        );
    }

    /**
     * Record interno para agrupar dados de investimento.
     */
    private record InvestmentSummary(
            BigDecimal totalInvested,
            BigDecimal currentValue,
            BigDecimal profitLoss,
            BigDecimal profitLossPercentage,
            long count
    ) {}
}
