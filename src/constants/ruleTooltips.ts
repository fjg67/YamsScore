/**
 * Tooltips détaillés pour chaque catégorie de score
 */

import { RuleTooltipData } from '../types/tutorial.types';
import { ScoreCategory } from '../types/game.types';

export const RULE_TOOLTIPS: Record<ScoreCategory, RuleTooltipData> = {
  ones: {
    category: 'ones',
    title: 'As (1️⃣)',
    description: 'Comptez tous les dés affichant 1',
    examples: [
      '🎲 1-1-1-2-3 = 3 points',
      '🎲 1-1-4-5-6 = 2 points',
      '🎲 1-2-3-4-5 = 1 point',
    ],
    scoring: 'Nombre de 1 × 1 point',
    tips: [
      'Visez 3+ pour contribuer au bonus',
      'Barrez si vous avez 0 ou 1',
    ],
    maxScore: 5,
  },

  twos: {
    category: 'twos',
    title: 'Deux (2️⃣)',
    description: 'Comptez tous les dés affichant 2',
    examples: [
      '🎲 2-2-2-1-3 = 6 points',
      '🎲 2-2-4-5-6 = 4 points',
      '🎲 2-3-4-5-6 = 2 points',
    ],
    scoring: 'Nombre de 2 × 2 points',
    tips: [
      'Visez 6+ pour contribuer au bonus',
      'Barrez si vous avez 1 seul dé',
    ],
    maxScore: 10,
  },

  threes: {
    category: 'threes',
    title: 'Trois (3️⃣)',
    description: 'Comptez tous les dés affichant 3',
    examples: [
      '🎲 3-3-3-1-2 = 9 points',
      '🎲 3-3-4-5-6 = 6 points',
      '🎲 3-4-5-6-1 = 3 points',
    ],
    scoring: 'Nombre de 3 × 3 points',
    tips: [
      'Visez 9+ pour contribuer au bonus',
      'Bon compromis score/bonus',
    ],
    maxScore: 15,
  },

  fours: {
    category: 'fours',
    title: 'Quatre (4️⃣)',
    description: 'Comptez tous les dés affichant 4',
    examples: [
      '🎲 4-4-4-1-2 = 12 points',
      '🎲 4-4-5-6-1 = 8 points',
      '🎲 4-5-6-1-2 = 4 points',
    ],
    scoring: 'Nombre de 4 × 4 points',
    tips: [
      'Visez 12+ pour contribuer au bonus',
      'Valeurs élevées recommandées',
    ],
    maxScore: 20,
  },

  fives: {
    category: 'fives',
    title: 'Cinq (5️⃣)',
    description: 'Comptez tous les dés affichant 5',
    examples: [
      '🎲 5-5-5-1-2 = 15 points',
      '🎲 5-5-6-1-2 = 10 points',
      '🎲 5-6-1-2-3 = 5 points',
    ],
    scoring: 'Nombre de 5 × 5 points',
    tips: [
      'Visez 15+ pour contribuer au bonus',
      'Catégorie à forte valeur',
    ],
    maxScore: 25,
  },

  sixes: {
    category: 'sixes',
    title: 'Six (6️⃣)',
    description: 'Comptez tous les dés affichant 6',
    examples: [
      '🎲 6-6-6-1-2 = 18 points',
      '🎲 6-6-5-1-2 = 12 points',
      '🎲 6-5-4-3-2 = 6 points',
    ],
    scoring: 'Nombre de 6 × 6 points',
    tips: [
      'Visez 18+ pour contribuer au bonus',
      'Catégorie la plus précieuse pour bonus',
    ],
    maxScore: 30,
  },

  threeOfKind: {
    category: 'threeOfKind',
    title: 'Brelan',
    description: '3 dés identiques - Somme de TOUS les dés',
    examples: [
      '🎲 4-4-4-6-5 = 23 points',
      '🎲 6-6-6-5-5 = 28 points',
      '🎲 1-1-1-6-6 = 15 points',
    ],
    scoring: 'Total des 5 dés si 3+ identiques',
    tips: [
      'Gardez les dés de haute valeur',
      'Peut sauver un mauvais lancer',
      'Maximum théorique: 30 (6-6-6-6-6)',
    ],
    maxScore: 30,
  },

  fourOfKind: {
    category: 'fourOfKind',
    title: 'Carré',
    description: '4 dés identiques - Somme de TOUS les dés',
    examples: [
      '🎲 5-5-5-5-3 = 23 points',
      '🎲 6-6-6-6-5 = 29 points',
      '🎲 2-2-2-2-6 = 14 points',
    ],
    scoring: 'Total des 5 dés si 4+ identiques',
    tips: [
      'Très rare, saisissez l\'opportunité',
      'Combinez avec dé de haute valeur',
      'Maximum théorique: 30 (6-6-6-6-6)',
    ],
    maxScore: 30,
  },

  fullHouse: {
    category: 'fullHouse',
    title: 'Full House 🏠',
    description: '3 dés identiques + 2 dés identiques',
    examples: [
      '🎲 3-3-3-5-5 = 25 points',
      '🎲 6-6-6-1-1 = 25 points',
      '🎲 2-2-4-4-4 = 25 points',
    ],
    scoring: 'Toujours 25 points (fixe)',
    tips: [
      'Score fixe, peu importe les chiffres',
      'Déclenche une célébration 🏠',
      'Ne passez pas à côté !',
    ],
    maxScore: 25,
  },

  smallStraight: {
    category: 'smallStraight',
    title: 'Petite Suite',
    description: '4 dés qui se suivent',
    examples: [
      '🎲 1-2-3-4-6 = 30 points',
      '🎲 2-3-4-5-1 = 30 points',
      '🎲 3-4-5-6-2 = 30 points',
    ],
    scoring: 'Toujours 30 points (fixe)',
    tips: [
      'Suite de 4: 1-2-3-4, 2-3-4-5, ou 3-4-5-6',
      'Le 5ème dé n\'a pas d\'importance',
      'Bon score garanti',
    ],
    maxScore: 30,
  },

  largeStraight: {
    category: 'largeStraight',
    title: 'Grande Suite 🚀',
    description: '5 dés qui se suivent',
    examples: [
      '🎲 1-2-3-4-5 = 40 points',
      '🎲 2-3-4-5-6 = 40 points',
    ],
    scoring: 'Toujours 40 points (fixe)',
    tips: [
      'Seulement 2 combinaisons possibles',
      'Score très élevé !',
      'Déclenche célébration fusée 🚀',
    ],
    maxScore: 40,
  },

  yams: {
    category: 'yams',
    title: 'YAMS 👑',
    description: '5 dés identiques - Le Graal !',
    examples: [
      '🎲 6-6-6-6-6 = 50 points',
      '🎲 3-3-3-3-3 = 50 points',
      '🎲 1-1-1-1-1 = 50 points',
    ],
    scoring: 'Toujours 50 points (fixe)',
    tips: [
      'Score maximum du jeu !',
      'Très rare, célébrez ! 👑',
      'Confettis dorés garantis',
      'Le chiffre n\'a pas d\'importance',
    ],
    maxScore: 50,
  },

  chance: {
    category: 'chance',
    title: 'Chance',
    description: 'Somme de TOUS les dés - Joker universel',
    examples: [
      '🎲 6-6-5-5-4 = 26 points',
      '🎲 6-6-6-6-3 = 27 points',
      '🎲 6-6-6-6-6 = 30 points',
    ],
    scoring: 'Total des 5 dés sans condition',
    tips: [
      'Utilisez pour sauver un mauvais coup',
      'Ou pour maximiser un excellent lancer',
      'Gardez pour la fin si possible',
      'Maximum: 30 (6-6-6-6-6)',
    ],
    maxScore: 30,
  },
};
