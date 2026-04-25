// src/shared/components/BottomTabBar.tsx
import { memo, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionModal } from './ActionModal';
import GradientWhiteToTransparent from './GradientWhiteToTransparent';

interface TabItem {
  name: string;
  icon: string;
  route: string;
  isSpecial?: boolean;
}

export const BottomTabBar = memo(() => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  
  const tabs: TabItem[] = [
    { name: 'chats', icon: 'chatbubble-outline', route: '/(app)' },
    { name: 'add', icon: 'add', route: '/add-user', isSpecial: true },
    { name: 'profile', icon: 'person-outline', route: '/profile' },
  ];

  const isActive = (route: string): boolean => {
    if (route === '/(app)') {
      return pathname === '/' || pathname === '/(app)' || pathname === '/index';
    }
    return pathname === route;
  };

  const handlePress = (route: string, isSpecial?: boolean) => {
    if (isSpecial) {
      setModalVisible(true);
    } else if (route === '/(app)') {
      router.push('/');
    } else {
      router.push(route as any);
    }
  };

  const handleNewChat = () => {
    router.push('/add-by-username');
  };



  return (
    <>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.content}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tab, tab.isSpecial && styles.specialTab]}
              onPress={() => handlePress(tab.route, tab.isSpecial)}
              activeOpacity={0.7}
            >
              <View style={tab.isSpecial ? styles.specialButton : undefined}>
                <Ionicons
                  name={tab.icon as any}
                  size={tab.isSpecial ? 32 : 30}
                  color={tab.isSpecial ? '#fff' : (isActive(tab.route) ? '#8b5cf6' : '#999')}
                />
                {tab.isSpecial && (
                  <Text style={styles.specialLabel}>Добавить</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>


      </View>

      <GradientWhiteToTransparent startOpacity={0} endOpacity={1} height={insets.bottom + 40} style={{ bottom: 0, left: 0, right: 0 }} />

      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNewChat={handleNewChat}
      />
    </>
  );
});

BottomTabBar.displayName = 'BottomTabBar';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 5,
    right: 0,
    paddingHorizontal: 15,
    zIndex: 12
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ecececff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  specialTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0, 
    minWidth: 120,
    maxWidth: 150, 
  },
  specialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#212121',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  specialLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});