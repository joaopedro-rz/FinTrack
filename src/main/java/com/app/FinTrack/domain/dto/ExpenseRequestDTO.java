package com.app.FinTrack.domain.dto;

import com.app.FinTrack.domain.enums.ExpenseCategory;
import com.app.FinTrack.domain.enums.PaymentMethod;
import com.app.FinTrack.domain.enums.RecurrenceType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para requisições de criação/atualização de Expense.
 */
public record ExpenseRequestDTO(

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
        String description,

        @NotNull(message = "Valor é obrigatório")
        @Positive(message = "Valor deve ser positivo")
        @Digits(integer = 13, fraction = 2, message = "Valor deve ter no máximo 13 dígitos inteiros e 2 decimais")
        BigDecimal amount,

        @NotNull(message = "Categoria é obrigatória")
        ExpenseCategory category,

        @NotNull(message = "Método de pagamento é obrigatório")
        PaymentMethod paymentMethod,

        @NotNull(message = "Data é obrigatória")
        LocalDate date,

        @NotNull(message = "Data de vencimento é obrigatória")
        LocalDate dueDate,

        RecurrenceType recurrence,

        Boolean isPaid,

        @Size(max = 1000, message = "Notas devem ter no máximo 1000 caracteres")
        String notes
) {
    public ExpenseRequestDTO {
        if (recurrence == null) {
            recurrence = RecurrenceType.ONCE;
        }
        if (isPaid == null) {
            isPaid = false; // Por padrão, despesas são criadas como pendentes
        }
        if (dueDate == null) {
            dueDate = date; // Se não informado, vencimento = data de criação
        }
    }
}
