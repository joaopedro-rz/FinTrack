package com.app.FinTrack.repository;

import com.app.FinTrack.domain.entity.Expense;
import com.app.FinTrack.domain.enums.ExpenseCategory;
import com.app.FinTrack.domain.enums.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

//Repository para operações de banco de dados da entidade Expense.
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    // BUSCA BÁSICA
    List<Expense> findByUserId(UUID userId);

    List<Expense> findByUserIdOrderByDateDesc(UUID userId);

    // FILTROS POR DATA
    List<Expense> findByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserIdAndDateGreaterThanEqual(UUID userId, LocalDate startDate);

    List<Expense> findByUserIdAndDateLessThanEqual(UUID userId, LocalDate endDate);

    // FILTROS POR CATEGORIA
    List<Expense> findByUserIdAndCategory(UUID userId, ExpenseCategory category);

    List<Expense> findByUserIdAndCategoryAndDateBetween(
            UUID userId, ExpenseCategory category, LocalDate startDate, LocalDate endDate);

    //FILTROS POR MÉTODO DE PAGAMENTO
    List<Expense> findByUserIdAndPaymentMethod(UUID userId, PaymentMethod paymentMethod);

    //FILTROS POR STATUS (PAGO/PENDENTE)
    List<Expense> findByUserIdAndIsPaid(UUID userId, Boolean isPaid);

    List<Expense> findByUserIdAndIsPaidFalseOrderByDateAsc(UUID userId);

    //AGREGAÇÕES (para relatórios)
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndDateBetween(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.dueDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndDueDateBetween(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.category = :category")
    BigDecimal sumAmountByUserIdAndCategory(@Param("userId") UUID userId, @Param("category") ExpenseCategory category);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.paymentMethod = :paymentMethod")
    BigDecimal sumAmountByUserIdAndPaymentMethod(@Param("userId") UUID userId, @Param("paymentMethod") PaymentMethod paymentMethod);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.isPaid = false")
    BigDecimal sumPendingAmountByUserId(@Param("userId") UUID userId);

    long countByUserId(UUID userId);

    long countByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);

    //BUSCA POR DESCRIÇÃO
    List<Expense> findByUserIdAndDescriptionContainingIgnoreCase(UUID userId, String description);

    // BUSCA POR DATA DE VENCIMENTO
    List<Expense> findByUserIdAndDueDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserIdAndIsPaidAndDueDateBetween(UUID userId, Boolean isPaid, LocalDate startDate, LocalDate endDate);

    // BUSCA ORDENADA CUSTOMIZADA (para lógica de exibição)
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND e.dueDate BETWEEN :startDate AND :endDate " +
           "ORDER BY CASE WHEN e.isPaid = false THEN 0 ELSE 1 END, " +
           "CASE WHEN e.recurrence != 'ONCE' THEN 0 ELSE 1 END, " +
           "e.dueDate ASC")
    List<Expense> findByUserIdAndDueDateBetweenOrderedByPriority(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
