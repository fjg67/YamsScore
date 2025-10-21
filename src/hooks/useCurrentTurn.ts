/**
 * Hook pour gérer le tour actuel
 */

import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';

export const useCurrentTurn = () => {
  const currentGame = useAppSelector((state) => state.game.currentGame);

  const currentTurnData = useMemo(() => {
    if (!currentGame) {
      return {
        currentPlayer: null,
        turnNumber: 0,
        totalTurns: 13,
        isGameFinished: true,
      };
    }

    // Calculer le joueur actuel basé sur le nombre de cellules remplies
    const playerScores = currentGame.scores;
    const players = currentGame.players;

    if (players.length === 0) {
      return {
        currentPlayer: null,
        turnNumber: 0,
        totalTurns: 13,
        isGameFinished: true,
      };
    }

    // Compter le nombre de cellules remplies pour chaque joueur
    const filledCounts = playerScores.map((score) => {
      let count = 0;
      const categories = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfKind', 'fourOfKind', 'fullHouse',
        'smallStraight', 'largeStraight', 'yams', 'chance',
      ] as const;

      categories.forEach((cat) => {
        if (score[cat] !== undefined) count++;
      });

      return { playerId: score.playerId, count };
    });

    // Le joueur actuel est celui avec le moins de cellules remplies
    const minCount = Math.min(...filledCounts.map((f) => f.count));
    const currentPlayerScore = filledCounts.find((f) => f.count === minCount);

    const currentPlayer = currentPlayerScore
      ? players.find((p) => p.id === currentPlayerScore.playerId) || null
      : null;

    // Le tour est basé sur le minimum
    const turnNumber = minCount + 1;
    const isGameFinished = minCount >= 13;

    return {
      currentPlayer,
      turnNumber,
      totalTurns: 13,
      isGameFinished,
    };
  }, [currentGame]);

  return currentTurnData;
};
