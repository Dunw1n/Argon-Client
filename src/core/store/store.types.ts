// src/core/store/store.types.ts
import { Chat } from '../entities/chat.entities';
import { Message } from '../entities/message.entities';
import { User } from '../entities/user.entities';

export interface ChatStoreState {
  chats: Chat[];
  currentChat: Chat | null;
  chatsLoaded: boolean;
  messages: Message[];
  loading: boolean;
  onlineUsers: Map<string, boolean>;
  typingUsers: Map<string, string[]>;
  users: Map<string, User>;
  chatsVersion: number;
}

export interface ChatStoreActions {
  fetchChats: (force?: boolean) => Promise<void>;
  fetchChatById: (chatId: string) => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<Message | null>;
  createChat: (userEmail: string) => Promise<Chat | void>;
  addMessage: (message: Message) => void;
  initSocket: () => Promise<void>;
  joinChatRoom: (chatId: string) => void;
  leaveChatRoom: (chatId: string) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  markChatAsRead: (chatId: string) => void;
  reset: () => void;
}

export type ChatStore = ChatStoreState & ChatStoreActions;