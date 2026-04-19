// src/features/chat/components/ChatHeader.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/src/infrastructure/store';

interface ChatHeaderProps {
  onSortPress?: () => void;
}

export const ChatHeader = ({ onSortPress }: ChatHeaderProps) => {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#fef3f8', '#f0e9ff', '#e8f4ff']}
      style={[styles.container, { paddingTop: insets.top + 10 }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Декоративные круги */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <View style={styles.content}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>
            Привет, <Text style={styles.userName}>{user?.name || 'Пользователь'}</Text>
          </Text>
          
          {/* Кнопки в стиле чата */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => router.push('/add-user')} activeOpacity={0.7} style={styles.iconBtn}>
              <BlurView intensity={80} tint="light" style={styles.iconBlur}>
                <Ionicons name="person-add-outline" size={18} color="#686868" />
              </BlurView>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7} style={styles.iconBtn}>
              <BlurView intensity={80} tint="light" style={styles.iconBlur}>
                <Ionicons name="settings-outline" size={18} color="#686868" />
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.chatsHeader}>
          <View style={styles.titleWrapper}>
            <Text style={styles.chatsTitle}>Мои чаты</Text>
          </View>
          <TouchableOpacity onPress={onSortPress} activeOpacity={0.7} style={styles.sortBtn}>
            <BlurView intensity={80} tint="light" style={styles.sortBlur}>
              <Ionicons name="options-outline" size={18} color="#6421FF" />
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 92, 246, 0)',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#c4b5fd',
    top: -80,
    right: -60,
    opacity: 0.3,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0abfc',
    bottom: -50,
    left: -50,
    opacity: 0.2,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#a78bfa',
    top: '30%',
    right: '10%',
    opacity: 0.15,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#18181b',
  },
  userName: {
    fontWeight: '700',
    color: '#8b5cf6',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBlur: {
    width: 46,
    height: 46,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffffb7',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    marginBottom: 14,
  },
  chatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#18181b',
  },
  sortBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sortBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
});