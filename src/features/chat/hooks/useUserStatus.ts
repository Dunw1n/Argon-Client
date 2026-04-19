// src/features/chat/hooks/useUserStatus.ts
import { useMemo } from 'react';
import { useChatStore, useAuthStore } from '@/src/infrastructure/store';
import { formatLastSeen } from '@/src/shared/utils';

export const useUserStatus = (userId?: string, chatId?: string) => {
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const users = useChatStore((state) => state.users);
  const currentUser = useAuthStore((state) => state.user);
  
  const userStatus = useMemo(() => {
    if (!userId) return { text: 'не в сети', color: '#999', isOnline: false };
    
    if (userId === currentUser?.id) {
      return { text: 'онлайн', color: '#4cd964', isOnline: true, isTyping: false };
    }
    
    const isOnline = onlineUsers.get(userId) || false;
    const isTyping = chatId ? typingUsers.get(chatId)?.includes(userId) || false : false;
    
    if (isTyping) {
      return { text: 'печатает...', color: '#8b5cf6', isOnline: true, isTyping: true };
    }
    if (isOnline) {
      return { text: 'онлайн', color: '#4cd964', isOnline: true, isTyping: false };
    }
    
    const user = users.get(userId);
    if (user?.last_seen) {
      return { text: formatLastSeen(user.last_seen), color: '#999', isOnline: false, isTyping: false };
    }
    
    return { text: 'не в сети', color: '#999', isOnline: false, isTyping: false };
  }, [userId, chatId, onlineUsers, typingUsers, users, currentUser]);

  const getMessageStatus = (status?: string) => {
    switch (status) {
      case 'read':
        return { isSent: true, isDelivered: true, isRead: true, iconName: 'checkmark-done-outline', iconColor: '#4cd964' };
      case 'delivered':
        return { isSent: true, isDelivered: true, isRead: false, iconName: 'checkmark-done-outline', iconColor: '#999' };
      case 'sent':
        return { isSent: true, isDelivered: false, isRead: false, iconName: 'checkmark-outline', iconColor: '#999' };
      default:
        return { isSent: false, isDelivered: false, isRead: false, iconName: 'time-outline', iconColor: '#999' };
    }
  };

  return {
    status: userStatus,
    isOnline: userStatus.isOnline,
    isTyping: userStatus.isTyping,
    getMessageStatus,
  };
};