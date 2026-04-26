// src/features/chat/components/ChatRoomHeader.tsx
import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStatus } from '../hooks';
import { getMediaUrl } from '@/src/shared/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatStore } from '@/src/infrastructure/store';

interface ChatRoomHeaderProps {
  onInfoPress?: () => void;
}

export const ChatRoomHeader = memo(({ onInfoPress }: ChatRoomHeaderProps) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  
  const currentChat = useChatStore(state => state.currentChat);
  const user = useChatStore(state => state.user);
  
  const otherParticipant = currentChat?.participants?.find(p => p.id !== user?.id);
  
  const chatName = otherParticipant?.name || 'Чат';
  const avatar = otherParticipant?.avatar;
  const userId = otherParticipant?.id || '';
  
  const { status } = useUserStatus(userId, id || '');

  const handleBack = useCallback(() => router.back(), []);
  const handleMenuPress = useCallback(() => onInfoPress?.(), [onInfoPress]);
  const avatarLetter = chatName.charAt(0).toUpperCase();

  return (
    <LinearGradient
      colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.gradient, { paddingTop: insets.top + 5}]}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push(`/user-profile?id=${userId}`)} 
          style={styles.centerBlock} 
          activeOpacity={0.7}
        >
          {avatar ? (
            <Image source={{ uri: getMediaUrl(avatar) }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
          )}
          <View style={styles.userTextInfo}>
            <Text style={styles.userName} numberOfLines={1}>{chatName}</Text>
            <Text style={[styles.status, { color: status.color }]}>{status.text}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
});

ChatRoomHeader.displayName = 'ChatRoomHeader';

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  iconButton: {
    overflow: 'hidden',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  centerBlock: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
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