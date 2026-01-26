package com.app.FinTrack.domain.entity;

import com.app.FinTrack.domain.enums.IncomeCategory;
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
 * Entidade que representa uma Receita/Renda do usuário.
 * Exemplos: salário, freelance, dividendos, vendas, etc.
 */
@Entity
@Table(name = "incomes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Income {

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
    private IncomeCategory category;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence", nullable = false, length = 20)
    @Builder.Default
    private RecurrenceType recurrence = RecurrenceType.ONCE;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Income(User user, String description, BigDecimal amount,
                  IncomeCategory category, LocalDate date) {
        this.user = user;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.recurrence = RecurrenceType.ONCE;
    }

    @Override
    public String toString() {
        return "Income{id=" + id + ", description='" + description + "', amount=" + amount +
               ", category=" + category + ", date=" + date + '}';
    }
}
