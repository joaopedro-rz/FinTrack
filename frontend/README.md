# ⚛️ FinTrack Frontend

<p align="center">
  <strong>Interface moderna e minimalista para o gestor financeiro pessoal FinTrack</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/MUI-5-007FFF?style=flat-square&logo=mui" alt="Material UI">
</p>

---

## 🎨 Design System

| Elemento | Valor | Uso |
|----------|-------|-----|
| **Cor Primária** | `#3B82F6` (Azul) | Tecnologia, confiança |
| **Sucesso** | `#10B981` (Verde) | Receitas, lucros |
| **Erro** | `#F43F5E` (Rosa) | Despesas, alertas |
| **Fonte** | Inter | Moderna e legível |
| **Estilo** | Minimalista | Clean e profissional |

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.x | Biblioteca UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Vite** | 5.x | Build tool rápido |
| **Material UI** | 5.x | Componentes UI |
| **Recharts** | 2.x | Gráficos interativos |
| **React Router** | 6.x | Navegação SPA |
| **Zustand** | 4.x | Estado global |
| **Axios** | 1.x | Cliente HTTP |
| **date-fns** | 3.x | Manipulação de datas |

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/
│   └── logo.svg              # Logo da aplicação
│
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── charts/           # Gráficos
│   │   │   ├── DonutChart.tsx
│   │   │   └── IncomeExpenseChart.tsx
│   │   ├── common/           # Componentes genéricos
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/           # Layout principal
│   │   │   └── MainLayout.tsx
│   │   └── index.ts          # Barrel export
│   │
│   ├── pages/                # Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── IncomesPage.tsx
│   │   ├── ExpensesPage.tsx
│   │   └── InvestmentsPage.tsx
│   │
│   ├── services/             # Chamadas à API
│   │   ├── api.ts            # Configuração Axios
│   │   └── index.ts
│   │
│   ├── store/                # Estado global (Zustand)
│   │   ├── authStore.ts      # Autenticação/JWT
│   │   └── themeStore.ts     # Tema claro/escuro
│   │
│   ├── theme/                # Configuração Material UI
│   │   └── index.ts
│   │
│   ├── types/                # Tipos TypeScript
│   │   └── index.ts
│   │
│   ├── utils/                # Utilitários
│   │   └── formatters.ts     # Formatação de moeda/data
│   │
│   ├── hooks/                # Custom hooks (futuro)
│   │
│   ├── App.tsx               # Componente raiz
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # Tipos do Vite
│
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando em `http://localhost:8080`

### Instalação

```bash
# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie em modo desenvolvimento
npm run dev

# Ou faça build para produção
npm run build
```

### URLs

| Ambiente | URL | Descrição |
|----------|-----|-----------|
| Desenvolvimento | `http://localhost:3000` | Hot reload ativado |
| Produção | Via Docker/Nginx | Build otimizado |

> 📝 Em desenvolvimento, o Vite faz proxy de `/api/*` para `http://localhost:8080`

---

## 📱 Rotas da Aplicação

| Rota | Página | Autenticação |
|------|--------|--------------|
| `/login` | Login | ❌ Público |
| `/register` | Cadastro | ❌ Público |
| `/dashboard` | Dashboard | ✅ Requer JWT |
| `/incomes` | Receitas | ✅ Requer JWT |
| `/expenses` | Despesas | ✅ Requer JWT |
| `/investments` | Investimentos | ✅ Requer JWT |

---

## 🔐 Autenticação

### Fluxo

1. Usuário faz login em `/api/auth/login`
2. Backend retorna JWT
3. Token é armazenado via Zustand (localStorage)
4. Axios interceptor adiciona token em todas as requisições
5. Se token expirar, redireciona para login

### Implementação (authStore.ts)

```typescript
// Estado global de autenticação
const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (email, password) => { /* ... */ },
  logout: () => { /* limpa token e redireciona */ },
}));
```

---

## 📊 Componentes Principais

### Dashboard
- **StatCard** - Cards de resumo (Receitas, Despesas, Balanço)
- **IncomeExpenseChart** - Gráfico de barras comparativo
- **DonutChart** - Distribuição por categoria

### Listagens
- **Tabelas** - Material UI DataGrid
- **Modais** - CRUD (criar/editar)
- **EmptyState** - Estado vazio amigável

### Layout
- **MainLayout** - Sidebar + Header + Content
- **Theme Toggle** - Claro/Escuro

---

## 🎯 Funcionalidades por Página

### 📊 Dashboard (`/dashboard`)
- Cards de resumo financeiro
- Gráfico Receitas vs Despesas (barras)
- Gráfico de distribuição (donut)
- Taxa de poupança
- Despesas pendentes
- Rentabilidade de investimentos

### 💵 Receitas (`/incomes`)
- Listagem em tabela
- CRUD completo
- Categorias: Salário, Freelance, Dividendos, Aluguel, Outros
- Recorrência: Única, Diária, Semanal, Mensal, Anual

### 💸 Despesas (`/expenses`)
- Listagem em tabela
- CRUD completo
- Marcar como pago/pendente
- Categorias: Alimentação, Moradia, Transporte, Saúde, etc.
- Métodos: Dinheiro, PIX, Débito, Crédito, Boleto

### 📈 Investimentos (`/investments`)
- Cards visuais por ativo
- CRUD completo
- Cálculo automático de lucro/prejuízo
- Rentabilidade em percentual
- Tipos: Ações, FIIs, CDB, LCI/LCA, Tesouro, Crypto, etc.

---

## 🌙 Tema (Claro/Escuro)

O tema é gerenciado via Zustand (`themeStore.ts`) e persiste no localStorage.

```typescript
const useThemeStore = create<ThemeState>((set) => ({
  mode: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toggleTheme: () => {
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return { mode: newMode };
    });
  },
}));
```

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verifica erros de lint |

---

## 🔧 Configuração do Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 🚧 Próximos Passos

- [ ] Filtros por período (data início/fim)
- [ ] Gráficos por categoria
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações de contas a vencer
- [ ] PWA (Progressive Web App)
- [ ] Testes com Jest + React Testing Library
- [ ] Storybook para documentação de componentes

---

## 📄 Arquivos Ignorados (.gitignore)

Os seguintes arquivos **NÃO** devem ser commitados:

- `node_modules/` - Dependências (instale com `npm install`)
- `dist/` - Build de produção
- `.env*` - Variáveis de ambiente locais
- `*.log` - Arquivos de log

---

## 🤝 Padrões de Código

- **Componentes**: PascalCase (`StatCard.tsx`)
- **Hooks**: camelCase com prefixo "use" (`useAuthStore`)
- **Tipos**: PascalCase com sufixo descritivo (`UserResponseDTO`)
- **Serviços**: camelCase (`api.ts`)
- **Pastas**: kebab-case ou camelCase

---

<p align="center">
  Parte do projeto <a href="../README.md">FinTrack</a>
</p>
