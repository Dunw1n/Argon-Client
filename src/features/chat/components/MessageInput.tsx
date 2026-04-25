import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useState, useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface MessageInputProps {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, onTyping, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<TextInput>(null);

  const handleChangeText = useCallback((text: string) => {
    setMessage(text);
    
    if (text.length > 0) {
      onTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    } else {
      onTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [onTyping]);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0 || disabled) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onTyping(false);
    onSend(trimmedMessage);
    setMessage('');
  }, [message, onSend, onTyping, disabled]);

  const isSendDisabled = !message.trim() || disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Сообщение..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={handleChangeText}
          multiline
          editable={!disabled}
          maxLength={1000}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, isSendDisabled && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={isSendDisabled}
          activeOpacity={0.7}
        >
          <Image 
            source={require('@/assets/images/components-chat/send-button.png')}
            style={styles.sendIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.micButton}
        onPress={() => {}}
        activeOpacity={0.7}
      >
        <Ionicons name="mic-outline" size={22} color="#4c1d95" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    zIndex: 11
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
    minHeight: 44,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
});