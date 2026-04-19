// src/features/profile/components/ActionButtons.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
  onSettingsPress?: () => void;
  onColorPress?: () => void;
}

export const ActionButtons = ({ onSettingsPress, onColorPress }: ActionButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onSettingsPress}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={20} color="#878787" />
        <Text style={styles.buttonText}>Настройки</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={onColorPress}
        activeOpacity={0.7}
      >
        <Ionicons name="color-palette-outline" size={20} color="#878787" />
        <Text style={styles.buttonText}>Изменить цвет</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#878787',
  },
});