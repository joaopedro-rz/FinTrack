package com.app.FinTrack.domain.enums;

public enum InvestmentType {

    // Renda Fixa
    SAVINGS("Poupança", "Caderneta de poupança"),
    CDB("CDB", "Certificado de Depósito Bancário"),
    LCI_LCA("LCI/LCA", "Letras de Crédito Imobiliário/Agronegócio"),
    TREASURY("Tesouro Direto", "Títulos públicos federais"),
    DEBENTURES("Debêntures", "Títulos de dívida privada"),

    // Renda Variável
    STOCKS("Ações", "Ações de empresas na bolsa"),
    REITS("FIIs", "Fundos de Investimento Imobiliário"),
    ETFS("ETFs", "Fundos de índice"),
    BDRS("BDRs", "Brazilian Depositary Receipts"),

    // Fundos
    INVESTMENT_FUND("Fundo de Investimento", "Fundos multimercado, RF, etc"),
    PENSION("Previdência Privada", "PGBL/VGBL"),

    // Criptomoedas
    CRYPTO("Criptomoedas", "Bitcoin, Ethereum, etc"),

    // Internacional
    INTERNATIONAL("Internacional", "Investimentos no exterior"),

    // Outros
    REAL_ESTATE("Imóveis", "Investimento direto em imóveis"),
    COMMODITIES("Commodities", "Ouro, prata, etc"),
    OTHER("Outros", "Outros tipos de investimento");

    private final String displayName;
    private final String description;

    InvestmentType(String displayName, String description) {
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
