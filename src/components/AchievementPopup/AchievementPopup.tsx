/**
 * Achievement Popup - Notification de succès débloqué
 * Animation premium avec confettis
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import type { Achievement } from '../../utils/achievements';

const { width } = Dimensions.get('window');

interface AchievementPopupProps {
  achievement: Achievement;
  onClose?: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose,
}) => {
  const { theme, isDarkMode } = useTheme();
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-close après 3 secondes
    const timer = setTimeout(() => {
      // Exit animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -200,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose?.();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [translateY, opacity, scale, onClose]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <View
        style={[
          styles.popup,
          {
            backgroundColor: isDarkMode
              ? 'rgba(40, 40, 40, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.badge}>🏆</Text>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Succès débloqué !
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.emoji}>{achievement.emoji}</Text>
          <Text style={[styles.achievementTitle, { color: theme.text.primary }]}>
            {achievement.title}
          </Text>
          <Text style={[styles.description, { color: theme.text.secondary }]}>
            {achievement.description}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
  },
  popup: {
    width: width - 40,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  badge: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
});
