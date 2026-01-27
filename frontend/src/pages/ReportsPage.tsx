import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  FilterList,
  Clear,
} from '@mui/icons-material';
import { reportService } from '@/services';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { ReportSummary, ReportFilters } from '@/types';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filtros - Último mês por padrão
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
    type: 'ALL',
  });

  useEffect(() => {
    handleApplyFilters();
  }, []);

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getTransactions(filters);
      setReport(data);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
      setError('Erro ao carregar relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    const defaults = getDefaultDates();
    setFilters({
      startDate: defaults.startDate,
      endDate: defaults.endDate,
      type: 'ALL',
    });
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await reportService.downloadPdf(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_fintrack_${filters.startDate}_${filters.endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar PDF:', err);
      setError('Erro ao baixar PDF. Tente novamente.');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const blob = await reportService.downloadExcel(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_fintrack_${filters.startDate}_${filters.endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar Excel:', err);
      setError('Erro ao baixar Excel. Tente novamente.');
    }
  };

  return (
    <Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Relatórios Financeiros
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Receitas e despesas detalhadas
        </Typography>
      </Box>


      <Card sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Data Inicial"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Data Final"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Tipo"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
            >
              <MenuItem value="ALL">Todos</MenuItem>
              <MenuItem value="INCOME">Receitas</MenuItem>
              <MenuItem value="EXPENSE">Despesas</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApplyFilters}
              disabled={loading}
            >
              Aplicar
            </Button>
            <Tooltip title="Limpar filtros">
              <IconButton onClick={handleClearFilters} disabled={loading}>
                <Clear />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Card>


      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}


      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}


      {!loading && report && (
        <>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, bgcolor: 'success.light' }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#1E293B', fontWeight: 500 }}>
                  Total de Receitas
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {formatCurrency(report.totalIncome)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#334155' }}>
                  {report.incomeCount} transações
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, bgcolor: 'error.light' }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#1E293B', fontWeight: 500 }}>
                  Total de Despesas
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {formatCurrency(report.totalExpense)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#334155' }}>
                  {report.expenseCount} transações
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: report.balance >= 0 ? 'info.light' : 'warning.light',
                }}
              >
                <Typography variant="body2" sx={{ mb: 1, color: '#1E293B', fontWeight: 500 }}>
                  Saldo do Período
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {formatCurrency(report.balance)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#334155' }}>
                  {report.balance >= 0 ? 'Positivo' : 'Negativo'}
                </Typography>
              </Card>
            </Grid>
          </Grid>


          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={handleDownloadPdf}
              color="error"
            >
              Baixar PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<TableChart />}
              onClick={handleDownloadExcel}
              color="success"
            >
              Baixar Excel
            </Button>
          </Box>


          <Card>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Transações ({report.transactions.length})
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data de Criação</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Vencimento</TableCell>
                    <TableCell align="right">Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Nenhuma transação encontrada no período selecionado
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    report.transactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.typeDisplayName}
                            size="small"
                            color={transaction.type === 'INCOME' ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{transaction.categoryDisplayName}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{transaction.description}</Typography>
                          {transaction.notes && (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {transaction.notes}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {transaction.type === 'EXPENSE' && transaction.dueDate
                            ? formatDate(transaction.dueDate)
                            : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: transaction.type === 'INCOME' ? 'success.main' : 'error.main',
                            }}
                          >
                            {formatCurrency(transaction.amount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Box>
  );
}
