// src/features/chat/components/MessageBubble.tsx
import { memo, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useAuthStore } from '@/src/infrastructure/store';
import { formatMessageTime } from '@/src/shared/utils';
import { StatusIcon } from './StatusIcon';
import type { Message } from '@/src/core/entities';

const { width: screenWidth } = Dimensions.get('window');
const MAX_WIDTH = screenWidth * 0.75;
const MIN_WIDTH = 50;

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const userId = useAuthStore(state => state.user?.id);
  
  const isOwn = useMemo(() => message.sender_id === userId, [message.sender_id, userId]);
  const isPending = useMemo(() => message.isPending === true, [message.isPending]);
  
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 35,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim]);

  const formattedTime = useMemo(() => {
    const date = new Date(message.created_at);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [message.created_at]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        isOwn && styles.ownContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwn ? styles.ownBubble : styles.otherBubble,
          isPending && styles.pendingBubble,
        ]}
      >
        <Text style={[styles.text, isOwn && styles.ownText]}>
          {message.text}
        </Text>
        
        <View style={[styles.bottomRow, isOwn && styles.bottomRowOwn]}>
          {!isOwn && (
            <Text style={[styles.time, styles.otherTime]}>
              {formattedTime}
            </Text>
          )}
          
          <View style={styles.rightGroup}>
            {isOwn && (
              <Text style={[styles.time, styles.ownTime]}>
                {formattedTime}
              </Text>
            )}
            
            {isOwn && (
              <View style={styles.statusContainer}>
                <StatusIcon status={message.status} isPending={isPending} />
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id &&
         prevProps.message.text === nextProps.message.text &&
         prevProps.message.status === nextProps.message.status &&
         prevProps.message.isPending === nextProps.message.isPending &&
         prevProps.message.created_at === nextProps.message.created_at;
});

MessageBubble.displayName = 'MessageBubble';

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: MAX_WIDTH,
    minWidth: MIN_WIDTH,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ownBubble: {
    backgroundColor: '#8b5cf6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f1f3f5',
    borderBottomLeftRadius: 4,
  },
  pendingBubble: {
    backgroundColor: '#a78bfa',
    opacity: 0.9,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    color: '#1a1a1a',
    flexShrink: 1,
  },
  ownText: {
    color: '#ffffff',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Меняем на space-between
  },
  bottomRowOwn: {
    justifyContent: 'flex-end', // Для своих сообщений время справа
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  otherTime: {
    color: '#8e8e93',
  },
  statusContainer: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});