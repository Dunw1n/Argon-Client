import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@/src/features/chat/hooks';
import { useChatStore } from '@/src/infrastructure/store';
import { ChatRoomHeader, MessageBubble, MessageInput, ChatBackground } from '@/src/features/chat/components';
import { Loading } from '@/src/shared/components';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    messages, 
    otherParticipant, 
    otherAvatar, 
    flatListRef, 
    sendMessage, 
    handleTyping, 
    isLoading, 
    scrollToEnd
  } = useChat(id);
  
  const { fetchChats } = useChatStore();
  const insets = useSafeAreaInsets();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        fetchChats(true);
      };
    }, [fetchChats])
  );

  // Скроллим при загрузке сообщений
  useEffect(() => {
    if (messages && messages.length > 0) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToEnd();
      }, 100);
    }
  }, [messages?.length, scrollToEnd]);

  if (isLoading || !messages) return <Loading />;

  return (
    <ChatBackground>
      {/* Header - фиксированный сверху */}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
        <ChatRoomHeader
          chatName={otherParticipant?.name || 'Чат'}
          userId={otherParticipant?.id || ''}
          chatId={id}
          avatar={otherAvatar}
        />
      </View>

      {/* Основной контент с клавиатурой */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.contentContainer}>
          {/* FlatList с сообщениями */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id || item.tempId}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={[
              styles.messagesList,
              { 
                paddingTop: insets.top + 60,
                paddingBottom: 20,
              }
            ]}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
              }
              scrollTimeoutRef.current = setTimeout(scrollToEnd, 50);
            }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
          />

          {/* Инпут - всегда внизу */}
          <MessageInput 
            onSend={sendMessage} 
            onTyping={(isTyping) => handleTyping(isTyping ? 'typing...' : '')} 
          />
        </View>
      </KeyboardAvoidingView>
    </ChatBackground>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});