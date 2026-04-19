// src/shared/hooks/useDebounce.ts
import { useRef, useCallback } from 'react';

export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

// Алиас для удобства
export const useThrottle = useDebounce;