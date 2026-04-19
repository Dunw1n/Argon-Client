// src/shared/utils/message.utils.ts
import type { Message, Chat } from '@/src/core/entities';

export const generateTempId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

export const createTempMessage = (
  text: string,
  senderId: string,
  chatId: string
): Message => ({
  tempId: generateTempId(),
  text,
  sender_id: senderId,
  chat_id: chatId,
  created_at: new Date().toISOString(),
  isPending: true,
});

export const isTempMessage = (message: Message): boolean => {
  return !!message.tempId && !message.id;
};

export const enrichMessage = (message: Message, existingMessages: Message[]): Message => {
  if (message.sender_id && message.chat_id) return message;
  
  const tempMessage = existingMessages.find(m => m.tempId === message.tempId);
  if (!tempMessage) return message;
  
  return {
    ...message,
    sender_id: message.sender_id || tempMessage.sender_id,
    chat_id: message.chat_id || tempMessage.chat_id,
  };
};

export const updateLastMessageInChats = (chats: Chat[], message: Message): Chat[] => {
  return chats.map(chat =>
    chat.id === message.chat_id
      ? { ...chat, lastMessage: message }
      : chat
  );
};

export const updateChatWithMessage = ({
  chat,
  message,
  isOwnMessage,
  isCurrentChat
}: {
  chat: Chat;
  message: Message;
  isOwnMessage: boolean;
  isCurrentChat: boolean;
}): Chat => {
  const newUnreadCount = !isOwnMessage && !isCurrentChat 
    ? (chat.unreadCount || 0) + 1 
    : 0;
  
  return { 
    ...chat, 
    lastMessage: message, 
    unreadCount: newUnreadCount 
  };
};

export const updateMessagesList = (
  messages: Message[], 
  newMessage: Message
): Message[] => {
  const tempIndex = messages.findIndex(m => m.tempId === newMessage.tempId);
  const existingIndex = messages.findIndex(m => m.id === newMessage.id);
  
  if (tempIndex !== -1) {
    const updated = [...messages];
    updated[tempIndex] = { ...newMessage, isPending: false };
    return updated;
  }
  
  if (existingIndex === -1) {
    return [...messages, { ...newMessage, isPending: false }];
  }
  
  return messages;
};

export const groupMessagesByDate = (messages: Message[]): Map<string, Message[]> => {
  const groups = new Map<string, Message[]>();
  
  messages.forEach((message) => {
    const date = new Date(message.created_at || message.createdAt || '').toDateString();
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(message);
  });
  
  return groups;
};