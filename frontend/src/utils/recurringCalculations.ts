/**
 * Utilitários para cálculo de valores com lógica de recorrência
 */

import type { RecurrenceType } from '@/types';

interface RecurringItem {
  amount: number;
  recurrence: RecurrenceType;
  date?: string;
  dueDate?: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}
const toDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const monthsBetweenInclusive = (start: Date, end: Date): number => {
  const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  return (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + (endMonth.getMonth() - startMonth.getMonth()) + 1;
};
const daysBetweenInclusive = (start: Date, end: Date): number => {
  const s = toDateOnly(start);
  const e = toDateOnly(end);
  return Math.floor((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000)) + 1;
};
export const calculateTotalWithoutRecurrenceExpansion = (items: RecurringItem[]): number => {
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
};

export const calculateCurrentMonthTotal = (
  items: RecurringItem[],
  dateField: 'date' | 'dueDate' = 'date'
): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  return calculateRecurringTotal(
    items,
    {
      startDate: startOfMonth.toISOString(),
      endDate: endOfMonth.toISOString(),
    },
    dateField
  );
};
export const calculateRecurringTotal = (
  items: RecurringItem[],
  dateRange: DateRange,
  dateField: 'date' | 'dueDate' = 'date'
): number => {
  const startDate = toDateOnly(new Date(dateRange.startDate));
  const endDate = toDateOnly(new Date(dateRange.endDate));
  return items.reduce((sum, item) => {
    const itemDateStr = dateField === 'dueDate' ? item.dueDate : item.date;
    if (!itemDateStr) return sum;
    const itemDate = toDateOnly(new Date(itemDateStr));
    if (item.recurrence === 'ONCE') {
      if (itemDate >= startDate && itemDate <= endDate) {
        return sum + item.amount;
      }
      return sum;
    }
    if (itemDate > endDate) return sum;
    const recurrence = item.recurrence?.toUpperCase() || '';
    if (recurrence === 'DAILY') {
      const effectiveStart = itemDate > startDate ? itemDate : startDate;
      const occurrences = daysBetweenInclusive(effectiveStart, endDate);
      return sum + item.amount * occurrences;
    }
    if (recurrence === 'WEEKLY') {
      const effectiveStart = itemDate > startDate ? itemDate : startDate;
      const days = daysBetweenInclusive(effectiveStart, endDate);
      const occurrences = Math.ceil(days / 7);
      return sum + item.amount * occurrences;
    }
    if (recurrence === 'BIWEEKLY') {
      const effectiveStart = itemDate > startDate ? itemDate : startDate;
      const days = daysBetweenInclusive(effectiveStart, endDate);
      const occurrences = Math.ceil(days / 14);
      return sum + item.amount * occurrences;
    }
    const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const monthEnd = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const itemMonth = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);
    if (itemMonth > monthEnd) return sum;
    const effectiveMonthStart = itemMonth > monthStart ? itemMonth : monthStart;
    let occurrences: number;
    if (recurrence === 'MONTHLY') {
      occurrences = monthsBetweenInclusive(effectiveMonthStart, monthEnd);
    } else if (recurrence === 'BIMONTHLY') {
      occurrences = Math.ceil(monthsBetweenInclusive(effectiveMonthStart, monthEnd) / 2);
    } else if (recurrence === 'QUARTERLY') {
      occurrences = Math.ceil(monthsBetweenInclusive(effectiveMonthStart, monthEnd) / 3);
    } else if (recurrence === 'SEMIANNUAL') {
      occurrences = Math.ceil(monthsBetweenInclusive(effectiveMonthStart, monthEnd) / 6);
    } else if (recurrence === 'ANNUAL') {
      occurrences = Math.ceil(monthsBetweenInclusive(effectiveMonthStart, monthEnd) / 12);
    } else {
      occurrences = monthsBetweenInclusive(effectiveMonthStart, monthEnd);
    }
    return sum + item.amount * occurrences;
  }, 0);
};
export const shouldShowRecurringItem = (
  item: RecurringItem,
  dateRange: DateRange,
  dateField: 'date' | 'dueDate' = 'date'
): boolean => {
  const itemDateStr = dateField === 'dueDate' ? item.dueDate : item.date;
  if (!itemDateStr) return false;

  const itemDate = new Date(itemDateStr);
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  if (item.recurrence === 'ONCE') {
    // Despesas/receitas únicas:
    // Mostrar se a data está dentro do período OU é futura
    // Isso permite que despesas/receitas agendadas apareçam na tabela
    return itemDate >= startDate; // Remove limite superior (endDate)
  } else {
    // Despesas/receitas recorrentes:
    // Usar SEMPRE o campo 'date' (data de criação) para verificar se deve aparecer,
    // não o 'dueDate' que pode ter sido atualizado pelo sistema
    const creationDateStr = item.date;
    if (!creationDateStr) return false;

    const creationDate = new Date(creationDateStr);

    // Mostrar se a data de criação foi antes ou durante o período selecionado
    // Isso garante que despesas/receitas recorrentes antigas sempre apareçam
    return creationDate <= endDate;
  }
};
export const shouldIncludeInTable = (
  item: RecurringItem & { isPaid?: boolean },
  dateRange: DateRange,
  dateField: 'date' | 'dueDate' = 'date'
): boolean => {
  const itemDateStr = dateField === 'dueDate' ? item.dueDate : item.date;
  if (!itemDateStr) return false;
  const itemDate = new Date(itemDateStr);
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  if (item.recurrence === 'ONCE') {
    return itemDate >= startDate && itemDate <= endDate;
  }
  return itemDate <= endDate;
};
