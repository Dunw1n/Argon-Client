// src/infrastructure/store/chat.store.types.ts
import { Chat, Message, User } from '@/src/core/entities';

export interface ChatStoreState {
  chats: Chat[];
  chatsLoaded: boolean;
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  onlineUsers: Map<string, boolean>;
  typingUsers: Map<string, string[]>;
  users: Map<string, User>;
  chatsVersion: number;
}

export interface ChatStoreActions {
  initSocket: () => Promise<void>;
  fetchChats: (force?: boolean) => Promise<void>;
  fetchChatById: (chatId: string) => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  createChat: (userEmail: string) => Promise<Chat | void>;
  markChatAsRead: (chatId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  joinChatRoom: (chatId: string) => void;
  leaveChatRoom: (chatId: string) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  reset: () => void;
}

export type ChatStore = ChatStoreState & ChatStoreActions;