/**
 * Lucky - Types et Interfaces
 * Définitions TypeScript pour la mascotte Lucky
 */

export type LuckyExpression =
  // Émotions basiques
  | 'neutral'
  | 'happy'
  | 'very_happy'
  | 'excited'
  | 'sad'
  | 'disappointed'
  | 'thinking'
  | 'encouraging'
  // Émotions avancées
  | 'surprised'
  | 'proud'
  | 'mischievous'
  | 'tired'
  | 'focused'
  | 'epic_victory'
  | 'defeated'
  | 'love'
  | 'panic'
  | 'determined'
  // Contextuelles
  | 'tutorial'
  | 'waiting'
  | 'celebration'
  | 'combo'
  | 'record'
  | 'sleeping'
  | 'error';

export interface LuckyExpressionData {
  eyes: {
    left: string;
    right: string;
    scale?: number;
  };
  mouth: string;
  color?: {
    body?: string;
    dots?: string;
    emissive?: string;
  };
  effects?: {
    particles?: ParticleEffect[];
    aura?: AuraEffect;
    screenFlash?: ScreenFlashEffect;
    accessories?: Accessory[];
  };
  bodyModifiers?: {
    rotation?: { x: number; y: number; z: number };
    scale?: number;
    position?: { x: number; y: number; z: number };
  };
}

export interface ParticleEffect {
  type: 'sparkle' | 'confetti' | 'firework' | 'star' | 'tear' | 'heart' | 'flame' | 'dice' | 'dots';
  count: number;
  color?: string | string[];
  continuous?: boolean;
  orbit?: boolean;
  interval?: number;
}

export interface AuraEffect {
  color: string;
  intensity: number;
  pulse?: boolean;
  type?: 'glow' | 'flame' | 'electric' | 'rainbow';
}

export interface ScreenFlashEffect {
  color: string;
  opacity: number;
  duration?: number;
}

export interface Accessory {
  type: 'crown' | 'hat' | 'trophy' | 'pointer' | 'clock';
  position?: { x: number; y: number; z: number };
  scale?: number;
}

export type LuckyAnimation =
  // Idle animations
  | 'idle'
  | 'idle_look_around'
  | 'idle_stretch'
  | 'idle_bounce'
  | 'idle_spin'
  // Entrée
  | 'enter_pop'
  | 'enter_slide'
  | 'enter_beam'
  | 'enter_roll'
  | 'enter_fade'
  // Réactions
  | 'celebrate_low'
  | 'celebrate_medium'
  | 'celebrate_high'
  | 'celebrate_epic'
  | 'sad_droop'
  | 'nod'
  | 'jump'
  | 'spin_jump'
  | 'mega_celebration'
  // Animations Yams spécifiques
  | 'dice_shake'
  | 'dice_roll_table'
  // Tutoriel
  | 'point'
  | 'wave'
  | 'bounce_attention'
  // Micro-animations
  | 'blink'
  | 'tilt_head'
  | 'puff_chest'
  | 'bounce_quick';

export interface AnimationConfig {
  duration: number;
  loop?: boolean;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeOutElastic' | 'easeOutBounce';
  delay?: number;
  onComplete?: () => void;
}

export interface LuckyPosition {
  x: number;
  y: number;
  placement?: 'center' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'floating';
}

export interface LuckyInteraction {
  onTap?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface LuckyContext {
  screen: 'home' | 'playerSetup' | 'game' | 'results' | 'history';
  gameState?: {
    currentScore: number;
    lastAction?: 'roll' | 'score' | 'combo' | 'yams';
    scoreValue?: number;
    isAITurn?: boolean;
  };
}

export interface LuckyState {
  expression: LuckyExpression;
  animation: LuckyAnimation;
  position: LuckyPosition;
  size: number;
  visible: boolean;
  minimized: boolean;
  context: LuckyContext;
}

export interface LuckyProps {
  initialExpression?: LuckyExpression;
  initialAnimation?: LuckyAnimation;
  size?: number;
  position?: LuckyPosition;
  context: LuckyContext;
  interactions?: LuckyInteraction;
  onExpressionChange?: (expression: LuckyExpression) => void;
  onAnimationComplete?: (animation: LuckyAnimation) => void;
}
