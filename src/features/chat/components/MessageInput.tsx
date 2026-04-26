import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useState, useCallback, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface MessageInputProps {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, onTyping, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleChangeText = useCallback((text: string) => {
    setMessage(text);
    
    if (text.length > 0) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => onTyping(false), 1000);
    } else {
      onTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  }, [onTyping]);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTyping(false);
    onSend(trimmedMessage);
    setMessage('');
  }, [message, onSend, onTyping, disabled]);

  const isSendDisabled = !message.trim() || disabled;

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
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
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    paddingTop: 20, 
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
    minHeight: 50,
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
});