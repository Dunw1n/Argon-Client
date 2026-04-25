// src/features/chat/hooks/useChat.ts (расширенная версия)
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, AppState } from 'react-native';
import { useChatStore, useAuthStore } from '@/src/infrastructure/store';
import { useTyping } from './useTyping';

const SCROLL_DELAY = 100;

export const useChat = (chatId?: string) => {
  const { user } = useAuthStore();
  const flatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
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

  const { handleTyping: handleTypingInternal } = useTyping(
    (isTyping) => sendTypingStore(chatId!, isTyping)
  );

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

  const handleTyping = useCallback((text: string) => {
    handleTypingInternal(text);
  }, [handleTypingInternal]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      (flatListRef.current as any)?.scrollToEnd({ animated: true });
    }, SCROLL_DELAY);
  }, []);

  // 👇 НОВЫЙ ХУК: обработка клавиатуры
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
      scrollToEnd();
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
      scrollToEnd();
    });
    return () => { show.remove(); hide.remove(); };
  }, [scrollToEnd]);

  // 👇 НОВЫЙ ХУК: авто-скролл при новых сообщениях
  useEffect(() => {
    if (messages?.length) scrollToEnd();
  }, [messages, scrollToEnd]);

  // 👇 НОВЫЙ ХУК: скролл при возврате из фона
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') scrollToEnd();
    });
    return () => subscription.remove();
  }, [scrollToEnd]);

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
    currentChat,
    otherParticipant,
    otherAvatar,
    flatListRef,
    sendMessage,
    handleTyping,
    scrollToEnd,
    isLoading,
    unreadCount,
    isKeyboardVisible, 
  };
};