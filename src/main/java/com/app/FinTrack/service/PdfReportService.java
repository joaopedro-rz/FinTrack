package com.app.FinTrack.service;

import com.app.FinTrack.domain.dto.ReportSummaryDTO;
import com.app.FinTrack.domain.dto.TransactionReportDTO;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Service para geração de relatórios em formato PDF.
 */
@Service
@Slf4j
public class PdfReportService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final NumberFormat CURRENCY_FORMATTER = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
    private static final DeviceRgb INCOME_COLOR = new DeviceRgb(76, 175, 80);  // Verde
    private static final DeviceRgb EXPENSE_COLOR = new DeviceRgb(244, 67, 54); // Vermelho

    /**
     * Gera um PDF com o relatório financeiro.
     */
    public byte[] generatePdf(ReportSummaryDTO report) {
        log.info("Gerando PDF do relatório");

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Cabeçalho
            document.add(new Paragraph("FinTrack - Relatório Financeiro")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10));

            document.add(new Paragraph(
                    String.format("Período: %s a %s",
                            report.startDate().format(DATE_FORMATTER),
                            report.endDate().format(DATE_FORMATTER)))
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Resumo
            document.add(new Paragraph("Resumo do Período")
                    .setFontSize(14)
                    .setBold()
                    .setMarginBottom(10));

            Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{3, 2}))
                    .useAllAvailableWidth();

            addSummaryRow(summaryTable, "Total de Receitas:", report.totalIncome(), INCOME_COLOR);
            addSummaryRow(summaryTable, "Total de Despesas:", report.totalExpense(), EXPENSE_COLOR);
            addSummaryRow(summaryTable, "Saldo:", report.balance(),
                    report.balance().compareTo(BigDecimal.ZERO) >= 0 ? INCOME_COLOR : EXPENSE_COLOR);

            document.add(summaryTable);
            document.add(new Paragraph("\n"));

            // Tabela de transações
            document.add(new Paragraph("Transações Detalhadas")
                    .setFontSize(14)
                    .setBold()
                    .setMarginBottom(10));

            Table transactionsTable = new Table(UnitValue.createPercentArray(new float[]{2, 2, 2, 4, 2}))
                    .useAllAvailableWidth();

            // Cabeçalho da tabela
            transactionsTable.addHeaderCell(createHeaderCell("Data"));
            transactionsTable.addHeaderCell(createHeaderCell("Tipo"));
            transactionsTable.addHeaderCell(createHeaderCell("Categoria"));
            transactionsTable.addHeaderCell(createHeaderCell("Descrição"));
            transactionsTable.addHeaderCell(createHeaderCell("Valor"));

            // Linhas de transações
            for (TransactionReportDTO transaction : report.transactions()) {
                transactionsTable.addCell(new Cell().add(new Paragraph(transaction.date().format(DATE_FORMATTER))));
                transactionsTable.addCell(new Cell().add(new Paragraph(transaction.typeDisplayName())));
                transactionsTable.addCell(new Cell().add(new Paragraph(transaction.categoryDisplayName())));
                transactionsTable.addCell(new Cell().add(new Paragraph(transaction.description())));

                Cell valueCell = new Cell().add(new Paragraph(CURRENCY_FORMATTER.format(transaction.amount())))
                        .setTextAlignment(TextAlignment.RIGHT);

                if ("INCOME".equals(transaction.type())) {
                    valueCell.setFontColor(INCOME_COLOR);
                } else {
                    valueCell.setFontColor(EXPENSE_COLOR);
                }

                transactionsTable.addCell(valueCell);
            }

            document.add(transactionsTable);

            // Rodapé
            document.add(new Paragraph("\n"));
            document.add(new Paragraph(String.format("Total de registros: %d", report.transactions().size()))
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT));

            document.close();

            log.info("PDF gerado com sucesso - {} bytes", baos.size());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Erro ao gerar PDF", e);
            throw new RuntimeException("Erro ao gerar PDF", e);
        }
    }

    private void addSummaryRow(Table table, String label, BigDecimal value, DeviceRgb color) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()));
        table.addCell(new Cell()
                .add(new Paragraph(CURRENCY_FORMATTER.format(value)).setBold())
                .setFontColor(color)
                .setTextAlignment(TextAlignment.RIGHT));
    }

    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold())
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER);
    }
}
