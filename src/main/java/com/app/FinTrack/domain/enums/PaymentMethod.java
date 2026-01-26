package com.app.FinTrack.domain.enums;

public enum PaymentMethod {

    // Dinheiro
    CASH("Dinheiro", "Pagamento em espécie"),

    // Cartões
    CREDIT_CARD("Cartão de Crédito", "Pagamento no crédito"),
    DEBIT_CARD("Cartão de Débito", "Pagamento no débito"),

    // Transferências
    PIX("PIX", "Transferência instantânea"),
    BANK_TRANSFER("Transferência Bancária", "TED/DOC"),

    // Digital
    DIGITAL_WALLET("Carteira Digital", "PicPay, Mercado Pago, etc"),

    // Outros
    BOLETO("Boleto", "Boleto bancário"),
    FINANCING("Financiamento", "Parcelamento com juros"),
    OTHER("Outro", "Outras formas de pagamento");

    private final String displayName;
    private final String description;

    PaymentMethod(String displayName, String description) {
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
