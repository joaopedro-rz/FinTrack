package com.app.FinTrack.domain.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * DTO para o resumo financeiro do Dashboard.
 * Contém os principais indicadores financeiros do usuário.
 */
public record DashboardDTO(
        // Resumo de Receitas
        BigDecimal totalIncome,
        long incomeCount,

        // Resumo de Despesas
        BigDecimal totalExpense,
        BigDecimal pendingExpense,
        long expenseCount,

        // Resumo de Investimentos
        BigDecimal totalInvested,
        BigDecimal currentInvestmentValue,
        BigDecimal investmentProfitLoss,
        BigDecimal investmentProfitLossPercentage,
        long investmentCount,

        // Balanço
        BigDecimal balance,
        BigDecimal savingsRate
) {
    /** Escala para cálculos intermediários (mais precisão). */
    public static final int CALCULATION_SCALE = 4;

    /** Escala para exibição (2 casas decimais para moeda). */
    public static final int DISPLAY_SCALE = 2;

    /** Fator para converter para percentual. */
    private static final BigDecimal HUNDRED = new BigDecimal("100");

    /**
     * Calcula o balanço (receitas - despesas).
     */
    public static BigDecimal calculateBalance(BigDecimal income, BigDecimal expense) {
        return income.subtract(expense);
    }

    /**
     * Calcula a taxa de poupança ((receitas - despesas) / receitas * 100).
     */
    public static BigDecimal calculateSavingsRate(BigDecimal income, BigDecimal expense) {
        if (income.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal savings = income.subtract(expense);
        return savings.divide(income, CALCULATION_SCALE, RoundingMode.HALF_UP)
                .multiply(HUNDRED)
                .setScale(DISPLAY_SCALE, RoundingMode.HALF_UP);
    }
}
