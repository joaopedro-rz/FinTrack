# 💰 FinTrack - Gestor Financeiro Pessoal

<p align="center">
  <img src="frontend/public/logo.svg" alt="FinTrack Logo" width="80" height="80">
</p>

<p align="center">
  <strong>Controle suas finanças de forma inteligente e visual</strong>
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-executar">Como Executar</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-estrutura">Estrutura</a>
</p>

---

## ✨ Funcionalidades

- 📊 **Dashboard** - Visão geral das finanças com gráficos interativos
- 💵 **Receitas** - Controle de salário, freelance, investimentos e outras rendas
- 💸 **Despesas** - Gestão de gastos com categorias e status de pagamento
- 📈 **Investimentos** - Acompanhamento de carteira com rentabilidade
- 🔐 **Autenticação JWT** - Segurança e dados isolados por usuário
- 🌙 **Tema Claro/Escuro** - Interface adaptável
- 📱 **Responsivo** - Funciona em desktop, tablet e mobile

## 🛠️ Tecnologias

### Backend
- **Java 17** + **Spring Boot 3**
- **Spring Security** + **JWT**
- **Spring Data JPA** + **PostgreSQL**
- **Flyway** (migrations)
- **Docker** + **Docker Compose**

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Material UI 5** (componentes)
- **Recharts** (gráficos)
- **Zustand** (estado)
- **Axios** (HTTP client)

## 🚀 Como Executar

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/FinTrack.git
cd FinTrack
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=fintrack_db
DB_USER=fintrack_user
DB_PASSWORD=fintrack_password

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura-aqui
JWT_EXPIRATION=86400000
```

### 3. Inicie o banco de dados

```bash
docker-compose up -d
```

### 4. Inicie o backend

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

O backend estará em `http://localhost:8080`

### 5. Inicie o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará em `http://localhost:3000`

## 🌐 Deploy

### Deploy em Produção

Este projeto está configurado para deploy em:

- **Backend**: [Koyeb](https://www.koyeb.com/) (Free tier)
- **Frontend**: [Vercel](https://vercel.com/) (Free tier)
- **Database**: [Supabase](https://supabase.com/) (Free tier)

📖 **Guia completo de deploy**: [`docs/DEPLOY_GUIDE.md`](docs/DEPLOY_GUIDE.md)

### Resumo Rápido

1. **Supabase** - Crie o banco de dados PostgreSQL
2. **Koyeb** - Deploy do backend via Docker
3. **Vercel** - Deploy do frontend automático do GitHub

**Variáveis de ambiente necessárias:**

```env
# Backend (Koyeb)
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_SSL_MODE=require
JWT_SECRET=seu_secret_seguro

# Frontend (Vercel)
VITE_API_URL=https://seu-app.koyeb.app/api
```

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Receitas
![Receitas](docs/screenshots/incomes.png)

### Despesas
![Despesas](docs/screenshots/expenses.png)

### Investimentos
![Investimentos](docs/screenshots/investments.png)

## 📁 Estrutura do Projeto

```
FinTrack/
├── frontend/                 # 🎨 React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Chamadas à API
│   │   ├── store/           # Estado global (Zustand)
│   │   ├── theme/           # Tema Material UI
│   │   └── types/           # Tipos TypeScript
│   └── package.json
│
├── src/                      # ☕ Spring Boot
│   └── main/
│       ├── java/com/app/FinTrack/
│       │   ├── controller/  # REST Controllers
│       │   ├── service/     # Lógica de negócio
│       │   ├── repository/  # Acesso a dados
│       │   ├── domain/      # Entidades, DTOs, Enums
│       │   ├── security/    # JWT, Auth
│       │   └── exception/   # Tratamento de erros
│       └── resources/
│           └── db/migration/ # Flyway migrations
│
├── docs/                     # 📚 Documentação
├── scripts/                  # 🔧 Scripts utilitários
├── docker-compose.yml        # 🐳 Docker config
└── pom.xml                   # Maven config
```

## 🔒 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Login |

### Receitas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/incomes` | Listar todas |
| POST | `/api/incomes` | Criar |
| PUT | `/api/incomes/{id}` | Atualizar |
| DELETE | `/api/incomes/{id}` | Deletar |

### Despesas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/expenses` | Listar todas |
| POST | `/api/expenses` | Criar |
| PATCH | `/api/expenses/{id}/pay` | Marcar como paga |

### Investimentos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/investments` | Listar todos |
| POST | `/api/investments` | Criar |
| PATCH | `/api/investments/{id}/price` | Atualizar preço |

### Dashboard
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/dashboard` | Resumo financeiro |

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como projeto de portfólio.

---

<p align="center">
  Feito com ☕ e 💙
</p>
