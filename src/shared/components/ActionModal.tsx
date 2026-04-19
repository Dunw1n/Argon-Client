// src/shared/components/ActionModal.tsx
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo } from 'react';
import { router } from 'expo-router';

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColors: string[];
  onPress: () => void;
}

export const ActionModal = ({ visible, onClose }: ActionModalProps) => {
  const insets = useSafeAreaInsets();

  const actions: ActionItem[] = useMemo(() => [
    {
      id: 'chat',
      title: 'Новый чат',
      subtitle: 'Найдите собеседника по уникальному имени',
      icon: 'chatbubble-outline',
      iconColors: ['#AA2BFF', '#6421FF'],
      onPress: () => router.push('/add-by-username'),
    },
    {
      id: 'group',
      title: 'Новая группа',
      subtitle: 'Создайте группу, и общайтесь с людьми',
      icon: 'people-outline',
      iconColors: ['#2B2EFF', '#2181FF'],
      onPress: () => router.push('/create-group'),
    },
    {
      id: 'channel',
      title: 'Новый канал',
      subtitle: 'Присоединяйтесь к популярным каналам',
      icon: 'megaphone-outline',
      iconColors: ['#FF2BB8', '#C61EE0'],
      onPress: () => router.push('/channels'),
    },
  ], []);

  const handleItemPress = useCallback((item: ActionItem) => {
    item.onPress();
    onClose();
  }, [onClose]);

  const modalStyle = useMemo(() => [
    styles.modalContainer,
    { marginBottom: insets.bottom + 10 }
  ], [insets.bottom]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={modalStyle}>
                {actions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.actionItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={item.iconColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.iconGradient}
                    >
                      <Ionicons name={item.icon} size={22} color="#fff" />
                    </LinearGradient>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.subtitle}>{item.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
                  </TouchableOpacity>
                ))}

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  iconGradient: {
    width: 43,
    height: 43,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  closeButton: {
    backgroundColor: '#212121',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});