// app/(app)/chat/[id].tsx
import { View, FlatList, Platform, AppState, Keyboard, Animated, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@/src/features/chat/hooks';
import { useChatStore, useAuthStore } from '@/src/infrastructure/store';
import { ChatRoomHeader, MessageBubble, MessageInput, ChatBackground } from '@/src/features/chat/components';
import { Loading } from '@/src/shared/components';
import { socketService } from '@/src/infrastructure/socket';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, otherParticipant, otherAvatar, flatListRef, sendMessage, handleTyping, scrollToEnd } = useChat(id);
  const { markChatAsRead, fetchChats } = useChatStore();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const isFirstRender = useRef(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Анимация для поднятия контента
  const translateY = useRef(new Animated.Value(0)).current;

  // Улучшенный скролл к концу
  const safeScrollToEnd = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 50);
  }, []);

  // Слушаем клавиатуру
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(translateY, {
          toValue: -e.endCoordinates.height,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          safeScrollToEnd();
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          safeScrollToEnd();
        });
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [translateY, safeScrollToEnd]);

  // При новом сообщении скроллим
  useEffect(() => {
    if (messages && messages.length > 0) {
      safeScrollToEnd();
    }
  }, [messages, safeScrollToEnd]);

  // Возврат из фона
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        safeScrollToEnd();
      }
    });
    return () => subscription.remove();
  }, [safeScrollToEnd]);

  useEffect(() => {
    if (isFirstRender.current && id) {
      markChatAsRead(id);
      isFirstRender.current = false;
    }
  }, [id, markChatAsRead]);

  useEffect(() => {
    if (!id || !messages || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.id !== lastMessageIdRef.current && lastMessage.sender_id !== user?.id) {
      lastMessageIdRef.current = lastMessage.id;
      
      if (socketService.isConnected()) {
        socketService.emit('mark_chat_read', id);
      }
      
      markChatAsRead(id);
    }
  }, [messages, id, user, markChatAsRead]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        fetchChats(true);
      };
    }, [fetchChats])
  );

  const onSend = useCallback((text: string) => {
    if (text.trim()) {
      sendMessage(text);
      safeScrollToEnd();
    }
  }, [sendMessage, safeScrollToEnd]);

  const onTyping = useCallback((isTyping: boolean) => {
    handleTyping(isTyping ? ' ' : '');
  }, [handleTyping]);

  const renderItem = useCallback(({ item, index }: any) => (
    <MessageBubble message={item} index={index} />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id || item.tempId, []);

  const chatName = useMemo(() => 
    otherParticipant?.name || 'Чат', 
    [otherParticipant?.name]
  );

  const userId = useMemo(() => 
    otherParticipant?.id || '', 
    [otherParticipant?.id]
  );

  if (!messages) return <Loading />;

  return (
    <ChatBackground>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <ChatRoomHeader
          chatName={chatName}
          userId={userId}
          chatId={id}
          avatar={otherAvatar}
        />
      </View>

      <Animated.View 
        style={[
          styles.animatedContainer,
          { transform: [{ translateY }] }
        ]}
      >
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContent}
            onLayout={safeScrollToEnd}
            onContentSizeChange={safeScrollToEnd}
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            initialNumToRender={20}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={Platform.OS !== 'web'}
          />
        </View>

        {/* Инпут */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
          <MessageInput
            onSend={onSend}
            onTyping={onTyping} 
          />
        </View>
      </Animated.View>
    </ChatBackground>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  animatedContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    flex: 1,
    overflow: "hidden",
    paddingTop: 13,
  },
  messagesContent: {
    paddingHorizontal: 0,
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
});