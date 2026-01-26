import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Chip,
  alpha,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
  Receipt,
  ShowChart,
} from '@mui/icons-material';
import StatCard from '@/components/common/StatCard';
import IncomeExpenseChart from '@/components/charts/IncomeExpenseChart';
import DonutChart from '@/components/charts/DonutChart';
import { dashboardService } from '@/services';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { chartColors } from '@/theme';
import type { Dashboard } from '@/types';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.get();
      setDashboard(data);
    } catch (err) {
      setError('Erro ao carregar dashboard. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gera os nomes dos últimos 6 meses para o gráfico.
   * Os dados reais virão do backend quando o histórico for implementado.
   */
  const getLastSixMonths = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const result = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      // Mês atual usa dados reais, outros meses ficam zerados até implementar histórico
      const isCurrentMonth = i === 0;
      result.push({
        name: monthName,
        income: isCurrentMonth ? (dashboard?.totalIncome || 0) : 0,
        expense: isCurrentMonth ? (dashboard?.totalExpense || 0) : 0,
      });
    }
    return result;
  };

  const chartData = getLastSixMonths();

  // Dados para o gráfico de donut
  const donutData = dashboard ? [
    { name: 'Receitas', value: dashboard.totalIncome, color: chartColors.income },
    { name: 'Despesas', value: dashboard.totalExpense, color: chartColors.expense },
  ] : [];

  return (
    <Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}


      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Visão geral das suas finanças
        </Typography>
      </Box>


      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Receitas Totais"
            value={dashboard?.totalIncome || 0}
            icon={<TrendingUp />}
            color="success"
            subtitle={`${dashboard?.incomeCount || 0} registros`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Despesas Totais"
            value={dashboard?.totalExpense || 0}
            icon={<TrendingDown />}
            color="error"
            subtitle={`${dashboard?.expenseCount || 0} registros`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Balanço"
            value={dashboard?.balance || 0}
            icon={<AccountBalance />}
            color={(dashboard?.balance || 0) >= 0 ? 'primary' : 'error'}
            subtitle="Receitas - Despesas"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Investimentos"
            value={dashboard?.currentInvestmentValue || 0}
            icon={<ShowChart />}
            color="primary"
            trend={dashboard?.investmentProfitLossPercentage}
            subtitle={`${dashboard?.investmentCount || 0} ativos`}
            loading={loading}
          />
        </Grid>
      </Grid>


      <Grid container spacing={3} sx={{ mb: 4 }}>

        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Receitas vs Despesas
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Evolução dos últimos 6 meses
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
              ) : (
                <IncomeExpenseChart data={chartData} />
              )}
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Distribuição
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Proporção receitas e despesas
              </Typography>
              {loading ? (
                <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', my: 4 }} />
              ) : (
                <DonutChart
                  data={donutData}
                  centerLabel="Taxa de Poupança"
                  centerValue={formatPercentage(dashboard?.savingsRate || 0)}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                    color: 'success.main',
                  }}
                >
                  <Savings />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Taxa de Poupança
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {loading ? <Skeleton width={80} /> : formatPercentage(dashboard?.savingsRate || 0)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Quanto você está guardando das suas receitas
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                    color: 'warning.main',
                  }}
                >
                  <Receipt />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Despesas Pendentes
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {loading ? <Skeleton width={100} /> : formatCurrency(dashboard?.pendingExpense || 0)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Contas a pagar ainda não quitadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(
                      (dashboard?.investmentProfitLoss || 0) >= 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      0.1
                    ),
                    color: (dashboard?.investmentProfitLoss || 0) >= 0 ? 'success.main' : 'error.main',
                  }}
                >
                  <ShowChart />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Lucro/Prejuízo
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: (dashboard?.investmentProfitLoss || 0) >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      <>
                        {(dashboard?.investmentProfitLoss || 0) >= 0 ? '+' : ''}
                        {formatCurrency(dashboard?.investmentProfitLoss || 0)}
                      </>
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  size="small"
                  label={`${(dashboard?.investmentProfitLossPercentage || 0) >= 0 ? '+' : ''}${formatPercentage(dashboard?.investmentProfitLossPercentage || 0)}`}
                  color={(dashboard?.investmentProfitLossPercentage || 0) >= 0 ? 'success' : 'error'}
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  de rentabilidade
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
