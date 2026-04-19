// app/(app)/user-profile.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { Image } from "expo-image";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useChatStore } from '@/src/infrastructure/store';
import { useUserStatus } from '@/src/features/chat/hooks';
import { getMediaUrl } from '@/src/shared/utils';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { users, chats } = useChatStore();
  
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const { status, isOnline } = useUserStatus(id as string);
  
  const user = useMemo(() => {
    const fromCache = users.get(id as string);
    if (fromCache) return fromCache;
    
    for (const chat of chats) {
      const participant = chat.participants?.find(p => p.id === id);
      if (participant) return participant;
    }
    
    return null;
  }, [id, users, chats]);
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Присоединяйся к чату с ${user?.name} в Argon Messenger!`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleBlock = () => {
    Alert.alert(
      isBlocked ? 'Разблокировать пользователя' : 'Заблокировать пользователя',
      isBlocked 
        ? 'Вы уверены, что хотите разблокировать этого пользователя?'
        : 'Пользователь не сможет отправлять вам сообщения',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: isBlocked ? 'Разблокировать' : 'Заблокировать', 
          style: isBlocked ? 'default' : 'destructive',
          onPress: () => setIsBlocked(!isBlocked)
        },
      ]
    );
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSendMessage = () => {
    const existingChat = chats.find(chat => 
      chat.participants?.some(p => p.id === id)
    );
    
    if (existingChat) {
      router.push(`/chat/${existingChat.id}`);
    } else {
      router.push(`/chat/new?userId=${id}`);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Пользователь не найден</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
              <Ionicons name="share-outline" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMute} style={styles.headerAction}>
              <Ionicons 
                name={isMuted ? "notifications-off" : "notifications-outline"} 
                size={22} 
                color={isMuted ? "#ff6b6b" : "#666"} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBlock} style={styles.headerAction}>
              <Ionicons 
                name={isBlocked ? "ban" : "ban-outline"} 
                size={22} 
                color={isBlocked ? "#ff6b6b" : "#666"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: getMediaUrl(user.avatar) }} style={styles.avatarImage} />
            ) : (
              <LinearGradient
                colors={['#8b5cf6', '#6421FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {user.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </LinearGradient>
            )}
            {isOnline && <View style={styles.onlineBadge} />}
          </View>
          
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username || `@${user.email?.split('@')[0]}`}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton} onPress={handleSendMessage}>
            <LinearGradient
              colors={['#8b5cf6', '#6421FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.messageButtonGradient}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#fff" />
              <Text style={styles.messageButtonText}>Написать сообщение</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="time-outline" size={22} color="#8b5cf6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Был(а) в сети</Text>
              <Text style={styles.infoValue}>{status.text}</Text>
            </View>
          </View>

          {user.phone && (
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={22} color="#8b5cf6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Телефон</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          )}

          {user.email && (
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail-outline" size={22} color="#8b5cf6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
          )}
        </View>

        {user.bio && (
          <View style={styles.bioSection}>
            <View style={styles.bioHeader}>
              <LinearGradient
                colors={['#8b5cf6', '#6421FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bioIcon}
              >
                <Ionicons name="person-outline" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.bioTitle}>О себе</Text>
            </View>
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '600',
    color: '#fff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4cd964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  messageButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  messageButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  bioIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bioCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
});