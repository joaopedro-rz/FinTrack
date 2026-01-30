import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { chartColors } from '@/theme';
import { formatCurrency, formatChartCurrency } from '@/utils/formatters';

interface IncomeExpenseChartProps {
  data: {
    name: string;
    income: number;
    expense: number;
    hasTransactions?: boolean;
  }[];
  height?: number;
}

export default function IncomeExpenseChart({ data, height = 350 }: IncomeExpenseChartProps) {
  const theme = useTheme();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatCurrency(entry.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColors.income} stopOpacity={0.3} />
            <stop offset="95%" stopColor={chartColors.income} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColors.expense} stopOpacity={0.3} />
            <stop offset="95%" stopColor={chartColors.expense} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={theme.palette.divider}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          tickFormatter={formatChartCurrency}
          domain={['auto', 'auto']}
          allowDataOverflow={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          animationDuration={150}
          isAnimationActive={true}
          cursor={{
            stroke: theme.palette.mode === 'light' ? '#0F172A' : '#FFFFFF',
            strokeWidth: 2,
            strokeDasharray: '5 5',
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => (
            <span style={{ color: theme.palette.text.primary, fontSize: 14 }}>
              {value}
            </span>
          )}
        />
        <Area
          type="monotone"
          dataKey="income"
          name="Receitas"
          stroke={chartColors.income}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#incomeGradient)"
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            if (payload.income > 0 || payload.expense > 0) {
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={chartColors.income}
                  stroke={theme.palette.mode === 'light' ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={2}
                />
              );
            }
            return <circle cx={cx} cy={cy} r={0} />;
          }}
          activeDot={{
            r: 6,
            fill: chartColors.income,
            stroke: theme.palette.mode === 'light' ? '#0F172A' : '#FFFFFF',
            strokeWidth: 2,
          }}
        />
        <Area
          type="monotone"
          dataKey="expense"
          name="Despesas"
          stroke={chartColors.expense}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#expenseGradient)"
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            if (payload.income > 0 || payload.expense > 0) {
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={chartColors.expense}
                  stroke={theme.palette.mode === 'light' ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={2}
                />
              );
            }
            return <circle cx={cx} cy={cy} r={0} />;
          }}
          activeDot={{
            r: 6,
            fill: chartColors.expense,
            stroke: theme.palette.mode === 'light' ? '#0F172A' : '#FFFFFF',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
