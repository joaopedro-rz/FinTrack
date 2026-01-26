package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.ReportSummaryDTO;
import com.app.FinTrack.domain.dto.TransactionReportDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Service para geração de relatórios em formato Excel (XLSX).
 */
@Service
@Slf4j
public class ExcelReportService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final NumberFormat CURRENCY_FORMATTER = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

    /**
     * Gera um arquivo Excel com o relatório financeiro.
     */
    public byte[] generateExcel(ReportSummaryDTO report) {
        log.info("Gerando Excel do relatório");

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Relatório Financeiro");

            // Estilos
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dateStyle = createDateStyle(workbook);
            CellStyle currencyStyle = createCurrencyStyle(workbook);
            CellStyle incomeStyle = createIncomeStyle(workbook);
            CellStyle expenseStyle = createExpenseStyle(workbook);
            CellStyle boldStyle = createBoldStyle(workbook);

            int rowNum = 0;

            // Título
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("FinTrack - Relatório Financeiro");
            titleCell.setCellStyle(boldStyle);

            // Período
            Row periodRow = sheet.createRow(rowNum++);
            periodRow.createCell(0).setCellValue(
                    String.format("Período: %s a %s",
                            report.startDate().format(DATE_FORMATTER),
                            report.endDate().format(DATE_FORMATTER))
            );

            // Linha em branco
            rowNum++;

            // Resumo
            Row summaryHeaderRow = sheet.createRow(rowNum++);
            Cell summaryHeaderCell = summaryHeaderRow.createCell(0);
            summaryHeaderCell.setCellValue("Resumo do Período");
            summaryHeaderCell.setCellStyle(boldStyle);

            addSummaryRow(sheet, rowNum++, "Total de Receitas:", report.totalIncome(), incomeStyle);
            addSummaryRow(sheet, rowNum++, "Total de Despesas:", report.totalExpense(), expenseStyle);

            CellStyle balanceStyle = report.balance().compareTo(BigDecimal.ZERO) >= 0 ? incomeStyle : expenseStyle;
            addSummaryRow(sheet, rowNum++, "Saldo:", report.balance(), balanceStyle);

            // Linha em branco
            rowNum++;
            rowNum++;

            // Cabeçalho da tabela de transações
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Data", "Tipo", "Categoria", "Descrição", "Valor"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Dados das transações
            for (TransactionReportDTO transaction : report.transactions()) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(transaction.date().format(DATE_FORMATTER));
                row.createCell(1).setCellValue(transaction.typeDisplayName());
                row.createCell(2).setCellValue(transaction.categoryDisplayName());
                row.createCell(3).setCellValue(transaction.description());

                Cell valueCell = row.createCell(4);
                valueCell.setCellValue(transaction.amount().doubleValue());

                if ("INCOME".equals(transaction.type())) {
                    valueCell.setCellStyle(incomeStyle);
                } else {
                    valueCell.setCellStyle(expenseStyle);
                }
            }

            // Ajustar largura das colunas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(baos);

            log.info("Excel gerado com sucesso - {} bytes", baos.size());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Erro ao gerar Excel", e);
            throw new RuntimeException("Erro ao gerar Excel", e);
        }
    }

    private void addSummaryRow(Sheet sheet, int rowNum, String label, BigDecimal value, CellStyle valueStyle) {
        Row row = sheet.createRow(rowNum);
        row.createCell(0).setCellValue(label);

        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value.doubleValue());
        valueCell.setCellStyle(valueStyle);
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        style.setDataFormat(createHelper.createDataFormat().getFormat("dd/mm/yyyy"));
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        style.setDataFormat(createHelper.createDataFormat().getFormat("R$ #,##0.00"));
        return style;
    }

    private CellStyle createIncomeStyle(Workbook workbook) {
        CellStyle style = createCurrencyStyle(workbook);
        Font font = workbook.createFont();
        font.setColor(IndexedColors.GREEN.getIndex());
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    private CellStyle createExpenseStyle(Workbook workbook) {
        CellStyle style = createCurrencyStyle(workbook);
        Font font = workbook.createFont();
        font.setColor(IndexedColors.RED.getIndex());
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    private CellStyle createBoldStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        style.setFont(font);
        return style;
    }
}
