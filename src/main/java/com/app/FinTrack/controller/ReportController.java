package com.app.FinTrack.controller;

import com.app.FinTrack.domain.dto.ReportSummaryDTO;
import com.app.FinTrack.domain.enums.ReportType;
import com.app.FinTrack.service.ExcelReportService;
import com.app.FinTrack.service.PdfReportService;
import com.app.FinTrack.service.ReportService;
import com.app.FinTrack.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Controller REST para relatórios financeiros.
 * Responsável por gerar visualizações e exportações de transações.
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;
    private final PdfReportService pdfReportService;
    private final ExcelReportService excelReportService;
    private final AuthUtils authUtils;

    /**
     * Retorna dados do relatório em formato JSON para visualização.
     *
     * @param startDate Data inicial (formato: yyyy-MM-dd)
     * @param endDate   Data final (formato: yyyy-MM-dd)
     * @param type      Tipo: ALL, INCOME ou EXPENSE (default: ALL)
     * @return Resumo do relatório com transações e totais
     */
    @GetMapping("/transactions")
    public ResponseEntity<ReportSummaryDTO> getTransactionsReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "ALL") ReportType type) {

        UUID userId = authUtils.getCurrentUserId();
        log.info("Requisição de relatório para usuário {} - {} a {} - Tipo: {}", userId, startDate, endDate, type);

        ReportSummaryDTO report = reportService.generateReport(userId, startDate, endDate, type);
        return ResponseEntity.ok(report);
    }

    /**
     * Exporta relatório em formato PDF.
     *
     * @param startDate Data inicial
     * @param endDate   Data final
     * @param type      Tipo de transação
     * @return Arquivo PDF para download
     */
    @GetMapping("/transactions/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "ALL") ReportType type) {

        UUID userId = authUtils.getCurrentUserId();
        log.info("Download de PDF - usuário {} - {} a {}", userId, startDate, endDate);

        // Gerar dados do relatório
        ReportSummaryDTO report = reportService.generateReport(userId, startDate, endDate, type);

        // Gerar PDF
        byte[] pdfBytes = pdfReportService.generatePdf(report);

        // Nome do arquivo
        String filename = String.format("relatorio_fintrack_%s_%s.pdf",
                startDate.toString(),
                endDate.toString());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(pdfBytes);
    }

    /**
     * Exporta relatório em formato Excel.
     *
     * @param startDate Data inicial
     * @param endDate   Data final
     * @param type      Tipo de transação
     * @return Arquivo Excel para download
     */
    @GetMapping("/transactions/excel")
    public ResponseEntity<byte[]> downloadExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "ALL") ReportType type) {

        UUID userId = authUtils.getCurrentUserId();
        log.info("Download de Excel - usuário {} - {} a {}", userId, startDate, endDate);

        // Gerar dados do relatório
        ReportSummaryDTO report = reportService.generateReport(userId, startDate, endDate, type);

        // Gerar Excel
        byte[] excelBytes = excelReportService.generateExcel(report);

        // Nome do arquivo
        String filename = String.format("relatorio_fintrack_%s_%s.xlsx",
                startDate.toString(),
                endDate.toString());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(excelBytes.length)
                .body(excelBytes);
    }

    /**
     * Relatório do mês atual.
     */
    @GetMapping("/current-month")
    public ResponseEntity<ReportSummaryDTO> getCurrentMonthReport(
            @RequestParam(defaultValue = "ALL") ReportType type) {

        UUID userId = authUtils.getCurrentUserId();
        ReportSummaryDTO report = reportService.generateCurrentMonthReport(userId, type);
        return ResponseEntity.ok(report);
    }

    /**
     * Relatório dos últimos 30 dias.
     */
    @GetMapping("/last-30-days")
    public ResponseEntity<ReportSummaryDTO> getLast30DaysReport(
            @RequestParam(defaultValue = "ALL") ReportType type) {

        UUID userId = authUtils.getCurrentUserId();
        ReportSummaryDTO report = reportService.generateLast30DaysReport(userId, type);
        return ResponseEntity.ok(report);
    }
}
