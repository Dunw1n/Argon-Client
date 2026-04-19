// src/shared/hooks/usePersistedState.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UsePersistedStateReturn<T> = [T, (value: T) => Promise<void>, boolean];

export const usePersistedState = <T>(
  key: string,
  initialValue: T
): UsePersistedStateReturn<T> => {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // Загрузка из storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored));
        }
      } catch (error) {
        console.error(`Failed to load "${key}" from storage:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    loadValue();
  }, [key]);

  // Сохранение в storage
  const saveValue = useCallback(
    async (newValue: T) => {
      setValue(newValue);
      try {
        await AsyncStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(`Failed to save "${key}" to storage:`, error);
      }
    },
    [key]
  );

  return [value, saveValue, loading];
};

// Алиас для удобства
export const useLocalStorage = usePersistedState;