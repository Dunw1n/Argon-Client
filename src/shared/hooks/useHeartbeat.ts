// src/shared/hooks/useHeartbeat.ts
import { useEffect, useRef } from 'react';
import { socketService } from '@/src/infrastructure/socket';

const HEARTBEAT_INTERVAL = 30000; // 30 секунд

export const useHeartbeat = (): void => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startHeartbeat = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (socketService.isConnected()) {
          socketService.emit('heartbeat');
        }
      }, HEARTBEAT_INTERVAL);
    };

    const stopHeartbeat = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    socketService.on('connect', startHeartbeat);
    socketService.on('disconnect', stopHeartbeat);
    
    if (socketService.isConnected()) {
      startHeartbeat();
    }

    return () => {
      stopHeartbeat();
      socketService.off('connect', startHeartbeat);
      socketService.off('disconnect', stopHeartbeat);
    };
  }, []);
};