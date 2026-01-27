-- Migration: Adicionar data de vencimento às despesas
-- Objetivo: Suportar controle de vencimento e pagamento de despesas recorrentes

-- Adicionar coluna due_date (data de vencimento)
ALTER TABLE expenses
ADD COLUMN due_date DATE;

-- Para despesas existentes, copiar a data atual como data de vencimento
UPDATE expenses
SET due_date = date
WHERE due_date IS NULL;

-- Tornar a coluna obrigatória após popular dados existentes
ALTER TABLE expenses
ALTER COLUMN due_date SET NOT NULL;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN expenses.date IS 'Data de criação/lançamento da despesa';
COMMENT ON COLUMN expenses.due_date IS 'Data de vencimento da despesa';
COMMENT ON COLUMN expenses.is_paid IS 'Status de pagamento: true = pago, false = pendente';
