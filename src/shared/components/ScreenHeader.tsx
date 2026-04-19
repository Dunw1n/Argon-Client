// src/shared/components/ScreenHeader.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: {
    name: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export const ScreenHeader = ({ title, showBack = true, rightIcon }: ScreenHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.leftButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftButton} />
        )}
        
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        {rightIcon ? (
          <TouchableOpacity onPress={rightIcon.onPress} style={styles.rightButton} activeOpacity={0.7}>
            <Ionicons name={rightIcon.name} size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  leftButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
});