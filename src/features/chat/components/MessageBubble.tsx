// src/features/chat/components/MessageBubble.tsx
import { memo, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useAuthStore } from '@/src/infrastructure/store';
import { formatMessageTime } from '@/src/shared/utils';
import { StatusIcon } from './StatusIcon';
import type { Message } from '@/src/core/entities';

const { width: screenWidth } = Dimensions.get('window');
const MAX_WIDTH = screenWidth * 0.70;
const MIN_WIDTH = 50;

interface MessageBubbleProps {
  message: Message;
  index?: number;
}

export const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const userId = useAuthStore(state => state.user?.id);
  
  const isOwn = useMemo(() => message.sender_id === userId, [message.sender_id, userId]);
  const isPending = useMemo(() => message.isPending === true, [message.isPending]);
  
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  const formattedTime = useMemo(() => {
    const date = message.created_at;
    return formatMessageTime(date);
  }, [message.created_at]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        
        <View style={[styles.bottomRow, isOwn && styles.ownBottomRow]}>
          <Text style={[styles.time, isOwn && styles.ownTime]}>
            {formattedTime}
          </Text>
          
          <View style={styles.statusContainer}>
            {isOwn && <StatusIcon status={message.status} isPending={isPending} />}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id &&
         prevProps.message.text === nextProps.message.text &&
         prevProps.message.isPending === nextProps.message.isPending &&
         prevProps.message.status === nextProps.message.status &&
         prevProps.message.created_at === nextProps.message.created_at
});

MessageBubble.displayName = 'MessageBubble';

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: MAX_WIDTH,
    minWidth: MIN_WIDTH,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0.5,
  },
  ownBubble: {
    backgroundColor: '#8b5cf6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  pendingBubble: {
    backgroundColor: '#c4b5fd',
    opacity: 0.85,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  ownText: {
    color: '#fff',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2,
    gap: 4,
  },
  ownBottomRow: {
    justifyContent: 'flex-end',
  },
  time: {
    fontSize: 10,
    color: '#999',
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusContainer: {
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});