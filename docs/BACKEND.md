# ☕ FinTrack Backend

<p align="center">
  <strong>API REST robusta e segura para o gestor financeiro pessoal FinTrack</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17+-ED8B00?style=flat-square&logo=openjdk" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=spring" alt="Spring Boot">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens" alt="JWT">
</p>

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Java** | 17+ | Linguagem principal |
| **Spring Boot** | 3.x | Framework web |
| **Spring Security** | 6.x | Autenticação/Autorização |
| **Spring Data JPA** | 3.x | ORM/Persistência |
| **PostgreSQL** | 16 | Banco de dados |
| **Flyway** | 10.x | Migrations de banco |
| **JWT (jjwt)** | 0.12.x | Tokens de autenticação |
| **Lombok** | 1.18.x | Redução de boilerplate |
| **Bean Validation** | 3.x | Validação de dados |

---

## 📁 Estrutura do Projeto

```
src/main/java/com/app/FinTrack/
├── config/                      # Configurações
│   └── SecurityConfig.java      # Spring Security + JWT
│
├── controller/                  # REST Controllers
│   ├── AuthController.java      # Login/Register
│   ├── DashboardController.java # Resumo financeiro
│   ├── EnumController.java      # Enums para frontend
│   ├── ExpenseController.java   # CRUD despesas
│   ├── HealthController.java    # Health check
│   ├── IncomeController.java    # CRUD receitas
│   ├── InvestmentController.java# CRUD investimentos
│   └── UserController.java      # Dados do usuário
│
├── service/                     # Lógica de negócio
│   ├── AuthService.java
│   ├── DashboardService.java
│   ├── ExpenseService.java
│   ├── IncomeService.java
│   ├── InvestmentService.java
│   └── UserService.java
│
├── repository/                  # Acesso a dados (JPA)
│   ├── ExpenseRepository.java
│   ├── IncomeRepository.java
│   ├── InvestmentRepository.java
│   └── UserRepository.java
│
├── domain/
│   ├── entity/                  # Entidades JPA
│   │   ├── User.java
│   │   ├── Income.java
│   │   ├── Expense.java
│   │   └── Investment.java
│   │
│   ├── dto/                     # Data Transfer Objects
│   │   ├── AuthRequestDTO.java
│   │   ├── AuthResponseDTO.java
│   │   ├── DashboardDTO.java
│   │   ├── ExpenseRequestDTO.java
│   │   ├── ExpenseResponseDTO.java
│   │   ├── IncomeRequestDTO.java
│   │   ├── IncomeResponseDTO.java
│   │   ├── InvestmentRequestDTO.java
│   │   ├── InvestmentResponseDTO.java
│   │   ├── UserRequestDTO.java
│   │   └── UserResponseDTO.java
│   │
│   └── enums/                   # Enumerações
│       ├── ExpenseCategory.java
│       ├── IncomeCategory.java
│       ├── InvestmentType.java
│       ├── PaymentMethod.java
│       └── RecurrenceType.java
│
├── security/                    # Segurança
│   ├── JwtAuthenticationFilter.java
│   ├── JwtService.java
│   └── CustomUserDetailsService.java
│
├── exception/                   # Tratamento de erros
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── BusinessException.java
│
├── util/                        # Utilitários
│   └── EmailNormalizer.java
│
└── FinTrackApplication.java     # Classe principal

src/main/resources/
├── application.yml              # Configurações
└── db/migration/                # Flyway migrations
    ├── V1__create_users_table.sql
    ├── V2__create_incomes_table.sql
    ├── V3__create_expenses_table.sql
    └── V4__create_investments_table.sql
```

---

## 🚀 Como Executar

### Pré-requisitos

- Java 17+
- Maven 3.8+ (ou use o wrapper `mvnw`)
- PostgreSQL 16 (ou via Docker)

### 1. Inicie o banco de dados

```bash
# Via Docker (recomendado)
docker-compose up -d postgres
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DB_NAME=fintrack_db
DB_USERNAME=fintrack_user
DB_PASSWORD=fintrack_password
DB_HOST=localhost
DB_PORT=5433

JWT_SECRET=seu_secret_seguro_aqui
JWT_EXPIRATION=3600000
```

### 3. Execute a aplicação

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

API disponível em `http://localhost:8080`

---

## 🔐 Segurança (JWT)

### Fluxo de Autenticação

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Cliente │         │   API   │         │  Banco  │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │ POST /auth/login  │                   │
     │ {email, password} │                   │
     │──────────────────>│                   │
     │                   │  Busca usuário    │
     │                   │──────────────────>│
     │                   │<──────────────────│
     │                   │                   │
     │                   │ Valida senha      │
     │                   │ (BCrypt)          │
     │                   │                   │
     │  {token: "JWT"}   │                   │
     │<──────────────────│                   │
     │                   │                   │
     │ GET /api/incomes  │                   │
     │ Authorization:    │                   │
     │ Bearer <JWT>      │                   │
     │──────────────────>│                   │
     │                   │ Valida JWT        │
     │                   │ Extrai userId     │
     │                   │──────────────────>│
     │  [lista incomes]  │<──────────────────│
     │<──────────────────│                   │
