import { useState, useEffect, useCallback } from 'react';
import { enumService } from '@/services';
import type { AllEnums } from '@/types';

/**
 * Hook para carregar e cachear todos os enums da API.
 * Evita múltiplas chamadas desnecessárias ao backend.
 */
export function useEnums() {
  const [enums, setEnums] = useState<AllEnums | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await enumService.getAll();
      setEnums(data);
    } catch (err) {
      console.error('Erro ao carregar enums:', err);
      setError('Erro ao carregar opções. Tente recarregar a página.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnums();
  }, [loadEnums]);

  const getLabel = useCallback(
    (enumType: keyof AllEnums, value: string): string => {
      if (!enums) return value;
      const option = enums[enumType]?.find((opt) => opt.value === value);
      return option?.label || value;
    },
    [enums]
  );

  return {
    enums,
    loading,
    error,
    reload: loadEnums,
    // Atalhos para cada tipo de enum
    incomeCategories: enums?.incomeCategories || [],
    expenseCategories: enums?.expenseCategories || [],
    paymentMethods: enums?.paymentMethods || [],
    investmentTypes: enums?.investmentTypes || [],
    recurrenceTypes: enums?.recurrenceTypes || [],
    // Função utilitária para pegar label
    getLabel,
  };
}

export default useEnums;
