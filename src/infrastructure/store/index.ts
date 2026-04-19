// src/infrastructure/store/index.ts
export { useAuthStore, useAuthUser, useIsAuthenticated, useIsLoading as useAuthIsLoading } from './auth.store';
export { 
  useChatStore, 
  useChats, 
  useChatsVersion, 
  useCurrentChat, 
  useMessages, 
  useOnlineUsers, 
  useTypingUsers,
  useIsChatsLoading,
} from './chat.store';
export type { ChatStoreState, ChatStoreActions } from './chat.store.types';