/**
 * Hook pour calculer les statistiques du jeu en temps réel
 */

import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { PlayerStats, GameStats } from '../types/tutorial.types';
import { ScoreCategory } from '../types';

export const useGameStats = (): GameStats | null => {
  const currentGame = useAppSelector((state) => state.game.currentGame);

  return useMemo(() => {
    if (!currentGame) return null;

    // Calculate stats for each player
    const playerStats: PlayerStats[] = currentGame.players.map((player) => {
      const playerScore = currentGame.scores.find((s) => s.playerId === player.id);

      if (!playerScore) {
        return {
          playerId: player.id,
          playerName: player.name,
          currentTotal: 0,
          upperSectionTotal: 0,
          lowerSectionTotal: 0,
          bonusProgress: 0,
          hasBonus: false,
          bestScore: null,
          worstScore: null,
          averageScore: 0,
          categoriesFilled: 0,
          categoriesRemaining: 13,
          completionRate: 0,
          perfectScores: [],
          crossedCategories: [],
        };
      }

      // Upper section categories
      const upperCategories: ScoreCategory[] = [
        'ones',
        'twos',
        'threes',
        'fours',
        'fives',
        'sixes',
      ];

      // Lower section categories
      const lowerCategories: ScoreCategory[] = [
        'threeOfKind',
        'fourOfKind',
        'fullHouse',
        'smallStraight',
        'largeStraight',
        'yams',
        'chance',
      ];

      // All categories
      const allCategories = [...upperCategories, ...lowerCategories];

      // Calculate upper section total
      const upperSectionTotal = upperCategories.reduce(
        (sum, cat) => sum + (playerScore[cat] || 0),
        0
      );

      // Calculate lower section total
      const lowerSectionTotal = lowerCategories.reduce(
        (sum, cat) => sum + (playerScore[cat] || 0),
        0
      );

      // Bonus progress
      const bonusProgress = Math.min(upperSectionTotal, 63);
      const hasBonus = playerScore.upperBonus > 0;

      // Find best and worst scores
      let bestScore: { category: ScoreCategory; value: number } | null = null;
      let worstScore: { category: ScoreCategory; value: number } | null = null;

      const maxScores: Record<ScoreCategory, number> = {
        ones: 5,
        twos: 10,
        threes: 15,
        fours: 20,
        fives: 25,
        sixes: 30,
        threeOfKind: 30,
        fourOfKind: 30,
        fullHouse: 25,
        smallStraight: 30,
        largeStraight: 40,
        yams: 50,
        chance: 30,
      };

      allCategories.forEach((cat) => {
        const value = playerScore[cat];
        if (value !== undefined && value !== null) {
          const percentage = (value / maxScores[cat]) * 100;

          if (!bestScore || percentage > (bestScore.value / maxScores[bestScore.category]) * 100) {
            bestScore = { category: cat, value };
          }

          if (value > 0 && (!worstScore || percentage < (worstScore.value / maxScores[worstScore.category]) * 100)) {
            worstScore = { category: cat, value };
          }
        }
      });

      // Categories filled/remaining
      const categoriesFilled = allCategories.filter(
        (cat) => playerScore[cat] !== undefined
      ).length;
      const categoriesRemaining = 13 - categoriesFilled;
      const completionRate = (categoriesFilled / 13) * 100;

      // Average score (excluding zeros)
      const nonZeroScores = allCategories
        .map((cat) => playerScore[cat])
        .filter((val) => val !== undefined && val !== null && val > 0) as number[];
      const averageScore =
        nonZeroScores.length > 0
          ? nonZeroScores.reduce((sum, val) => sum + val, 0) / nonZeroScores.length
          : 0;

      // Perfect scores (max value achieved)
      const perfectScores = allCategories.filter(
        (cat) =>
          playerScore[cat] !== undefined &&
          playerScore[cat] === maxScores[cat]
      );

      // Crossed categories (0 points)
      const crossedCategories = allCategories.filter(
        (cat) =>
          playerScore[cat] !== undefined &&
          playerScore[cat] === 0
      );

      return {
        playerId: player.id,
        playerName: player.name,
        currentTotal: playerScore.grandTotal,
        upperSectionTotal,
        lowerSectionTotal,
        bonusProgress,
        hasBonus,
        bestScore,
        worstScore,
        averageScore: Math.round(averageScore * 10) / 10,
        categoriesFilled,
        categoriesRemaining,
        completionRate: Math.round(completionRate),
        perfectScores,
        crossedCategories,
      };
    });

    // Sort by total score to determine leader
    const sortedPlayers = [...playerStats].sort(
      (a, b) => b.currentTotal - a.currentTotal
    );

    const leader = sortedPlayers[0] || null;
    const secondPlace = sortedPlayers[1] || null;

    // Score difference between 1st and 2nd
    const scoreDifference = secondPlace
      ? leader.currentTotal - secondPlace.currentTotal
      : 0;

    // Is it a close game?
    const isCloseGame = scoreDifference < 10 && scoreDifference > 0;

    // Current turn (based on filled categories)
    const totalCategoriesFilled = playerStats.reduce(
      (sum, p) => sum + p.categoriesFilled,
      0
    );
    const currentTurn = Math.floor(totalCategoriesFilled / currentGame.players.length) + 1;

    // Simple prediction: project based on current rate
    const projectedWinner = leader ? leader.playerId : null;
    const avgScorePerCategory = leader
      ? leader.currentTotal / Math.max(leader.categoriesFilled, 1)
      : 0;
    const projectedFinalScore = Math.round(avgScorePerCategory * 13);

    return {
      currentTurn: Math.min(currentTurn, 13),
      totalTurns: 13,
      playerStats,
      leader,
      scoreDifference,
      isCloseGame,
      projectedWinner,
      projectedFinalScore,
    };
  }, [currentGame]);
};
