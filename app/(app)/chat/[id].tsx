import { FlatList, StyleSheet, View, Keyboard } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@/src/features/chat/hooks';
import { useChatStore } from '@/src/infrastructure/store';
import { MessageBubble, MessageInput, ChatBackground } from '@/src/features/chat/components';
import { Loading } from '@/src/shared/components';

const ChatRoomScreen = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, sendMessage, handleTyping, isLoading } = useChat(id);
  const { fetchChats } = useChatStore();
  const insets = useSafeAreaInsets();
  const inputRef = useRef(null);

  // Обработчики клавиатуры
  useEffect(() => {
    const keyboardShow = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  useFocusEffect(useCallback(() => () => fetchChats(true), [fetchChats]));

  const renderItem = useCallback(({ item }) => <MessageBubble message={item} />, []);

  if (isLoading || !messages) return <Loading />;

  return (
    <ChatBackground>
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id || item.tempId}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.messagesList,
            {
              paddingTop: insets.top + 60,
              paddingBottom: keyboardHeight + 70
            }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
        <View
          style={[
            styles.footerContainer,
            { bottom: keyboardHeight }
          ]}
        >
          <MessageInput
            ref={inputRef}
            onSend={sendMessage}
            onTyping={handleTyping}
          />
        </View>
      </View>
    </ChatBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative'
  },
  messagesList: {
    flexGrow: 1
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default ChatRoomScreen;