package com.app.FinTrack.controller;

import com.app.FinTrack.domain.dto.DashboardDTO;
import com.app.FinTrack.service.DashboardService;
import com.app.FinTrack.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;

/**
 * Controller REST para o Dashboard (resumo financeiro).
 * Consolida e retorna os principais indicadores financeiros.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthUtils authUtils;


    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Requisição de dashboard para usuário: {}", userId);

        DashboardDTO dashboard = dashboardService.getDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/period")
    public ResponseEntity<DashboardDTO> getDashboardByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID userId = authUtils.getCurrentUserId();
        log.info("Requisição de dashboard período {} a {} para usuário: {}", startDate, endDate, userId);

        DashboardDTO dashboard = dashboardService.getDashboardByPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/current-month")
    public ResponseEntity<DashboardDTO> getCurrentMonthDashboard() {
        UUID userId = authUtils.getCurrentUserId();

        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();

        log.info("Requisição de dashboard mês atual ({}) para usuário: {}", currentMonth, userId);

        DashboardDTO dashboard = dashboardService.getDashboardByPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/month")
    public ResponseEntity<DashboardDTO> getMonthDashboard(
            @RequestParam int year,
            @RequestParam int month) {
        UUID userId = authUtils.getCurrentUserId();

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        log.info("Requisição de dashboard mês {}/{} para usuário: {}", month, year, userId);

        DashboardDTO dashboard = dashboardService.getDashboardByPeriod(userId, startDate, endDate);
        return ResponseEntity.ok(dashboard);
    }
}
