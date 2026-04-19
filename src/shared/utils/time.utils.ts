// src/shared/utils/time.utils.ts
type TimeFormatOptions = {
  hour?: '2-digit';
  minute?: '2-digit';
  day?: '2-digit';
  month?: '2-digit' | 'long' | 'short';
  year?: 'numeric';
  weekday?: 'short';
};

const formatTime = (date: Date, options: TimeFormatOptions): string => {
  try {
    return date.toLocaleDateString('ru-RU', options);
  } catch {
    return '';
  }
};

export const formatMessageTime = (timestamp: string): string => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    
    return formatTime(date, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export const formatChatDate = (timestamp: string): string => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysDiff = Math.floor((today.getTime() - messageDate.getTime()) / 86400000);
    
    if (daysDiff === 0) return formatTime(date, { hour: '2-digit', minute: '2-digit' });
    if (daysDiff === 1) return 'вчера';
    if (daysDiff < 7) return formatTime(date, { weekday: 'short' });
    
    return formatTime(date, { day: '2-digit', month: '2-digit' });
  } catch {
    return '';
  }
};

export const formatLastSeen = (lastSeen?: string | null): string => {
  if (!lastSeen) return 'не в сети';
  
  try {
    const date = new Date(lastSeen);
    if (isNaN(date.getTime())) return 'не в сети';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return formatTime(date, { day: 'numeric', month: 'short' });
  } catch {
    return 'не в сети';
  }
};

export const isUserOnline = (lastSeen?: string | null): boolean => {
  if (!lastSeen) return false;
  
  try {
    const date = new Date(lastSeen);
    if (isNaN(date.getTime())) return false;
    
    return Date.now() - date.getTime() < 5 * 60 * 1000;
  } catch {
    return false;
  }
};

export const formatFullDate = (date?: string | null): string => {
  if (!date) return 'Не указано';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Не указано';
    
    return formatTime(d, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return 'Не указано';
  }
};

export const formatBirthday = {
  toDisplay: (date?: string | null): string => {
    if (!date) return '';
    if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    }
    return date;
  },
  toServer: (date?: string): string | null => {
    if (!date) return null;
    if (date.includes('.')) {
      const [day, month, year] = date.split('.');
      if (day?.length === 2 && month?.length === 2 && year?.length === 4) {
        return `${year}-${month}-${day}`;
      }
    }
    return null;
  },
};