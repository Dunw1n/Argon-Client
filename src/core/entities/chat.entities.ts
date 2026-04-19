// src/core/entities/chat.entities.ts
import { User } from './user.entities';
import { Message } from './message.entities';

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  chatId: string;
  userId: string;
  joinedAt: string;
}

export type ChatPreview = Pick<Chat, 'id' | 'lastMessage' | 'unreadCount' | 'updated_at'> & {
  otherParticipant: User;
};

// 🔥 ДОБАВЛЯЕМ НЕДОСТАЮЩИЕ ТИПЫ
export interface SendMessageData {
  chatId: string;
  text: string;
  tempId: string;
}

export interface CreateChatData {
  userEmail: string;
}