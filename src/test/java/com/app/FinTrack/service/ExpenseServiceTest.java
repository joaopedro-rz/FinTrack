package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.ExpenseRequestDTO;
import com.app.FinTrack.domain.dto.ExpenseResponseDTO;
import com.app.FinTrack.domain.entity.Expense;
import com.app.FinTrack.domain.entity.User;
import com.app.FinTrack.domain.enums.ExpenseCategory;
import com.app.FinTrack.domain.enums.PaymentMethod;
import com.app.FinTrack.domain.enums.RecurrenceType;
import com.app.FinTrack.exception.ResourceNotFoundException;
import com.app.FinTrack.repository.ExpenseRepository;
import com.app.FinTrack.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User validUser;
    private Expense validExpense;
    private ExpenseRequestDTO validRequest;

    @BeforeEach
    void setUp() {
        validUser = User.builder()
                .id(UUID.randomUUID())
                .name("Test User")
                .email("test@email.com")
                .password("$2a$10$encodedPassword")
                .createdAt(LocalDateTime.now())
                .build();

        validExpense = Expense.builder()
                .id(UUID.randomUUID())
                .user(validUser)
                .description("Test Expense")
                .amount(new BigDecimal("100.00"))
                .category(ExpenseCategory.FOOD)
                .paymentMethod(PaymentMethod.PIX)
                .date(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(7))
                .recurrence(RecurrenceType.ONCE)
                .isPaid(false)
                .notes("Test notes")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        validRequest = new ExpenseRequestDTO(
                "Test Expense",
                new BigDecimal("100.00"),
                ExpenseCategory.FOOD,
                PaymentMethod.PIX,
                LocalDate.now(),
                LocalDate.now().plusDays(7),
                RecurrenceType.ONCE,
                false,
                "Test notes"
        );
    }

    @Test
    @DisplayName("Deve criar despesa com sucesso")
    void shouldCreateExpenseSuccessfully() {
        UUID userId = validUser.getId();
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));
        when(expenseRepository.save(any(Expense.class))).thenReturn(validExpense);

        ExpenseResponseDTO result = expenseService.create(userId, validRequest);

        assertNotNull(result);
        assertEquals(validExpense.getId(), result.id());
        assertEquals(validExpense.getDescription(), result.description());
        assertEquals(validExpense.getAmount(), result.amount());

        verify(userRepository).findById(userId);
        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    @DisplayName("Deve atualizar despesa com sucesso incluindo dueDate")
    void shouldUpdateExpenseIncludingDueDate() {
        UUID userId = validUser.getId();
        UUID expenseId = validExpense.getId();
        LocalDate newDueDate = LocalDate.now().plusDays(14);

        ExpenseRequestDTO updateRequest = new ExpenseRequestDTO(
                "Updated Expense",
                new BigDecimal("150.00"),
                ExpenseCategory.TRANSPORTATION,
                PaymentMethod.CREDIT_CARD,
                LocalDate.now(),
                newDueDate,
                RecurrenceType.MONTHLY,
                true,
                "Updated notes"
        );

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(validExpense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(validExpense);

        ExpenseResponseDTO result = expenseService.update(userId, expenseId, updateRequest);

        assertNotNull(result);
        verify(expenseRepository).findById(expenseId);
        verify(expenseRepository).save(any(Expense.class));

        assertEquals(newDueDate, validExpense.getDueDate());
        assertEquals("Updated Expense", validExpense.getDescription());
        assertEquals(new BigDecimal("150.00"), validExpense.getAmount());
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar despesa para usuário inexistente")
    void shouldThrowExceptionWhenUserNotFound() {
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
            expenseService.create(userId, validRequest)
        );

        verify(userRepository).findById(userId);
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    @DisplayName("Deve buscar despesa por ID com sucesso")
    void shouldFindExpenseByIdSuccessfully() {
        UUID userId = validUser.getId();
        UUID expenseId = validExpense.getId();

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(validExpense));

        ExpenseResponseDTO result = expenseService.findById(userId, expenseId);

        assertNotNull(result);
        assertEquals(validExpense.getId(), result.id());
        verify(expenseRepository).findById(expenseId);
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar despesa inexistente")
    void shouldThrowExceptionWhenExpenseNotFound() {
        UUID userId = validUser.getId();
        UUID expenseId = UUID.randomUUID();

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
            expenseService.findById(userId, expenseId)
        );

        verify(expenseRepository).findById(expenseId);
    }

    @Test
    @DisplayName("Deve deletar despesa com sucesso")
    void shouldDeleteExpenseSuccessfully() {
        UUID userId = validUser.getId();
        UUID expenseId = validExpense.getId();

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(validExpense));
        doNothing().when(expenseRepository).delete(validExpense);

        assertDoesNotThrow(() -> expenseService.delete(userId, expenseId));

        verify(expenseRepository).findById(expenseId);
        verify(expenseRepository).delete(validExpense);
    }

    @Test
    @DisplayName("Deve marcar despesa como paga com sucesso")
    void shouldMarkExpenseAsPaidSuccessfully() {
        UUID userId = validUser.getId();
        UUID expenseId = validExpense.getId();

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(validExpense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(validExpense);

        ExpenseResponseDTO result = expenseService.markAsPaid(userId, expenseId);

        assertNotNull(result);
        assertTrue(validExpense.getIsPaid());
        verify(expenseRepository).findById(expenseId);
        verify(expenseRepository).save(validExpense);
    }

    @Test
    @DisplayName("Deve marcar despesa como pendente com sucesso")
    void shouldMarkExpenseAsPendingSuccessfully() {
        UUID userId = validUser.getId();
        UUID expenseId = validExpense.getId();
        validExpense.setIsPaid(true);

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(validExpense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(validExpense);

        ExpenseResponseDTO result = expenseService.markAsPending(userId, expenseId);

        assertNotNull(result);
        assertFalse(validExpense.getIsPaid());
        verify(expenseRepository).findById(expenseId);
        verify(expenseRepository).save(validExpense);
    }

    @Test
    @DisplayName("Deve atualizar data de vencimento de despesa recorrente ao marcar como paga")
    void shouldUpdateDueDateForRecurringExpenseWhenMarkedAsPaid() {
        UUID userId = validUser.getId();
        UUID expenseId = validExpense.getId();
        LocalDate originalDueDate = LocalDate.now();

        validExpense.setRecurrence(RecurrenceType.MONTHLY);
        validExpense.setDueDate(originalDueDate);
        validExpense.setIsPaid(false);

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(validExpense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(validExpense);

        expenseService.markAsPaid(userId, expenseId);

        assertNotEquals(originalDueDate, validExpense.getDueDate());
        assertEquals(originalDueDate.plusMonths(1), validExpense.getDueDate());
        verify(expenseRepository).findById(expenseId);
        verify(expenseRepository).save(validExpense);
    }

    @Test
    @DisplayName("Não deve alterar data de vencimento de despesa não recorrente")
    void shouldNotUpdateDueDateForNonRecurringExpense() {
        UUID userId = validUser.getId();
        UUID expenseId = validExpense.getId();
        LocalDate originalDueDate = LocalDate.now();

        validExpense.setRecurrence(RecurrenceType.ONCE);
        validExpense.setDueDate(originalDueDate);
        validExpense.setIsPaid(false);

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(validExpense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(validExpense);

        expenseService.markAsPaid(userId, expenseId);

        assertEquals(originalDueDate, validExpense.getDueDate());
        assertTrue(validExpense.getIsPaid());
        verify(expenseRepository).save(validExpense);
    }
}
