import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_CONFIG = {
  baseURL: '/api',
  timeout: 15000,
} as const;

const ROUTES = {
  LOGIN_EXPIRED: '/login?session=expired',
} as const;

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.timeout,
});

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const authStore = useAuthStore.getState();

    if (error.response?.status === 401) {
      if (authStore.isAuthenticated) {
        console.warn('Token inválido ou expirado. Redirecionando para login...');
        authStore.clearAuth();
        window.location.replace(ROUTES.LOGIN_EXPIRED);
      }
    } else if (error.response?.status === 403) {
      console.error('Acesso negado: permissões insuficientes');
    }

    return Promise.reject(error);
  }
);

export default api;
