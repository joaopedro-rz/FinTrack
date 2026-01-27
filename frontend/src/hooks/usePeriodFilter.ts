import { useState, useMemo } from 'react';
import type { PeriodFilter } from '@/types';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export const usePeriodFilter = (defaultPeriod: PeriodFilter = '30_DAYS') => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>(defaultPeriod);

  const dateRange = useMemo((): DateRange => {
    const endDate = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case '30_DAYS':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'BIMONTHLY':
        startDate.setDate(endDate.getDate() - 60);
        break;
      case 'SEMESTER':
        startDate.setDate(endDate.getDate() - 180);
        break;
      case 'ANNUAL':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, [selectedPeriod]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    dateRange,
  };
};
