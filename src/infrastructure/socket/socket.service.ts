import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Продакшн WebSocket URL (Render)
const PRODUCTION_SOCKET_URL = 'wss://argon-backend-m52y.onrender.com';

// Локальный WebSocket URL для разработки
const DEVELOPMENT_SOCKET_URL = 'ws://192.168.1.199:3000';

const getSocketUrl = (): string => {
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    console.log('💻 Dev mode: Using local WebSocket:', DEVELOPMENT_SOCKET_URL);
    return DEVELOPMENT_SOCKET_URL;
  }
  
  console.log('🚀 Prod mode: Using Render WebSocket:', PRODUCTION_SOCKET_URL);
  return PRODUCTION_SOCKET_URL;
};

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

  async connect(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found, cannot connect socket');
        return;
      }
      
      if (this.socket?.connected) {
        console.log('✅ Socket already connected');
        return;
      }

      const socketUrl = getSocketUrl();
      const isProduction = !__DEV__;
      
      console.log('🔄 Connecting to WebSocket:', socketUrl);
      console.log('🔐 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');

      this.socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket'], // Force WebSocket transport
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        // Для продакшн (Render) используем secure connection
        ...(isProduction && {
          secure: true,
          rejectUnauthorized: false,
        }),
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully, ID:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.messageDedupe.clear();
      this.emit('get_online_users');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Сервер разорвал соединение, пробуем переподключиться
        setTimeout(() => this.connect(), 1000);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (error.message.includes('401')) {
        console.error('  → Authentication failed, token might be invalid');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('  → Connection refused, server might be offline');
      } else if (error.message.includes('xhr poll error')) {
        console.error('  → Transport error, trying websocket only');
      }
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('  → Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed after max attempts');
    });

    // Регистрация всех обработчиков событий
    const events: (keyof SocketEventMap)[] = [
      'online_users', 
      'chat_created', 
      'new_message', 
      'user_joined',
      'user_left', 
      'user_status', 
      'user_typing', 
      'message_error',
      'message_sent', 
      'message_delivered', 
      'message_read', 
      'messages_read',
      'chat_marked_read'
    ];

    events.forEach((event) => {
      this.socket?.on(event, (data: any) => {
        if (__DEV__) {
          console.log(`📨 Socket event: ${event}`, data);
        }
        
        // Дедупликация сообщений (только для new_message)
        if (event === 'new_message') {
          const now = Date.now();
          const messageKey = data.id || data.tempId;
          
          if (this.messageDedupe.has(messageKey)) {
            console.log('⏭️ Duplicate message skipped:', messageKey);
            return;
          }
          
          if (now - this.lastMessageTime < 100) {
            console.log('⏭️ Message too fast, skipping duplicate');
            return;
          }
          
          this.messageDedupe.add(messageKey);
          this.lastMessageTime = now;
          
          setTimeout(() => this.messageDedupe.delete(messageKey), 2000);
        }
        
        // Вызов всех зарегистрированных слушателей
        this.emitEvent(event, data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.messageDedupe.clear();
      this.listeners.clear();
    }
  }

  joinChat(chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_chat', chatId);
      if (__DEV__) console.log(`📢 Joined chat: ${chatId}`);
    } else {
      console.warn('⚠️ Cannot join chat - socket not connected');
    }
  }

  leaveChat(chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_chat', chatId);
      if (__DEV__) console.log(`📢 Left chat: ${chatId}`);
    }
  }

  sendMessage(chatId: string, text: string, tempId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('send_message', { chatId, text, tempId });
      if (__DEV__) console.log(`📤 Sending message to ${chatId}: ${text.substring(0, 20)}...`);
    } else {
      console.warn('⚠️ Cannot send message - socket not connected');
    }
  }

  sendTyping(chatId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { chatId, isTyping });
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit ${event} - socket not connected`);
    }
  }

  markChatAsRead(chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('mark_chat_read', chatId);
    }
  }

  getUserStatus(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('get_user_status', userId);
    }
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