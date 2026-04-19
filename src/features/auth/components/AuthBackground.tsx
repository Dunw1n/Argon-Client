// src/features/auth/components/AuthBackground.tsx
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const AuthBackground = ({ children }: { children: ReactNode }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.gradient}>
            {/* Декоративные элементы */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />
            <View style={styles.circle4} />
            <View style={styles.circle5} />
            
            {/* Точки для текстуры */}
            <View style={styles.dotsPattern}>
                {[...Array(50)].map((_, i) => (
                    <View key={i} style={styles.dot} />
                ))}
            </View>
            
            <View style={[styles.safeContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                    {children}
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#f5f0ff', // fallback
    },
    circle1: {
        position: 'absolute',
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: '#c4b5fd',
        top: -120,
        right: -100,
        opacity: 0.4,
    },
    circle2: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#f0abfc',
        bottom: -80,
        left: -80,
        opacity: 0.3,
    },
    circle3: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#a78bfa',
        bottom: '25%',
        right: -60,
        opacity: 0.25,
    },
    circle4: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e9d5ff',
        top: '40%',
        left: -50,
        opacity: 0.35,
    },
    circle5: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd6fe',
        bottom: '15%',
        right: '20%',
        opacity: 0.4,
    },
    dotsPattern: {
        position: 'absolute',
        flexDirection: 'row',
        flexWrap: 'wrap',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    dot: {
        width: 2,
        height: 2,
        borderRadius: 1,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        margin: 12,
    },
    safeContainer: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
});