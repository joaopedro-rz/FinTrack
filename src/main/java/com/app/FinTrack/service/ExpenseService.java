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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExpenseResponseDTO create(UUID userId, ExpenseRequestDTO request) {
        log.info("Criando despesa para usuário: {}", userId);
        User user = findUserById(userId);

        // Validação: Despesas recorrentes não podem ter vencimento em meses anteriores
        if (request.recurrence() != null && request.recurrence() != RecurrenceType.ONCE) {
            YearMonth currentYearMonth = YearMonth.now();
            YearMonth dueYearMonth = YearMonth.from(request.dueDate());

            if (dueYearMonth.isBefore(currentYearMonth)) {
                throw new IllegalArgumentException("Despesas recorrentes não podem ter vencimento em meses anteriores. Use o mês atual ou futuro.");
            }
        }

        Expense expense = Expense.builder()
                .user(user)
                .description(request.description())
                .amount(request.amount())
                .category(request.category())
                .paymentMethod(request.paymentMethod())
                .date(request.date())
                .dueDate(request.dueDate())
                .recurrence(request.recurrence())
                .isPaid(request.isPaid())
                .notes(request.notes())
                .build();

        Expense saved = expenseRepository.save(expense);
        log.info("Despesa criada com ID: {}", saved.getId());
        return ExpenseResponseDTO.fromEntity(saved);
    }

    public List<ExpenseResponseDTO> findAllByUser(UUID userId) {
        updateRecurringExpensesStatus(userId);
        return expenseRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateRecurringExpensesStatus(UUID userId) {
        List<Expense> recurringExpenses = expenseRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .filter(expense -> expense.getRecurrence() != null && expense.getRecurrence() != RecurrenceType.ONCE)
                .filter(Expense::getIsPaid)
                .toList();

        YearMonth currentYearMonth = YearMonth.now();

        for (Expense expense : recurringExpenses) {
            YearMonth dueYearMonth = YearMonth.from(expense.getDueDate());

            if (dueYearMonth.isBefore(currentYearMonth)) {
                LocalDate nextDueDate = calculateNextDueDate(expense.getDueDate(), expense.getRecurrence());
                expense.setDueDate(nextDueDate);
                expense.setIsPaid(false);
                expenseRepository.save(expense);
                log.info("Despesa recorrente {} resetada para o novo mês. Vencimento: {}", expense.getId(), nextDueDate);
            }
        }
    }

    public ExpenseResponseDTO findById(UUID userId, UUID expenseId) {
        Expense expense = findExpenseByIdAndUser(expenseId, userId);
        return ExpenseResponseDTO.fromEntity(expense);
    }

    @Transactional
    public ExpenseResponseDTO update(UUID userId, UUID expenseId, ExpenseRequestDTO request) {
        log.info("Atualizando despesa: {} do usuário: {}", expenseId, userId);
        Expense expense = findExpenseByIdAndUser(expenseId, userId);

        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setPaymentMethod(request.paymentMethod());
        expense.setDate(request.date());
        expense.setDueDate(request.dueDate());
        expense.setRecurrence(request.recurrence());
        expense.setIsPaid(request.isPaid());
        expense.setNotes(request.notes());

        Expense updated = expenseRepository.save(expense);
        return ExpenseResponseDTO.fromEntity(updated);
    }

    @Transactional
    public void delete(UUID userId, UUID expenseId) {
        log.info("Deletando despesa: {} do usuário: {}", expenseId, userId);
        Expense expense = findExpenseByIdAndUser(expenseId, userId);
        expenseRepository.delete(expense);
    }

    public List<ExpenseResponseDTO> findByPeriod(UUID userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponseDTO> findByCategory(UUID userId, ExpenseCategory category) {
        return expenseRepository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponseDTO> findByPaymentMethod(UUID userId, PaymentMethod paymentMethod) {
        return expenseRepository.findByUserIdAndPaymentMethod(userId, paymentMethod)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponseDTO> findPending(UUID userId) {
        return expenseRepository.findByUserIdAndIsPaidFalseOrderByDateAsc(userId)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponseDTO> searchByDescription(UUID userId, String searchTerm) {
        return expenseRepository.findByUserIdAndDescriptionContainingIgnoreCase(userId, searchTerm)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExpenseResponseDTO markAsPaid(UUID userId, UUID expenseId) {
        Expense expense = findExpenseByIdAndUser(expenseId, userId);
        expense.setIsPaid(true);
        log.info("Despesa {} marcada como paga", expenseId);
        return ExpenseResponseDTO.fromEntity(expenseRepository.save(expense));
    }

    private LocalDate calculateNextDueDate(LocalDate currentDueDate, RecurrenceType recurrence) {
        return switch (recurrence) {
            case DAILY -> currentDueDate.plusDays(1);
            case WEEKLY -> currentDueDate.plusWeeks(1);
            case BIWEEKLY -> currentDueDate.plusWeeks(2);
            case MONTHLY -> currentDueDate.plusMonths(1);
            case BIMONTHLY -> currentDueDate.plusMonths(2);
            case QUARTERLY -> currentDueDate.plusMonths(3);
            case SEMIANNUAL -> currentDueDate.plusMonths(6);
            case ANNUAL -> currentDueDate.plusYears(1);
            case ONCE -> currentDueDate;
        };
    }

    @Transactional
    public ExpenseResponseDTO markAsPending(UUID userId, UUID expenseId) {
        Expense expense = findExpenseByIdAndUser(expenseId, userId);
        expense.setIsPaid(false);
        return ExpenseResponseDTO.fromEntity(expenseRepository.save(expense));
    }

    public BigDecimal getTotalAmount(UUID userId) {
        return expenseRepository.sumAmountByUserId(userId);
    }

    public BigDecimal getTotalAmountByPeriod(UUID userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.sumAmountByUserIdAndDueDateBetween(userId, startDate, endDate);
    }

    public BigDecimal getTotalPending(UUID userId) {
        return expenseRepository.sumPendingAmountByUserId(userId);
    }

    public long count(UUID userId) {
        return expenseRepository.countByUserId(userId);
    }

    public long countByPeriod(UUID userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.countByUserIdAndDateBetween(userId, startDate, endDate);
    }

    public List<ExpenseResponseDTO> findByDueDatePeriodWithPriority(UUID userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserIdAndDueDateBetweenOrderedByPriority(userId, startDate, endDate)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponseDTO> findByDueDateAndStatus(UUID userId, Boolean isPaid, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserIdAndIsPaidAndDueDateBetween(userId, isPaid, startDate, endDate)
                .stream()
                .map(ExpenseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + userId));
    }

    private Expense findExpenseByIdAndUser(UUID expenseId, UUID userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Despesa não encontrada: " + expenseId));

        if (!expense.getUser().getId().equals(userId)) {
            log.warn("Tentativa de acesso não autorizado à despesa {} pelo usuário {}", expenseId, userId);
            throw new ResourceNotFoundException("Despesa não encontrada: " + expenseId);
        }
        return expense;
    }
}
