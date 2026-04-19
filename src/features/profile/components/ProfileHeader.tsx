// src/features/profile/components/ProfileHeader.tsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks';
import { useUserStatus } from '@/src/features/chat/hooks';
import { formatLastSeen, getMediaUrl } from '@/src/shared/utils';

interface ProfileHeaderProps {
  name: string;
  userId?: string;
  avatar?: string | null;
  onAvatarPress?: () => void;
  lastSeen?: string;
}

export const ProfileHeader = ({ 
  name, 
  userId,
  avatar, 
  lastSeen: lastSeenProp,
  onAvatarPress
}: ProfileHeaderProps) => {
  const { getImageUrl } = useProfile();
  const { status } = useUserStatus(userId);
  
  const avatarLetter = name.charAt(0).toUpperCase();
  
  const isOnline = status.isOnline;
  const lastSeenText = !isOnline ? status.text : null;

  return (
    <LinearGradient
      colors={['#8b5cf6', '#a78bfa', '#c4b5fd']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <View style={styles.profileBlock}>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={onAvatarPress}
          activeOpacity={0.8}
        >
          {avatar ? (
            <Image 
              source={{ uri: getMediaUrl(avatar) }} 
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
          )}
          <View style={styles.editIconContainer}>
            <LinearGradient
              colors={['#fff', '#f0f0f0']}
              style={styles.editIconGradient}
            >
              <Ionicons name="pencil" size={14} color="#8b5cf6" />
            </LinearGradient>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.name}>{name}</Text>
        
        <View style={styles.statusContainer}>
          {isOnline ? (
            <>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Онлайн</Text>
            </>
          ) : (
            <Text style={styles.offlineText}>{lastSeenText || formatLastSeen(lastSeenProp)}</Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    paddingTop: 40,
    paddingBottom: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  profileBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
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
    color: '#8b5cf6',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  editIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4cd964',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});