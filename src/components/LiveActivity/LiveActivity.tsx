/**
 * Live Activity - Activité en temps réel
 * Social proof dynamique pour créer l'urgence
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface Activity {
  id: number;
  emoji: string;
  text: string;
  timeAgo: string;
}

const SAMPLE_ACTIVITIES: Omit<Activity, 'id'>[] = [
  { emoji: '🎲', text: 'Pierre a réalisé un Yams !', timeAgo: 'Il y a 2 min' },
  { emoji: '🏆', text: 'Marie a battu son record', timeAgo: 'Il y a 5 min' },
  { emoji: '🔥', text: 'Thomas atteint 7 jours de streak', timeAgo: 'Il y a 8 min' },
  { emoji: '⚡', text: 'Sophie a joué sa 50ème partie', timeAgo: 'Il y a 12 min' },
  { emoji: '🌟', text: 'Lucas a débloqué "Maître"', timeAgo: 'Il y a 15 min' },
  { emoji: '💎', text: 'Emma a obtenu un score parfait', timeAgo: 'Il y a 18 min' },
  { emoji: '🎯', text: 'Jules a commencé sa première partie', timeAgo: 'Il y a 22 min' },
  { emoji: '👑', text: 'Léa atteint 30 jours consécutifs', timeAgo: 'Il y a 25 min' },
];

export const LiveActivity: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const [currentActivity, setCurrentActivity] = useState<Activity>({ id: 0, ...SAMPLE_ACTIVITIES[0] });
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let currentIndex = 0;

    const showActivity = () => {
      // Changer l'activité
      currentIndex = (currentIndex + 1) % SAMPLE_ACTIVITIES.length;
      setCurrentActivity({
        id: currentIndex,
        ...SAMPLE_ACTIVITIES[currentIndex],
      });

      // Animation d'entrée
      translateY.setValue(50);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Animation de sortie après 4 secondes
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 4000);
    };

    // Première activité
    showActivity();

    // Nouvelles activités toutes les 6 secondes
    const interval = setInterval(showActivity, 6000);

    return () => clearInterval(interval);
  }, [translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.05)',
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{currentActivity.emoji}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.text, { color: theme.text.primary }]} numberOfLines={1}>
            {currentActivity.text}
          </Text>
          <Text style={[styles.time, { color: theme.text.secondary }]}>
            {currentActivity.timeAgo}
          </Text>
        </View>
      </View>
      <View style={[styles.pulse, { backgroundColor: '#50C878' }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  emoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  time: {
    fontSize: 11,
    marginTop: 2,
  },
  pulse: {
    position: 'absolute',
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
