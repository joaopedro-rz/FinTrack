CREATE TABLE investments (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    ticker VARCHAR(20),
    quantity NUMERIC(18, 8) NOT NULL DEFAULT 1,
    purchase_price NUMERIC(15, 2) NOT NULL,
    current_price NUMERIC(15, 2),
    purchase_date DATE NOT NULL,
    broker VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_investment_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_investment_user_id ON investments(user_id);
CREATE INDEX idx_investment_type ON investments(user_id, type);
CREATE INDEX idx_investment_ticker ON investments(ticker);
CREATE INDEX idx_investment_purchase_date ON investments(purchase_date);

-- Comentários
COMMENT ON TABLE investments IS 'Tabela de investimentos dos usuários';
COMMENT ON COLUMN investments.type IS 'Tipos: STOCKS, REITS, CDB, TREASURY, CRYPTO, etc';
COMMENT ON COLUMN investments.quantity IS 'Quantidade com 8 casas decimais para criptomoedas';
COMMENT ON COLUMN investments.current_price IS 'Preço atual - pode ser atualizado via API externa';
