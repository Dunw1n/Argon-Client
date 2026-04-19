// src/features/auth/components/AuthTextBlock.tsx
import { StyleSheet, Text, View } from "react-native";

interface AuthTextBlockProps {
    title: string;
    descr: string;
}

export const AuthTextBlock = ({ title, descr }: AuthTextBlockProps) => {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>A</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{descr}</Text>
            
            <Text style={styles.infoText}>
                Argon — безопасный мессенджер с end-to-end шифрованием.
                Ваши данные защищены, а общение остается приватным.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
    },
    logoText: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#18181b',
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#52525b',
        textAlign: 'center',
        marginBottom: 24,
    },
    infoText: {
        fontSize: 12,
        color: '#71717a',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 20,
    },
});