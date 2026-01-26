import { createTheme, alpha } from '@mui/material/styles';

/**
 * 🎨 TEMA FINTRACK
 *
 * Paleta de cores inspirada em:
 * - Azul escuro (Slate): Confiança, tecnologia, segurança
 * - Verde (Emerald): Crescimento, dinheiro, sucesso
 * - Vermelho suave: Alertas, despesas
 *
 * Design: Minimalista, sofisticado, moderno
 */

// Cores principais
const colors = {
  // Azul Slate - Cor principal (tecnologia, confiança)
  primary: {
    main: '#3B82F6',      // Azul vibrante
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  // Verde Emerald - Sucesso, receitas, crescimento
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  // Vermelho Rose - Alertas, despesas
  error: {
    main: '#F43F5E',
    light: '#FB7185',
    dark: '#E11D48',
    contrastText: '#FFFFFF',
  },
  // Âmbar - Avisos, pendentes
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  // Cinza Slate - Texto, backgrounds
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    350: '#B0BAC9',  // Intermediário entre 300 e 400 para bordas mais visíveis
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

// Tema claro
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: {
      main: colors.grey[700],
      light: colors.grey[500],
      dark: colors.grey[900],
    },
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    background: {
      default: colors.grey[50],
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.grey[900],
      secondary: colors.grey[600],
    },
    divider: colors.grey[350],
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.06)',
    '0px 1px 3px rgba(15, 23, 42, 0.1)',
    '0px 2px 4px rgba(15, 23, 42, 0.1)',
    '0px 4px 6px rgba(15, 23, 42, 0.1)',
    '0px 6px 8px rgba(15, 23, 42, 0.1)',
    '0px 8px 12px rgba(15, 23, 42, 0.1)',
    '0px 12px 16px rgba(15, 23, 42, 0.1)',
    '0px 16px 24px rgba(15, 23, 42, 0.1)',
    '0px 20px 32px rgba(15, 23, 42, 0.1)',
    '0px 24px 40px rgba(15, 23, 42, 0.1)',
    ...Array(14).fill('0px 24px 40px rgba(15, 23, 42, 0.1)'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.grey[350]} ${colors.grey[100]}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: colors.grey[350],
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: colors.grey[100],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.35)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.08)',
          border: `1px solid ${colors.grey[350]}`, // Borda visível no modo claro
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.08)',
          borderBottom: `1px solid ${colors.grey[350]}`, // Linha de separação visível
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.grey[350]}`, // Borda visível no modo claro
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.15),
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: colors.grey[50],
          borderBottom: `2px solid ${colors.grey[350]}`, // Linha de separação mais visível
        },
      },
    },
  },
});

// Tema escuro
export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: {
      main: colors.grey[400],
      light: colors.grey[300],
      dark: colors.grey[500],
    },
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    background: {
      default: colors.grey[900],
      paper: colors.grey[800],
    },
    text: {
      primary: colors.grey[50],
      secondary: colors.grey[400],
    },
    divider: colors.grey[700],
  },
  components: {
    ...lightTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.grey[600]} ${colors.grey[800]}`,
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.grey[600],
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: colors.grey[800],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${colors.grey[700]}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.grey[700]}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: colors.grey[800],
        },
      },
    },
  },
});

// Cores para gráficos
export const chartColors = {
  income: '#10B981',      // Verde - Receitas
  expense: '#F43F5E',     // Vermelho - Despesas
  investment: '#3B82F6',  // Azul - Investimentos
  balance: '#8B5CF6',     // Roxo - Saldo
  // Gradientes
  incomeGradient: ['#10B981', '#34D399'],
  expenseGradient: ['#F43F5E', '#FB7185'],
  investmentGradient: ['#3B82F6', '#60A5FA'],
};

export default lightTheme;
