CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    date DATE NOT NULL,
    recurrence VARCHAR(20) NOT NULL DEFAULT 'ONCE',
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_expense_user_id ON expenses(user_id);
CREATE INDEX idx_expense_date ON expenses(date);
CREATE INDEX idx_expense_user_date ON expenses(user_id, date);
CREATE INDEX idx_expense_category ON expenses(user_id, category);
CREATE INDEX idx_expense_paid ON expenses(user_id, is_paid);

-- Comentários
COMMENT ON TABLE expenses IS 'Tabela de despesas/gastos dos usuários';
COMMENT ON COLUMN expenses.category IS 'Categorias: FOOD, HOUSING, TRANSPORTATION, etc';
COMMENT ON COLUMN expenses.payment_method IS 'Métodos: CASH, CREDIT_CARD, DEBIT_CARD, PIX, etc';
COMMENT ON COLUMN expenses.is_paid IS 'TRUE = já pago, FALSE = pendente/a pagar';
