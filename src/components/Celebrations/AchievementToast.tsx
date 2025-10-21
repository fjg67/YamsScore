/**
 * Toast de notification pour achievements et petites célébrations
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { ToastNotification } from '../../types/celebration.types';
import { premiumTheme } from '../../theme/premiumTheme';

interface AchievementToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ toast, onDismiss }) => {
  const translateY = useSharedValue(-200);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (toast) {
      // Enter animation
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1)
      );
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        // Exit animation
        translateY.value = withTiming(-200, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onDismiss)();
        });
      }, toast.duration);

      return () => clearTimeout(timer);
    } else {
      translateY.value = -200;
      opacity.value = 0;
    }
  }, [toast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!toast) return null;

  const gradientColors = getGradientColors(toast.type);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {toast.emoji && (
          <Text style={styles.emoji}>{toast.emoji}</Text>
        )}
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

const getGradientColors = (type: ToastNotification['type']): string[] => {
  switch (type) {
    case 'success':
      return ['#50C878', '#3FA065'];
    case 'achievement':
      return ['#FFD700', '#FFA500'];
    case 'warning':
      return ['#F39C12', '#E67E22'];
    case 'info':
    default:
      return ['#4A90E2', '#5DADE2'];
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: premiumTheme.spacing.md,
    right: premiumTheme.spacing.md,
    zIndex: 10000,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: premiumTheme.spacing.md,
    paddingHorizontal: premiumTheme.spacing.lg,
    borderRadius: premiumTheme.borderRadius.xl,
    ...premiumTheme.colors.shadows.medium,
  },
  emoji: {
    fontSize: 32,
    marginRight: premiumTheme.spacing.md,
  },
  message: {
    flex: 1,
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 22,
  },
});

export default AchievementToast;
