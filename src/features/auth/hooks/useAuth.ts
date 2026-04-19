// src/features/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '@/src/infrastructure/store';
import { authService } from '@/src/infrastructure/services/auth.service';

export const useAuth = () => {
  const { user, token, isLoading, login, register, logout, setUser } = useAuthStore();

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.requiresPin) {
        router.push({
          pathname: '/(auth)/verify-pin',
          params: { userId: response.userId }
        });
        return { requiresPin: true, userId: response.userId };
      }
      
      await login(email, password, response.token);
      await authService.clearBetaFlag();
      router.replace('/(app)');
      
      return { success: true };
    } catch (error: any) {
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось войти');
      throw error;
    }
  }, [login]);

  const handleRegister = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await authService.register({ email, password, name });
      
      if (response.requiresPin) {
        router.push({
          pathname: '/(auth)/verify-pin',
          params: { userId: response.userId }
        });
        return { requiresPin: true, userId: response.userId };
      }
      
      await register(email, password, name);
      await authService.clearBetaFlag();
      router.replace('/(app)');
      
      return { success: true };
    } catch (error: any) {
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарегистрироваться');
      throw error;
    }
  }, [register]);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive', 
          onPress: async () => {
            await logout();
            await authService.logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  }, [logout]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    handleLogin,
    handleRegister,
    handleLogout,
    setUser,
  };
};