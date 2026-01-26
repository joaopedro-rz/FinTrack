import { useState, useCallback } from 'react';


const DIALOG_CLOSE_ANIMATION_DELAY_MS = 150;

interface UseDialogReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
}

/**
 * Hook para gerenciar estado de dialogs/modais.
 * Simplifica o controle de abertura/fechamento e dados associados.
 */
export function useDialog<T = unknown>(): UseDialogReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((newData?: T) => {
    setData(newData || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Pequeno delay para animação do dialog fechar antes de limpar dados
    setTimeout(() => setData(null), DIALOG_CLOSE_ANIMATION_DELAY_MS);
  }, []);

  return { isOpen, data, open, close };
}

export default useDialog;
