// src/features/chat/components/MessageInput.tsx
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useState, useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTyping } from '../hooks';
import { useDebounce } from '@/src/shared/hooks';

interface MessageInputProps {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, onTyping, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(36);
  const [isSending, setIsSending] = useState(false);
  const { handleTyping, stopTyping } = useTyping(onTyping);
  
  const sendButtonScale = useRef(new Animated.Value(1)).current;
  const inputOpacity = useRef(new Animated.Value(1)).current;
  
  const debouncedSend = useDebounce((text: string) => {
    onSend(text);
    setIsSending(false);
    Animated.parallel([
      Animated.spring(sendButtonScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, 300);

  const handleChangeText = useCallback((text: string) => {
    setMessage(text);
    handleTyping(text);
  }, [handleTyping]);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0 || isSending) return;
    
    setIsSending(true);
    
    Animated.parallel([
      Animated.spring(sendButtonScale, {
        toValue: 0.8,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(inputOpacity, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    debouncedSend(trimmedMessage);
    setMessage('');
    setInputHeight(36);
    stopTyping();
  }, [message, debouncedSend, stopTyping, isSending]);

  const handleContentSizeChange = (event: any) => {
    const newHeight = event.nativeEvent.contentSize.height;
    const maxHeight = 100;
    const minHeight = 36;
    
    if (newHeight < minHeight) {
      setInputHeight(minHeight);
    } else if (newHeight > maxHeight) {
      setInputHeight(maxHeight);
    } else {
      setInputHeight(newHeight);
    }
  };

  const isSendDisabled = !message.trim() || disabled || isSending;

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="light" style={styles.inputBlur}>
        <View style={styles.inputContainer}>
          <Animated.View style={{ flex: 1, opacity: inputOpacity }}>
            <TextInput
              style={[styles.input, { height: inputHeight }]}
              placeholder="Сообщение..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={handleChangeText}
              multiline
              editable={!disabled && !isSending}
              maxLength={1000}
              onContentSizeChange={handleContentSizeChange}
              scrollEnabled={inputHeight >= 100}
              textAlignVertical="center"
            />
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
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
          </Animated.View>
        </View>
      </BlurView>
      
      <BlurView intensity={60} tint="light" style={styles.micBlur}>
        <TouchableOpacity 
          style={styles.micButton}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <Ionicons name="mic-outline" size={22} color="#4c1d95" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  inputBlur: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    height: 48,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  micBlur: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  micButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});