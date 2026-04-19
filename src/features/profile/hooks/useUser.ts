// src/features/profile/hooks/useUser.ts
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '@/src/infrastructure/store';

export const useUser = () => {
  const { user, updateUser, fetchUserProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      await updateUser(data);
      Alert.alert('Успех', 'Профиль обновлен');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchUserProfile();
    } catch (error) {
      console.error('Refresh profile error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  return {
    user,
    isLoading,
    updateProfile,
    refreshProfile,
  };
};