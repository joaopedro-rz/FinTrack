import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { formatCurrency } from '@/utils/formatters';

interface DonutChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}

export default function DonutChart({
  data,
  height = 300,
  centerLabel,
  centerValue
}: DonutChartProps) {
  const theme = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Proteção contra array vazio ou total zero
  const hasData = data.length > 0 && total > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && hasData) {
      const item = payload[0];
      // Proteção contra divisão por zero
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: item.payload.color,
              }}
            />
            <Typography variant="subtitle2">{item.name}</Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatCurrency(item.value)} ({percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const renderCustomLegend = ({ payload }: any) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 2 }}>
      {payload.map((entry: any, index: number) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: entry.color,
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ position: 'relative', width: '100%', height }}>
      {!hasData ? (
        // Estado vazio quando não há dados
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sem dados para exibir
          </Typography>
        </Box>
      ) : (
        <>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>


          {(centerLabel || centerValue) && (
            <Box
              sx={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              {centerLabel && (
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {centerLabel}
                </Typography>
              )}
              {centerValue && (
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {centerValue}
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
