import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Продакшн URL (Render)
const PRODUCTION_API_URL = 'https://argon-backend-m52y.onrender.com/api';

// Локальный URL для разработки (измените IP на ваш)
const DEVELOPMENT_API_URL = 'http://192.168.1.199:3000/api';

const getApiUrl = (): string => {
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    // Режим разработки - используем локальный сервер
    console.log('💻 Dev mode: Using local API');
    return DEVELOPMENT_API_URL;
  }
  
  // Продакшн режим - используем Render
  console.log('🚀 Prod mode: Using Render API:', PRODUCTION_API_URL);
  return PRODUCTION_API_URL;
};

const API_URL = getApiUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Логирование запросов в dev режиме
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
      if (error.response) {
        console.error(`❌ API Error ${error.response.status}:`, error.config?.url);
        console.error('  Response data:', error.response.data);
      } else if (error.request) {
        console.error('❌ API No Response:', error.config?.url);
        console.error('  Error message:', error.message);
        console.error('  Is server running? Check:', API_URL);
      } else {
        console.error('❌ API Request Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
}

// Добавление токена авторизации
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

// Обработка 401 ошибки (неавторизован)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('🔐 Token expired or invalid, removing...');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
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