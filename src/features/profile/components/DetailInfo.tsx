// src/features/profile/components/DetailInfo.tsx
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface DetailInfoProps {
  firstName?: string;
  lastName?: string;
  onFirstNameChange?: (firstName: string) => void;
  onLastNameChange?: (lastName: string) => void;
  onBlur?: () => void;
}

export const DetailInfo = ({ 
  firstName = '', 
  lastName = '', 
  onFirstNameChange,
  onLastNameChange,
  onBlur
}: DetailInfoProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детальная информация</Text>
    
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={onFirstNameChange}
        onBlur={onBlur}
        placeholder="Укажите свое имя"
        placeholderTextColor="#ccc"
      />

      <View style={styles.lineField} />

      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={onLastNameChange}
        onBlur={onBlur}
        placeholder="Укажите свою фамилию (необязательно)"
        placeholderTextColor="#ccc"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginTop: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B29D0',
    marginBottom: 16,
  },
  lineField: {
    width: "100%",
    height: 1,
    backgroundColor: "#ececec", 
    marginVertical: 5
  },
  input: {
    borderRadius: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#ffffff',
  },
});