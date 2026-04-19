// src/features/auth/screens/VerifyPinScreen.tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { AuthBackground, AuthButton } from '../components';
import { useAuthStore } from '@/src/infrastructure/store';
import { apiClient } from '@/src/infrastructure/api';

export default function VerifyPinScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [pinCode, setPinCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { login } = useAuthStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handlePinChange = (text: string, index: number) => {
    const newPin = [...pinCode];
    newPin[index] = text;
    setPinCode(newPin);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pinCode[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = pinCode.join('');
    if (code.length !== 6) {
      Alert.alert('Ошибка', 'Введите 6-значный код');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-pin', {
        userId,
        pinCode: code,
      });
      
      const { user, token } = response.data;
      await login(user.email, '', token);
      router.replace('/(app)');
    } catch (err: any) {
      Alert.alert('Ошибка', err.response?.data?.error || 'Неверный код');
      setPinCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      await apiClient.post('/auth/resend-pin', { userId });
      setTimer(60);
      setCanResend(false);
      Alert.alert('Успех', 'Новый код отправлен на почту');
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось отправить код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.logoGradient}
              >
                <Ionicons name="mail-outline" size={32} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Проверьте почту</Text>
            <Text style={styles.subtitle}>
              Мы отправили 6-значный код подтверждения на ваш email
            </Text>
          </View>

          <View style={styles.pinContainer}>
            {pinCode.map((digit, index) => (
              <BlurView key={index} intensity={30} tint="light" style={styles.pinBlur}>
                <TextInput
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={(text) => handlePinChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              </BlurView>
            ))}
          </View>

          <AuthButton 
            onPress={handleVerify} 
            loading={loading} 
            title="Подтвердить"
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {canResend ? 'Не пришел код?' : `Отправить повторно через ${timer} сек`}
            </Text>
            {canResend && (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Отправить снова</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#52525b',
    textAlign: 'center',
    lineHeight: 20,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  pinBlur: {
    width: 52,
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  pinInput: {
    width: 52,
    height: 60,
    fontSize: 22,
    fontWeight: '600',
    color: '#18181b',
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 0,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 13,
    color: '#71717a',
  },
  resendLink: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
    marginTop: 8,
  },
});