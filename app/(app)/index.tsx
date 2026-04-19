// app/(app)/index.tsx
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useChats } from '@/src/features/chat/hooks';
import { ChatHeader } from '@/src/features/chat/components';
import { ChatItem } from '@/src/features/chat/components';
import { BottomTabBar } from '@/src/shared/components';
import { Loading } from '@/src/shared/components';

const EMPTY_LIST_MESSAGE = 'Нет чатов';
const EMPTY_SUBTEXT = 'Нажмите на кнопку + чтобы добавить пользователя';

export default function ChatsScreen() {
  const { chats, loading, chatsLoaded, refresh } = useChats();
  const [refreshing, setRefreshing] = useState(false);

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

  const EmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{EMPTY_LIST_MESSAGE}</Text>
      <Text style={styles.emptySubtext}>{EMPTY_SUBTEXT}</Text>
    </View>
  ), []);

  if (loading && !chatsLoaded) return <Loading />;
  
  return (
    <View style={styles.container}>
      <ChatHeader />
      
      <FlatList
        data={chats}
        keyExtractor={keyExtractor}
        renderItem={renderChatItem}
        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
        ListEmptyComponent={EmptyComponent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
      
      <BottomTabBar />
    </View>
  );
}

const keyExtractor = (item: any) => item.id;
const renderChatItem = ({ item }: any) => <ChatItem chat={item} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});