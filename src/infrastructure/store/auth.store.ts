// src/infrastructure/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/infrastructure/api';
import type { User, UpdateUserData } from '@/src/core/entities';

// Типы
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string, existingToken?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ requiresPin: boolean; userId?: string } | void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (data: UpdateUserData) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

// Константы
const TOKEN_KEY = 'token';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      // Логин
      login: async (email: string, password: string, existingToken?: string) => {
        try {
          let token = existingToken;
          let user: User | undefined;

          if (!existingToken) {
            const response = await apiClient.post('/auth/login', { email, password });
            
            if (response.data.requiresPin) {
              throw { response: { data: { requiresPin: true, userId: response.data.userId } } };
            }
            
            token = response.data.token;
            user = response.data.user;
          } else {
            const response = await apiClient.get('/auth/me', {
              headers: { Authorization: `Bearer ${existingToken}` }
            });
            user = response.data;
          }

          if (token) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            set({ token, user, isAuthenticated: true });
          }
        } catch (error: any) {
          if (error.response?.data?.requiresPin) throw error;
          console.error('Login error:', error.response?.data || error.message);
          throw error;
        }
      },

      // Регистрация
      register: async (email: string, password: string, name: string) => {
        try {
          const response = await apiClient.post('/auth/register', { email, password, name });
          
          if (response.data.requiresPin) {
            return { requiresPin: true, userId: response.data.userId };
          }
          
          const { token, user } = response.data;
          await AsyncStorage.setItem(TOKEN_KEY, token);
          set({ token, user, isAuthenticated: true });
        } catch (error: any) {
          console.error('Register error:', error.response?.data || error.message);
          throw error;
        }
      },

      // Выход
      logout: async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        set({ user: null, token: null, isAuthenticated: false });
      },

      // Проверка аутентификации
      checkAuth: async () => {
        set({ isLoading: true });
        
        try {
          const token = await AsyncStorage.getItem(TOKEN_KEY);
          
          if (!token) {
            set({ user: null, token: null, isLoading: false, isAuthenticated: false });
            return;
          }
          
          const response = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          set({ 
            user: response.data, 
            token, 
            isLoading: false, 
            isAuthenticated: true 
          });
        } catch (error: any) {
          console.error('Auth check error:', error.message);
          await AsyncStorage.removeItem(TOKEN_KEY);
          set({ user: null, token: null, isLoading: false, isAuthenticated: false });
        }
      },

      // Обновление пользователя
      updateUser: async (data: UpdateUserData) => {
        try {
          const response = await apiClient.patch('/users/profile', data);
          const updatedUser = response.data;
          
          set((state) => ({
            user: state.user ? { ...state.user, ...updatedUser } : null
          }));
        } catch (error: any) {
          console.error('Update user error:', error.response?.data || error.message);
          throw error;
        }
      },

      // Получение профиля
      fetchUserProfile: async () => {
        try {
          const response = await apiClient.get('/users/profile');
          const userData = response.data;
          
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : userData
          }));
        } catch (error: any) {
          console.error('Fetch profile error:', error.response?.data || error.message);
          throw error;
        }
      },

      // Установка пользователя
      setUser: (user: User) => {
        set({ user });
      },

      // Очистка стора
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Селекторы для удобства
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);