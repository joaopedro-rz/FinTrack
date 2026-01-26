package com.app.FinTrack.domain.enums;

public enum RecurrenceType {

    ONCE("Única", "Transação única, sem repetição"),
    DAILY("Diária", "Repete todo dia"),
    WEEKLY("Semanal", "Repete toda semana"),
    BIWEEKLY("Quinzenal", "Repete a cada 15 dias"),
    MONTHLY("Mensal", "Repete todo mês"),
    BIMONTHLY("Bimestral", "Repete a cada 2 meses"),
    QUARTERLY("Trimestral", "Repete a cada 3 meses"),
    SEMIANNUAL("Semestral", "Repete a cada 6 meses"),
    ANNUAL("Anual", "Repete todo ano");

    private final String displayName;
    private final String description;

    RecurrenceType(String displayName, String description) {
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
