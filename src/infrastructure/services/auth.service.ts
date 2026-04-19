// src/infrastructure/services/auth.service.ts
import { apiClient } from '@/src/infrastructure/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Типы
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface PinVerificationData {
  userId: string;
  pinCode: string;
}

export interface LoginResponse {
  token?: string;
  user?: any;
  requiresPin?: boolean;
  userId?: string;
}

export interface RegisterResponse {
  requiresPin?: boolean;
  userId?: string;
  token?: string;
  user?: any;
}

class AuthService {
  private static instance: AuthService;
  private readonly TOKEN_KEY = 'token';
  private readonly BETA_KEY = 'beta_modal_shown';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      await this.saveToken(response.data.token);
    }
    return response.data;
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }

  async verifyPin(data: PinVerificationData): Promise<{ token?: string; user?: any }> {
    const response = await apiClient.post('/auth/verify-pin', data);
    if (response.data.token) {
      await this.saveToken(response.data.token);
    }
    return response.data;
  }

  async resendPin(userId: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/resend-pin', { userId });
    return response.data;
  }

  async getMe(): Promise<any> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
  }

  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(this.TOKEN_KEY, token);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(this.TOKEN_KEY);
  }

  async clearBetaFlag(): Promise<void> {
    await AsyncStorage.setItem(this.BETA_KEY, 'false');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

// Singleton экспорт
export const authService = AuthService.getInstance();