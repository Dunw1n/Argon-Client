// src/features/profile/components/BioSection.tsx
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

interface BioSectionProps {
  bio?: string;
  onBioChange?: (bio: string) => void;
  onBlur?: () => void;
}

export const BioSection = ({ bio = '', onBioChange, onBlur }: BioSectionProps) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(bio.length);
  }, [bio]);

  const handleChange = (text: string) => {
    if (text.length <= 90) {
      onBioChange?.(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Здесь вы можете рассказать немного о себе</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, charCount > 90 && styles.inputError]}
          value={bio}
          onChangeText={handleChange}
          onBlur={onBlur}
          placeholder="Заполните по желанию"
          placeholderTextColor="#ccc"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <Text style={[styles.counter, charCount > 90 && styles.counterError]}>
          {charCount}/90 символов
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B29D0',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingBottom: 6,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  counter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  counterError: {
    color: '#ef4444',
  },
});