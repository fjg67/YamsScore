/**
 * Utilitaires de calcul de score pour le jeu de Yams
 */

import {
  ScoreRow,
  PlayerScore,
  Game,
  Player,
} from '../types';
import {
  GameConfig,
  UpperSectionCategories,
  LowerSectionCategories,
} from '../constants';

/**
 * Calcule le total de la section supérieure (1-6)
 */
export const calculateUpperTotal = (scores: ScoreRow): number => {
  let total = 0;

  UpperSectionCategories.forEach((category) => {
    const score = scores[category];
    if (score !== undefined) {
      total += score;
    }
  });

  return total;
};

/**
 * Calcule le bonus de la section supérieure
 * Bonus de 35 points si le total >= 63
 */
export const calculateUpperBonus = (upperTotal: number): number => {
  return upperTotal >= GameConfig.UPPER_BONUS_THRESHOLD
    ? GameConfig.UPPER_BONUS_VALUE
    : 0;
};

/**
 * Calcule le total de la section inférieure
 */
export const calculateLowerTotal = (scores: ScoreRow): number => {
  let total = 0;

  LowerSectionCategories.forEach((category) => {
    const score = scores[category];
    if (score !== undefined) {
      total += score;
    }
  });

  return total;
};

/**
 * Calcule le score total d'un joueur
 */
export const calculateGrandTotal = (playerScore: PlayerScore): number => {
  const upperTotal = playerScore.upperTotal;
  const upperBonus = playerScore.upperBonus;
  const lowerTotal = playerScore.lowerTotal;

  return upperTotal + upperBonus + lowerTotal;
};

/**
 * Met à jour tous les totaux d'un score de joueur
 */
export const updatePlayerScoreTotals = (
  scores: ScoreRow,
  playerId: string
): PlayerScore => {
  const upperTotal = calculateUpperTotal(scores);
  const upperBonus = calculateUpperBonus(upperTotal);
  const lowerTotal = calculateLowerTotal(scores);

  const playerScore: PlayerScore = {
    ...scores,
    playerId,
    upperTotal,
    upperBonus,
    lowerTotal,
    grandTotal: 0, // Sera calculé juste après
  };

  playerScore.grandTotal = calculateGrandTotal(playerScore);

  return playerScore;
};

/**
 * Vérifie si une partie est terminée
 * (toutes les catégories remplies pour tous les joueurs)
 */
export const isGameComplete = (game: Game): boolean => {
  const totalCategories =
    UpperSectionCategories.length + LowerSectionCategories.length;

  return game.scores.every((playerScore) => {
    let filledCategories = 0;

    [...UpperSectionCategories, ...LowerSectionCategories].forEach(
      (category) => {
        if (playerScore[category] !== undefined) {
          filledCategories++;
        }
      }
    );

    return filledCategories === totalCategories;
  });
};

/**
 * Détermine le gagnant d'une partie
 */
export const determineWinner = (game: Game): Player | null => {
  if (game.scores.length === 0) {
    return null;
  }

  let highestScore = -1;
  let winnerId: string | null = null;

  game.scores.forEach((playerScore) => {
    if (playerScore.grandTotal > highestScore) {
      highestScore = playerScore.grandTotal;
      winnerId = playerScore.playerId;
    }
  });

  if (winnerId === null) {
    return null;
  }

  return game.players.find((player) => player.id === winnerId) || null;
};

/**
 * Obtient le classement des joueurs
 */
export const getPlayerRankings = (
  game: Game
): Array<{ player: Player; score: PlayerScore; rank: number }> => {
  const rankings = game.scores
    .map((score) => ({
      player: game.players.find((p) => p.id === score.playerId)!,
      score,
    }))
    .sort((a, b) => b.score.grandTotal - a.score.grandTotal)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  return rankings;
};

/**
 * Calcule le nombre de catégories remplies pour un joueur
 */
export const getFilledCategoriesCount = (scores: ScoreRow): number => {
  let count = 0;

  [...UpperSectionCategories, ...LowerSectionCategories].forEach(
    (category) => {
      if (scores[category] !== undefined) {
        count++;
      }
    }
  );

  return count;
};

/**
 * Calcule le pourcentage de progression d'une partie
 */
export const getGameProgress = (game: Game): number => {
  const totalCategories =
    UpperSectionCategories.length + LowerSectionCategories.length;
  const totalSlots = totalCategories * game.players.length;

  let filledSlots = 0;
  game.scores.forEach((playerScore) => {
    filledSlots += getFilledCategoriesCount(playerScore);
  });

  return (filledSlots / totalSlots) * 100;
};
