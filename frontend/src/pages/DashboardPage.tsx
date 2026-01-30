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
import PeriodFilterSelect from '@/components/common/PeriodFilterSelect';
import IncomeExpenseChart from '@/components/charts/IncomeExpenseChart';
import DonutChart from '@/components/charts/DonutChart';
import { dashboardService, incomeService, expenseService } from '@/services';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { calculateRecurringTotal, calculateCurrentMonthTotal } from '@/utils/recurringCalculations';
import { chartColors } from '@/theme';
import { usePeriodFilter } from '@/hooks';
import type { Dashboard, Income, Expense } from '@/types';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { selectedPeriod, setSelectedPeriod, dateRange } = usePeriodFilter('30_DAYS');

  useEffect(() => {
    loadDashboard();
  }, [dateRange]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardData, incomesData, expensesData] = await Promise.all([
        dashboardService.getByPeriod(dateRange.startDate, dateRange.endDate),
        incomeService.getAll(),
        expenseService.getAll(),
      ]);
      setDashboard(dashboardData);
      setIncomes(incomesData);
      setExpenses(expensesData);
    } catch (err) {
      setError('Erro ao carregar dashboard. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    const monthlyData = new Map<string, { income: number; expense: number }>();

    // Pré-criar buckets para todos os meses do período
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (currentDate <= endDate) {
      const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(key, { income: 0, expense: 0 });
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }

    // Processar receitas
    incomes.forEach(income => {
      if (income.recurrence === 'ONCE') {
        const date = new Date(income.date);
        if (date >= startDate && date <= endDate) {
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData.has(key)) {
            monthlyData.get(key)!.income += income.amount;
          }
        }
      } else {
        const createdDate = new Date(income.date);
        let currentMonth = new Date(Math.max(startDate.getTime(), createdDate.getTime()));
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

        const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

        while (currentMonth <= endMonth) {
          const key = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData.has(key)) {
            monthlyData.get(key)!.income += income.amount;
          }
          currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        }
      }
    });

    // Processar despesas
    expenses.forEach(expense => {
      if (expense.recurrence === 'ONCE') {
        const date = new Date(expense.date);
        if (date >= startDate && date <= endDate) {
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData.has(key)) {
            monthlyData.get(key)!.expense += expense.amount;
          }
        }
      } else {
        const createdDate = new Date(expense.date);
        let currentMonth = new Date(Math.max(startDate.getTime(), createdDate.getTime()));
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

        const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

        while (currentMonth <= endMonth) {
          const key = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData.has(key)) {
            monthlyData.get(key)!.expense += expense.amount;
          }
          currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        }
      }
    });

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    return Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month) - 1;
        return {
          name: `${monthNames[monthIndex]}/${year.slice(2)}`,
          income: data.income,
          expense: data.expense,
        };
      });
  };

  const chartData = generateChartData();

  const currentMonthIncome = calculateCurrentMonthTotal(incomes, 'date');
  const currentMonthExpense = calculateCurrentMonthTotal(expenses, 'date');
  const currentMonthBalance = currentMonthIncome - currentMonthExpense;

  const totalIncomeWithRecurrence = calculateRecurringTotal(incomes, dateRange, 'date');
  const totalExpenseWithRecurrence = calculateRecurringTotal(expenses, dateRange, 'date');

  const savingsRate = currentMonthIncome > 0
    ? ((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100
    : 0;

  const pendingExpensesTotal = expenses
    .filter(expense => !expense.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const donutData = [
    { name: 'Receitas', value: totalIncomeWithRecurrence, color: chartColors.income },
    { name: 'Despesas', value: totalExpenseWithRecurrence, color: chartColors.expense },
  ];

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
            title="Receitas do Mês"
            value={currentMonthIncome}
            icon={<TrendingUp />}
            color="success"
            subtitle={`${incomes.length} registros`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Despesas do Mês"
            value={currentMonthExpense}
            icon={<TrendingDown />}
            color="error"
            subtitle={`${expenses.length} registros`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Balanço do Mês"
            value={currentMonthBalance}
            icon={<AccountBalance />}
            color={currentMonthBalance >= 0 ? 'primary' : 'error'}
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
                    Análise do período selecionado
                  </Typography>
                </Box>
                <PeriodFilterSelect
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                />
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
                  centerValue={formatPercentage(savingsRate)}
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
                    {loading ? <Skeleton width={80} /> : formatPercentage(savingsRate)}
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
                    {loading ? <Skeleton width={100} /> : formatCurrency(pendingExpensesTotal)}
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
