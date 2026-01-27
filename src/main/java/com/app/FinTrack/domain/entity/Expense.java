package com.app.FinTrack.domain.entity;

import com.app.FinTrack.domain.enums.ExpenseCategory;
import com.app.FinTrack.domain.enums.PaymentMethod;
import com.app.FinTrack.domain.enums.RecurrenceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade que representa uma Despesa/Gasto do usuário.
 * Exemplos: aluguel, mercado, conta de luz, restaurante, etc.
 */
@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private ExpenseCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence", nullable = false, length = 20)
    @Builder.Default
    private RecurrenceType recurrence = RecurrenceType.ONCE;

    @Column(name = "is_paid", nullable = false)
    @Builder.Default
    private Boolean isPaid = true;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Expense(User user, String description, BigDecimal amount,
                   ExpenseCategory category, PaymentMethod paymentMethod, LocalDate date) {
        this.user = user;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.paymentMethod = paymentMethod;
        this.date = date;
        this.dueDate = date;
        this.recurrence = RecurrenceType.ONCE;
        this.isPaid = false;
    }

    @Override
    public String toString() {
        return "Expense{id=" + id + ", description='" + description + "', amount=" + amount +
               ", category=" + category + ", paymentMethod=" + paymentMethod + ", date=" + date + '}';
    }
}
