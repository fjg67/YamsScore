/**
 * Configuration des achievements de fin de partie
 */

import { AchievementType } from '../types/victory.types';

interface AchievementConfig {
  type: AchievementType;
  title: string;
  emoji: string;
  color: string;
}

export const ACHIEVEMENT_CONFIGS: Record<AchievementType, AchievementConfig> = {
  winner: {
    type: 'winner',
    title: 'Victoire !',
    emoji: '👑',
    color: '#FFD700',
  },
  second_place: {
    type: 'second_place',
    title: 'Vice-Champion',
    emoji: '🥈',
    color: '#C0C0C0',
  },
  third_place: {
    type: 'third_place',
    title: 'Médaille de Bronze',
    emoji: '🥉',
    color: '#CD7F32',
  },
  highest_score: {
    type: 'highest_score',
    title: 'Score Légendaire',
    emoji: '🌟',
    color: '#FFD700',
  },
  bonus_master: {
    type: 'bonus_master',
    title: 'Maître du Bonus',
    emoji: '⭐',
    color: '#4A90E2',
  },
  yams_king: {
    type: 'yams_king',
    title: 'Roi du Yams',
    emoji: '👑',
    color: '#FF6B6B',
  },
  perfect_player: {
    type: 'perfect_player',
    title: 'Joueur Parfait',
    emoji: '💎',
    color: '#50C878',
  },
  comeback_hero: {
    type: 'comeback_hero',
    title: 'Héros du Comeback',
    emoji: '🔥',
    color: '#FF8E53',
  },
  strategic_genius: {
    type: 'strategic_genius',
    title: 'Génie Stratégique',
    emoji: '🧠',
    color: '#8A2BE2',
  },
  lucky_roller: {
    type: 'lucky_roller',
    title: 'Chanceux Légendaire',
    emoji: '🎲',
    color: '#F39C12',
  },
};

// Victory messages variés pour plus de fun
export const VICTORY_MESSAGES = [
  'Victoire Éclatante !',
  'Champion Incontesté !',
  'Domination Totale !',
  'Victoire Royale !',
  'Performance Légendaire !',
  'Maître du Yams !',
  'Triomphe Absolu !',
  'Victoire Magistrale !',
];

// Messages pour le podium
export const PODIUM_MESSAGES = {
  first: [
    'Le meilleur joueur !',
    'Performance exceptionnelle !',
    'Stratégie parfaite !',
    'Victoire méritée !',
  ],
  second: [
    'Excellente partie !',
    'Presque la victoire !',
    'Belle performance !',
    'Très bien joué !',
  ],
  third: [
    'Bonne partie !',
    'Place sur le podium !',
    'Bien joué !',
    'Partie solide !',
  ],
};
