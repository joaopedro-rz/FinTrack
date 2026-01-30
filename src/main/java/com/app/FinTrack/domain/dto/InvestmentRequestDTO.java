package com.app.FinTrack.domain.dto;

import com.app.FinTrack.domain.enums.InvestmentType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para requisições de criação/atualização de Investment.
 */
public record InvestmentRequestDTO(

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
        String name,

        @NotNull(message = "Tipo é obrigatório")
        InvestmentType type,

        @Size(max = 20, message = "Ticker deve ter no máximo 20 caracteres")
        String ticker,

        @NotNull(message = "Quantidade é obrigatória")
        @Positive(message = "Quantidade deve ser positiva")
        @Digits(integer = 10, fraction = 8, message = "Quantidade deve ter no máximo 10 dígitos inteiros e 8 decimais")
        BigDecimal quantity,

        @NotNull(message = "Preço de compra é obrigatório")
        @Positive(message = "Preço de compra deve ser positivo")
        @Digits(integer = 13, fraction = 2, message = "Preço deve ter no máximo 13 dígitos inteiros e 2 decimais")
        BigDecimal purchasePrice,

        @Positive(message = "Preço atual deve ser positivo")
        @Digits(integer = 13, fraction = 2, message = "Preço deve ter no máximo 13 dígitos inteiros e 2 decimais")
        BigDecimal currentPrice,

        @NotNull(message = "Data de compra é obrigatória")
        LocalDate purchaseDate,

        @Size(max = 100, message = "Corretora deve ter no máximo 100 caracteres")
        String broker,

        @Size(max = 1000, message = "Notas devem ter no máximo 1000 caracteres")
        String notes
) {
    /**
     * Construtor que define valores padrão para campos opcionais.
     */
    public InvestmentRequestDTO {
        if (quantity == null) {
            quantity = BigDecimal.ONE;
        }
        // Normaliza ticker para uppercase
        if (ticker != null && !ticker.isBlank()) {
            ticker = ticker.trim().toUpperCase();
        }
    }
}
