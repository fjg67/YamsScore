/**
 * Carte de badge avec animation
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { Badge as BadgeType } from '../types';

interface BadgeCardProps {
  badge: BadgeType;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  showProgress?: boolean;
}

const BADGE_COLORS = {
  bronze: {
    gradient: ['#CD7F32', '#B87333'],
    glow: 'rgba(205, 127, 50, 0.4)',
  },
  silver: {
    gradient: ['#C0C0C0', '#A8A8A8'],
    glow: 'rgba(192, 192, 192, 0.4)',
  },
  gold: {
    gradient: ['#FFD700', '#FFC700'],
    glow: 'rgba(255, 215, 0, 0.4)',
  },
  secret: {
    gradient: ['#9B59B6', '#8E44AD'],
    glow: 'rgba(155, 89, 182, 0.4)',
  },
};

const SIZES = {
  small: {
    container: 80,
    icon: 32,
    name: 10,
    desc: 8,
  },
  medium: {
    container: 120,
    icon: 48,
    name: 13,
    desc: 10,
  },
  large: {
    container: 160,
    icon: 64,
    name: 16,
    desc: 12,
  },
};

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  size = 'medium',
  onPress,
  showProgress = false,
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const { gradient, glow } = BADGE_COLORS[badge.tier];
  const dimensions = SIZES[size];

  const handlePress = () => {
    // Animation au tap
    scale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    if (badge.unlocked) {
      // Rotation pour les badges débloqués
      rotate.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }

    if (onPress) {
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!badge.unlocked && !onPress}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width: dimensions.container,
            height: dimensions.container,
          },
          animatedStyle,
        ]}
      >
        {badge.unlocked ? (
          <LinearGradient
            colors={[gradient[0], gradient[1]]}
            style={[
              styles.badge,
              {
                shadowColor: glow,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.icon, { fontSize: dimensions.icon }]}>
              {badge.icon}
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styles.badge, styles.badgeLocked]}>
            <Text style={[styles.icon, { fontSize: dimensions.icon }]}>
              {badge.hidden ? '❓' : '🔒'}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              {
                fontSize: dimensions.name,
                opacity: badge.unlocked ? 1 : 0.5,
              },
            ]}
            numberOfLines={1}
          >
            {badge.hidden && !badge.unlocked ? '???' : badge.name}
          </Text>

          {showProgress && badge.progress !== undefined && !badge.unlocked && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${badge.progress}%`,
                      backgroundColor: gradient[0],
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{badge.progress}%</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  badge: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  badgeLocked: {
    backgroundColor: '#D0D0D0',
  },
  icon: {
    textAlign: 'center',
  },
  info: {
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#999',
  },
});
