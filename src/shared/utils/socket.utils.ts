// src/shared/utils/socket.utils.ts
import { socketService } from '@/src/infrastructure/socket';
import type { Chat } from '@/src/core/entities';

export const joinAllChatRooms = (chats: Chat[]): boolean => {
  if (!socketService.isConnected()) {
    console.warn('⚠️ Socket not connected, skipping join');
    return false;
  }
  
  chats.forEach(chat => socketService.joinChat(chat.id));
  console.log(`🔌 Joined ${chats.length} chat rooms`);
  
  return true;
};

export const emitMarkRead = (chatId: string): void => {
  if (socketService.isConnected()) {
    socketService.emit('mark_chat_read', chatId);
  }
};