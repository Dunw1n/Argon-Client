// src/infrastructure/store/chat.store.ts
import { create } from 'zustand';
import { produce } from 'immer';
import { apiClient } from '@/src/infrastructure/api';
import { socketService } from '@/src/infrastructure/socket';
import { useAuthStore } from './auth.store';
import type { ChatStore, ChatStoreState } from './chat.store.types';
import type { Message, Chat, User } from '@/src/core/entities';
import { generateTempId } from '@/src/shared/utils';

// Константы
const REFETCH_DELAY = 100;

// Начальное состояние
const initialState: ChatStoreState = {
  chats: [],
  chatsLoaded: false,
  currentChat: null,
  messages: [],
  loading: false,
  onlineUsers: new Map(),
  typingUsers: new Map(),
  users: new Map(),
  chatsVersion: 0,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // Инициализация сокета
  initSocket: async () => {
    if (socketService.isConnected()) return;

    await socketService.connect();

    socketService.on('connect', () => {
      const { chats, fetchChats } = get();
      chats.forEach(chat => socketService.joinChat(chat.id));
      fetchChats(true);
      socketService.emit('get_online_users');
    });

    socketService.on('chat_update_needed', () => {
      get().fetchChats(true);
    });

    socketService.on('online_users', (users: string[]) => {
      set(produce((state) => {
        state.onlineUsers.clear();
        users.forEach(userId => state.onlineUsers.set(userId, true));
      }));
    });

    socketService.on('new_message', (message: Message) => {
      const { currentChat, chats } = get();
      const currentUser = useAuthStore.getState().user;
      const isOwnMessage = message.sender_id === currentUser?.id;
      const isCurrentChat = currentChat?.id === message.chat_id;

      set(produce((state) => {
        // Обновляем сообщения
        const tempIndex = state.messages.findIndex(m => m.tempId === message.tempId);
        const existingIndex = state.messages.findIndex(m => m.id === message.id);
        
        if (tempIndex !== -1) {
          state.messages[tempIndex] = { ...message, isPending: false };
        } else if (existingIndex === -1) {
          state.messages.push({ ...message, isPending: false });
        }

        // Обновляем чат
        const chatIndex = state.chats.findIndex(c => c.id === message.chat_id);
        if (chatIndex !== -1) {
          const chat = state.chats[chatIndex];
          const newUnreadCount = !isOwnMessage && !isCurrentChat
            ? (chat.unreadCount || 0) + 1
            : 0;
          
          state.chats[chatIndex] = {
            ...chat,
            lastMessage: message,
            unreadCount: newUnreadCount,
          };
          state.chats = [...state.chats];
        }
      }));

      if (!isOwnMessage) {
        setTimeout(() => get().fetchChats(true), REFETCH_DELAY);
      }
    });

    socketService.on('chat_created', (newChat: Chat) => {
      set(produce((state) => {
        if (!state.chats.some(chat => chat.id === newChat.id)) {
          state.chats = [newChat, ...state.chats];
          newChat.participants?.forEach((participant: User) => {
            state.users.set(participant.id, participant);
          });
        }
      }));
    });

    socketService.on('user_status', ({ userId, status, last_seen }) => {
      set(produce((state) => {
        if (status === 'online') {
          state.onlineUsers.set(userId, true);
        } else {
          state.onlineUsers.delete(userId);
        }

        const user = state.users.get(userId);
        if (user) {
          user.last_seen = last_seen || user.last_seen;
          state.users.set(userId, { ...user });
        } else if (last_seen) {
          state.users.set(userId, { id: userId, last_seen } as User);
        }
      }));
    });

    socketService.on('message_sent', ({ tempId, message }) => {
      set(produce((state) => {
        const index = state.messages.findIndex(m => m.tempId === tempId);
        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            id: message.id,
            created_at: message.created_at,
            isPending: false,
            status: 'sent',
          };
          state.messages = [...state.messages];
        }
      }));
    });

    socketService.on('message_delivered', ({ messageId, chatId }) => {
      set(produce((state) => {
        const messageIndex = state.messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          state.messages[messageIndex].status = 'delivered';
          state.messages = [...state.messages];
        }
        
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1 && state.chats[chatIndex].lastMessage?.id === messageId) {
          state.chats[chatIndex].lastMessage.status = 'delivered';
          state.chats[chatIndex].lastMessage.delivered = true;
          state.chats = [...state.chats];
        }
        
        state.chatsVersion++;
      }));
    });

    socketService.on('message_read', ({ messageId, chatId }) => {
      set(produce((state) => {
        const messageIndex = state.messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          state.messages[messageIndex].status = 'read';
          state.messages[messageIndex].read = true;
          state.messages = [...state.messages];
        }
        
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1 && state.chats[chatIndex].lastMessage?.id === messageId) {
          state.chats[chatIndex].lastMessage.status = 'read';
          state.chats[chatIndex].lastMessage.read = true;
          state.chats = [...state.chats];
        }
      }));
    });

    socketService.on('user_typing', ({ userId, chatId, isTyping }) => {
      set(produce((state) => {
        const currentUsers = state.typingUsers.get(chatId) || [];
        if (isTyping && !currentUsers.includes(userId)) {
          state.typingUsers.set(chatId, [...currentUsers, userId]);
        } else if (!isTyping) {
          state.typingUsers.set(chatId, currentUsers.filter(id => id !== userId));
        }
      }));
    });

    socketService.on('mark_chat_read', ({ chatId }) => {
      set(produce((state) => {
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].unreadCount = 0;
          state.chats = [...state.chats];
        }
      }));
    });
  },

  // Методы
  joinChatRoom: (chatId: string) => socketService.joinChat(chatId),
  leaveChatRoom: (chatId: string) => socketService.leaveChat(chatId),
  sendTyping: (chatId: string, isTyping: boolean) => socketService.sendTyping(chatId, isTyping),

  fetchChats: async (force = false) => {
    if (!force && get().chatsLoaded) return;

    set({ loading: true });
    try {
      const { data } = await apiClient.get('/chats');

      // Присоединяемся ко всем чатам
      data.forEach((chat: Chat) => socketService.joinChat(chat.id));

      set(produce((state) => {
        state.chats = data;
        data.forEach((chat: Chat) => {
          chat.participants?.forEach((participant: User) => {
            state.users.set(participant.id, participant);
          });
        });
        state.loading = false;
        state.chatsLoaded = true;
      }));
    } catch (error) {
      console.error('Fetch chats error:', error);
      set({ loading: false });
      throw error;
    }
  },

  fetchChatById: async (chatId: string) => {
    try {
      const { data } = await apiClient.get(`/chats/${chatId}`);
      set(produce((state) => {
        state.currentChat = data;
        data.participants?.forEach((participant: User) => {
          state.users.set(participant.id, participant);
        });
      }));
    } catch (error) {
      console.error('Fetch chat error:', error);
      throw error;
    }
  },

  fetchMessages: async (chatId: string) => {
    try {
      const { data } = await apiClient.get(`/chats/${chatId}/messages`);
      set({ messages: data });
      await get().markChatAsRead(chatId);
    } catch (error) {
      console.error('Fetch messages error:', error);
      throw error;
    }
  },

  sendMessage: async (chatId: string, text: string) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');

      const tempId = generateTempId();
      const tempMessage: Message = {
        tempId,
        text,
        sender_id: user.id,
        chat_id: chatId,
        created_at: new Date().toISOString(),
        isPending: true,
        status: 'sending',
      };

      set(produce((state) => {
        state.messages.push(tempMessage);
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].lastMessage = tempMessage;
          state.chats[chatIndex].unreadCount = 0;
          state.chats = [...state.chats];
        }
      }));

      socketService.sendMessage(chatId, text, tempId);
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  createChat: async (userEmail: string): Promise<Chat | void> => {
    try {
      const { data } = await apiClient.post('/chats', { userEmail });
      set(produce((state) => {
        if (!state.chats.some(chat => chat.id === data.id)) {
          state.chats = [data, ...state.chats];
          data.participants?.forEach((participant: User) => {
            state.users.set(participant.id, participant);
          });
        }
      }));
      await get().fetchChats(true);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) throw new Error('Пользователь не найден');
      if (error.response?.status === 400) throw new Error('Нельзя создать чат с самим собой');
      throw new Error('Не удалось создать чат');
    }
  },

  markChatAsRead: async (chatId: string) => {
    try {
      await apiClient.post(`/chats/${chatId}/read`);
      if (socketService.isConnected()) {
        socketService.emit('mark_chat_read', chatId);
      }
      set(produce((state) => {
        const chatIndex = state.chats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].unreadCount = 0;
          state.chats = [...state.chats];
        }
      }));
    } catch (error) {
      console.error('Mark chat as read error:', error);
    }
  },

  addMessage: (message: Message) => {
    set(produce((state) => {
      if (state.messages.some(m => m.id === message.id)) return;
      if (message.tempId && state.messages.some(m => m.tempId === message.tempId)) {
        state.messages = state.messages.filter(m => m.tempId !== message.tempId);
      }
      state.messages.push(message);
    }));
  },

  reset: () => {
    socketService.disconnect();
    set(initialState);
  },
}));

// Селекторы
export const useChats = () => useChatStore((state) => state.chats);
export const useChatsVersion = () => useChatStore((state) => state.chatsVersion);
export const useCurrentChat = () => useChatStore((state) => state.currentChat);
export const useMessages = () => useChatStore((state) => state.messages);
export const useOnlineUsers = () => useChatStore((state) => state.onlineUsers);
export const useTypingUsers = () => useChatStore((state) => state.typingUsers);
export const useIsChatsLoading = () => useChatStore((state) => state.loading);