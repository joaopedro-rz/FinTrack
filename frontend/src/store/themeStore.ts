import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: (localStorage.getItem('fintrack-theme') as ThemeMode) || 'light',

  toggleTheme: () => {
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('fintrack-theme', newMode);
      return { mode: newMode };
    });
  },

  setTheme: (mode: ThemeMode) => {
    localStorage.setItem('fintrack-theme', mode);
    set({ mode });
  },
}));
