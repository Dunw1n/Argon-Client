import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ImageBackground } from 'expo-image';
import GradientWhiteToTransparent from '@/src/shared/components/GradientWhiteToTransparent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatBackgroundProps {
  children: ReactNode;
}

export const ChatBackground = ({ children }: ChatBackgroundProps) => {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('@/assets/images/components-chat/background2.png')}
      style={styles.background}
      contentFit="cover"
    >
      {/* Верхний градиент */}
      <GradientWhiteToTransparent 
        height={insets.top + 70} 
        style={{ 
          position: 'absolute',
          top: 0, 
          left: 0, 
          right: 0,
          zIndex: 10,
        }} 
      />
      
      {/* Контент */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Нижний градиент */}
      <GradientWhiteToTransparent 
        startOpacity={0} 
        endOpacity={0.8} 
        height={100} 
        style={{ 
          position: 'absolute',
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: 10,
        }} 
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 10
  },
  content: {
    flex: 1
  },
});