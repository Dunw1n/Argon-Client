import { memo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useAuthStore } from '@/src/infrastructure/store';
import { StatusIcon } from './StatusIcon';
import type { Message } from '@/src/core/entities';

const { width: screenWidth } = Dimensions.get('window');
const MAX_WIDTH = screenWidth * 0.75;

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const userId = useAuthStore(state => state.user?.id);
  const isOwn = message.sender_id === userId;
  const isPending = message.isPending === true;
  
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View style={[
        styles.bubble,
        isOwn ? styles.ownBubble : styles.otherBubble,
        isPending && styles.pendingBubble,
      ]}>
        <Text style={[styles.text, isOwn && styles.ownText]}>
          {message.text}
        </Text>
        
        <View style={[styles.bottomRow, isOwn && styles.bottomRowOwn]}>
          {!isOwn && <Text style={styles.otherTime}>{formattedTime}</Text>}
          
          {isOwn && (
            <>
              <Text style={styles.ownTime}>{formattedTime}</Text>
              <StatusIcon status={message.status} isPending={isPending} />
            </>
          )}
        </View>
      </View>
    </View>
  );
});

MessageBubble.displayName = 'MessageBubble';

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: MAX_WIDTH,
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

    alignSelf: 'flex-start',
  },
  pendingBubble: {
    backgroundColor: '#a78bfa',
    opacity: 0.9,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    color: '#1a1a1a',
  },
  ownText: {
    color: '#ffffff',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bottomRowOwn: {
    justifyContent: 'flex-end',
  },
  time: {
    fontSize: 10,
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.75)',
    marginRight: 4,
    fontSize: 10,
  },
  otherTime: {
    color: '#8e8e93',
    fontSize: 10,
  },
});

export default MessageBubble;