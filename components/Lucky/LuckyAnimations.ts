/**
 * Lucky - Système d'Animations
 * Gère toutes les animations de Lucky
 */

import { LuckyAnimation, AnimationConfig } from './LuckyTypes';

export interface AnimationKeyframe {
  time: number; // 0-1 normalized time
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: number;
  opacity?: number;
}

export interface AnimationSequence {
  name: LuckyAnimation;
  duration: number;
  loop: boolean;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeOutElastic' | 'easeOutBounce';
  keyframes: AnimationKeyframe[];
  effects?: {
    sound?: string;
    haptic?: 'light' | 'medium' | 'heavy' | 'success';
    particles?: boolean;
  };
}

export class LuckyAnimations {
  private static animations: Record<LuckyAnimation, AnimationSequence> = {
    // ========== IDLE ANIMATIONS ==========
    idle: {
      name: 'idle',
      duration: 4000,
      loop: true,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.5, position: { x: 0, y: 0.08, z: 0 }, rotation: { x: 0, y: 0.02, z: 0 }, scale: 1.02 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.0 },
      ],
    },

    idle_look_around: {
      name: 'idle_look_around',
      duration: 3000,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.3, rotation: { x: 0, y: -0.3, z: 0 } },
        { time: 0.5, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.8, rotation: { x: 0, y: 0.3, z: 0 } },
        { time: 1, rotation: { x: 0, y: 0, z: 0 } },
      ],
    },

    idle_stretch: {
      name: 'idle_stretch',
      duration: 2000,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, scale: 1.0 },
        { time: 0.3, scale: 1.0, position: { x: 0, y: 0.1, z: 0 } },
        { time: 0.6, scale: 1.15, position: { x: 0, y: 0.15, z: 0 } },
        { time: 1, scale: 1.0, position: { x: 0, y: 0, z: 0 } },
      ],
    },

    idle_bounce: {
      name: 'idle_bounce',
      duration: 1000,
      loop: false,
      easing: 'easeOutBounce',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 } },
        { time: 0.5, position: { x: 0, y: 0.2, z: 0 } },
        { time: 1, position: { x: 0, y: 0, z: 0 } },
      ],
    },

    idle_spin: {
      name: 'idle_spin',
      duration: 2500,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.25, rotation: { x: Math.PI / 4, y: Math.PI / 2, z: Math.PI / 4 } },
        { time: 0.5, rotation: { x: Math.PI / 2, y: Math.PI, z: Math.PI / 2 } },
        { time: 0.75, rotation: { x: Math.PI, y: Math.PI * 1.5, z: Math.PI } },
        { time: 1, rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 } },
      ],
    },

    // ========== ENTRÉE ==========
    enter_pop: {
      name: 'enter_pop',
      duration: 1200,
      loop: false,
      easing: 'easeOutBounce',
      keyframes: [
        { time: 0, position: { x: 0, y: 2, z: 0 }, scale: 0, rotation: { x: 0, y: 0, z: 0 }, opacity: 0 },
        { time: 0.4, position: { x: 0, y: 0.3, z: 0 }, scale: 1.2, rotation: { x: Math.PI, y: Math.PI, z: Math.PI }, opacity: 1 },
        { time: 0.7, position: { x: 0, y: -0.1, z: 0 }, scale: 0.9, rotation: { x: Math.PI * 2, y: Math.PI * 1.5, z: Math.PI * 2 }, opacity: 1 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, scale: 1.0, rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 }, opacity: 1 },
      ],
      effects: {
        sound: 'dice-roll.mp3',
        haptic: 'medium',
        particles: true,
      },
    },

    enter_slide: {
      name: 'enter_slide',
      duration: 600,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: 3, y: 0, z: 0 }, opacity: 0 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, opacity: 1 },
      ],
    },

    enter_beam: {
      name: 'enter_beam',
      duration: 1000,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, scale: 0, opacity: 0 },
        { time: 0.7, position: { x: 0, y: 0, z: 0 }, scale: 1.2, opacity: 0.5 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, scale: 1.0, opacity: 1 },
      ],
      effects: {
        particles: true,
      },
    },

    enter_roll: {
      name: 'enter_roll',
      duration: 1500,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: -3, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.3, position: { x: -2, y: 0.3, z: 0 }, rotation: { x: Math.PI, y: 0, z: Math.PI * 2 } },
        { time: 0.6, position: { x: -0.8, y: 0.1, z: 0 }, rotation: { x: Math.PI * 2, y: 0, z: Math.PI * 4 } },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: Math.PI * 3, y: 0, z: Math.PI * 6 } },
      ],
      effects: {
        sound: 'dice-roll.mp3',
        haptic: 'medium',
      },
    },

    enter_fade: {
      name: 'enter_fade',
      duration: 800,
      loop: false,
      easing: 'easeIn',
      keyframes: [
        { time: 0, opacity: 0, scale: 1.2 },
        { time: 1, opacity: 1, scale: 1.0 },
      ],
    },

    // ========== RÉACTIONS ==========
    celebrate_low: {
      name: 'celebrate_low',
      duration: 800,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.3, rotation: { x: 0.2, y: 0, z: 0 } },
        { time: 0.6, rotation: { x: -0.2, y: 0, z: 0 } },
        { time: 1, rotation: { x: 0, y: 0, z: 0 } },
      ],
      effects: {
        haptic: 'light',
      },
    },

    celebrate_medium: {
      name: 'celebrate_medium',
      duration: 1200,
      loop: false,
      easing: 'easeOutBounce',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.4, position: { x: 0, y: 0.3, z: 0 }, scale: 1.1 },
        { time: 0.6, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.8, position: { x: 0, y: 0.15, z: 0 }, scale: 1.05 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
      ],
      effects: {
        haptic: 'medium',
        particles: true,
      },
    },

    celebrate_high: {
      name: 'celebrate_high',
      duration: 1500,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.3, position: { x: 0, y: 0.5, z: 0 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: 1.2 },
        { time: 0.6, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI * 2, z: 0 }, scale: 1.0 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: Math.PI * 2, z: 0 }, scale: 1.0 },
      ],
      effects: {
        sound: 'celebrate.mp3',
        haptic: 'heavy',
        particles: true,
      },
    },

    celebrate_epic: {
      name: 'celebrate_epic',
      duration: 3500,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.15, position: { x: 0, y: 1.2, z: 0 }, rotation: { x: Math.PI, y: Math.PI, z: Math.PI }, scale: 1.4 },
        { time: 0.3, position: { x: 0, y: 0.8, z: 0 }, rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 }, scale: 1.6 },
        { time: 0.5, position: { x: 0, y: 1.0, z: 0 }, rotation: { x: Math.PI * 3, y: Math.PI * 3, z: Math.PI * 3 }, scale: 1.5 },
        { time: 0.7, position: { x: 0, y: 0.5, z: 0 }, rotation: { x: Math.PI * 4, y: Math.PI * 4, z: Math.PI * 4 }, scale: 1.4 },
        { time: 0.85, position: { x: 0, y: 0.2, z: 0 }, rotation: { x: Math.PI * 5, y: Math.PI * 5, z: Math.PI * 5 }, scale: 1.3 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: Math.PI * 6, y: Math.PI * 6, z: Math.PI * 6 }, scale: 1.2 },
      ],
      effects: {
        sound: 'yams-celebration.mp3',
        haptic: 'success',
        particles: true,
      },
    },

    mega_celebration: {
      name: 'mega_celebration',
      duration: 4000,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.1, position: { x: -0.1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: -0.2 }, scale: 1.0 },
        { time: 0.2, position: { x: 0.1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0.2 }, scale: 1.1 },
        { time: 0.3, position: { x: -0.1, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: -0.2 }, scale: 1.0 },
        { time: 0.4, position: { x: 0, y: 1.5, z: 0 }, rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 }, scale: 1.8 },
        { time: 0.6, position: { x: 0, y: 1.2, z: 0 }, rotation: { x: Math.PI * 4, y: Math.PI * 4, z: Math.PI * 4 }, scale: 1.7 },
        { time: 0.8, position: { x: 0, y: 0.5, z: 0 }, rotation: { x: Math.PI * 6, y: Math.PI * 6, z: Math.PI * 6 }, scale: 1.5 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: Math.PI * 8, y: Math.PI * 8, z: Math.PI * 8 }, scale: 1.3 },
      ],
      effects: {
        sound: 'mega-yams.mp3',
        haptic: 'success',
        particles: true,
      },
    },

    sad_droop: {
      name: 'sad_droop',
      duration: 1500,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.5, position: { x: 0, y: -0.1, z: 0 }, scale: 0.95 },
        { time: 1, position: { x: 0, y: -0.1, z: 0 }, scale: 0.95 },
      ],
    },

    nod: {
      name: 'nod',
      duration: 600,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.5, rotation: { x: 0.3, y: 0, z: 0 } },
        { time: 1, rotation: { x: 0, y: 0, z: 0 } },
      ],
    },

    jump: {
      name: 'jump',
      duration: 800,
      loop: false,
      easing: 'easeOutBounce',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 } },
        { time: 0.5, position: { x: 0, y: 0.5, z: 0 } },
        { time: 1, position: { x: 0, y: 0, z: 0 } },
      ],
    },

    spin_jump: {
      name: 'spin_jump',
      duration: 1800,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.3, position: { x: 0, y: 0.7, z: 0 }, rotation: { x: Math.PI, y: Math.PI, z: Math.PI } },
        { time: 0.6, position: { x: 0, y: 0.5, z: 0 }, rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 } },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: Math.PI * 3, y: Math.PI * 3, z: Math.PI * 3 } },
      ],
      effects: {
        sound: 'dice-tumble.mp3',
        haptic: 'medium',
      },
    },

    // ========== ANIMATIONS YAMS SPÉCIFIQUES ==========
    dice_shake: {
      name: 'dice_shake',
      duration: 1200,
      loop: false,
      easing: 'linear',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.1, position: { x: -0.15, y: 0.1, z: 0 }, rotation: { x: 0.3, y: -0.3, z: 0.2 } },
        { time: 0.2, position: { x: 0.15, y: -0.05, z: 0 }, rotation: { x: -0.2, y: 0.4, z: -0.3 } },
        { time: 0.3, position: { x: -0.1, y: 0.08, z: 0 }, rotation: { x: 0.4, y: -0.2, z: 0.3 } },
        { time: 0.4, position: { x: 0.12, y: -0.08, z: 0 }, rotation: { x: -0.3, y: 0.3, z: -0.2 } },
        { time: 0.5, position: { x: -0.08, y: 0.1, z: 0 }, rotation: { x: 0.2, y: -0.4, z: 0.4 } },
        { time: 0.6, position: { x: 0.1, y: -0.06, z: 0 }, rotation: { x: -0.4, y: 0.2, z: -0.3 } },
        { time: 0.7, position: { x: -0.12, y: 0.07, z: 0 }, rotation: { x: 0.3, y: -0.3, z: 0.2 } },
        { time: 0.8, position: { x: 0.08, y: -0.09, z: 0 }, rotation: { x: -0.2, y: 0.4, z: -0.4 } },
        { time: 0.9, position: { x: -0.05, y: 0.05, z: 0 }, rotation: { x: 0.1, y: -0.2, z: 0.1 } },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      ],
      effects: {
        sound: 'dice-shake.mp3',
        haptic: 'medium',
      },
    },

    dice_roll_table: {
      name: 'dice_roll_table',
      duration: 2000,
      loop: false,
      easing: 'easeOut',
      keyframes: [
        { time: 0, position: { x: -1, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 0.8 },
        { time: 0.2, position: { x: -0.5, y: 0.3, z: 0 }, rotation: { x: Math.PI / 2, y: Math.PI / 2, z: Math.PI / 3 }, scale: 0.9 },
        { time: 0.4, position: { x: 0, y: 0.15, z: 0 }, rotation: { x: Math.PI, y: Math.PI, z: Math.PI }, scale: 1.0 },
        { time: 0.6, position: { x: 0.3, y: 0.08, z: 0 }, rotation: { x: Math.PI * 1.5, y: Math.PI * 1.5, z: Math.PI * 1.8 }, scale: 1.0 },
        { time: 0.8, position: { x: 0.1, y: 0.03, z: 0 }, rotation: { x: Math.PI * 1.8, y: Math.PI * 1.8, z: Math.PI * 2 }, scale: 1.0 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 }, scale: 1.0 },
      ],
      effects: {
        sound: 'dice-roll.mp3',
        haptic: 'heavy',
      },
    },

    // ========== TUTORIEL ==========
    point: {
      name: 'point',
      duration: 1000,
      loop: true,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 } },
        { time: 0.5, position: { x: 0, y: 0.1, z: 0 } },
        { time: 1, position: { x: 0, y: 0, z: 0 } },
      ],
    },

    wave: {
      name: 'wave',
      duration: 600,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.25, rotation: { x: 0, y: 0, z: -0.3 } },
        { time: 0.5, rotation: { x: 0, y: 0, z: 0.3 } },
        { time: 0.75, rotation: { x: 0, y: 0, z: -0.3 } },
        { time: 1, rotation: { x: 0, y: 0, z: 0 } },
      ],
    },

    bounce_attention: {
      name: 'bounce_attention',
      duration: 800,
      loop: true,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.5, position: { x: 0, y: 0.15, z: 0 }, scale: 1.05 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
      ],
    },

    // ========== MICRO-ANIMATIONS ==========
    blink: {
      name: 'blink',
      duration: 150,
      loop: false,
      easing: 'linear',
      keyframes: [
        { time: 0, scale: 1.0 },
        { time: 0.5, scale: 1.0 },
        { time: 1, scale: 1.0 },
      ],
    },

    tilt_head: {
      name: 'tilt_head',
      duration: 800,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, rotation: { x: 0, y: 0, z: 0 } },
        { time: 0.5, rotation: { x: 0, y: 0, z: 0.3 } },
        { time: 1, rotation: { x: 0, y: 0, z: 0 } },
      ],
    },

    puff_chest: {
      name: 'puff_chest',
      duration: 800,
      loop: false,
      easing: 'easeInOut',
      keyframes: [
        { time: 0, scale: 1.0 },
        { time: 0.5, scale: 1.1 },
        { time: 1, scale: 1.05 },
      ],
    },

    bounce_quick: {
      name: 'bounce_quick',
      duration: 400,
      loop: false,
      easing: 'easeOutBounce',
      keyframes: [
        { time: 0, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
        { time: 0.5, position: { x: 0, y: 0.1, z: 0 }, scale: 1.05 },
        { time: 1, position: { x: 0, y: 0, z: 0 }, scale: 1.0 },
      ],
      effects: {
        haptic: 'light',
      },
    },
  };

  static getAnimation(animation: LuckyAnimation): AnimationSequence {
    return this.animations[animation] || this.animations.idle;
  }

  static getAnimationForScore(scoreValue: number): LuckyAnimation {
    if (scoreValue === 0) return 'sad_droop';
    if (scoreValue < 15) return 'nod';
    if (scoreValue < 25) return 'celebrate_medium';
    if (scoreValue < 40) return 'celebrate_high';
    if (scoreValue >= 50) return 'celebrate_epic'; // Yams
    return 'jump';
  }

  static getRandomIdleVariation(): LuckyAnimation {
    const variations: LuckyAnimation[] = ['idle_look_around', 'idle_stretch', 'idle_bounce', 'idle_spin'];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  /**
   * Easing functions pour interpolation
   */
  static easing = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeOutElastic: (t: number) => {
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
    },
    easeOutBounce: (t: number) => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    },
  };

  /**
   * Interpolation entre deux keyframes
   */
  static interpolate(from: AnimationKeyframe, to: AnimationKeyframe, progress: number, easingFn: (t: number) => number): AnimationKeyframe {
    const t = easingFn(progress);

    return {
      time: progress,
      position: from.position && to.position ? {
        x: from.position.x + (to.position.x - from.position.x) * t,
        y: from.position.y + (to.position.y - from.position.y) * t,
        z: from.position.z + (to.position.z - from.position.z) * t,
      } : undefined,
      rotation: from.rotation && to.rotation ? {
        x: from.rotation.x + (to.rotation.x - from.rotation.x) * t,
        y: from.rotation.y + (to.rotation.y - from.rotation.y) * t,
        z: from.rotation.z + (to.rotation.z - from.rotation.z) * t,
      } : undefined,
      scale: from.scale !== undefined && to.scale !== undefined
        ? from.scale + (to.scale - from.scale) * t
        : undefined,
      opacity: from.opacity !== undefined && to.opacity !== undefined
        ? from.opacity + (to.opacity - from.opacity) * t
        : undefined,
    };
  }
}
