// src/infrastructure/services/chat.service.ts
import { apiClient } from '@/src/infrastructure/api';
import type { Chat, Message, CreateChatData, SendMessageData } from '@/src/core/entities';

class ChatService {
  private static instance: ChatService;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async getChats(): Promise<Chat[]> {
    const response = await apiClient.get('/chats');
    return response.data;
  }

  async getChatById(chatId: string): Promise<Chat> {
    const response = await apiClient.get(`/chats/${chatId}`);
    return response.data;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const response = await apiClient.get(`/chats/${chatId}/messages`);
    return response.data;
  }

  async createChat(data: CreateChatData): Promise<Chat> {
    const response = await apiClient.post('/chats', data);
    return response.data;
  }

  async markChatAsRead(chatId: string): Promise<void> {
    await apiClient.post(`/chats/${chatId}/read`);
  }

  async sendMessage(data: SendMessageData): Promise<Message> {
    const response = await apiClient.post(`/chats/${data.chatId}/messages`, {
      text: data.text,
    });
    return response.data;
  }
}

// Singleton экспорт
export const chatService = ChatService.getInstance();