import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../api/axios';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CASHIER' | 'INVENTORY_MANAGER';
};

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = response.data.data;
          
          set({
            user,
            token: accessToken,
            refreshToken,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error?.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          await axios.post('/auth/logout', { refreshToken });
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Even if logout API fails, clear local state
          set({
            user: null,
            token: null,
            refreshToken: null,
            isLoading: false,
            error: null,
          });
        }
      },
      
      register: async (name, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post('/auth/register', { name, email, password, role });
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error?.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);