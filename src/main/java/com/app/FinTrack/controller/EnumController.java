package com.app.FinTrack.controller;

import com.app.FinTrack.domain.enums.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller REST para retornar os Enums disponíveis.
 * Útil para o frontend popular dropdowns/selects.
 *
 * Rotas públicas - não requerem autenticação.
 */
@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @GetMapping("/income-categories")
    public ResponseEntity<List<Map<String, String>>> getIncomeCategories() {
        List<Map<String, String>> categories = Arrays.stream(IncomeCategory.values())
                .map(cat -> Map.of(
                        "value", cat.name(),
                        "label", cat.getDisplayName(),
                        "description", cat.getDescription()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/expense-categories")
    public ResponseEntity<List<Map<String, String>>> getExpenseCategories() {
        List<Map<String, String>> categories = Arrays.stream(ExpenseCategory.values())
                .map(cat -> Map.of(
                        "value", cat.name(),
                        "label", cat.getDisplayName(),
                        "description", cat.getDescription()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<List<Map<String, String>>> getPaymentMethods() {
        List<Map<String, String>> methods = Arrays.stream(PaymentMethod.values())
                .map(method -> Map.of(
                        "value", method.name(),
                        "label", method.getDisplayName(),
                        "description", method.getDescription()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(methods);
    }


    @GetMapping("/investment-types")
    public ResponseEntity<List<Map<String, String>>> getInvestmentTypes() {
        List<Map<String, String>> types = Arrays.stream(InvestmentType.values())
                .map(type -> Map.of(
                        "value", type.name(),
                        "label", type.getDisplayName(),
                        "description", type.getDescription()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(types);
    }

    @GetMapping("/recurrence-types")
    public ResponseEntity<List<Map<String, String>>> getRecurrenceTypes() {
        List<Map<String, String>> types = Arrays.stream(RecurrenceType.values())
                .map(type -> Map.of(
                        "value", type.name(),
                        "label", type.getDisplayName(),
                        "description", type.getDescription()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(types);
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllEnums() {
        Map<String, Object> allEnums = Map.of(
                "incomeCategories", getIncomeCategories().getBody(),
                "expenseCategories", getExpenseCategories().getBody(),
                "paymentMethods", getPaymentMethods().getBody(),
                "investmentTypes", getInvestmentTypes().getBody(),
                "recurrenceTypes", getRecurrenceTypes().getBody()
        );
        return ResponseEntity.ok(allEnums);
    }
}
