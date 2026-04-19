// src/features/auth/hooks/useAuthForm.ts
import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/src/infrastructure/store';
import { authService } from '@/src/infrastructure/services';

interface UseAuthFormProps {
  type: 'login' | 'register';
}

interface LoginReturn {
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void;
  loading: boolean;
  error: string;
  handleSubmit: () => Promise<void>;
}

interface RegisterReturn extends LoginReturn {
  name: string;
  setName: (text: string) => void;
}

const BETA_STORAGE_KEY = 'beta_modal_shown';

export function useAuthForm(props: { type: 'login' }): LoginReturn;
export function useAuthForm(props: { type: 'register' }): RegisterReturn;
export function useAuthForm({ type }: UseAuthFormProps): LoginReturn | RegisterReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  
  const { login, register } = useAuthStore();

  const validate = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError('Заполните все поля');
      return false;
    }
    
    if (type === 'register' && !name.trim()) {
      setError('Введите ваше имя');
      return false;
    }
    
    if (type === 'register' && password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return false;
    }
    
    if (!email.includes('@')) {
      setError('Введите корректный email');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    setLoading(true);
    setError('');
    
    try {
      let response;
      
      if (type === 'login') {
        response = await authService.login({ email: email.trim(), password });
      } else {
        response = await authService.register({ 
          email: email.trim(), 
          password, 
          name: name.trim() 
        });
      }
      
      if (response.requiresPin) {
        router.push({
          pathname: '/(auth)/verify-pin',
          params: { userId: response.userId }
        });
        return;
      }
      
      const { user, token } = response;
      
      await AsyncStorage.setItem('token', token);
      
      if (type === 'login') {
        await login(email.trim(), password, token);
      } else {
        await register(email.trim(), password, name.trim());
      }
      
      await AsyncStorage.setItem(BETA_STORAGE_KEY, 'false');
      
      router.replace('/(app)');
    } catch (err: any) {
      const errorMessage = type === 'login' 
        ? err.response?.data?.error || 'Неверный email или пароль'
        : err.response?.data?.error || 'Ошибка регистрации';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const baseReturn = {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };

  return type === 'register' 
    ? { ...baseReturn, name, setName } 
    : baseReturn;
}