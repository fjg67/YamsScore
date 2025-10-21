/**
 * Types pour le système de tutoriel ultra premium
 */

export type TutorialLevel = 'beginner' | 'intermediate' | 'expert';
export type TutorialMode = 'guided' | 'express' | 'free' | 'challenge';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'secret';

export interface TutorialStep {
  id: string;
  level: TutorialLevel;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  videoUrl?: string;
  estimatedDuration: number; // en secondes
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
  attempts: number;
  perfectRun: boolean; // Complété sans erreur
  speedrunTime?: number; // Temps de complétion
}

export interface Badge {
  id: string;
  tier: BadgeTier;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  hidden: boolean; // Pour les badges secrets
  progress?: number; // 0-100 pour les badges avec progression
  requirement: string;
}

export interface TutorialProgress {
  // XP & Niveau
  totalXP: number;
  level: number;
  levelName: string; // Novice, Apprenti, Compétent, Expert, Légende

  // Progression par niveau de difficulté
  beginnerProgress: number; // 0-100
  intermediateProgress: number;
  expertProgress: number;

  // Étapes
  completedSteps: string[];
  currentStepId: string | null;
  totalSteps: number;

  // Badges
  unlockedBadges: string[];
  totalBadges: number;

  // Stats
  totalPlayTime: number; // en secondes
  fastestCompletion: number;
  perfectRuns: number;

  // Modes
  preferredMode: TutorialMode;
  unlockedModes: TutorialMode[];

  // Easter eggs
  secretsFound: string[];

  // Timestamps
  startedAt: Date;
  lastPlayedAt: Date;
  completedAt?: Date;
}

export interface LevelInfo {
  level: TutorialLevel;
  name: string;
  icon: string;
  color: string;
  gradient: string[];
  glowColor: string;
  steps: TutorialStep[];
  requiredSteps: number;
  rewardBadges: string[];
  rewardThemes?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  condition: (progress: TutorialProgress) => boolean;
}

export interface HapticPattern {
  pattern: number[];
  type: 'success' | 'error' | 'progression' | 'achievement';
}

export interface SoundEffect {
  id: string;
  type: 'validation' | 'error' | 'milestone' | 'achievement' | 'transition';
  frequency?: number;
  duration: number;
}

export interface TooltipConfig {
  message: string;
  type: 'info' | 'tip' | 'warning' | 'pro';
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  dismissAfter?: number;
  showOnce?: boolean;
}

export interface HotSpotConfig {
  x: number;
  y: number;
  size: number;
  label: string;
  pulseSpeed: number;
  autoFocusDelay?: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  time: number;
  stars: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface TutorialSettings {
  animationSpeed: 'slow' | 'normal' | 'fast';
  hapticEnabled: boolean;
  soundVolume: 'mute' | 'low' | 'medium' | 'high';
  subtitlesEnabled: boolean;
  reducedMotion: boolean;
  colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
}

export interface TutorialAnalytics {
  stepId: string;
  startTime: Date;
  endTime?: Date;
  attempts: number;
  errorsCount: number;
  hintsUsed: number;
  skipped: boolean;
  completed: boolean;
}
