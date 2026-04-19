// src/features/chat/hooks/useTyping.ts
import { useRef, useCallback } from 'react';

export const useTyping = (
  onTyping: (isTyping: boolean) => void,
  delay: number = 1500
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const startTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping(true);
    }
  }, [onTyping]);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTyping(false);
    }
  }, [onTyping]);

  const handleTyping = useCallback((text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (text.length > 0) {
      startTyping();
    }
    
    timeoutRef.current = setTimeout(() => {
      stopTyping();
    }, delay);
  }, [startTyping, stopTyping, delay]);

  return { handleTyping, stopTyping };
};