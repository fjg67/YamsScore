/**
 * Règles du jeu de Yams
 */

import { ScoreCategory, ScoreValidationRule } from '../types';

/**
 * Configuration du jeu
 */
export const GameConfig = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  UPPER_BONUS_THRESHOLD: 63, // Points nécessaires pour le bonus
  UPPER_BONUS_VALUE: 35, // Valeur du bonus
  DICE_COUNT: 5,
  DICE_FACES: 6,
  MAX_ROLLS_PER_TURN: 3,
};

/**
 * Valeurs fixes pour certaines catégories
 */
export const FixedScoreValues = {
  FULL_HOUSE: 25,
  SMALL_STRAIGHT: 30,
  LARGE_STRAIGHT: 40,
  YAMS: 50,
};

/**
 * Règles de validation pour chaque catégorie
 */
export const ScoreValidationRules: Record<ScoreCategory, ScoreValidationRule> = {
  // Section supérieure - somme des dés de cette valeur
  ones: {
    category: 'ones',
    minValue: 0,
    maxValue: 5, // 5 dés × 1
  },
  twos: {
    category: 'twos',
    minValue: 0,
    maxValue: 10, // 5 dés × 2
  },
  threes: {
    category: 'threes',
    minValue: 0,
    maxValue: 15, // 5 dés × 3
  },
  fours: {
    category: 'fours',
    minValue: 0,
    maxValue: 20, // 5 dés × 4
  },
  fives: {
    category: 'fives',
    minValue: 0,
    maxValue: 25, // 5 dés × 5
  },
  sixes: {
    category: 'sixes',
    minValue: 0,
    maxValue: 30, // 5 dés × 6
  },

  // Section inférieure
  threeOfKind: {
    category: 'threeOfKind',
    minValue: 0,
    maxValue: 30, // Maximum = 5×6
  },
  fourOfKind: {
    category: 'fourOfKind',
    minValue: 0,
    maxValue: 30, // Maximum = 5×6
  },
  fullHouse: {
    category: 'fullHouse',
    minValue: 0,
    maxValue: 25,
    fixedValue: 25,
  },
  smallStraight: {
    category: 'smallStraight',
    minValue: 0,
    maxValue: 30,
    fixedValue: 30,
  },
  largeStraight: {
    category: 'largeStraight',
    minValue: 0,
    maxValue: 40,
    fixedValue: 40,
  },
  yams: {
    category: 'yams',
    minValue: 0,
    maxValue: 50,
    fixedValue: 50,
  },
  chance: {
    category: 'chance',
    minValue: 0,
    maxValue: 30, // Maximum = 5×6
  },
};

/**
 * Catégories de la section supérieure
 */
export const UpperSectionCategories: ScoreCategory[] = [
  'ones',
  'twos',
  'threes',
  'fours',
  'fives',
  'sixes',
];

/**
 * Catégories de la section inférieure
 */
export const LowerSectionCategories: ScoreCategory[] = [
  'threeOfKind',
  'fourOfKind',
  'fullHouse',
  'smallStraight',
  'largeStraight',
  'yams',
  'chance',
];

/**
 * Toutes les catégories dans l'ordre d'affichage
 */
export const AllCategories: ScoreCategory[] = [
  ...UpperSectionCategories,
  ...LowerSectionCategories,
];

/**
 * Labels en français pour chaque catégorie
 */
export const CategoryLabels: Record<ScoreCategory, string> = {
  ones: '1 (As)',
  twos: '2 (Deux)',
  threes: '3 (Trois)',
  fours: '4 (Quatre)',
  fives: '5 (Cinq)',
  sixes: '6 (Six)',
  threeOfKind: 'Brelan',
  fourOfKind: 'Carré',
  fullHouse: 'Full',
  smallStraight: 'Petite Suite',
  largeStraight: 'Grande Suite',
  yams: 'Yams',
  chance: 'Chance',
};

/**
 * Descriptions pour chaque catégorie
 */
export const CategoryDescriptions: Record<ScoreCategory, string> = {
  ones: 'Somme de tous les dés montrant 1',
  twos: 'Somme de tous les dés montrant 2',
  threes: 'Somme de tous les dés montrant 3',
  fours: 'Somme de tous les dés montrant 4',
  fives: 'Somme de tous les dés montrant 5',
  sixes: 'Somme de tous les dés montrant 6',
  threeOfKind: '3 dés identiques - Total des 5 dés',
  fourOfKind: '4 dés identiques - Total des 5 dés',
  fullHouse: '3 dés identiques + 2 dés identiques - 25 points',
  smallStraight: '4 dés consécutifs - 30 points',
  largeStraight: '5 dés consécutifs - 40 points',
  yams: '5 dés identiques - 50 points',
  chance: 'N\'importe quelle combinaison - Total des 5 dés',
};
