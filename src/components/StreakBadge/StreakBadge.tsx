/**
 * Streak Badge - Badge de jours consécutifs
 * Affiche le streak actuel avec animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface StreakBadgeProps {
  streak: number;
  emoji?: string;
  message?: string;
  compact?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  emoji = '🔥',
  message = '',
  compact = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation de glow (opacity uniquement pour native driver)
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [pulseAnim, glowAnim]);

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
        <Animated.Text style={[styles.compactEmoji, { transform: [{ scale: pulseAnim }] }]}>
          {emoji}
        </Animated.Text>
        <Text style={[styles.compactStreak, { color: theme.text.primary }]}>
          {streak}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glowContainer,
          {
            backgroundColor: 'rgba(255, 107, 107, 0.3)',
            opacity: glowAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <View style={[styles.badge, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)' }]}>
        <Animated.Text
          style={[
            styles.emoji,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {emoji}
        </Animated.Text>
        <Text style={[styles.streak, { color: theme.text.primary }]}>
          {streak} {streak > 1 ? 'jours' : 'jour'}
        </Text>
        {message && (
          <Text style={[styles.message, { color: theme.text.secondary }]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 100,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  streak: {
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  compactEmoji: {
    fontSize: 20,
  },
  compactStreak: {
    fontSize: 16,
    fontWeight: '700',
  },
});
