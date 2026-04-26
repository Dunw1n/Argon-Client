// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { ChatRoomHeader } from '@/src/features/chat/components';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', 
      }}
    >
      <Stack.Screen name="index" />
      
      <Stack.Screen 
        name="chat/[id]" 
        options={{
          headerShown: true,
          header: () => <ChatRoomHeader />,
          headerTransparent: true,
        }}
      />
      
      <Stack.Screen name="profile" />
      <Stack.Screen 
        name="settings" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="add-by-username" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
    </Stack>
  );
}