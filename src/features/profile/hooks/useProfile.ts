// src/features/profile/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/src/infrastructure/store';
import { userService } from '@/src/infrastructure/services';
import { formatBirthday, getMediaUrl } from '@/src/shared/utils';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.199:3000';

export const useProfile = () => {
  const router = useRouter();
  const { user, updateUser, fetchUserProfile, logout } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const formatPhoneNumber = useCallback((text: string) => {
    let cleaned = text.replace(/\D/g, '');
    
    if (cleaned.startsWith('8')) {
      cleaned = '7' + cleaned.slice(1);
    }
    
    const limited = cleaned.slice(0, 11);
    
    if (limited.length === 0) return '';
    if (limited.length === 1 && limited === '7') return '+7';
    
    let numberPart = limited;
    if (numberPart.startsWith('7')) {
      numberPart = numberPart.slice(1);
    }
    
    if (numberPart.length <= 3) return `+7 (${numberPart}`;
    if (numberPart.length <= 6) {
      return `+7 (${numberPart.slice(0, 3)}) ${numberPart.slice(3)}`;
    }
    if (numberPart.length <= 8) {
      return `+7 (${numberPart.slice(0, 3)}) ${numberPart.slice(3, 6)}-${numberPart.slice(6)}`;
    }
    return `+7 (${numberPart.slice(0, 3)}) ${numberPart.slice(3, 6)}-${numberPart.slice(6, 8)}-${numberPart.slice(8, 10)}`;
  }, []);

  const handlePhoneChange = useCallback((text: string) => {
    if (text === '' || text === '+') {
      setPhone('');
      return;
    }
    if (text === '7' || text === '+7') {
      setPhone('+7');
      return;
    }
    setPhone(formatPhoneNumber(text));
  }, [formatPhoneNumber]);

  const handleUsernameChange = useCallback((text: string) => {
    let value = text;
    if (value && !value.startsWith('@')) {
      value = '@' + value.replace(/@/g, '');
    }
    setUsername(value);
  }, []);

  const handleBirthdayChange = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 8);
    
    let formatted = limited;
    if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}.${limited.slice(2)}`;
    }
    if (limited.length > 4) {
      formatted = `${limited.slice(0, 2)}.${limited.slice(2, 4)}.${limited.slice(4)}`;
    }
    
    setBirthday(formatted);
  }, []);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchUserProfile();
    } catch (error) {
      console.error('Load profile error:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить профиль');
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const handleSaveChanges = useCallback(async () => {
    const cleanUsername = username.replace(/^@/, '');
    const cleanPhone = phone.replace(/\D/g, '');
    
    let serverBirthday = null;
    if (birthday && birthday.length === 10) {
      serverBirthday = formatBirthday.toServer(birthday);
    }
    
    const hasChanges = 
      cleanPhone !== (user?.phone || '') ||
      cleanUsername !== (user?.username || '') ||
      serverBirthday !== (user?.birthday || '') ||
      bio !== (user?.bio || '') ||
      (lastName ? `${firstName} ${lastName}` : firstName) !== (user?.name || '');

    if (!hasChanges) return;

    setIsSaving(true);
    try {
      const updateData: Record<string, any> = {};
      
      if (cleanPhone !== (user?.phone || '')) updateData.phone = cleanPhone;
      if (cleanUsername !== (user?.username || '')) updateData.username = cleanUsername;
      if (serverBirthday !== (user?.birthday || '')) updateData.birthday = serverBirthday;
      if (bio !== (user?.bio || '')) updateData.bio = bio;
      
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      if (fullName !== (user?.name || '')) updateData.name = fullName;
      
      if (Object.keys(updateData).length > 0) {
        await updateUser(updateData);
        Alert.alert('Успех', 'Профиль обновлен');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  }, [phone, username, birthday, bio, firstName, lastName, user, updateUser]);

  const handleBlur = useCallback(() => {
    handleSaveChanges();
  }, [handleSaveChanges]);

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
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  }, [logout, router]);

  const handleSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'web') return true;
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нужно разрешение для доступа к фотографиям');
      return false;
    }
    return true;
  }, []);

  const uploadAvatar = useCallback(async (image: ImagePicker.ImagePickerAsset) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: image.uri,
        type: 'image/jpeg',
        name: `avatar_${user?.id}_${Date.now()}.jpg`,
      } as any);

      const response = await userService.uploadAvatar(formData);

      if (response.avatar) {
        await updateUser({ avatar: response.avatar });
        Alert.alert('Успех', 'Аватар обновлен');
      }
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось обновить аватар');
    } finally {
      setUploadingAvatar(false);
    }
  }, [user, updateUser]);

  const handleAvatarPress = useCallback(async () => {
    if (!(await requestPermissions())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0]);
    }
  }, [requestPermissions, uploadAvatar]);

  const getImageUrl = useCallback((avatar: string | null | undefined) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    return `${API_BASE_URL}${avatar}`;
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (user) {
      const rawPhone = user.phone || '';
      setPhone(rawPhone ? formatPhoneNumber(rawPhone) : '');
      setUsername(user.username ? (user.username.startsWith('@') ? user.username : `@${user.username}`) : '');
      setBirthday(formatBirthday.toDisplay(user.birthday));
      
      const nameParts = user.name?.split(' ') || [];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      
      setBio(user.bio || '');
      setIsLoading(false);
    }
  }, [user, formatPhoneNumber]);

  return {
    user,
    phone,
    username,
    birthday,
    firstName,
    lastName,
    bio,
    isLoading,
    isSaving,
    uploadingAvatar,
    handlePhoneChange,
    handleUsernameChange,
    handleBirthdayChange,
    setBirthday,
    setFirstName,
    setLastName,
    setBio,
    handleBlur,
    handleLogout,
    handleSettingsPress,
    handleAvatarPress,
    getImageUrl,
  };
};