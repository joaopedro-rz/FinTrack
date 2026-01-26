import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '@/types';

interface AuthState {
  token: string | null;
  userId: string | null;
  name: string | null;
  email: string | null;
  createdAt: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  clearAuth: () => void;
  updateUser: (name: string, email: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  removeAvatar: () => void; // Remove foto explicitamente
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      name: null,
      email: null,
      createdAt: null,
      avatarUrl: null,
      isAuthenticated: false,

      login: (data: AuthResponse) => {
        set((state) => ({
          token: data.token,
          userId: data.userId,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
          // Preserva o avatarUrl se o usuário já tinha uma foto configurada
          avatarUrl: state.avatarUrl,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        // Preserva a foto de perfil mesmo ao fazer logout (como redes sociais)
        set((state) => ({
          token: null,
          userId: null,
          name: null,
          email: null,
          createdAt: null,
          avatarUrl: state.avatarUrl, // Mantém a foto
          isAuthenticated: false,
        }));
      },

      clearAuth: () => {
        // Usado quando token expira - preserva avatar
        set((state) => ({
          token: null,
          userId: null,
          name: null,
          email: null,
          createdAt: null,
          avatarUrl: state.avatarUrl, // Mantém o avatar
          isAuthenticated: false,
        }));
      },

      updateUser: (name: string, email: string) => {
        set({ name, email });
      },

      updateAvatar: (avatarUrl: string) => {
        set({ avatarUrl });
      },

      removeAvatar: () => {
        // Remove a foto explicitamente quando o usuário quiser
        set({ avatarUrl: null });
      },
    }),
    {
      name: 'fintrack-auth',
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        name: state.name,
        email: state.email,
        createdAt: state.createdAt,
        avatarUrl: state.avatarUrl,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
