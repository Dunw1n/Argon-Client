// app/(app)/channels.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Channel {
  id: string;
  name: string;
  description: string;
  subscribers: number;
  avatar: string;
  isSubscribed: boolean;
  category: string;
}

export default function ChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все', icon: 'apps-outline' },
    { id: 'entertainment', name: 'Развлечения', icon: 'tv-outline' },
    { id: 'education', name: 'Образование', icon: 'school-outline' },
    { id: 'news', name: 'Новости', icon: 'newspaper-outline' },
    { id: 'gaming', name: 'Игры', icon: 'game-controller-outline' },
    { id: 'music', name: 'Музыка', icon: 'musical-notes-outline' },
  ];

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'Argon Official',
      description: 'Официальный канал Argon Messenger. Новости, обновления, анонсы.',
      subscribers: 15420,
      avatar: 'A',
      isSubscribed: false,
      category: 'news',
    },
    {
      id: '2',
      name: 'Tech News',
      description: 'Свежие новости из мира технологий, гаджетов и IT',
      subscribers: 8920,
      avatar: 'T',
      isSubscribed: true,
      category: 'news',
    },
    {
      id: '3',
      name: 'Music Vibes',
      description: 'Ежедневные подборки лучшей музыки и новые релизы',
      subscribers: 12340,
      avatar: 'M',
      isSubscribed: false,
      category: 'music',
    },
    {
      id: '4',
      name: 'Gaming Hub',
      description: 'Обзоры игр, стримы, новости игровой индустрии',
      subscribers: 6700,
      avatar: 'G',
      isSubscribed: false,
      category: 'gaming',
    },
    {
      id: '5',
      name: 'Learn English',
      description: 'Бесплатные уроки английского языка каждый день',
      subscribers: 4530,
      avatar: 'E',
      isSubscribed: true,
      category: 'education',
    },
    {
      id: '6',
      name: 'Cinema World',
      description: 'Новости кино, трейлеры, рецензии на фильмы',
      subscribers: 8920,
      avatar: 'C',
      isSubscribed: false,
      category: 'entertainment',
    },
  ]);

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          channel.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, isSubscribed: !channel.isSubscribed }
        : channel
    ));
  };

  const formatSubscribers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Кнопка назад */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Шапка */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#FF2BB8', '#C61EE0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Ionicons name="megaphone-outline" size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.title}>Каналы</Text>
          <Text style={styles.subtitle}>
            Подпишитесь на интересные каналы и получайте актуальную информацию
          </Text>
        </View>

        {/* Поиск */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск каналов..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Категории */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={18} 
                color={selectedCategory === category.id ? '#FF2BB8' : '#666'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Список каналов */}
        <View style={styles.channelsList}>
          {filteredChannels.map((channel) => (
            <View key={channel.id} style={styles.channelCard}>
              <LinearGradient
                colors={['#FF2BB8', '#C61EE0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.channelAvatar}
              >
                <Text style={styles.channelAvatarText}>{channel.avatar}</Text>
              </LinearGradient>
              
              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelDescription} numberOfLines={2}>
                  {channel.description}
                </Text>
                <View style={styles.channelStats}>
                  <Ionicons name="people-outline" size={14} color="#999" />
                  <Text style={styles.channelSubscribers}>
                    {formatSubscribers(channel.subscribers)} подписчиков
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.subscribeButton,
                  channel.isSubscribed && styles.subscribedButton
                ]}
                onPress={() => handleSubscribe(channel.id)}
              >
                <Text style={[
                  styles.subscribeButtonText,
                  channel.isSubscribed && styles.subscribedButtonText
                ]}>
                  {channel.isSubscribed ? 'Отписаться' : 'Подписаться'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Создать свой канал */}
        <View style={styles.createChannelSection}>
          <Text style={styles.createChannelTitle}>Создайте свой канал</Text>
          <Text style={styles.createChannelSubtitle}>
            Делитесь своими мыслями, идеями и контентом с подписчиками
          </Text>
          <TouchableOpacity style={styles.createChannelButton}>
            <LinearGradient
              colors={['#FF2BB8', '#C61EE0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createChannelGradient}
            >
              <Ionicons name="add-outline" size={20} color="#fff" />
              <Text style={styles.createChannelButtonText}>Создать канал</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    shadowColor: '#FF2BB8',
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
  searchContainer: {
    marginBottom: 20,
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
  categoriesContainer: {
    gap: 10,
    paddingBottom: 8,
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryItemActive: {
    backgroundColor: 'rgba(255, 43, 184, 0.1)',
    borderColor: '#FF2BB8',
  },
  categoryText: {
    fontSize: 13,
    color: '#666',
  },
  categoryTextActive: {
    color: '#FF2BB8',
    fontWeight: '600',
  },
  channelsList: {
    gap: 12,
    marginBottom: 32,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  channelAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelAvatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  channelInfo: {
    flex: 1,
    gap: 4,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  channelDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  channelStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelSubscribers: {
    fontSize: 11,
    color: '#999',
  },
  subscribeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FF2BB8',
    borderWidth: 1,
    borderColor: '#FF2BB8',
  },
  subscribedButton: {
    backgroundColor: 'transparent',
    borderColor: '#FF2BB8',
  },
  subscribeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  subscribedButtonText: {
    color: '#FF2BB8',
  },
  createChannelSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  createChannelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  createChannelSubtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  createChannelButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#FF2BB8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createChannelGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createChannelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});