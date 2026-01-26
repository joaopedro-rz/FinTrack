import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

// ==================== CONFIGURAÇÕES ====================
const API_CONFIG = {
  baseURL: '/api',
  timeout: 15000,
} as const;

const ROUTES = {
  LOGIN_EXPIRED: '/login?session=expired',
} as const;

/**
 * Instância do Axios configurada para a API do FinTrack.
 */
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.timeout,
});

/**
 * Interceptor de requisição - Adiciona o token JWT automaticamente.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta - Trata erros globalmente.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      // Só faz logout se o usuário estava autenticado
      if (authStore.isAuthenticated) {
        authStore.logout();
        // Usar replace para não adicionar ao histórico e evitar loops
        window.location.replace(ROUTES.LOGIN_EXPIRED);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
