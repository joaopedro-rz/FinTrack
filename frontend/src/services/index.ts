import api from './api';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Income,
  IncomeRequest,
  Expense,
  ExpenseRequest,
  Investment,
  InvestmentRequest,
  Dashboard,
  AllEnums,
  ReportSummary,
  ReportFilters
} from '@/types';

// ==================== AUTH ====================
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};

// INCOME
export const incomeService = {
  getAll: async (): Promise<Income[]> => {
    const response = await api.get<Income[]>('/incomes');
    return response.data;
  },

  getById: async (id: string): Promise<Income> => {
    const response = await api.get<Income>(`/incomes/${id}`);
    return response.data;
  },

  create: async (data: IncomeRequest): Promise<Income> => {
    const response = await api.post<Income>('/incomes', data);
    return response.data;
  },

  update: async (id: string, data: IncomeRequest): Promise<Income> => {
    const response = await api.put<Income>(`/incomes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/incomes/${id}`);
  },

  getByPeriod: async (startDate: string, endDate: string): Promise<Income[]> => {
    const response = await api.get<Income[]>('/incomes/period', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getByPeriodOrdered: async (startDate: string, endDate: string): Promise<Income[]> => {
    const response = await api.get<Income[]>('/incomes/period/ordered', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getTotal: async (): Promise<number> => {
    const response = await api.get<number>('/incomes/total');
    return response.data;
  },
};

// EXPENSE
export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses');
    return response.data;
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  create: async (data: ExpenseRequest): Promise<Expense> => {
    const response = await api.post<Expense>('/expenses', data);
    return response.data;
  },

  update: async (id: string, data: ExpenseRequest): Promise<Expense> => {
    const response = await api.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  getPending: async (): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses/pending');
    return response.data;
  },

  markAsPaid: async (id: string): Promise<Expense> => {
    const response = await api.patch<Expense>(`/expenses/${id}/pay`);
    return response.data;
  },

  markAsPending: async (id: string): Promise<Expense> => {
    const response = await api.patch<Expense>(`/expenses/${id}/unpay`);
    return response.data;
  },

  getByPeriod: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses/period', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getByDueDatePeriod: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses/due-date/period', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getByDueDateAndStatus: async (startDate: string, endDate: string, isPaid: boolean): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses/due-date/status', {
      params: { startDate, endDate, isPaid },
    });
    return response.data;
  },

  getTotal: async (): Promise<number> => {
    const response = await api.get<number>('/expenses/total');
    return response.data;
  },
};

//  INVESTMENT
export const investmentService = {
  getAll: async (): Promise<Investment[]> => {
    const response = await api.get<Investment[]>('/investments');
    return response.data;
  },

  getById: async (id: string): Promise<Investment> => {
    const response = await api.get<Investment>(`/investments/${id}`);
    return response.data;
  },

  create: async (data: InvestmentRequest): Promise<Investment> => {
    const response = await api.post<Investment>('/investments', data);
    return response.data;
  },

  update: async (id: string, data: InvestmentRequest): Promise<Investment> => {
    const response = await api.put<Investment>(`/investments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/investments/${id}`);
  },

  updatePrice: async (id: string, price: number): Promise<Investment> => {
    const response = await api.patch<Investment>(`/investments/${id}/price`, null, {
      params: { price },
    });
    return response.data;
  },

  getTotalInvested: async (): Promise<number> => {
    const response = await api.get<number>('/investments/total/invested');
    return response.data;
  },

  getCurrentValue: async (): Promise<number> => {
    const response = await api.get<number>('/investments/total/current');
    return response.data;
  },
};

// DASHBOARD
export const dashboardService = {
  get: async (): Promise<Dashboard> => {
    const response = await api.get<Dashboard>('/dashboard');
    return response.data;
  },

  getByPeriod: async (startDate: string, endDate: string): Promise<Dashboard> => {
    const response = await api.get<Dashboard>('/dashboard/period', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getCurrentMonth: async (): Promise<Dashboard> => {
    const response = await api.get<Dashboard>('/dashboard/current-month');
    return response.data;
  },

  getByMonth: async (year: number, month: number): Promise<Dashboard> => {
    const response = await api.get<Dashboard>('/dashboard/month', {
      params: { year, month },
    });
    return response.data;
  },
};

// ENUMS
export const enumService = {
  getAll: async (): Promise<AllEnums> => {
    const response = await api.get<AllEnums>('/enums/all');
    return response.data;
  },
};

//  REPORTS
export const reportService = {

   // Busca relatório de transações com filtros.
  getTransactions: async (filters: ReportFilters): Promise<ReportSummary> => {
    const response = await api.get<ReportSummary>('/reports/transactions', {
      params: {
        startDate: filters.startDate,
        endDate: filters.endDate,
        type: filters.type,
      },
    });
    return response.data;
  },

  //Faz download do relatório em PDF.
  downloadPdf: async (filters: ReportFilters): Promise<Blob> => {
    const response = await api.get('/reports/transactions/pdf', {
      params: {
        startDate: filters.startDate,
        endDate: filters.endDate,
        type: filters.type,
      },
      responseType: 'blob',
    });
    return response.data;
  },

  //Faz download do relatório em Excel.
  downloadExcel: async (filters: ReportFilters): Promise<Blob> => {
    const response = await api.get('/reports/transactions/excel', {
      params: {
        startDate: filters.startDate,
        endDate: filters.endDate,
        type: filters.type,
      },
      responseType: 'blob',
    });
    return response.data;
  },

   //Relatório do mês atual.
  getCurrentMonth: async (type: 'ALL' | 'INCOME' | 'EXPENSE' = 'ALL'): Promise<ReportSummary> => {
    const response = await api.get<ReportSummary>('/reports/current-month', {
      params: { type },
    });
    return response.data;
  },

  //Relatório dos últimos 30 dias.
  getLast30Days: async (type: 'ALL' | 'INCOME' | 'EXPENSE' = 'ALL'): Promise<ReportSummary> => {
    const response = await api.get<ReportSummary>('/reports/last-30-days', {
      params: { type },
    });
    return response.data;
  },
};
