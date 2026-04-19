// src/features/auth/components/AuthButton.tsx
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, Text, Animated } from "react-native";
import { useRef } from "react";

interface AuthButtonProps {
    onPress: () => void;
    loading: boolean;
    children?: ReactNode;
    title?: string;
}

export const AuthButton = ({ onPress, loading, children, title }: AuthButtonProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
                style={styles.button}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={loading}
                activeOpacity={0.8}
            >
                <LinearGradient 
                    colors={['#8b5cf6', '#7c3aed']} 
                    style={styles.buttonGradient} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 0 }}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        children || <Text style={styles.buttonText}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});