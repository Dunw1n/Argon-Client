// app/(app)/profile.tsx
import { Text, ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader, ActionButtons, InfoSection, DetailInfo, BioSection } from '@/src/features/profile/components';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar, Loading } from '@/src/shared/components';
import { useProfile } from '@/src/features/profile/hooks';

export default function ProfileScreen() {
  const {
    user,
    phone,
    username,
    birthday,
    firstName,
    lastName,
    bio,
    isLoading,
    handlePhoneChange,
    handleUsernameChange,
    handleAvatarPress,
    handleBirthdayChange,
    setFirstName,
    setLastName,
    setBio,
    handleBlur,
    handleLogout,
    handleSettingsPress,
  } = useProfile();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileHeader 
            name={user?.name || 'Mister'} 
            avatar={user?.avatar}
            userId={user?.id} 
            onAvatarPress={handleAvatarPress}
          />
          
          <ActionButtons onSettingsPress={handleSettingsPress} />
          
          <InfoSection
            phone={phone}
            username={username}
            birthday={birthday}
            onPhoneChange={handlePhoneChange}
            onUsernameChange={handleUsernameChange}
            onBirthdayChange={handleBirthdayChange} 
            onBlur={handleBlur}
          />
          
          <DetailInfo 
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onBlur={handleBlur}
          />
          
          <BioSection 
            bio={bio}
            onBioChange={setBio}
            onBlur={handleBlur}
          />
          
          <TouchableOpacity style={styles.privacyLink} activeOpacity={0.7}>
            <Text style={styles.privacyText}>
              Здесь вы можете заполнить информацию о себе. Также, в{' '}
              <Text style={styles.privacyLinkText}>настройках конфиденциальности</Text>
              , вы можете выбрать, кто может ее видеть
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Выйти с аккаунта</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      <BottomTabBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titlePageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 15,
  },
  titlePage: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  subtitlePage: {
    textAlign: 'center',
    color: '#6421FF',
    fontWeight: '400',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  privacyLink: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  privacyText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 18,
    textAlign: 'left',
  },
  privacyLinkText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#ffffff00',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
  },
});