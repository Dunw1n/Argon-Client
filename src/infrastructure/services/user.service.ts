// src/infrastructure/services/user.service.ts
import { apiClient } from '@/src/infrastructure/api';
import type { UpdateUserData } from '@/src/core/entities';

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getProfile() {
    const response = await apiClient.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: UpdateUserData) {
    const response = await apiClient.patch('/users/profile', data);
    return response.data;
  }

  async uploadAvatar(formData: FormData) {
    const response = await apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return response.data;
  }

  async deleteAvatar() {
    const response = await apiClient.delete('/users/avatar');
    return response.data;
  }

  async getUserById(userId: string) {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  async searchUsers(query: string) {
    const response = await apiClient.get(`/users/search?query=${query}`);
    return response.data;
  }
}

export const userService = UserService.getInstance();