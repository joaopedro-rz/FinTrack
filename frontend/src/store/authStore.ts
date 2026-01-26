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
  updateUser: (name: string, email: string) => void;
  updateAvatar: (avatarUrl: string) => void;
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
        set({
          token: data.token,
          userId: data.userId,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          userId: null,
          name: null,
          email: null,
          createdAt: null,
          avatarUrl: null,
          isAuthenticated: false,
        });
      },

      updateUser: (name: string, email: string) => {
        set({ name, email });
      },

      updateAvatar: (avatarUrl: string) => {
        set({ avatarUrl });
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
