package com.app.FinTrack.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportType {
    ALL("ALL", "Todas as transações"),
    INCOME("INCOME", "Apenas receitas"),
    EXPENSE("EXPENSE", "Apenas despesas");

    @JsonValue
    private final String code;
    private final String displayName;

    @JsonCreator
    public static ReportType fromCode(String code) {
        for (ReportType type : ReportType.values()) {
            if (type.code.equalsIgnoreCase(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Tipo de relatório inválido: " + code);
    }

    @Override
    public String toString() {
        return this.code;
    }
}
