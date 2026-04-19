// src/features/chat/hooks/useChatSort.ts
import { useMemo } from 'react';
import { usePersistedState } from '@/src/shared/hooks';
import { useAuthStore } from '@/src/infrastructure/store';
import type { Chat } from '@/src/core/entities';

type SortType = 'date' | 'name' | 'unread';

export const useChatSort = (chats: Chat[]) => {
  const [sortBy, setSortBy] = usePersistedState<SortType>('chat_sort', 'date');
  const { user } = useAuthStore();

  const sortedChats = useMemo(() => {
    const sorted = [...chats];
    
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      case 'name':
        return sorted.sort((a, b) => {
          const nameA = a.participants?.find(p => p.id !== user?.id)?.name || '';
          const nameB = b.participants?.find(p => p.id !== user?.id)?.name || '';
          return nameA.localeCompare(nameB);
        });
      case 'unread':
        return sorted.sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
      default:
        return sorted;
    }
  }, [chats, sortBy, user]);

  return { sortedChats, sortBy, setSortBy };
};