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
 * Formata valores para uso em gráficos (valores compactos como 1k, 1M).
 */
export function formatChartCurrency(value: number): string {
  if (value === 0) return 'R$ 0';

  const abs = Math.abs(value);

  if (abs >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }

  return formatCurrency(value);
}

/**
 * Formata uma data ISO para exibição (DD/MM/YYYY).
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  // Parse da data como local (evita problemas de fuso horário)
  // Se a string é "2026-01-27", cria data com ano=2026, mês=0 (janeiro), dia=27
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  const date = new Date(year, month - 1, day);

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
 */
export function toISODateString(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

/**
 * Retorna a data atual no formato ISO (YYYY-MM-DD) sem problemas de fuso horário.
 */
export function getTodayISOString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
