/**
 * Animation de podium pour les 3 premiers joueurs
 * Colonnes animées avec hauteurs différentes
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../theme/premiumTheme';
import { PodiumPlayer } from '../../types/victory.types';

interface PodiumAnimationProps {
  players: PodiumPlayer[]; // Max 3, sorted by position
}

const PodiumAnimation: React.FC<PodiumAnimationProps> = ({ players }) => {
  // Animation values
  const firstHeight = useSharedValue(0);
  const secondHeight = useSharedValue(0);
  const thirdHeight = useSharedValue(0);

  const firstScale = useSharedValue(0);
  const secondScale = useSharedValue(0);
  const thirdScale = useSharedValue(0);

  useEffect(() => {
    // Animate podium heights sequentially
    // 3rd place first (smallest)
    if (players[2]) {
      thirdHeight.value = withDelay(300, withSpring(80, { damping: 12 }));
      thirdScale.value = withDelay(300, withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 12 })
      ));
    }

    // 2nd place second (medium)
    if (players[1]) {
      secondHeight.value = withDelay(600, withSpring(120, { damping: 12 }));
      secondScale.value = withDelay(600, withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 12 })
      ));
    }

    // 1st place last (tallest) - most dramatic
    if (players[0]) {
      firstHeight.value = withDelay(900, withSpring(160, { damping: 10 }));
      firstScale.value = withDelay(900, withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 10 })
      ));
    }
  }, [players]);

  const firstHeightStyle = useAnimatedStyle(() => ({
    height: firstHeight.value,
  }));

  const secondHeightStyle = useAnimatedStyle(() => ({
    height: secondHeight.value,
  }));

  const thirdHeightStyle = useAnimatedStyle(() => ({
    height: thirdHeight.value,
  }));

  const firstScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: firstScale.value }],
  }));

  const secondScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondScale.value }],
  }));

  const thirdScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thirdScale.value }],
  }));

  const renderPlayer = (
    player: PodiumPlayer,
    heightStyle: any,
    scaleStyle: any,
    gradientColors: string[]
  ) => {
    const medal = player.position === 1 ? '🥇' : player.position === 2 ? '🥈' : '🥉';

    return (
      <View style={styles.podiumColumn}>
        {/* Player info above podium */}
        <Animated.View style={[styles.playerInfo, scaleStyle]}>
          <Text style={styles.playerAvatar}>{player.player.avatar || '👤'}</Text>
          <Text style={styles.playerName} numberOfLines={1}>
            {player.player.name}
          </Text>
          <Text style={styles.playerScore}>{player.score} pts</Text>
        </Animated.View>

        {/* Podium column */}
        <Animated.View style={[styles.column, heightStyle]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.columnGradient}
          >
            <Text style={styles.positionMedal}>{medal}</Text>
            <Text style={styles.positionNumber}>{player.position}</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  // Sort players for visual order: 2nd, 1st, 3rd
  const sortedForDisplay = [
    players.find(p => p.position === 2), // Left
    players.find(p => p.position === 1), // Center (tallest)
    players.find(p => p.position === 3), // Right
  ].filter(Boolean) as PodiumPlayer[];

  return (
    <View style={styles.container}>
      <View style={styles.podium}>
        {/* 2nd Place - Left */}
        {sortedForDisplay[0] && renderPlayer(
          sortedForDisplay[0],
          secondHeightStyle,
          secondScaleStyle,
          ['#C0C0C0', '#A8A8A8']
        )}

        {/* 1st Place - Center */}
        {sortedForDisplay[1] && renderPlayer(
          sortedForDisplay[1],
          firstHeightStyle,
          firstScaleStyle,
          ['#FFD700', '#FFA500']
        )}

        {/* 3rd Place - Right */}
        {sortedForDisplay[2] && renderPlayer(
          sortedForDisplay[2],
          thirdHeightStyle,
          thirdScaleStyle,
          ['#CD7F32', '#B8860B']
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: premiumTheme.spacing.xl,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: premiumTheme.spacing.sm,
  },
  podiumColumn: {
    alignItems: 'center',
    width: 100,
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.sm,
  },
  playerAvatar: {
    fontSize: 48,
    marginBottom: premiumTheme.spacing.xs,
  },
  playerName: {
    fontSize: premiumTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  playerScore: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  column: {
    width: '100%',
    borderTopLeftRadius: premiumTheme.borderRadius.lg,
    borderTopRightRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
    ...premiumTheme.colors.shadows.medium,
  },
  columnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: premiumTheme.spacing.md,
  },
  positionMedal: {
    fontSize: 32,
    marginBottom: premiumTheme.spacing.xs,
  },
  positionNumber: {
    fontSize: premiumTheme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PodiumAnimation;
