CREATE TABLE incomes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    recurrence VARCHAR(20) NOT NULL DEFAULT 'ONCE',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_income_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_income_user_id ON incomes(user_id);

CREATE INDEX idx_income_date ON incomes(date);

CREATE INDEX idx_income_user_date ON incomes(user_id, date);

-- Comentários nas colunas (documentação no banco)
COMMENT ON TABLE incomes IS 'Tabela de receitas/rendas dos usuários';
COMMENT ON COLUMN incomes.category IS 'Categorias: SALARY, FREELANCE, DIVIDENDS, etc';
COMMENT ON COLUMN incomes.recurrence IS 'Recorrência: ONCE, DAILY, WEEKLY, MONTHLY, ANNUAL, etc';
