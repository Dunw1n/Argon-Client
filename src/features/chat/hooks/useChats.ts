// src/features/chat/hooks/useChats.ts
import { useCallback } from 'react';
import { useChatStore } from '@/src/infrastructure/store';

export const useChats = () => {
  const { chats, fetchChats, loading, chatsLoaded } = useChatStore();
  
  const unreadCount = chats.reduce(
    (total, chat) => total + (chat.unreadCount || 0), 
    0
  );
  
  const refresh = useCallback(async () => {
    await fetchChats(true);
  }, [fetchChats]);
  
  return {
    chats,
    unreadCount,
    loading,
    chatsLoaded,
    refresh,
  };
};