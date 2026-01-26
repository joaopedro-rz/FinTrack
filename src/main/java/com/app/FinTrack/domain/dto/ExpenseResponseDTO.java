package com.app.FinTrack.domain.dto;

import com.app.FinTrack.domain.entity.Expense;
import com.app.FinTrack.domain.enums.ExpenseCategory;
import com.app.FinTrack.domain.enums.PaymentMethod;
import com.app.FinTrack.domain.enums.RecurrenceType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para respostas de Expense.
 */
public record ExpenseResponseDTO(
        UUID id,
        String description,
        BigDecimal amount,
        ExpenseCategory category,
        String categoryDisplayName,
        PaymentMethod paymentMethod,
        String paymentMethodDisplayName,
        LocalDate date,
        RecurrenceType recurrence,
        String recurrenceDisplayName,
        Boolean isPaid,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static ExpenseResponseDTO fromEntity(Expense expense) {
        return new ExpenseResponseDTO(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getCategory().getDisplayName(),
                expense.getPaymentMethod(),
                expense.getPaymentMethod().getDisplayName(),
                expense.getDate(),
                expense.getRecurrence(),
                expense.getRecurrence().getDisplayName(),
                expense.getIsPaid(),
                expense.getNotes(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }
}
