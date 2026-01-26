# 💰 FinTrack - Gestor Financeiro Pessoal

<p align="center">
  <img src="frontend/public/logo.svg" alt="FinTrack Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Controle suas finanças de forma inteligente, visual e segura</strong>
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-executar">Como Executar</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-api">API</a> •
  <a href="#-segurança">Segurança</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=openjdk" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-green?style=flat-square&logo=spring" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker" alt="Docker">
</p>

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---------|-----------|
| 📊 **Dashboard** | Visão geral com gráficos interativos de receitas vs despesas |
| 💵 **Receitas** | Controle de salário, freelance, dividendos e outras rendas |
| 💸 **Despesas** | Gestão de gastos com categorias, métodos de pagamento e status |
| 📈 **Investimentos** | Acompanhamento de carteira com cálculo de rentabilidade |
| 🔐 **Autenticação JWT** | Login seguro com tokens e dados isolados por usuário |
| 🌙 **Tema Claro/Escuro** | Interface adaptável às preferências do usuário |
| 📱 **Responsivo** | Funciona perfeitamente em desktop, tablet e mobile |
| 🐳 **Docker Ready** | Deploy simplificado com um único comando |

---

## 🛠️ Tecnologias

### Backend (Java/Spring)
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Java | 17+ | Linguagem principal |
| Spring Boot | 3.x | Framework web |
| Spring Security | 6.x | Autenticação e autorização |
| Spring Data JPA | 3.x | Persistência de dados |
| PostgreSQL | 16 | Banco de dados |
| Flyway | 10.x | Versionamento de schema |
| JWT (jjwt) | 0.12.x | Tokens de autenticação |
| Lombok | 1.18.x | Redução de boilerplate |

### Frontend (React/TypeScript)
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.x | Biblioteca UI |
| TypeScript | 5.x | Tipagem estática |
| Vite | 5.x | Build tool |
| Material UI | 5.x | Componentes de interface |
| Recharts | 2.x | Gráficos interativos |
| Zustand | 4.x | Gerenciamento de estado |
| Axios | 1.x | Cliente HTTP |
| React Router | 6.x | Navegação SPA |

### Infraestrutura
| Tecnologia | Uso |
|------------|-----|
| Docker | Containerização |
| Docker Compose | Orquestração |
| Nginx | Servidor web do frontend |

---

