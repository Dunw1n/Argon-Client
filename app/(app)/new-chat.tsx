// app/(app)/new-chat.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useChatStore } from '@/src/infrastructure/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function NewChatScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { createChat } = useChatStore();

  const handleCreateChat = async () => {
    if (!email) {
      Alert.alert('Ошибка', 'Введите email пользователя');
      return;
    }

    setLoading(true);
    try {
      await createChat(email);
      router.back();
    } catch (err: any) {
      Alert.alert('Ошибка', err.response?.data?.error || 'Не удалось создать чат');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a0b2e', '#2a1a3e']} style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="chat" size={80} color="#8b5cf6" style={styles.icon} />
        <Text style={styles.title}>Новый чат</Text>
        <Text style={styles.subtitle}>Введите email пользователя, чтобы начать общение</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#b8a8d8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email пользователя"
            placeholderTextColor="#8a7a9a"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateChat}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Создать чат</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#b8a8d8',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
  },
  inputIcon: {
    padding: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  cancelText: {
    color: '#b8a8d8',
    fontSize: 16,
  },
});