// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router'; 
import { useEffect, useState } from 'react'; 
import { useAuthStore, useChatStore } from '@/src/infrastructure/store';
import { StatusBar } from 'expo-status-bar';
import { enableMapSet } from 'immer';
import { Loading } from '@/src/shared/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useHeartbeat } from '@/src/shared/hooks';

enableMapSet();

export default function RootLayout() {
  const { checkAuth, isLoading, user } = useAuthStore(); 
  const { fetchChats, initSocket, reset } = useChatStore();
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments(); 
  const router = useRouter(); 

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
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}