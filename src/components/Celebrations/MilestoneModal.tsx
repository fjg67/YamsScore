/**
 * Modal full-screen pour grandes célébrations (Yams, Bonus, Comeback)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { Milestone } from '../../types/celebration.types';
import { premiumTheme } from '../../theme/premiumTheme';
import ConfettiSystem from './ConfettiSystem';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onDismiss: () => void;
}

const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onDismiss }) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-15);
  const opacity = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  useEffect(() => {
    if (milestone) {
      // Background fade in
      opacity.value = withTiming(1, { duration: 300 });

      // Card entrance with bounce
      scale.value = withSequence(
        withDelay(200, withSpring(1.2, { damping: 8, stiffness: 100 })),
        withSpring(1, { damping: 12 })
      );

      rotation.value = withSequence(
        withDelay(200, withTiming(5, { duration: 150 })),
        withTiming(0, { duration: 150 })
      );

      // Emoji pop
      emojiScale.value = withSequence(
        withDelay(400, withSpring(1.3, { damping: 8 })),
        withSpring(1)
      );

      // Auto-dismiss
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onDismiss)();
        });
      }, milestone.config.duration);

      return () => clearTimeout(timer);
    }
  }, [milestone]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  if (!milestone) return null;

  const { config } = milestone;

  return (
    <Modal
      visible={!!milestone}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      {/* Background overlay */}
      <Animated.View style={[styles.background, backgroundStyle]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Confetti */}
      {config.confetti && (
        <ConfettiSystem
          active={!!milestone}
          count={config.confettiCount}
          colors={config.confettiColors}
          duration={config.duration}
        />
      )}

      {/* Content card */}
      <View style={styles.container}>
        <Animated.View style={[styles.card, cardStyle]}>
          <LinearGradient
            colors={getGradientForType(config.type)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Emoji */}
            <Animated.Text style={[styles.emoji, emojiStyle]}>
              {config.emoji}
            </Animated.Text>

            {/* Title */}
            <Text style={styles.title}>{config.title}</Text>

            {/* Subtitle */}
            {config.subtitle && (
              <Text style={styles.subtitle}>{config.subtitle}</Text>
            )}

            {/* Player name if applicable */}
            {milestone.playerName && (
              <Text style={styles.playerName}>{milestone.playerName}</Text>
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const getGradientForType = (type: string): string[] => {
  const gradients: Record<string, string[]> = {
    yams: ['#FFD700', '#FFA500'],
    bonus: ['#FFD700', '#FFEB3B'],
    largeStraight: ['#4A90E2', '#5DADE2'],
    fullHouse: ['#50C878', '#3FA065'],
    comeback: ['#FF6B6B', '#FFA500'],
    perfectGame: ['#4A90E2', '#50C878'],
    highScore: ['#FFD700', '#FF6B6B'],
    shutout: ['#FFD700', '#FFA500'],
  };

  return gradients[type] || ['#4A90E2', '#5DADE2'];
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9998,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: premiumTheme.spacing.xxl,
    zIndex: 9999,
  },
  card: {
    width: '100%',
    borderRadius: premiumTheme.borderRadius.xxl,
    ...premiumTheme.colors.shadows.heavy,
  },
  cardGradient: {
    padding: premiumTheme.spacing.huge,
    alignItems: 'center',
    borderRadius: premiumTheme.borderRadius.xxl,
  },
  emoji: {
    fontSize: 100,
    marginBottom: premiumTheme.spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: 'black',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: premiumTheme.typography.fontSize.display,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: premiumTheme.spacing.sm,
  },
  playerName: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: premiumTheme.spacing.md,
  },
});

export default MilestoneModal;
