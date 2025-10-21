/**
 * Constantes pour le système de tutoriel
 */

// Couleurs par niveau
export const TUTORIAL_COLORS = {
  beginner: {
    primary: '#4ECDC4',
    glow: 'rgba(78, 205, 196, 0.4)',
    gradient: ['#4ECDC4', '#44A08D'],
  },
  intermediate: {
    primary: '#FFB347',
    glow: 'rgba(255, 179, 71, 0.4)',
    gradient: ['#FFB347', '#FFCC33'],
  },
  expert: {
    primary: '#9B59B6',
    glow: 'rgba(155, 89, 182, 0.4)',
    gradient: ['#9B59B6', '#8E44AD'],
  },
} as const;

// Système d'XP
export const XP_REWARDS = {
  COMPLETE_STEP: 50,
  FIRST_TRY: 25,
  NO_SKIP: 100,
  SPEEDRUN: 150,
  PERFECT_RUN: 200,
} as const;

export const LEVEL_THRESHOLDS = {
  1: { name: 'Novice', xp: 0 },
  2: { name: 'Novice', xp: 100 },
  3: { name: 'Novice', xp: 250 },
  4: { name: 'Novice', xp: 400 },
  5: { name: 'Novice', xp: 500 },
  6: { name: 'Apprenti', xp: 650 },
  7: { name: 'Apprenti', xp: 850 },
  8: { name: 'Apprenti', xp: 1100 },
  9: { name: 'Apprenti', xp: 1350 },
  10: { name: 'Apprenti', xp: 1500 },
  11: { name: 'Compétent', xp: 1750 },
  12: { name: 'Compétent', xp: 2050 },
  13: { name: 'Compétent', xp: 2400 },
  14: { name: 'Compétent', xp: 2750 },
  15: { name: 'Compétent', xp: 3000 },
  16: { name: 'Expert', xp: 3350 },
  17: { name: 'Expert', xp: 3750 },
  18: { name: 'Expert', xp: 4200 },
  19: { name: 'Expert', xp: 4650 },
  20: { name: 'Expert', xp: 5000 },
  21: { name: 'Légende', xp: 5500 },
} as const;

// Patterns haptiques
export const HAPTIC_PATTERNS = {
  success: [50, 100, 50],
  error: [20, 50, 20, 50, 20],
  progression: [10, 30, 10],
  achievement: [100, 200, 100, 200],
} as const;

// Durées d'animation (ms)
export const ANIMATION_DURATIONS = {
  TRANSITION: 800,
  VALIDATION: 600,
  PROGRESS_BAR: 400,
  PARTICLE_BURST: 1000,
  CONFETTI: 2500,
  PAGE_FLIP: 800,
  TOOLTIP_SLIDE: 300,
  HOTSPOT_PULSE: 1000,
} as const;

// Easter eggs
export const EASTER_EGGS = {
  KONAMI_CODE: 'konami',
  SHAKE_IT: 'shake',
  LONG_PRESS: 'longpress',
  TRIPLE_TAP: 'tripletap',
  MIDNIGHT_MODE: 'midnight',
  REVERSE_SCROLL: 'reversescroll',
  DEVELOPER_MODE: 'devmode',
  TIME_TRAVELER: 'timetraveler',
  SILENT_GUARDIAN: 'silent',
  REFERRAL_MASTER: 'referral',
  SOCIAL_BUTTERFLY: 'social',
  COMPLETIONIST: 'completionist',
} as const;

// Seuils de temps pour speedrun
export const SPEEDRUN_THRESHOLDS = {
  beginner: 15 * 60, // 15 minutes
  intermediate: 8 * 60, // 8 minutes
  expert: 7 * 60, // 7 minutes
  total: 10 * 60, // 10 minutes total
} as const;

// Noms de joueurs suggérés amusants
export const SUGGESTED_PLAYER_NAMES = [
  'Roi des Dés',
  'Lucky Luke',
  'Yamseur Pro',
  'Dé-terminé',
  'Chance Infinie',
  'Maître Hasard',
  'Double Six',
  'Full House',
  'Suite Royale',
  'Brelan Gagnant',
] as const;

// Messages de motivation
export const MOTIVATIONAL_MESSAGES = {
  beginner: [
    'Super ! Tu progresses bien ! 🎲',
    'Continue comme ça ! 🌟',
    'Excellent début ! 👏',
    'Tu es sur la bonne voie ! 🎯',
  ],
  intermediate: [
    'Impressionnant ! 🚀',
    'Tu maîtrises de mieux en mieux ! 💪',
    'Niveau intermédiaire débloqué ! 🏆',
    'Tu deviens un expert ! ⭐',
  ],
  expert: [
    'Incroyable ! 👑',
    'Tu es un véritable maître ! 💎',
    'Performance exceptionnelle ! 🔥',
    'Légendaire ! ⚡',
  ],
} as const;