## 🚀 Como Executar

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)
- (Opcional para dev) [Java 17+](https://adoptium.net/) e [Node.js 18+](https://nodejs.org/)

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/FinTrack.git
cd FinTrack
```

### 2️⃣ Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# ===== BANCO DE DADOS =====
DB_NAME=fintrack_db
DB_USERNAME=fintrack_user
DB_PASSWORD=sua_senha_segura_aqui
DB_HOST=localhost
DB_PORT=5433

# ===== JWT (OBRIGATÓRIO!) =====
# Gere um secret seguro:
# Linux/Mac: openssl rand -base64 32
# PowerShell: [Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
JWT_SECRET=seu_secret_jwt_muito_seguro_aqui
JWT_EXPIRATION=3600000

# ===== FRONTEND =====
FRONTEND_PORT=3000
```

> ⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env`! Ele contém credenciais sensíveis.

---

### 🐳 Opção 1: Docker (Recomendado)

**Subir toda a stack com um comando:**

```bash
docker-compose up -d --build
```

Isso inicia automaticamente:
- 🐘 **PostgreSQL** → `localhost:5433`
- ☕ **Backend API** → `http://localhost:8080`
- ⚛️ **Frontend** → `http://localhost:3000`

**Comandos úteis:**

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar todos os serviços
docker-compose down

# Parar e APAGAR dados do banco (cuidado!)
docker-compose down -v

# Rebuildar após mudanças no código
docker-compose up -d --build
```

---

### 💻 Opção 2: Desenvolvimento Local

#### 2.1 Inicie apenas o banco de dados

```bash
docker-compose up -d postgres
```

#### 2.2 Inicie o backend

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

API disponível em `http://localhost:8080`

#### 2.3 Inicie o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:3000`

---

### ✅ Verificando a Instalação

| Verificação | URL |
|-------------|-----|
| Health Check API | http://localhost:8080/api/health |
| Frontend | http://localhost:3000 |
| Banco de dados | `localhost:5433` (use DBeaver, pgAdmin ou IntelliJ) |

---

## 📁 Estrutura do Projeto

```
FinTrack/
├── 📂 frontend/                  # ⚛️ React + TypeScript
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── charts/          # Gráficos (Recharts)
│   │   │   ├── common/          # Loading, EmptyState, StatCard
│   │   │   └── layout/          # MainLayout
│   │   ├── pages/               # Páginas (Login, Dashboard, etc.)
│   │   ├── services/            # Chamadas à API (Axios)
│   │   ├── store/               # Estado global (Zustand)
│   │   ├── theme/               # Tema Material UI
│   │   ├── types/               # Tipos TypeScript
│   │   └── utils/               # Utilitários (formatadores)
│   ├── package.json
│   └── vite.config.ts
│
├── 📂 src/main/                  # ☕ Spring Boot
│   ├── java/com/app/FinTrack/
│   │   ├── config/              # Configurações (Security, etc.)
│   │   ├── controller/          # REST Controllers
│   │   │   ├── AuthController
│   │   │   ├── DashboardController
│   │   │   ├── ExpenseController
│   │   │   ├── IncomeController
│   │   │   ├── InvestmentController
│   │   │   └── HealthController
│   │   ├── service/             # Lógica de negócio
│   │   ├── repository/          # Acesso a dados (JPA)
│   │   ├── domain/
│   │   │   ├── entity/          # Entidades JPA
│   │   │   ├── dto/             # DTOs (Request/Response)
│   │   │   └── enums/           # Enums do domínio
│   │   ├── security/            # JWT, Filtros, Auth
│   │   ├── exception/           # Tratamento de erros
│   │   └── util/                # Utilitários
│   └── resources/
│       ├── application.yml      # Configurações
│       └── db/migration/        # Flyway migrations
│
├── 📂 docs/                      # 📚 Documentação adicional
├── 📂 scripts/                   # 🔧 Scripts utilitários
│
├── 🐳 docker-compose.yml         # Orquestração dos containers
├── 🐳 backend.Dockerfile         # Build do backend
├── 🐳 frontend.Dockerfile        # Build do frontend
├── 🐳 nginx.conf                 # Configuração do nginx
│
├── 📄 .env.example               # Template de variáveis de ambiente
├── 📄 .gitignore                 # Arquivos ignorados pelo Git
├── 📄 .dockerignore              # Arquivos ignorados pelo Docker
└── 📄 pom.xml                    # Configuração Maven
```

---

## 🔒 API Endpoints

### 🔑 Autenticação (Público)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Criar nova conta |
| `POST` | `/api/auth/login` | Login (retorna JWT) |

### 📊 Dashboard (Autenticado)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/dashboard` | Resumo financeiro geral |
| `GET` | `/api/dashboard/period?start=&end=` | Resumo por período |

### 💵 Receitas (Autenticado)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/incomes` | Listar todas |
| `GET` | `/api/incomes/{id}` | Buscar por ID |
| `POST` | `/api/incomes` | Criar nova |
| `PUT` | `/api/incomes/{id}` | Atualizar |
| `DELETE` | `/api/incomes/{id}` | Deletar |

### 💸 Despesas (Autenticado)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/expenses` | Listar todas |
| `GET` | `/api/expenses/{id}` | Buscar por ID |
| `POST` | `/api/expenses` | Criar nova |
| `PUT` | `/api/expenses/{id}` | Atualizar |
| `DELETE` | `/api/expenses/{id}` | Deletar |
| `PATCH` | `/api/expenses/{id}/pay` | Marcar como paga |

### 📈 Investimentos (Autenticado)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/investments` | Listar todos |
| `GET` | `/api/investments/{id}` | Buscar por ID |
| `POST` | `/api/investments` | Criar novo |
| `PUT` | `/api/investments/{id}` | Atualizar |
| `DELETE` | `/api/investments/{id}` | Deletar |
| `PATCH` | `/api/investments/{id}/price` | Atualizar preço atual |

### 📋 Enums (Público)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/enums/income-categories` | Categorias de receita |
| `GET` | `/api/enums/expense-categories` | Categorias de despesa |
| `GET` | `/api/enums/payment-methods` | Métodos de pagamento |
| `GET` | `/api/enums/investment-types` | Tipos de investimento |
| `GET` | `/api/enums/recurrence-types` | Tipos de recorrência |

### ❤️ Health (Público)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Status da aplicação |

---

## 🔐 Segurança

### Arquivos que NUNCA devem ser commitados:
- `.env` - Credenciais de banco e JWT secret
- `application-local.yml` - Configurações locais
- `*.pem`, `*.key` - Chaves privadas
- `*.jks`, `*.p12` - Keystores

### Boas práticas implementadas:
- ✅ Senhas hasheadas com BCrypt
- ✅ JWT com expiração configurável
- ✅ Containers rodando como usuário não-root
- ✅ Headers de segurança no nginx (X-Frame-Options, etc.)
- ✅ CORS configurado
- ✅ Validação de dados com Bean Validation

---

## 🗄️ Banco de Dados

### Migrations (Flyway)
| Versão | Arquivo | Descrição |
|--------|---------|-----------|
| V1 | `V1__create_users_table.sql` | Tabela de usuários |
| V2 | `V2__create_incomes_table.sql` | Tabela de receitas |
| V3 | `V3__create_expenses_table.sql` | Tabela de despesas |
| V4 | `V4__create_investments_table.sql` | Tabela de investimentos |

### Diagrama ER Simplificado
```
┌─────────────┐
│    users    │
├─────────────┤
│ id (UUID)   │──────┐
│ name        │      │
│ email       │      │
│ password    │      │
│ created_at  │      │
└─────────────┘      │
                     │ 1:N
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────┐    ┌──────────┐    ┌─────────────┐
│ incomes │    │ expenses │    │ investments │
└─────────┘    └──────────┘    └─────────────┘
```

---

## 📝 Scripts Úteis

```bash
# Resetar banco de dados (Windows PowerShell)
.\scripts\reset-db.ps1

# Gerar JWT Secret seguro (PowerShell)
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))

# Gerar JWT Secret seguro (Linux/Mac)
openssl rand -base64 32
```

---

## 🚧 Roadmap

- [ ] Filtros avançados por período
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Gráficos de categorias
- [ ] Notificações de contas a vencer
- [ ] PWA (Progressive Web App)
- [ ] Integração com APIs de investimentos (Alpha Vantage)
- [ ] Testes automatizados (JUnit + Jest)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido como projeto de portfólio para demonstrar habilidades em:
- Desenvolvimento Full Stack (Java + React)
- Arquitetura de software
- Boas práticas de código
- DevOps (Docker)

---

<p align="center">
  Feito com ☕ Java, ⚛️ React e 💙 dedicação
</p>
