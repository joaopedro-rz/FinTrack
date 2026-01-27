package com.app.FinTrack.repository;

import com.app.FinTrack.domain.entity.Income;
import com.app.FinTrack.domain.enums.IncomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Repository para operações de banco de dados da entidade Income.
 *
 * Spring Data JPA gera automaticamente as implementações baseadas nos nomes dos métodos.
 */
@Repository
public interface IncomeRepository extends JpaRepository<Income, UUID> {

    //BUSCA BÁSICA
    //Busca todas as receitas de um usuário.
    List<Income> findByUserId(UUID userId);

    //Busca receitas de um usuário ordenadas por data (mais recente primeiro).
    List<Income> findByUserIdOrderByDateDesc(UUID userId);

    //FILTROS POR DATA
    //Busca receitas de um usuário em um período específico.
    List<Income> findByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);

    //Busca receitas de um usuário a partir de uma data.
    List<Income> findByUserIdAndDateGreaterThanEqual(UUID userId, LocalDate startDate);

    //Busca receitas de um usuário até uma data.
    List<Income> findByUserIdAndDateLessThanEqual(UUID userId, LocalDate endDate);

    //FILTROS POR CATEGORIA
    //Busca receitas de um usuário por categoria.
    List<Income> findByUserIdAndCategory(UUID userId, IncomeCategory category);

    //Busca receitas de um usuário por categoria em um período.
    List<Income> findByUserIdAndCategoryAndDateBetween(
            UUID userId, IncomeCategory category, LocalDate startDate, LocalDate endDate);

    //AGREGAÇÕES (para relatórios)
    //Soma total de receitas de um usuário.
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") UUID userId);

    //Soma de receitas de um usuário em um período.
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId AND i.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndDateBetween(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    //Soma de receitas por categoria de um usuário.
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId AND i.category = :category")
    BigDecimal sumAmountByUserIdAndCategory(@Param("userId") UUID userId, @Param("category") IncomeCategory category);

    //Conta quantas receitas um usuário tem.
    long countByUserId(UUID userId);

    //Conta receitas em um período.
    long countByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);

    //BUSCA POR DESCRIÇÃO
    // Busca receitas contendo texto na descrição (case insensitive).
    List<Income> findByUserIdAndDescriptionContainingIgnoreCase(UUID userId, String description);

    // BUSCA ORDENADA POR RECORRÊNCIA
    // Ordem: 1) Recorrentes, 2) Únicas, 3) Data mais recente
    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND i.date BETWEEN :startDate AND :endDate " +
           "ORDER BY CASE WHEN i.recurrence != 'ONCE' THEN 0 ELSE 1 END, i.date DESC")
    List<Income> findByUserIdAndDateBetweenOrderedByRecurrence(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
