/**
 * Animation System Types
 * Définit tous les types pour le système d'animations premium
 */

import { CategoryType } from '../types/game';

// ===== NIVEAUX D'INTENSITÉ =====
export type AnimationIntensity = 'minimal' | 'standard' | 'bon' | 'excellent' | 'ÉPIQUE' | 'LÉGENDAIRE';

// ===== CONFIGURATION CELLULE =====
export interface CellAnimationConfig {
  scale?: number[];
  rotate?: number[];
  opacity?: number[];
  duration: number;
  ease?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeOutBack' | 'easeOutElastic';
  delay?: number;
}

// ===== PARTICULES =====
export interface ParticleConfig {
  type: 'confetti' | 'sparkle' | 'star' | 'circle' | 'dots';
  count: number;
  colors: string[];
  size?: number;
  spread: number; // Angle en degrés
  velocity: number;
  gravity?: number;
  duration: number;
  delay?: number;
}

// ===== CONFETTI =====
export interface ConfettiConfig {
  count: number;
  colors: string[];
  spread: number;
  velocity: number;
  gravity?: number;
  duration: number;
}

// ===== GLOW / LUEUR =====
export interface GlowConfig {
  color: string;
  intensity: number; // 0 à 1
  radius: number;
  duration: number;
  pulse?: boolean;
}

// ===== FLASH ÉCRAN =====
export interface FlashConfig {
  color: string;
  opacity: number;
  duration: number;
  repeat?: number;
}

// ===== HAPTIC FEEDBACK =====
export interface HapticConfig {
  type: 'light' | 'medium' | 'heavy';
  pattern?: number[]; // Durées en ms
}

// ===== SON =====
export interface SoundConfig {
  file: string;
  volume: number; // 0 à 1
}

// ===== MESSAGE POPUP =====
export interface MessageConfig {
  text: string;
  fontSize?: number;
  color: string;
  position?: 'above' | 'center' | 'below';
  animation?: {
    scale?: number[];
    opacity?: number[];
    translateY?: number[];
    duration: number;
  };
}

// ===== MODAL CÉLÉBRATION =====
export interface CelebrationModalConfig {
  show: boolean;
  background?: string;
  content: {
    icon: string;
    iconSize: number;
    title: string;
    titleSize: number;
    titleColor: string;
    subtitle?: string;
    subtitleSize?: number;
    subtitleColor?: string;
  };
  animation: {
    scale: number[];
    opacity: number[];
    duration: number;
    ease?: string;
  };
  duration: number;
  closable: boolean;
}

// ===== CONFIGURATION GLOBALE ANIMATION =====
export interface ScoreAnimationConfig {
  name: string;
  intensity: AnimationIntensity;

  // Animation de la cellule
  cell?: CellAnimationConfig;

  // Effets particules
  particles?: ParticleConfig;
  confetti?: ConfettiConfig;

  // Effets visuels
  glow?: GlowConfig;
  flash?: FlashConfig;
  message?: MessageConfig;
  modal?: CelebrationModalConfig;

  // Feedback
  haptic?: HapticConfig;
  sound?: SoundConfig;

  // Metadata
  duration?: number;
}

// ===== CONTEXTE ANIMATION =====
export interface AnimationContext {
  isFirstScore?: boolean;
  isPersonalRecord?: boolean;
  comboCount?: number;
  isLastTurn?: boolean;
  isBonusEarned?: boolean;
  isCrossed?: boolean;
}

// ===== PARAMÈTRES POUR HOOK =====
export interface ScoreAnimationParams {
  category: CategoryType;
  score: number;
  playerColor: string;
  cellRef?: any;
  context?: AnimationContext;
}

// ===== HELPERS =====
export const INTENSITY_LEVELS: Record<AnimationIntensity, number> = {
  'minimal': 1,
  'standard': 2,
  'bon': 3,
  'excellent': 4,
  'ÉPIQUE': 5,
  'LÉGENDAIRE': 6,
};

/**
 * Détermine l'intensité d'animation selon le score
 */
export function getScoreIntensity(score: number, maxScore: number): AnimationIntensity {
  const ratio = score / maxScore;

  if (score === 0) return 'minimal';
  if (ratio <= 0.4) return 'minimal';
  if (ratio <= 0.6) return 'standard';
  if (ratio <= 0.8) return 'bon';
  if (ratio < 1.0) return 'excellent';
  return 'excellent'; // Score max
}
