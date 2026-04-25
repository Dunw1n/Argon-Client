// app/(app)/settings.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '@/src/shared/components';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientWhiteToTransparent from '@/src/shared/components/GradientWhiteToTransparent';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

const settingsItems = useMemo(() => [
  { id: 1, title: 'Уведомления', description: 'Push-уведомления, звуки, вибрация', icon: 'notifications-outline', colors: ['#AA2BFF', '#6421FF'] },
  { id: 2, title: 'Конфиденциальность', description: 'Кто может видеть ваш профиль, статус онлайн', icon: 'lock-closed-outline', colors: ['#2B2EFF', '#2181FF'] },
  { id: 3, title: 'Безопасность', description: 'Двухфакторная аутентификация, сессии', icon: 'shield-checkmark-outline', colors: ['#FF2BB8', '#C61EE0'] },
  { id: 4, title: 'Внешний вид', description: 'Тема, цвет акцентов, шрифты', icon: 'color-palette-outline', colors: ['#FF2B36', '#FF217A'] },
  { id: 5, title: 'Аватары и медиа', description: 'Загрузка фото, качество изображений, автозагрузка', icon: 'images-outline', colors: ['#36D1DC', '#5B86E5'] },
  { id: 6, title: 'Контакты', description: 'Синхронизация, черный список', icon: 'people-outline', colors: ['#FF9A44', '#FC6076'] },
  { id: 7, title: 'Резервное копирование', description: 'Чат бекап, восстановление', icon: 'archive-outline', colors: ['#43CBFF', '#9708CC'] },
  { id: 8, title: 'Язык и регион', description: 'Русский, English', icon: 'language-outline', colors: ['#FFBC2B', '#FF7E21'] },
  { id: 9, title: 'Хранилище', description: 'Кэш, медиафайлы, документы', icon: 'cloud-outline', colors: ['#87FF5C', '#37A814'] },
  { id: 10, title: 'О приложении', description: 'Версия 1.0.0, Лицензионное соглашение', icon: 'information-circle-outline', colors: ['#8b5cf6', '#a78bfa'] },
  
  // Дополнительные важные пункты
  { id: 11, title: 'Данные и экономия', description: 'Экономия трафика, качество медиа', icon: 'cellular-outline', colors: ['#4ECDC4', '#44A08D'] },
  { id: 12, title: 'Звуки и вибрация', description: 'Настройка звуковых профилей', icon: 'musical-notes-outline', colors: ['#FF6B6B', '#EE5A24'] },
  { id: 13, title: 'Стикеры и GIF', description: 'Управление наборами стикеров', icon: 'happy-outline', colors: ['#A8E6CF', '#3B8D99'] },
  { id: 14, title: 'Помощь и поддержка', description: 'FAQ, обратная связь', icon: 'help-circle-outline', colors: ['#FF9966', '#FF5E62'] },
], []);

  return (
    <>
      <GradientWhiteToTransparent height={insets.top + 50} style={{ top: 0, left: 0, right: 0, }} />
    
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 15, paddingBottom: insets.bottom + 70 }]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Настройки приложения</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Argon — это ваше пространство. Индивидуальные настройки, управление параметрами, 
            конфиденциальность и комфорт. Сделайте Argon своим.
          </Text>
        </View>

        <View style={styles.settingsList}>
          {settingsItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.settingsItem} activeOpacity={0.7}>
              <LinearGradient
                colors={item.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
          <View style={styles.lineSubsc} />
        </View>

        {/* Баннер подписки */}
        <View style={styles.subscriptionWrapper}>
          <LinearGradient
            colors={['#EAE0FF', '#B291FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subscriptionBanner}
          >
            <View style={styles.emojiContainer}>
              <Image
                source={require('../../assets/images/components-subscribe/group-smiles.png')} 
                style={styles.premiumImage}
                contentFit="contain"
              />
            </View>

            <View style={styles.bannerContent}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuresContainer}
                style={styles.featuresScrollView}
              >
                <TouchableOpacity style={styles.featureCardWrapper} activeOpacity={0.7}>
                  <LinearGradient
                    colors={['#AA2BFF', '#6421FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featureIconGradient}
                  >
                    <Ionicons name="mic-outline" size={22} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>Расшифровка голосовых сообщений</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.featureCardWrapper} activeOpacity={0.7}>
                  <LinearGradient
                    colors={['#2B2EFF', '#2181FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featureIconGradient}
                  >
                    <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>Отправка файлов объемом до 2 ГБ</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.featureCardWrapper} activeOpacity={0.7}>
                  <LinearGradient
                    colors={['#FF2BB8', '#C61EE0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featureIconGradient}
                  >
                    <Ionicons name="brush-outline" size={22} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>Премиум дизайн</Text>
                </TouchableOpacity>
              </ScrollView>

              <Text style={styles.subscriptionText}>
                Приобретите подписку <Text style={styles.subscriptionTextSpan}>Argon Premium</Text> и получите доступ к эксклюзивным функциям и премиальному дизайну.
              </Text>

              <TouchableOpacity style={styles.buyButton} activeOpacity={0.7}>
                <LinearGradient
                  colors={['#A37CFF', '#6421FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buyButtonGradient}
                >
                  <Text style={styles.buyButtonText}>Приобрести за 185 ₽</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.tariffText}>Здесь вы можете выбрать тариф</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      <BottomTabBar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  descriptionContainer: {
    paddingHorizontal: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 12,
    color: '#989898',
    lineHeight: 20,
    textAlign: 'center',
  },
  settingsList: {
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 14,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 12,
    color: '#999',
  },
  lineSubsc: {
    width: '90%',
    height: 1,
    backgroundColor: '#574c4c31',
    marginTop: 30,
    zIndex: 12,
  },
  subscriptionWrapper: {
    marginTop: 10,
    marginBottom: 16,
  },
  subscriptionBanner: {
    marginHorizontal: 16,
    marginTop: 35,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  emojiContainer: {
    position: 'absolute',
    top: -90,
    left: -30,
    zIndex: 10,
    width: '120%',
    height: 290,
  },
  premiumImage: {
    width: '100%',
    height: '100%',
  },
  bannerContent: {
    alignItems: 'center',
    minHeight: 290,
    paddingTop: 120,
    zIndex: 12,
  },
  featuresScrollView: {
    marginBottom: 0,
    height: 100,
  },
  featuresContainer: {
    gap: 12,
    alignItems: 'center',
  },
  featureCardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    minWidth: 120,
    flexDirection: 'row',
    gap: 15,
  },
  featureIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4a',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subscriptionText: {
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
    marginTop: 4,
  },
  subscriptionTextSpan: {
    color: '#6421FF',
    fontWeight: '600',
  },
  buyButton: {
    borderRadius: 30,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#6421FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buyButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  tariffText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6421FF',
    textAlign: 'center',
  },
});