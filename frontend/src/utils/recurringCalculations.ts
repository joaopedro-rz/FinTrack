/**
 * Utilitários para cálculo de valores com lógica de recorrência
 */

interface RecurringItem {
  amount: number;
  recurrence: string;
  date?: string;
  dueDate?: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export const calculateRecurringTotal = (
  items: RecurringItem[],
  dateRange: DateRange,
  dateField: 'date' | 'dueDate' = 'date'
): number => {
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  return items.reduce((sum, item) => {
    const itemDateStr = dateField === 'dueDate' ? item.dueDate : item.date;
    if (!itemDateStr) return sum;

    const itemDate = new Date(itemDateStr);

    if (item.recurrence === 'ONCE') {
      // Item único: soma apenas se a data estiver no período
      if (itemDate >= startDate && itemDate <= endDate) {
        return sum + item.amount;
      }
      return sum;
    } else {
      // Item recorrente: conta quantos meses ocorre no período
      const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      const itemMonth = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);

      if (itemMonth > endMonth) return sum;

      let currentMonth = new Date(Math.max(startMonth.getTime(), itemMonth.getTime()));
      let total = 0;

      while (currentMonth <= endMonth) {
        total += item.amount;
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      }

      return sum + total;
    }
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
  const endDate = new Date(dateRange.endDate);

  if (item.recurrence === 'ONCE') {
    const startDate = new Date(dateRange.startDate);
    return itemDate >= startDate && itemDate <= endDate;
  } else {
    return itemDate <= endDate;
  }
};


export const getRecurringItemActivity = (
  item: RecurringItem,
  dateRange: DateRange,
  dateField: 'date' | 'dueDate' = 'date'
): { isActive: boolean; monthCount: number } => {
  const itemDateStr = dateField === 'dueDate' ? item.dueDate : item.date;
  if (!itemDateStr) return { isActive: false, monthCount: 0 };

  const itemDate = new Date(itemDateStr);
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);

  if (item.recurrence === 'ONCE') {
    const isActive = itemDate >= startDate && itemDate <= endDate;
    return { isActive, monthCount: isActive ? 1 : 0 };
  } else {
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const itemMonth = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);

    if (itemMonth > endMonth) {
      return { isActive: false, monthCount: 0 };
    }

    let currentMonth = new Date(Math.max(startMonth.getTime(), itemMonth.getTime()));
    let monthCount = 0;

    while (currentMonth <= endMonth) {
      monthCount++;
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    }

    return { isActive: monthCount > 0, monthCount };
  }
};
