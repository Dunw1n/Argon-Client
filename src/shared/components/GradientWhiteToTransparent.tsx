// components/GradientWhiteToTransparent.tsx
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientWhiteToTransparentProps {
  height?: number;
  startOpacity?: number; 
  endOpacity?: number;
  style?: ViewStyle;
}

export const GradientWhiteToTransparent: React.FC<GradientWhiteToTransparentProps> = ({
  height = 10,
  startOpacity = 1,
  style,
  endOpacity = 0
}) => {
  const colors = [ 
    `rgba(255, 255, 255, ${startOpacity})`, 
    `rgba(255, 255, 255, ${endOpacity})`
  ] as const;

  return (
    <View style={[styles.container, { height }, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});

export default GradientWhiteToTransparent;