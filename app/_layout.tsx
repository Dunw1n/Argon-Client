// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore, useChatStore } from '@/src/infrastructure/store';
import { StatusBar } from 'expo-status-bar';
import { enableMapSet } from 'immer';
import { Loading } from '@/src/shared/components';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeartbeat } from '@/src/shared/hooks';
import { AppState } from 'react-native';
import * as NavigationBar from "expo-navigation-bar";
import GradientWhiteToTransparent from '@/src/shared/components/GradientWhiteToTransparent';

enableMapSet();

export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const { checkAuth, isLoading, user } = useAuthStore();
  const { fetchChats, initSocket, reset } = useChatStore();
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  const updateNavigationBarStyle = async () => {
    try {
      // Определяем текущий экран по сегментам
      const currentRoute = segments[segments.length - 1];
      const isInChat = currentRoute?.startsWith('chat') || currentRoute === '[id]';
      
      // Для чата - белые кнопки, для главной - черные
      const buttonStyle = isInChat ? "light" : "dark";
      
      await NavigationBar.setBackgroundColorAsync("transparent");
      await NavigationBar.setVisibilityAsync("visible");
      await NavigationBar.setButtonStyleAsync(buttonStyle);
      
      console.log(`Navigation bar updated: ${buttonStyle} buttons`);
    } catch (error) {
      console.error("Error configuring navigation bar:", error);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        updateNavigationBarStyle();
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    updateNavigationBarStyle();

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  // Обновляем стиль при изменении маршрута
  useEffect(() => {
    if (isReady) {
      updateNavigationBarStyle();
    }
  }, [segments, isReady]);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsReady(true);
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (!isReady) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    const currentUser = useAuthStore.getState().user;
    
    if (currentUser) {
      if (inAuthGroup) router.replace('/(app)');
    } else {
      if (!inAuthGroup && segments[0] !== undefined) {
        router.replace('/(auth)/login');
      }
    }
  }, [isReady, segments, router]);

  useEffect(() => {
    if (!isReady) return;
    
    if (user) {
      fetchChats(true);
      initSocket();
    } else {
      reset();
    }
  }, [isReady, user, fetchChats, initSocket, reset]);

  useHeartbeat();

  if (!isReady || isLoading) return <Loading />;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent/>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      
    </SafeAreaProvider>
  );
}