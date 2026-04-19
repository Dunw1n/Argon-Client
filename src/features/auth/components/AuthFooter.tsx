// src/features/auth/components/AuthFooter.tsx
import { StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { useRef } from "react";

interface AuthFooterProps {
    onPress: () => void;
    linkText: string;
    linkHighlight: string;
}

export const AuthFooter = ({ onPress, linkText, linkHighlight }: AuthFooterProps) => {
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity 
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.Text style={[styles.linkText, { opacity: opacityAnim }]}>
                {linkText}{' '}
                <Text style={styles.linkHighlight}>{linkHighlight}</Text>
            </Animated.Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    linkText: {
        color: '#52525b',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    },
    linkHighlight: {
        color: '#8b5cf6',
        fontWeight: '600',
    },
});