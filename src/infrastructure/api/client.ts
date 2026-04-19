// src/infrastructure/api/client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP || '192.168.1.199';
const SERVER_PORT = process.env.EXPO_PUBLIC_SERVER_PORT || '3000';
const API_URL = `http://${SERVER_IP}:${SERVER_PORT}/api`;

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