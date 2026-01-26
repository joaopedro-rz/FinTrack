import { useState, useCallback, useRef } from 'react';

interface UseConfirmReturn {
  isOpen: boolean;
  message: string;
  title: string;
  confirm: (title: string, message: string) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

/**
 * Hook para gerenciar dialogs de confirmação.
 * Retorna uma Promise que resolve com true (confirmado) ou false (cancelado).
 */
export function useConfirm(): UseConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  // Usando useRef para evitar problemas de stale closures com o React rendering lifecycle
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((newTitle: string, newMessage: string): Promise<boolean> => {
    setTitle(newTitle);
    setMessage(newMessage);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  return {
    isOpen,
    title,
    message,
    confirm,
    handleConfirm,
    handleCancel,
  };
}

export default useConfirm;
