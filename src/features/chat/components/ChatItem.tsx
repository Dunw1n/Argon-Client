// src/features/chat/components/ChatItem.tsx
import { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useChatStore } from '@/src/infrastructure/store';
import { useUserStatus } from '../hooks';
import { formatChatDate, getMediaUrl } from '@/src/shared/utils';

interface ChatItemProps {
  chat: {
    id: string;
    participants?: any[];
    lastMessage?: { 
      text: string; 
      created_at?: string; 
      status?: string; 
      sender_id?: string;
      read?: boolean;
      delivered?: boolean;
    };
    unreadCount?: number;
  };
}

export const ChatItem = memo(({ chat: initialChat }: ChatItemProps) => {
  const { user: currentUser } = useAuthStore();
  const { chats, chatsVersion } = useChatStore();
  
  const currentChat = useMemo(
    () => chats.find(c => c.id === initialChat.id) || initialChat,
    [chats, initialChat, chatsVersion]
  );
  
  const otherParticipant = useMemo(
    () => currentChat.participants?.find(p => p.id !== currentUser?.id),
    [currentChat.participants, currentUser?.id]
  );
  
  const { status, getMessageStatus } = useUserStatus(otherParticipant?.id);
  
  const chatName = otherParticipant?.name || otherParticipant?.email || 'Unknown';
  const lastMessageText = currentChat.lastMessage?.text || 'Нет сообщений';
  const lastMessageTime = currentChat.lastMessage?.created_at;
  const unreadCount = currentChat.unreadCount || 0;
  const avatar = otherParticipant?.avatar;
  
  const lastMessageRaw = currentChat.lastMessage;
  const isLastMessageOwn = lastMessageRaw?.sender_id === currentUser?.id;
  
  let messageStatus = lastMessageRaw?.status;
  if (!messageStatus && isLastMessageOwn) {
    if (lastMessageRaw?.read) messageStatus = 'read';
    else if (lastMessageRaw?.delivered) messageStatus = 'delivered';
    else messageStatus = 'sent';
  }
  
  const messageStatusData = getMessageStatus(messageStatus);
  
  const handlePress = () => {
    router.push(`/chat/${currentChat.id}`);
  };
  
  const renderStatusIcon = () => {
    if (!isLastMessageOwn) return null;
    
    if (messageStatusData.isRead) {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-done-outline" size={14} color="#34C759" />
        </View>
      );
    }
    if (messageStatusData.isDelivered) {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-done-outline" size={14} color="#999" />
        </View>
      );
    }
    return (
      <View style={styles.statusContainer}>
        <Ionicons name="checkmark-outline" size={14} color="#999" />
      </View>
    );
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress} 
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: getMediaUrl(avatar) }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {chatName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {status.isOnline && <View style={styles.onlineDot} />}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {chatName}
          </Text>
          {lastMessageTime && (
            <Text style={styles.time}>{formatChatDate(lastMessageTime)}</Text>
          )}
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText}
          </Text>
          <View style={styles.rightContainer}>
            {renderStatusIcon()}
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ChatItem.displayName = 'ChatItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4cd964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 11,
    color: '#999',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusContainer: {
    marginLeft: 2,
  },
  unreadBadge: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});