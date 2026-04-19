// app/(app)/add-user.tsx
import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useChatStore } from '@/src/infrastructure/store';
import { ScreenHeader } from '@/src/shared/components';

export default function AddUserScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { createChat } = useChatStore();

  const handleAddUser = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert('Ошибка', 'Введите email пользователя');
      return;
    }

    setLoading(true);
    try {
      await createChat(email.trim());
      Alert.alert('Успех', 'Чат создан');
      router.back();
    } catch (error: any) {
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось создать чат');
    } finally {
      setLoading(false);
    }
  }, [email, createChat]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScreenHeader title="Добавить пользователя" />
      
      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email пользователя</Text>
          <TextInput
            style={styles.input}
            placeholder="user@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddUser}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Создание...' : 'Создать чат'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});