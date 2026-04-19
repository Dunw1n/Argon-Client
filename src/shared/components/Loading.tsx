// src/shared/components/Loading.tsx
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Loading = ({ size = 'large', color = '#8b5cf6' }: LoadingProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});