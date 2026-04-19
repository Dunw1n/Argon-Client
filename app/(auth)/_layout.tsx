// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: 'Вход' }} />
        <Stack.Screen name="register" options={{ title: 'Регистрация' }} />
        <Stack.Screen name="verify-pin" options={{ title: 'Подтверждение' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}