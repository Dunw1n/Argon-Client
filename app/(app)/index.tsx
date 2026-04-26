import { View, FlatList, StyleSheet, RefreshControl, Text, Platform } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useChats } from '@/src/features/chat/hooks';
import { ChatHeader } from '@/src/features/chat/components';
import { ChatItem } from '@/src/features/chat/components';
import { BottomTabBar } from '@/src/shared/components';
import { Loading } from '@/src/shared/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EMPTY_LIST_MESSAGE = 'Нет чатов';
const EMPTY_SUBTEXT = 'Нажмите на кнопку + чтобы добавить пользователя';

export default function ChatsScreen() {
  const { chats, loading, chatsLoaded, refresh } = useChats();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const renderChatItem = useCallback(({ item }: any) => (
    <ChatItem chat={item} />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const EmptyComponent = useMemo(() => (
    <View style={[styles.emptyContainer, { paddingTop: insets.top + 100 }]}>
      <Text style={styles.emptyText}>{EMPTY_LIST_MESSAGE}</Text>
      <Text style={styles.emptySubtext}>{EMPTY_SUBTEXT}</Text>
    </View>
  ), [insets.top]);

  if (loading && !chatsLoaded) return <Loading />;
  
  return (
    <View style={styles.container}>
      <ChatHeader />
      
      <FlatList
        data={chats}
        keyExtractor={keyExtractor}
        renderItem={renderChatItem}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#4c1d95"
            colors={['#4c1d95']}
          />
        }
        ListEmptyComponent={EmptyComponent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={[
          styles.listContent,
          chats.length === 0 && styles.emptyListContent
        ]}
      />
      
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80, // Отступ для таббара
  },
  emptyListContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});