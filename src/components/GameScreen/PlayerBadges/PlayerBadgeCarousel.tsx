/**
 * Carousel de badges joueurs avec scores en temps réel
 */

import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { useLeaderboard } from '../../../hooks/useLeaderboard';
import { useCurrentTurn } from '../../../hooks/useCurrentTurn';
import { premiumTheme } from '../../../theme/premiumTheme';
import { PlayerBadgeData } from '../../../types/premium.types';
import PlayerBadgeCard from './PlayerBadgeCard';

const PlayerBadgeCarousel: React.FC = () => {
  const currentGame = useAppSelector((state) => state.game.currentGame);
  const { leaderboard } = useLeaderboard();
  const { currentPlayer } = useCurrentTurn();

  const playerBadges = useMemo<PlayerBadgeData[]>(() => {
    if (!currentGame) return [];

    return currentGame.players.map((player) => {
      const leaderboardEntry = leaderboard.find((e) => e.playerId === player.id);
      const isActive = currentPlayer?.id === player.id;
      const isWinning = leaderboardEntry?.position === 1;

      return {
        id: player.id,
        name: player.name,
        avatar: player.emoji || '🎲',
        color: player.color,
        score: leaderboardEntry?.score || 0,
        isActive,
        isWinning,
        position: leaderboardEntry?.position || 0,
      };
    });
  }, [currentGame, leaderboard, currentPlayer]);

  if (!currentGame) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={premiumTheme.sizes.playerBadge.width + premiumTheme.spacing.badgeSpacing}
        decelerationRate="fast"
      >
        {playerBadges.map((badge) => (
          <PlayerBadgeCard key={badge.id} data={badge} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: premiumTheme.spacing.md,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: premiumTheme.spacing.md,
  },
});

export default PlayerBadgeCarousel;
