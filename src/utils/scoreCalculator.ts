/**
 * Score Calculator - Utility functions for score validation and calculation
 */

import { CategoryType, PlayerScores } from '../types/game';

/**
 * Validate if a score is valid for a given category
 */
export const validateScore = (category: CategoryType, value: number): { valid: boolean; message?: string } => {
  // Allow 0 (crossed/barré) for all categories
  if (value === 0) {
    return { valid: true };
  }

  switch (category) {
    // Upper section (1-6)
    case 'ones':
      if (value < 1 || value > 5 || value % 1 !== 0) {
        return { valid: false, message: 'Les As doivent être 0, 1, 2, 3, 4, ou 5' };
      }
      return { valid: true };

    case 'twos':
      if (value < 2 || value > 10 || value % 2 !== 0) {
        return { valid: false, message: 'Les Deux doivent être un multiple de 2 (0, 2, 4, 6, 8, 10)' };
      }
      return { valid: true };

    case 'threes':
      if (value < 3 || value > 15 || value % 3 !== 0) {
        return { valid: false, message: 'Les Trois doivent être un multiple de 3 (0, 3, 6, 9, 12, 15)' };
      }
      return { valid: true };

    case 'fours':
      if (value < 4 || value > 20 || value % 4 !== 0) {
        return { valid: false, message: 'Les Quatre doivent être un multiple de 4 (0, 4, 8, 12, 16, 20)' };
      }
      return { valid: true };

    case 'fives':
      if (value < 5 || value > 25 || value % 5 !== 0) {
        return { valid: false, message: 'Les Cinq doivent être un multiple de 5 (0, 5, 10, 15, 20, 25)' };
      }
      return { valid: true };

    case 'sixes':
      if (value < 6 || value > 30 || value % 6 !== 0) {
        return { valid: false, message: 'Les Six doivent être un multiple de 6 (0, 6, 12, 18, 24, 30)' };
      }
      return { valid: true };

    // Lower section - Brelan (sum of 5 dice)
    case 'threeOfKind':
      if (value < 5 || value > 30) {
        return { valid: false, message: 'Le Brelan doit être entre 5 et 30 (somme des 5 dés)' };
      }
      return { valid: true };

    // Lower section - Carré (sum of 5 dice)
    case 'fourOfKind':
      if (value < 5 || value > 30) {
        return { valid: false, message: 'Le Carré doit être entre 5 et 30 (somme des 5 dés)' };
      }
      return { valid: true };

    // Lower section - Full (25 points fixed)
    case 'fullHouse':
      if (value !== 25) {
        return { valid: false, message: 'Le Full vaut 25 points ou 0 (barré)' };
      }
      return { valid: true };

    // Lower section - Petite Suite (30 points fixed)
    case 'smallStraight':
      if (value !== 30) {
        return { valid: false, message: 'La Petite Suite vaut 30 points ou 0 (barré)' };
      }
      return { valid: true };

    // Lower section - Grande Suite (40 points fixed)
    case 'largeStraight':
      if (value !== 40) {
        return { valid: false, message: 'La Grande Suite vaut 40 points ou 0 (barré)' };
      }
      return { valid: true };

    // Lower section - Yams (50 points fixed)
    case 'yams':
      if (value !== 50) {
        return { valid: false, message: 'Le Yams vaut 50 points ou 0 (barré)' };
      }
      return { valid: true };

    // Lower section - Chance (sum of 5 dice)
    case 'chance':
      if (value < 5 || value > 30) {
        return { valid: false, message: 'La Chance doit être entre 5 et 30 (somme des 5 dés)' };
      }
      return { valid: true };

    default:
      return { valid: false, message: 'Catégorie invalide' };
  }
};

/**
 * Calculate upper section total
 */
export const calculateUpperTotal = (scores: PlayerScores): number => {
  const upperCategories: (keyof PlayerScores)[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

  let total = 0;
  for (const category of upperCategories) {
    const entry = scores[category];
    if (typeof entry === 'object' && entry.value !== null) {
      total += entry.value;
    }
  }

  return total;
};

/**
 * Calculate if upper bonus is earned (>= 63 points)
 */
export const calculateUpperBonus = (upperTotal: number): number => {
  return upperTotal >= 63 ? 35 : 0;
};

/**
 * Calculate lower section total
 */
export const calculateLowerTotal = (scores: PlayerScores): number => {
  const lowerCategories: (keyof PlayerScores)[] = [
    'threeOfKind',
    'fourOfKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'yams',
    'chance',
  ];

  let total = 0;
  for (const category of lowerCategories) {
    const entry = scores[category];
    if (typeof entry === 'object' && entry.value !== null) {
      total += entry.value;
    }
  }

  return total;
};

/**
 * Calculate grand total (upper + bonus + lower)
 */
export const calculateGrandTotal = (scores: PlayerScores): number => {
  const upperTotal = calculateUpperTotal(scores);
  const upperBonus = calculateUpperBonus(upperTotal);
  const lowerTotal = calculateLowerTotal(scores);

  return upperTotal + upperBonus + lowerTotal;
};

/**
 * Update all calculated totals for a player
 */
export const updateTotals = (scores: PlayerScores): PlayerScores => {
  const upperTotal = calculateUpperTotal(scores);
  const upperBonus = calculateUpperBonus(upperTotal);
  const lowerTotal = calculateLowerTotal(scores);
  const grandTotal = upperTotal + upperBonus + lowerTotal;

  return {
    ...scores,
    upperTotal,
    upperBonus,
    lowerTotal,
    grandTotal,
  };
};

/**
 * Check if a category is already filled for a player
 */
export const isCategoryFilled = (scores: PlayerScores, category: CategoryType): boolean => {
  const entry = scores[category];
  return typeof entry === 'object' && entry.value !== null;
};

/**
 * Check if all categories are filled for a player (game complete for this player)
 */
export const isPlayerComplete = (scores: PlayerScores): boolean => {
  const allCategories: CategoryType[] = [
    'ones',
    'twos',
    'threes',
    'fours',
    'fives',
    'sixes',
    'threeOfKind',
    'fourOfKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'yams',
    'chance',
  ];

  return allCategories.every((category) => isCategoryFilled(scores, category));
};

/**
 * Get error message for validation
 */
export const getValidationErrorMessage = (category: CategoryType, value: number): string => {
  const result = validateScore(category, value);
  return result.message || 'Score invalide';
};
