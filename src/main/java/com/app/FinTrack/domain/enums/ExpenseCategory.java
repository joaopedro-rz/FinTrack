package com.app.FinTrack.domain.enums;

public enum ExpenseCategory {

    // Moradia
    HOUSING("Moradia", "Aluguel, condomínio, IPTU"),
    UTILITIES("Contas de Casa", "Água, luz, gás, internet"),

    // Transporte
    TRANSPORTATION("Transporte", "Combustível, transporte público, Uber"),
    VEHICLE("Veículo", "Manutenção, seguro, IPVA"),

    // Alimentação
    FOOD("Alimentação", "Supermercado e feira"),
    RESTAURANT("Restaurante", "Refeições fora de casa"),

    // Saúde
    HEALTH("Saúde", "Plano de saúde, médicos, farmácia"),

    // Educação
    EDUCATION("Educação", "Cursos, livros, material escolar"),

    // Lazer e entretenimento
    ENTERTAINMENT("Lazer", "Cinema, streaming, jogos"),
    TRAVEL("Viagem", "Passagens, hospedagem, passeios"),

    // Pessoal
    CLOTHING("Vestuário", "Roupas e acessórios"),
    PERSONAL_CARE("Cuidados Pessoais", "Salão, academia, estética"),

    // Financeiro
    SUBSCRIPTION("Assinatura", "Serviços recorrentes"),
    INSURANCE("Seguro", "Seguros diversos"),
    TAX("Impostos", "Impostos e taxas"),
    DEBT("Dívidas", "Parcelas e empréstimos"),

    // Família
    PET("Pet", "Gastos com animais de estimação"),
    KIDS("Filhos", "Escola, atividades, mesada"),

    // Outros
    DONATION("Doação", "Caridade e ajudas"),
    OTHER("Outros", "Gastos não categorizados");

    private final String displayName;
    private final String description;

    ExpenseCategory(String displayName, String description) {
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
