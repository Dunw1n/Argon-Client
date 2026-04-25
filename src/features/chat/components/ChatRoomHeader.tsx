// src/features/chat/components/ChatRoomHeader.tsx
import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useUserStatus } from '../hooks';
import { getMediaUrl } from '@/src/shared/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatRoomHeaderProps {
  chatName: string;
  userId: string;
  chatId: string;
  avatar?: string | null;
  onInfoPress?: () => void;
}

export const ChatRoomHeader = memo(({ 
  chatName, 
  userId, 
  chatId,
  avatar,
  onInfoPress 
}: ChatRoomHeaderProps) => {

  const insets = useSafeAreaInsets();
  
  
  const { status } = useUserStatus(userId, chatId);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleMenuPress = useCallback(() => {
    onInfoPress?.();
  }, [onInfoPress]);

  const avatarLetter = chatName.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 5 }]}>
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <BlurView intensity={100} tint="light" style={styles.blurWrapper}>
            <Ionicons name="arrow-back" size={22} color="#333" />
          </BlurView>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push(`/user-profile?id=${userId}`)} 
          style={styles.centerBlock}
          activeOpacity={0.7}
        >
          <BlurView intensity={100} tint="light" style={styles.centerBlur}>
            <View style={styles.centerContent}>
              {avatar ? (
                <Image source={{ uri: getMediaUrl(avatar) }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
              )}
              <View style={styles.userTextInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {chatName}
                </Text>
                <Text style={[styles.status, { color: status.color }]}>
                  {status.text}
                </Text>
              </View>
            </View>
          </BlurView>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleMenuPress} 
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <BlurView intensity={100} tint="light" style={styles.blurWrapper}>
            <Ionicons name="ellipsis-vertical" size={22} color="#333" />
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );
});

ChatRoomHeader.displayName = 'ChatRoomHeader';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  iconButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  centerBlock: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 30,
  },
  centerBlur: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  userTextInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 12,
  },
});