/**
 * Utilitários de formatação para o FinTrack.
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data ISO para exibição (DD/MM/YYYY).
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Formata uma data ISO para exibição completa (DD/MM/YYYY HH:mm).
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Formata um percentual com 2 casas decimais.
 *
 * @param value - Valor em formato 0-100 (ex: 50 = 50%)
 *                Se o valor já estiver em formato decimal (0-1), multiplique por 100 antes de passar.
 * @returns String formatada (ex: "50,00%")
 *
 * @example
 * formatPercentage(50)     // "50,00%"
 * formatPercentage(0.5 * 100) // "50,00%" - para valores decimais, multiplique por 100
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '0,00%';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Formata valores monetários de forma compacta para uso em eixos de gráficos.
 *
 * @param value - Valor numérico
 * @returns String formatada (ex: "R$ 5k" para 5000, "R$ 500" para 500)
 *
 * @example
 * formatChartCurrency(5000)  // "R$ 5k"
 * formatChartCurrency(500)   // "R$ 500"
 * formatChartCurrency(1500000) // "R$ 1.5M"
 */
export function formatChartCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return `R$ ${value}`;
}

/**
 * Formata um número com separador de milhar.
 */
export function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) {
    return '0';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Converte uma data para o formato ISO (YYYY-MM-DD).
 * Retorna string vazia se a data for null/undefined.
 */
export function toISODateString(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

/**
 * Retorna o primeiro dia do mês atual.
 */
export function getFirstDayOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Retorna o último dia do mês atual.
 */
export function getLastDayOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}

/**
 * Retorna a diferença de dias entre duas datas.
 * Retorna 0 se alguma data for null/undefined.
 */
export function daysBetween(date1: Date | null | undefined, date2: Date | null | undefined): number {
  if (!date1 || !date2) return 0;
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date2.getTime() - date1.getTime()) / oneDay));
}

/**
 * Trunca um texto se exceder o limite de caracteres.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitaliza a primeira letra de cada palavra.
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
