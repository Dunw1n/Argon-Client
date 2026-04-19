// src/features/profile/components/InfoSection.tsx
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoSectionProps {
  phone?: string;
  username?: string;
  birthday?: string;
  onPhoneChange?: (phone: string) => void;
  onUsernameChange?: (username: string) => void;
  onBirthdayChange?: (birthday: string) => void;
  onBlur?: () => void;
}

export const InfoSection = ({ 
  phone = '', 
  username = '', 
  birthday = '',
  onPhoneChange,
  onUsernameChange,
  onBirthdayChange,
  onBlur
}: InfoSectionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Информация о вас</Text>
      
      {/* Номер телефона */}
      <View style={styles.infoItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="call-outline" size={22} color="#8b5cf6" />
        </View>
        <View style={styles.infoContent}>
          <TextInput
            style={styles.infoValue}
            value={phone}
            onChangeText={onPhoneChange}
            onBlur={onBlur}
            placeholder="+7 (___) ___-__-__"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            maxLength={18}
          />
          <Text style={styles.infoSubtitle}>
            Запишите свой актуальный номер телефона
          </Text>
        </View>
      </View>
      
      {/* Уникальное имя */}
      <View style={styles.infoItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="at-outline" size={22} color="#8b5cf6" />
        </View>
        <View style={styles.infoContent}>
          <TextInput
            style={styles.infoValue}
            value={username}
            onChangeText={onUsernameChange}
            onBlur={onBlur}
            placeholder="@username"
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.infoSubtitle}>
            Ваше уникальное имя в приложении
          </Text>
        </View>
      </View>
      
      {/* День рождения */}
      <View style={styles.infoItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={22} color="#8b5cf6" />
        </View>
        <View style={styles.infoContent}>
          <TextInput
            style={styles.infoValue}
            value={birthday}
            onChangeText={onBirthdayChange}
            onBlur={onBlur}
            placeholder="ДД.ММ.ГГГГ"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={styles.infoSubtitle}>
            Эта информация будет видна только вам
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 6,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 25
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B29D0',
    paddingTop: 10,
    paddingBottom: 4,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center'
  },
  iconContainer: {
    width: 32,
    marginRight: 12,
    paddingTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
    padding: 0,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#999',
    lineHeight: 12,
  },
});