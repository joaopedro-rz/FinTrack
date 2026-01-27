// ==================== USER ====================
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

// ==================== INCOME ====================
export type IncomeCategory =
  | 'SALARY'
  | 'FREELANCE'
  | 'BUSINESS'
  | 'DIVIDENDS'
  | 'INTEREST'
  | 'RENTAL'
  | 'BONUS'
  | 'GIFT'
  | 'REFUND'
  | 'SALE'
  | 'OTHER';

export type RecurrenceType =
  | 'ONCE'
  | 'DAILY'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'BIMONTHLY'
  | 'QUARTERLY'
  | 'SEMIANNUAL'
  | 'ANNUAL';

export interface Income {
  id: string;
  description: string;
  amount: number;
  category: IncomeCategory;
  categoryDisplayName: string;
  date: string;
  recurrence: RecurrenceType;
  recurrenceDisplayName: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeRequest {
  description: string;
  amount: number;
  category: IncomeCategory;
  date: string;
  recurrence?: RecurrenceType;
  notes?: string;
}

// ==================== EXPENSE ====================
export type ExpenseCategory =
  | 'HOUSING'
  | 'UTILITIES'
  | 'TRANSPORTATION'
  | 'VEHICLE'
  | 'FOOD'
  | 'RESTAURANT'
  | 'HEALTH'
  | 'EDUCATION'
  | 'ENTERTAINMENT'
  | 'TRAVEL'
  | 'CLOTHING'
  | 'PERSONAL_CARE'
  | 'SUBSCRIPTION'
  | 'INSURANCE'
  | 'TAX'
  | 'DEBT'
  | 'PET'
  | 'KIDS'
  | 'DONATION'
  | 'OTHER';

export type PaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PIX'
  | 'BANK_TRANSFER'
  | 'DIGITAL_WALLET'
  | 'BOLETO'
  | 'FINANCING'
  | 'OTHER';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  categoryDisplayName: string;
  paymentMethod: PaymentMethod;
  paymentMethodDisplayName: string;
  date: string;
  dueDate: string;
  recurrence: RecurrenceType;
  recurrenceDisplayName: string;
  isPaid: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRequest {
  description: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
  dueDate: string;
  recurrence?: RecurrenceType;
  isPaid?: boolean;
  notes?: string;
}

// ==================== INVESTMENT ====================
export type InvestmentType =
  | 'SAVINGS'
  | 'CDB'
  | 'LCI_LCA'
  | 'TREASURY'
  | 'DEBENTURES'
  | 'STOCKS'
  | 'REITS'
  | 'ETFS'
  | 'BDRS'
  | 'INVESTMENT_FUND'
  | 'PENSION'
  | 'CRYPTO'
  | 'INTERNATIONAL'
  | 'REAL_ESTATE'
  | 'COMMODITIES'
  | 'OTHER';

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  typeDisplayName: string;
  ticker: string | null;
  quantity: number;
  purchasePrice: number;
  currentPrice: number | null;
  purchaseDate: string;
  broker: string | null;
  notes: string | null;
  totalInvested: number;
  currentValue: number | null;
  profitLoss: number | null;
  profitLossPercentage: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentRequest {
  name: string;
  type: InvestmentType;
  ticker?: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  purchaseDate: string;
  broker?: string;
  notes?: string;
}

// ==================== DASHBOARD ====================
export interface Dashboard {
  totalIncome: number;
  incomeCount: number;
  totalExpense: number;
  pendingExpense: number;
  expenseCount: number;
  totalInvested: number;
  currentInvestmentValue: number;
  investmentProfitLoss: number;
  investmentProfitLossPercentage: number;
  investmentCount: number;
  balance: number;
  savingsRate: number;
}

// ==================== ENUMS ====================
export interface EnumOption {
  value: string;
  label: string;
  description: string;
}

export interface AllEnums {
  incomeCategories: EnumOption[];
  expenseCategories: EnumOption[];
  paymentMethods: EnumOption[];
  investmentTypes: EnumOption[];
  recurrenceTypes: EnumOption[];
}

// ==================== REPORTS ====================
export interface TransactionReport {
  id: string;
  date: string;
  dueDate: string | null;
  type: 'INCOME' | 'EXPENSE';
  typeDisplayName: string;
  category: string;
  categoryDisplayName: string;
  description: string;
  amount: number;
  notes: string | null;
  createdAt: string;
}

export interface ReportSummary {
  startDate: string;
  endDate: string;
  filterType: 'ALL' | 'INCOME' | 'EXPENSE';
  transactions: TransactionReport[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  type: 'ALL' | 'INCOME' | 'EXPENSE';
}

// ==================== FILTROS ====================
export type PeriodFilter = '30_DAYS' | 'BIMONTHLY' | 'SEMESTER' | 'ANNUAL';

export interface PeriodFilterOption {
  value: PeriodFilter;
  label: string;
  days: number;
}

export const PERIOD_FILTERS: PeriodFilterOption[] = [
  { value: '30_DAYS', label: 'Últimos 30 dias', days: 30 },
  { value: 'BIMONTHLY', label: 'Bimestre', days: 60 },
  { value: 'SEMESTER', label: 'Semestre', days: 180 },
  { value: 'ANNUAL', label: 'Anual', days: 365 },
];

// ==================== API ====================
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

export interface ValidationError extends ApiError {
  errors: Record<string, string>;
}
