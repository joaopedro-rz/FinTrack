package com.app.FinTrack.domain.dto;

import com.app.FinTrack.domain.enums.IncomeCategory;
import com.app.FinTrack.domain.enums.RecurrenceType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para requisições de criação/atualização de Income.
 * Contém validações de entrada.
 */
public record IncomeRequestDTO(

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
        String description,

        @NotNull(message = "Valor é obrigatório")
        @Positive(message = "Valor deve ser positivo")
        @Digits(integer = 13, fraction = 2, message = "Valor deve ter no máximo 13 dígitos inteiros e 2 decimais")
        BigDecimal amount,

        @NotNull(message = "Categoria é obrigatória")
        IncomeCategory category,

        @NotNull(message = "Data é obrigatória")
        LocalDate date,

        RecurrenceType recurrence,

        @Size(max = 1000, message = "Notas devem ter no máximo 1000 caracteres")
        String notes
) {
    public IncomeRequestDTO {
        if (recurrence == null) {
            recurrence = RecurrenceType.ONCE;
        }
    }
}
