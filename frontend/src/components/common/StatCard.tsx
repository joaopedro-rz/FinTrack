import { Box, Card, CardContent, Typography, Skeleton, alpha } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'error' | 'warning' | 'info';
  trend?: number; // Percentual de variação
  subtitle?: string;
  isCurrency?: boolean;
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
  isCurrency = true,
  loading = false,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined || trend === null) return null;
    if (trend > 0) return <TrendingUp sx={{ fontSize: 16 }} />;
    if (trend < 0) return <TrendingDown sx={{ fontSize: 16 }} />;
    return <TrendingFlat sx={{ fontSize: 16 }} />;
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === null) return 'text.secondary';
    if (trend > 0) return 'success.main';
    if (trend < 0) return 'error.main';
    return 'text.secondary';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={32} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
            color: `${color}.main`,
            mb: 2,
          }}
        >
          {icon}
        </Box>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        {/* Value */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {isCurrency ? formatCurrency(value) : value.toLocaleString('pt-BR')}
        </Typography>

        {/* Trend & Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend !== undefined && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: getTrendColor(),
              }}
            >
              {getTrendIcon()}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {trend > 0 ? '+' : ''}{formatPercentage(trend)}
              </Typography>
            </Box>
          )}
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
