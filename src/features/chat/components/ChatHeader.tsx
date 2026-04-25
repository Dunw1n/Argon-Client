// src/features/chat/components/ChatHeader.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import GradientWhiteToTransparent from '@/src/shared/components/GradientWhiteToTransparent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export const ChatHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#fef3f8', '#f0e9ff', '#e8f4ff']}
      style={[styles.container, { paddingTop: insets.top + 5 }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.content]}>
      
          <View style={styles.greeting}>
            <Image 
              source={require("@/assets/images/components-logo/Logotype-512.png")} 
              style={styles.greetingLogo} 
              contentFit='cover'
            />
            <Text style={styles.greetingText}>
              Argon Messager
            </Text>
          </View>
          
          <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={24} color="#686868" />
          </TouchableOpacity>

      </View>

      <GradientWhiteToTransparent startOpacity={0} endOpacity={1} height={30} style={{ bottom: 0, left: 0, right: 0 }} />
      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: 10,
    paddingBottom: 20
  },
  content: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: "100%",
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 30
  },
  greeting: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 10
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 600
  },
  greetingLogo: {
    width: 35,
    height: 35,
    borderRadius: 100
  }
});