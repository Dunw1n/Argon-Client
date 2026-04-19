// src/features/chat/components/ChatBackground.tsx
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ImageBackground } from 'expo-image';

interface ChatBackgroundProps {
  children: ReactNode;
}

export const ChatBackground = ({ children }: ChatBackgroundProps) => {
  return (
    <ImageBackground
      source={require('@/assets/images/components-chat/background2.png')}
      style={styles.background}
      contentFit="cover"
    >
      <View style={styles.content}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 12,
  },
});