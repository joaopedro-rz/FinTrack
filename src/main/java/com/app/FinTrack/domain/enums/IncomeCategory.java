package com.app.FinTrack.domain.enums;

public enum IncomeCategory {

    // Rendas principais
    SALARY("Salário", "Renda fixa mensal do trabalho CLT"),
    FREELANCE("Freelance", "Trabalhos autônomos e projetos pontuais"),
    BUSINESS("Negócio Próprio", "Lucros de empresa ou MEI"),

    // Rendas de investimentos
    DIVIDENDS("Dividendos", "Proventos de ações e FIIs"),
    INTEREST("Juros", "Rendimentos de renda fixa"),
    RENTAL("Aluguel", "Renda de imóveis alugados"),

    // Outras rendas
    BONUS("Bônus", "Bônus, PLR e comissões"),
    GIFT("Presente", "Dinheiro recebido como presente"),
    REFUND("Reembolso", "Devoluções e reembolsos"),
    SALE("Venda", "Venda de bens pessoais"),
    OTHER("Outros", "Outras fontes de renda");

    private final String displayName;
    private final String description;

    IncomeCategory(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
