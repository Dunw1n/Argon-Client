// src/core/entities/message.entities.ts
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id?: string;
  tempId?: string;
  text: string;
  sender_id: string;
  chat_id: string;
  created_at?: string;
  createdAt?: string;
  isPending?: boolean;
  isError?: boolean;
  status?: MessageStatus;
  read?: boolean;
  delivered?: boolean;
}

export interface TempMessage extends Message {
  tempId: string;
  isPending: true;
}

export const isTempMessage = (message: Message): message is TempMessage => {
  return !!message.tempId && !message.id;
};