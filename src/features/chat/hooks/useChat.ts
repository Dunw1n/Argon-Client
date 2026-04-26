import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useChatStore, useAuthStore } from '@/src/infrastructure/store';

export const useChat = (chatId?: string) => {
  const { user } = useAuthStore();
  const flatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    messages,
    currentChat,
    fetchMessages,
    fetchChatById,
    sendMessage: sendMessageStore,
    sendTyping: sendTypingStore,
    joinChatRoom,
    leaveChatRoom,
    chats,
  } = useChatStore();

  const unreadCount = chats.find(c => c.id === chatId)?.unreadCount || 0;

  const loadChat = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    try {
      await Promise.all([fetchChatById(chatId), fetchMessages(chatId)]);
    } finally {
      setIsLoading(false);
    }
  }, [chatId, fetchChatById, fetchMessages]);
  
  const sendMessage = useCallback(async (text: string) => {
    if (!chatId || !text.trim()) return;
    await sendMessageStore(chatId, text);
    scrollToEnd();
  }, [chatId, sendMessageStore]);

  const handleTyping = useCallback((isTyping: boolean) => {
    sendTypingStore(chatId!, isTyping);
  }, [chatId, sendTypingStore]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      (flatListRef.current as any)?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Авто-скролл при новых сообщениях
  useEffect(() => {
    if (messages?.length) scrollToEnd();
  }, [messages, scrollToEnd]);

  // Скролл при возврате из фона
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') scrollToEnd();
    });
    return () => subscription.remove();
  }, [scrollToEnd]);

  // Загрузка чата и подписка на комнату
  useEffect(() => {
    if (!chatId) return;
    loadChat();
    joinChatRoom(chatId);
    return () => leaveChatRoom(chatId);
  }, [chatId, loadChat, joinChatRoom, leaveChatRoom]);
  
  const otherParticipant = currentChat?.participants?.find(p => p.id !== user?.id);
  const otherAvatar = otherParticipant?.avatar;
  
  return {
    messages,
    otherParticipant,
    otherAvatar,
    flatListRef,
    sendMessage,
    handleTyping,
    scrollToEnd,
    isLoading,
    unreadCount,
  };
};