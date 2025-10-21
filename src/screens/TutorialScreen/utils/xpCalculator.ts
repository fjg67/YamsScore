/**
 * Calculateur d'XP et de niveaux
 */

import { LEVEL_THRESHOLDS, XP_REWARDS } from '../data/constants';

/**
 * Calcule le niveau actuel basé sur l'XP total
 */
export const calculateLevel = (totalXP: number): { level: number; name: string } => {
  let currentLevel = 1;
  let currentName = 'Novice';

  Object.entries(LEVEL_THRESHOLDS).forEach(([level, data]) => {
    const levelNum = parseInt(level);
    if (totalXP >= data.xp) {
      currentLevel = levelNum;
      currentName = data.name;
    }
  });

  return { level: currentLevel, name: currentName };
};

/**
 * Calcule l'XP nécessaire pour atteindre le prochain niveau
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  const nextLevel = currentLevel + 1;
  const threshold = LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS];
  return threshold ? threshold.xp : 0;
};

/**
 * Calcule le pourcentage de progression vers le prochain niveau
 */
export const getLevelProgress = (totalXP: number, currentLevel: number): number => {
  const currentLevelXP =
    LEVEL_THRESHOLDS[currentLevel as keyof typeof LEVEL_THRESHOLDS]?.xp || 0;
  const nextLevelXP = getXPForNextLevel(currentLevel);

  if (nextLevelXP === 0) return 100; // Niveau max atteint

  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;

  return Math.min(Math.round((xpInCurrentLevel / xpNeededForLevel) * 100), 100);
};

/**
 * Calcule l'XP restant pour le prochain niveau
 */
export const getXPRemainingForNextLevel = (
  totalXP: number,
  currentLevel: number
): number => {
  const nextLevelXP = getXPForNextLevel(currentLevel);
  if (nextLevelXP === 0) return 0;
  return Math.max(nextLevelXP - totalXP, 0);
};

/**
 * Calcule l'XP gagné pour une étape complétée
 */
export const calculateStepXP = (
  baseXP: number,
  options: {
    firstTry?: boolean;
    noSkip?: boolean;
    speedrun?: boolean;
    perfect?: boolean;
  } = {}
): number => {
  let totalXP = baseXP;

  if (options.firstTry) totalXP += XP_REWARDS.FIRST_TRY;
  if (options.noSkip) totalXP += XP_REWARDS.NO_SKIP;
  if (options.speedrun) totalXP += XP_REWARDS.SPEEDRUN;
  if (options.perfect) totalXP += XP_REWARDS.PERFECT_RUN;

  return totalXP;
};

/**
 * Vérifie si l'utilisateur a level up
 */
export const checkLevelUp = (
  oldXP: number,
  newXP: number
): { leveledUp: boolean; newLevel?: number; newName?: string } => {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);

  if (newLevel.level > oldLevel.level) {
    return {
      leveledUp: true,
      newLevel: newLevel.level,
      newName: newLevel.name,
    };
  }

  return { leveledUp: false };
};

/**
 * Obtient toutes les informations de niveau
 */
export const getLevelInfo = (totalXP: number) => {
  const { level, name } = calculateLevel(totalXP);
  const progress = getLevelProgress(totalXP, level);
  const remaining = getXPRemainingForNextLevel(totalXP, level);
  const nextLevelXP = getXPForNextLevel(level);

  return {
    level,
    name,
    progress,
    remaining,
    nextLevelXP,
    totalXP,
  };
};

/**
 * Obtient le nom du tier basé sur le niveau
 */
export const getLevelTier = (
  level: number
): 'novice' | 'apprenti' | 'competent' | 'expert' | 'legende' => {
  if (level >= 21) return 'legende';
  if (level >= 16) return 'expert';
  if (level >= 11) return 'competent';
  if (level >= 6) return 'apprenti';
  return 'novice';
};

/**
 * Obtient l'icône du niveau
 */
export const getLevelIcon = (level: number): string => {
  const tier = getLevelTier(level);
  const icons = {
    novice: '🌱',
    apprenti: '⭐',
    competent: '🔥',
    expert: '💎',
    legende: '👑',
  };
  return icons[tier];
};

/**
 * Obtient la couleur du niveau
 */
export const getLevelColor = (level: number): string => {
  const tier = getLevelTier(level);
  const colors = {
    novice: '#95E1D3',
    apprenti: '#FFB347',
    competent: '#FF6B6B',
    expert: '#9B59B6',
    legende: '#FFD700',
  };
  return colors[tier];
};
