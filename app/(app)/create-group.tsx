// app/(app)/create-group.tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateGroup = () => {
    console.log('Create group:', { groupName, groupDescription, members });
  };

  const handleAddMember = () => {
    console.log('Add member');
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Кнопка назад */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* Шапка */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#2B2EFF', '#2181FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name="people-outline" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>Новая группа</Text>
            <Text style={styles.subtitle}>
              Создайте группу для общения с друзьями, коллегами или по интересам
            </Text>
          </View>

          {/* Информационные карточки */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <LinearGradient
                colors={['#2B2EFF', '#2181FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoCardIcon}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Название группы</Text>
                <Text style={styles.infoCardText}>Придумайте уникальное название для вашей группы</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <LinearGradient
                colors={['#2B2EFF', '#2181FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoCardIcon}
              >
                <Ionicons name="people-outline" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Добавьте участников</Text>
                <Text style={styles.infoCardText}>Пригласите друзей, чтобы начать общение</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <LinearGradient
                colors={['#2B2EFF', '#2181FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoCardIcon}
              >
                <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Общайтесь вместе</Text>
                <Text style={styles.infoCardText}>Делитесь сообщениями, фото и файлами в группе</Text>
              </View>
            </View>
          </View>

          {/* Форма создания группы */}
          <View style={styles.form}>
            {/* Аватар группы */}
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#2B2EFF', '#2181FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="camera-outline" size={28} color="#fff" />
                </LinearGradient>
                <View style={styles.avatarEditIcon}>
                  <Ionicons name="add-circle" size={24} color="#2B2EFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarHint}>Добавить фото группы</Text>
            </View>

            {/* Название группы */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Название группы</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="people-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Например: Друзья, Работа, Хобби"
                  placeholderTextColor="#999"
                  value={groupName}
                  onChangeText={setGroupName}
                />
              </View>
              <Text style={styles.inputHint}>
                Название поможет участникам понять, о чём группа
              </Text>
            </View>

            {/* Описание группы */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Описание (необязательно)</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Расскажите, для чего эта группа..."
                  placeholderTextColor="#999"
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Добавление участников - обновленный блок */}
            <View style={styles.membersSection}>
              <View style={styles.membersHeader}>
                <Text style={styles.sectionTitle}>Участники</Text>
                <Text style={styles.membersCount}>{members.length}/500</Text>
              </View>

              {/* Горизонтальный список участников */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.membersList}
                contentContainerStyle={styles.membersListContent}
              >
                {/* Кнопка добавления */}
                <TouchableOpacity style={styles.addMemberCard} onPress={handleAddMember} activeOpacity={0.7}>
                  <LinearGradient
                    colors={['#2B2EFF', '#2181FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.addMemberIcon}
                  >
                    <Ionicons name="add" size={28} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.addMemberText}>Добавить</Text>
                </TouchableOpacity>

                {/* Список добавленных участников */}
                {members.map((member) => (
                  <View key={member.id} style={styles.memberCard}>
                    <View style={styles.memberAvatar}>
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} style={styles.memberAvatarImage} />
                      ) : (
                        <Text style={styles.memberAvatarText}>
                          {member.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.memberName} numberOfLines={1}>
                      {member.name.split(' ')[0]}
                    </Text>
                    <TouchableOpacity 
                      style={styles.removeMemberBtn}
                      onPress={() => handleRemoveMember(member.id)}
                    >
                      <Ionicons name="close-circle" size={18} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              {/* Поле поиска друзей */}
              <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                  <Ionicons name="search-outline" size={20} color="#999" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Поиск друзей по имени или email..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              <Text style={styles.membersHint}>
                Пригласите друзей, чтобы начать общение в группе
              </Text>
            </View>

            {/* Кнопка создания */}
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateGroup}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2B2EFF', '#2181FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="checkmark-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Создать группу</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Дополнительная информация */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              В группе могут общаться до 500 участников. Вы сможете управлять настройками группы в любой момент
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2B2EFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCards: {
    gap: 12,
    marginBottom: 32,
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
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  infoCardText: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  form: {
    gap: 24,
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#2B2EFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  avatarHint: {
    fontSize: 12,
    color: '#999',
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 14,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  membersSection: {
    gap: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  membersCount: {
    fontSize: 12,
    color: '#2B2EFF',
    fontWeight: '500',
  },
  membersList: {
    flexGrow: 0,
  },
  membersListContent: {
    gap: 12,
    paddingVertical: 4,
  },
  addMemberCard: {
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  addMemberIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2B2EFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addMemberText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  memberCard: {
    alignItems: 'center',
    gap: 6,
    width: 70,
    position: 'relative',
  },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  memberAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  memberName: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
    maxWidth: 70,
  },
  removeMemberBtn: {
    position: 'absolute',
    top: -4,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  searchContainer: {
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  membersHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  createButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#2B2EFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});