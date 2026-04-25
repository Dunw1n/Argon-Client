// src/infrastructure/api/client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Получаем переменные окружения
const getApiUrl = (): string => {
  // Приоритет 1: Явно заданный в .env
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('📡 Using API URL from env:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Приоритет 2: Определяем по NODE_ENV
  const isDevelopment = __DEV__; // React Native глобальная переменная
  
  if (isDevelopment) {
    // Локальная разработка
    const ip = process.env.EXPO_PUBLIC_SERVER_IP || '192.168.1.199';
    const port = process.env.EXPO_PUBLIC_SERVER_PORT || '3000';
    const url = `http://${ip}:${port}/api`;
    console.log('💻 Dev mode API URL:', url);
    return url;
  } else {
    // Production
    const url = 'https://argon-backend-ibt7.onrender.com/api';
    console.log('🚀 Prod mode API URL:', url);
    return url;
  }
};

const API_URL = getApiUrl();

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Логируем все запросы в dev режиме
if (__DEV__) {
  apiClient.interceptors.request.use(request => {
    console.log('📤 API Request:', request.method?.toUpperCase(), request.url);
    return request;
  });
  
  apiClient.interceptors.response.use(
    response => {
      console.log('📥 API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('❌ API Error:', error.message);
      return Promise.reject(error);
    }
  );
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      console.log('🔐 Token expired, removing...');
      await AsyncStorage.removeItem('token');
    }
    
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
    
    return Promise.reject(error);
  }
);

export const api = {
  get: <T = unknown>(url: string) => apiClient.get<T>(url),
  post: <T = unknown>(url: string, data?: unknown) => apiClient.post<T>(url, data),
  put: <T = unknown>(url: string, data?: unknown) => apiClient.put<T>(url, data),
  patch: <T = unknown>(url: string, data?: unknown) => apiClient.patch<T>(url, data),
  delete: <T = unknown>(url: string) => apiClient.delete<T>(url),
};

export default apiClient;