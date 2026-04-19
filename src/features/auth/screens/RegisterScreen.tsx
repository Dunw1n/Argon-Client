// src/features/auth/screens/RegisterScreen.tsx
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AuthBackground, AuthTextBlock, AuthInput, AuthButton, AuthFooter } from '../components';
import { useAuthForm } from '../hooks';

export default function RegisterScreen() {
  const { email, setEmail, password, setPassword, name, setName, loading, error, handleSubmit } = useAuthForm({ type: 'register' });
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <AuthBackground>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <AuthTextBlock title={'Регистрация'} descr={'Создайте аккаунт'} />

        <View style={styles.form}>
          <AuthInput 
            placeholder="Имя" 
            value={name} 
            onChangeText={setName}
            icon="person-outline"
          />

          <AuthInput 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />

          <AuthInput 
            placeholder="Пароль" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry={true}
            icon="lock-closed-outline"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AuthButton onPress={handleSubmit} loading={loading} title="Зарегистрироваться" />

          <AuthFooter 
            onPress={() => router.push('/(auth)/login')} 
            linkText={'Уже есть аккаунт?'} 
            linkHighlight={'Войти'}
          />
        </View>
      </Animated.View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  form: {
    gap: 16,
  },
  error: {
    color: '#ef4444',
    fontSize: 13,
    textAlign: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});