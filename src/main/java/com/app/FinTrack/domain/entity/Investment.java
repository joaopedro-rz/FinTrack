package com.app.FinTrack.domain.entity;

import com.app.FinTrack.domain.enums.InvestmentType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade que representa um Investimento do usuário.
 * Exemplos: ações, FIIs, CDB, Tesouro Direto, criptomoedas, etc.
 */
@Entity
@Table(name = "investments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private InvestmentType type;

    @Column(name = "ticker", length = 20)
    private String ticker;

    @Column(name = "quantity", nullable = false, precision = 18, scale = 8)
    @Builder.Default
    private BigDecimal quantity = BigDecimal.ONE;

    @Column(name = "purchase_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "current_price", precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "broker", length = 100)
    private String broker;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // MÉTODOS DE CÁLCULO

    /** Calcula o valor total investido (quantidade × preço de compra). */
    public BigDecimal getTotalInvested() {
        return quantity.multiply(purchasePrice);
    }

    /** Calcula o valor atual do investimento (quantidade × preço atual). */
    public BigDecimal getCurrentValue() {
        if (currentPrice == null) return null;
        return quantity.multiply(currentPrice);
    }

    /** Calcula o lucro/prejuízo (valor atual - valor investido). */
    public BigDecimal getProfitLoss() {
        BigDecimal currentValue = getCurrentValue();
        if (currentValue == null) return null;
        return currentValue.subtract(getTotalInvested());
    }

    /** Calcula a rentabilidade percentual. */
    public BigDecimal getProfitLossPercentage() {
        BigDecimal profitLoss = getProfitLoss();
        if (profitLoss == null) return null;
        BigDecimal totalInvested = getTotalInvested();
        if (totalInvested.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return profitLoss.divide(totalInvested, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }

    @Override
    public String toString() {
        return "Investment{id=" + id + ", name='" + name + "', type=" + type +
               ", ticker='" + ticker + "', quantity=" + quantity + ", purchasePrice=" + purchasePrice + '}';
    }
}
