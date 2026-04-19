// src/infrastructure/socket/socket.service.ts
import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP || '192.168.1.199';
const SERVER_PORT = process.env.EXPO_PUBLIC_SERVER_PORT || '3000';

export type SocketEventMap = {
  online_users: (users: string[]) => void;
  chat_created: (chat: any) => void;
  new_message: (message: any) => void;
  user_joined: (data: any) => void;
  user_left: (data: any) => void;
  user_status: (data: any) => void;
  user_typing: (data: any) => void;
  message_error: (data: any) => void;
  message_sent: (data: any) => void;
  message_delivered: (data: any) => void;
  message_read: (data: any) => void;
  messages_read: (data: any) => void;
  chat_marked_read: (data: any) => void;
};

class SocketService {
  private socket: Socket | null = null;
  private listeners = new Map<keyof SocketEventMap, Function[]>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly messageDedupe = new Set<string>();
  private lastMessageTime = 0;

  private getSocketUrl(): string {
    if (Platform.OS === 'android') {
      return `http://${SERVER_IP}:${SERVER_PORT}`;
    }
    if (Platform.OS === 'ios') {
      return `http://${SERVER_IP}:${SERVER_PORT}`;
    }
    return `http://${SERVER_IP}:${SERVER_PORT}`;
  }

  async connect(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || this.socket?.connected) return;

      this.socket = io(this.getSocketUrl(), {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.messageDedupe.clear();
      this.emit('get_online_users');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.reconnectAttempts++;
    });

    const events: (keyof SocketEventMap)[] = [
      'online_users', 'chat_created', 'new_message', 'user_joined',
      'user_left', 'user_status', 'user_typing', 'message_error',
      'message_sent', 'message_delivered', 'message_read', 'messages_read',
      'chat_marked_read'
    ];

    events.forEach((event) => {
      this.socket?.on(event, (data: any) => {
        if (event === 'new_message') {
          const now = Date.now();
          const messageKey = data.id || data.tempId;
          
          if (this.messageDedupe.has(messageKey)) return;
          if (now - this.lastMessageTime < 100) return;
          
          this.messageDedupe.add(messageKey);
          this.lastMessageTime = now;
          
          setTimeout(() => this.messageDedupe.delete(messageKey), 2000);
        }
        
        this.emitEvent(event, data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.messageDedupe.clear();
      this.listeners.clear();
    }
  }

  joinChat(chatId: string): void {
    this.socket?.connected && this.socket.emit('join_chat', chatId);
  }

  leaveChat(chatId: string): void {
    this.socket?.connected && this.socket.emit('leave_chat', chatId);
  }

  sendMessage(chatId: string, text: string, tempId: string): void {
    this.socket?.connected && this.socket.emit('send_message', { chatId, text, tempId });
  }

  sendTyping(chatId: string, isTyping: boolean): void {
    this.socket?.connected && this.socket.emit('typing', { chatId, isTyping });
  }

  emit(event: string, data?: any): void {
    this.socket?.connected && this.socket.emit(event, data);
  }

  markChatAsRead(chatId: string): void {
    this.socket?.connected && this.socket.emit('mark_chat_read', chatId);
  }

  getUserStatus(userId: string): void {
    this.socket?.connected && this.socket.emit('get_user_status', userId);
  }

  on<K extends keyof SocketEventMap>(event: K, callback: SocketEventMap[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off<K extends keyof SocketEventMap>(event: K, callback?: SocketEventMap[K]): void {
    if (!this.listeners.has(event)) return;
    
    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    } else {
      this.listeners.delete(event);
    }
  }

  private emitEvent<K extends keyof SocketEventMap>(event: K, data: Parameters<SocketEventMap[K]>[0]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  clearCache(): void {
    this.messageDedupe.clear();
  }
}

export const socketService = new SocketService();