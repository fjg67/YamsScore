/**
 * Mini leaderboard avec podium temps réel
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  Layout,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useLeaderboard } from '../../../hooks/useLeaderboard';
import { premiumTheme } from '../../../theme/premiumTheme';
import { PODIUM_EMOJIS } from '../../../constants/emojis';

const LiveLeaderboardMini: React.FC = () => {
  const { leaderboard, isCloseGame } = useLeaderboard();

  // Afficher uniquement le top 3
  const topThree = leaderboard.slice(0, 3);

  if (topThree.length === 0) return null;

  return (
    <LinearGradient
      colors={['rgba(74,144,226,0.05)', 'rgba(80,200,120,0.05)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.podiumContainer}>
        {topThree.map((entry, index) => (
          <Animated.View
            key={entry.playerId}
            entering={FadeIn.delay(index * 100)}
            layout={Layout.springify()}
            style={styles.podiumItem}
          >
            {/* Medal */}
            <Text style={styles.medal}>
              {index === 0 && PODIUM_EMOJIS.first}
              {index === 1 && PODIUM_EMOJIS.second}
              {index === 2 && PODIUM_EMOJIS.third}
            </Text>

            {/* Avatar mini */}
            <Text style={styles.miniAvatar}>{entry.avatar}</Text>

            {/* Score */}
            <Text style={[styles.score, { color: entry.color }]}>
              {entry.score}
            </Text>

            {/* Trend arrow */}
            <Text style={styles.trend}>
              {entry.trend === 'up' && '↑'}
              {entry.trend === 'down' && '↓'}
              {entry.trend === 'stable' && '↔'}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Close game indicator */}
      {isCloseGame && (
        <View style={styles.closeGameBadge}>
          <Text style={styles.closeGameText}>🔥 Partie serrée !</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: premiumTheme.sizes.leaderboardMini.height,
    borderRadius: premiumTheme.borderRadius.lg,
    marginHorizontal: premiumTheme.spacing.md,
    marginBottom: premiumTheme.spacing.sm,
    paddingHorizontal: premiumTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  podiumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: premiumTheme.spacing.lg,
  },
  medal: {
    fontSize: 18,
    marginRight: premiumTheme.spacing.xs,
  },
  miniAvatar: {
    fontSize: 16,
    marginRight: premiumTheme.spacing.xs,
  },
  score: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginRight: premiumTheme.spacing.xs,
  },
  trend: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: premiumTheme.colors.ui.textSecondary,
  },
  closeGameBadge: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderRadius: premiumTheme.borderRadius.md,
    paddingHorizontal: premiumTheme.spacing.sm,
    paddingVertical: premiumTheme.spacing.xs,
  },
  closeGameText: {
    fontSize: premiumTheme.typography.fontSize.xs,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default LiveLeaderboardMini;