```

### Configurações JWT

| Variável | Descrição | Default |
|----------|-----------|---------|
| `JWT_SECRET` | Chave para assinar tokens | **Obrigatório** |
| `JWT_EXPIRATION` | Tempo de vida (ms) | 3600000 (1h) |

---

## 🗄️ Banco de Dados

### Migrations (Flyway)

As migrations são aplicadas automaticamente ao iniciar a aplicação:

| Versão | Arquivo | Descrição |
|--------|---------|-----------|
| V1 | `V1__create_users_table.sql` | Tabela de usuários |
| V2 | `V2__create_incomes_table.sql` | Tabela de receitas |
| V3 | `V3__create_expenses_table.sql` | Tabela de despesas |
| V4 | `V4__create_investments_table.sql` | Tabela de investimentos |

### Modelo de Dados

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Incomes (1:N com users)
CREATE TABLE incomes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    recurrence VARCHAR(20) DEFAULT 'NONE',
    created_at TIMESTAMP NOT NULL
);

-- Expenses (1:N com users)
CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    due_date DATE,
    category VARCHAR(50) NOT NULL,
    payment_method VARCHAR(30),
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);

-- Investments (1:N com users)
CREATE TABLE investments (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    purchase_price DECIMAL(15,4) NOT NULL,
    current_price DECIMAL(15,4) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

---

## 📋 Enums do Domínio

### IncomeCategory
| Valor | Descrição |
|-------|-----------|
| `SALARY` | Salário |
| `FREELANCE` | Freelance |
| `INVESTMENTS` | Rendimentos de investimentos |
| `RENT` | Aluguel recebido |
| `DIVIDENDS` | Dividendos |
| `BONUS` | Bônus |
| `OTHER` | Outros |

### ExpenseCategory
| Valor | Descrição |
|-------|-----------|
| `FOOD` | Alimentação |
| `HOUSING` | Moradia |
| `TRANSPORTATION` | Transporte |
| `HEALTH` | Saúde |
| `EDUCATION` | Educação |
| `ENTERTAINMENT` | Entretenimento |
| `SHOPPING` | Compras |
| `UTILITIES` | Utilidades |
| `OTHER` | Outros |

### PaymentMethod
| Valor | Descrição |
|-------|-----------|
| `CASH` | Dinheiro |
| `PIX` | PIX |
| `DEBIT_CARD` | Cartão de débito |
| `CREDIT_CARD` | Cartão de crédito |
| `BANK_SLIP` | Boleto |
| `TRANSFER` | Transferência |

### InvestmentType
| Valor | Descrição |
|-------|-----------|
| `STOCK` | Ações |
| `FII` | Fundos Imobiliários |
| `ETF` | ETFs |
| `CDB` | CDB |
| `LCI_LCA` | LCI/LCA |
| `TREASURY` | Tesouro Direto |
| `CRYPTO` | Criptomoedas |
| `OTHER` | Outros |

### RecurrenceType
| Valor | Descrição |
|-------|-----------|
| `NONE` | Única |
| `DAILY` | Diária |
| `WEEKLY` | Semanal |
| `MONTHLY` | Mensal |
| `YEARLY` | Anual |

---

## 🔒 API Endpoints

### Públicos (sem autenticação)

```
POST /api/auth/register    - Criar conta
POST /api/auth/login       - Login
GET  /api/health           - Health check
GET  /api/enums/*          - Listas de enums
```

### Protegidos (requer JWT)

```
GET    /api/dashboard              - Resumo financeiro
GET    /api/dashboard/period       - Resumo por período

GET    /api/incomes                - Listar receitas
GET    /api/incomes/{id}           - Buscar receita
POST   /api/incomes                - Criar receita
PUT    /api/incomes/{id}           - Atualizar receita
DELETE /api/incomes/{id}           - Deletar receita

GET    /api/expenses               - Listar despesas
GET    /api/expenses/{id}          - Buscar despesa
POST   /api/expenses               - Criar despesa
PUT    /api/expenses/{id}          - Atualizar despesa
DELETE /api/expenses/{id}          - Deletar despesa
PATCH  /api/expenses/{id}/pay      - Marcar como paga

GET    /api/investments            - Listar investimentos
GET    /api/investments/{id}       - Buscar investimento
POST   /api/investments            - Criar investimento
PUT    /api/investments/{id}       - Atualizar investimento
DELETE /api/investments/{id}       - Deletar investimento
PATCH  /api/investments/{id}/price - Atualizar preço
```

---

## 🧪 Testando a API

### Com cURL

```bash
# Registrar usuário
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@email.com","password":"123456"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"123456"}'

# Usar o token retornado nas próximas requisições
TOKEN="seu_jwt_aqui"

# Criar receita
curl -X POST http://localhost:8080/api/incomes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Salário","amount":5000,"date":"2024-01-15","category":"SALARY"}'

# Listar receitas
curl http://localhost:8080/api/incomes \
  -H "Authorization: Bearer $TOKEN"
```

### Com Postman

1. Importe a collection (se houver em `docs/`)
2. Configure a variável `{{baseUrl}}` = `http://localhost:8080`
3. Após login, copie o token para a variável `{{token}}`

---

## 📝 Configuração (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5433}/${DB_NAME:fintrack_db}
    username: ${DB_USERNAME:fintrack_user}
    password: ${DB_PASSWORD:fintrack_password}

  jpa:
    hibernate:
      ddl-auto: validate    # Flyway gerencia o schema
    show-sql: true

  flyway:
    enabled: true

server:
  port: ${PORT:8080}

jwt:
  secret: ${JWT_SECRET}     # OBRIGATÓRIO
  expiration: ${JWT_EXPIRATION:3600000}
```

---

## 🚧 Próximos Passos

- [ ] Testes unitários (JUnit 5)
- [ ] Testes de integração
- [ ] Documentação OpenAPI/Swagger
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Refresh tokens
- [ ] Auditoria de ações

---

## 📄 Arquivos Ignorados

Os seguintes arquivos **NÃO** devem ser commitados:

- `.env` - Credenciais
- `application-local.yml` - Config local
- `target/` - Build artifacts
- `*.log` - Logs

---

<p align="center">
  Parte do projeto <a href="../README.md">FinTrack</a>
</p>
