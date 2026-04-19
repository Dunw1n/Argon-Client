// app/(app)/add-by-username.tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useChatStore } from '@/src/infrastructure/store';
import { apiClient } from '@/src/infrastructure/api';

export default function AddByUsernameScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createChat } = useChatStore();

  const handleAddUser = async () => {
    if (!username.trim()) {
      setError('Введите уникальное имя пользователя');
      return;
    }

    let cleanUsername = username.trim();
    if (cleanUsername.startsWith('@')) {
      cleanUsername = cleanUsername.slice(1);
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get(`/users/by-username/${cleanUsername}`);
      
      if (!response.data) {
        throw new Error('Пользователь не найден');
      }

      const user = response.data;
      await createChat(user.email);
      router.back();
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Пользователь не найден');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <LinearGradient
              colors={['#8b5cf6', '#6421FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name="person-add-outline" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>Добавить по имени</Text>
            <Text style={styles.subtitle}>
              Найдите пользователя по его уникальному имени и начните общение
            </Text>
          </View>

          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <LinearGradient
                colors={['#8b5cf6', '#6421FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoCardIcon}
              >
                <Ionicons name="at-outline" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Уникальное имя</Text>
                <Text style={styles.infoCardText}>Каждый пользователь имеет своё уникальное имя, например @kirill</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <LinearGradient
                colors={['#8b5cf6', '#6421FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoCardIcon}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Мгновенный чат</Text>
                <Text style={styles.infoCardText}>Сразу после добавления вы сможете обмениваться сообщениями</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <LinearGradient
                colors={['#8b5cf6', '#6421FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoCardIcon}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Безопасно</Text>
                <Text style={styles.infoCardText}>Все данные защищены и шифруются</Text>
              </View>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Уникальное имя пользователя</Text>
              <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
                <Text style={styles.atSymbol}>@</Text>
                <TextInput
                  style={styles.input}
                  placeholder="username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleAddUser}
                />
              </View>
              <Text style={styles.inputHint}>
                Введите имя без пробелов, используя латиницу
              </Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color="#ff6b6b" />
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddUser}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8b5cf6', '#6421FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Начать чат</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Не знаете уникальное имя? Попросите друга поделиться своим именем в настройках профиля
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCards: {
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  infoCardText: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  form: {
    gap: 24,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inputWrapperError: {
    borderColor: '#ff6b6b',
  },
  atSymbol: {
    fontSize: 16,
    color: '#999',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 14,
    paddingRight: 16,
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  error: {
    flex: 1,
    fontSize: 14,
    color: '#ff6b6b',
  },
  addButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});