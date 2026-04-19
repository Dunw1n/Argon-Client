// src/features/auth/components/AuthInput.tsx
import { StyleSheet, TextInput, View, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState, useRef } from "react";

interface AuthInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    icon: keyof typeof Ionicons.glyphMap;
}

export const AuthInput = ({ 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false, 
    keyboardType = 'default',
    icon 
}: AuthInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 255, 255, 0.6)', '#8b5cf6'],
    });

    return (
        <Animated.View style={[
            styles.blurContainer,
            { borderColor }
        ]}>
            <BlurView intensity={30} tint="light" style={styles.blurInner}>
                <View style={styles.inputContainer}>
                    <Ionicons 
                        name={icon} 
                        size={20} 
                        color={isFocused ? '#8b5cf6' : '#a1a1aa'} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor="#a1a1aa"
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        autoCapitalize="none"
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                    />
                </View>
            </BlurView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    blurContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
    },
    blurInner: {
        overflow: 'hidden',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#18181b',
        padding: 0,
    },
});