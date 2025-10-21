/**
 * Hook pour calculer le classement en temps réel
 */

import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { LeaderboardEntry } from '../types/premium.types';

export const useLeaderboard = () => {
  const currentGame = useAppSelector((state) => state.game.currentGame);

  const leaderboard = useMemo<LeaderboardEntry[]>(() => {
    if (!currentGame) return [];

    // Calculer les scores totaux pour chaque joueur
    const playerScores = currentGame.players.map((player) => {
      const playerScoreData = currentGame.scores.find((s) => s.playerId === player.id);

      // Calculer le total (somme de tous les scores + bonus)
      let total = 0;

      if (playerScoreData) {
        // Section supérieure
        const upperTotal =
          (playerScoreData.ones || 0) +
          (playerScoreData.twos || 0) +
          (playerScoreData.threes || 0) +
          (playerScoreData.fours || 0) +
          (playerScoreData.fives || 0) +
          (playerScoreData.sixes || 0);

        // Bonus si >= 63
        const bonus = upperTotal >= 63 ? 35 : 0;

        // Section inférieure
        const lowerTotal =
          (playerScoreData.threeOfKind || 0) +
          (playerScoreData.fourOfKind || 0) +
          (playerScoreData.fullHouse || 0) +
          (playerScoreData.smallStraight || 0) +
          (playerScoreData.largeStraight || 0) +
          (playerScoreData.yams || 0) +
          (playerScoreData.chance || 0);

        total = upperTotal + bonus + lowerTotal;
      }

      return {
        playerId: player.id,
        playerName: player.name,
        avatar: player.emoji || '🎲',
        color: player.color,
        score: total,
        position: 0, // Will be set after sorting
        trend: 'stable' as const,
      };
    });

    // Trier par score décroissant
    playerScores.sort((a, b) => b.score - a.score);

    // Assigner les positions
    return playerScores.map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));
  }, [currentGame]);

  const winner = leaderboard[0] || null;
  const isCloseGame = leaderboard.length > 1 &&
    leaderboard[0].score - leaderboard[1].score < 10;

  return {
    leaderboard,
    winner,
    isCloseGame,
  };
};
