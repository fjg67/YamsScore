/**
 * Lucky - Bibliothèque d'Expressions
 * 25+ expressions pour toutes les situations
 */

import { LuckyExpression, LuckyExpressionData } from './LuckyTypes';

export class LuckyExpressions {
  private static expressions: Record<LuckyExpression, LuckyExpressionData> = {
    // ========== ÉMOTIONS BASIQUES ==========
    neutral: {
      eyes: { left: '●', right: '●' },
      mouth: '___',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
    },

    happy: {
      eyes: { left: '●', right: '●', scale: 1.1 },
      mouth: '\\_____/',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      effects: {
        particles: [
          { type: 'star', count: 5, color: '#4A90E2' },
        ],
      },
    },

    very_happy: {
      eyes: { left: '^', right: '^' },
      mouth: '\\______/',
      color: {
        body: '#FFF4E0', // Teinte plus chaude
        dots: '#2C3E50',
      },
      effects: {
        particles: [
          { type: 'sparkle', count: 20, color: '#FFD700' },
        ],
      },
    },

    excited: {
      eyes: { left: '◉', right: '◉', scale: 1.3 },
      mouth: 'O',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
        emissive: '#FFD700',
      },
      effects: {
        particles: [
          { type: 'sparkle', count: 15, color: ['#FFD700', '#FF6B6B'], continuous: true },
        ],
        aura: {
          color: '#FFD700',
          intensity: 0.4,
          pulse: true,
        },
      },
    },

    sad: {
      eyes: { left: '●', right: '●' },
      mouth: '/‾‾‾\\',
      color: {
        body: '#E8E8DC', // Teinte plus froide
        dots: '#2C3E50',
      },
      bodyModifiers: {
        scale: 0.95,
      },
    },

    disappointed: {
      eyes: { left: '-', right: '-' },
      mouth: '__',
      color: {
        body: '#E8E8DC',
        dots: '#2C3E50',
      },
      effects: {
        particles: [
          { type: 'tear', count: 1, color: '#4A90E2' },
        ],
      },
    },

    thinking: {
      eyes: { left: '●', right: '●' },
      mouth: '~',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      bodyModifiers: {
        rotation: { x: 0, y: 0.2, z: 0 },
      },
    },

    encouraging: {
      eyes: { left: '●', right: '●' },
      mouth: '\\_____/',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      effects: {
        aura: {
          color: '#FFD700',
          intensity: 0.3,
          pulse: true,
        },
      },
    },

    // ========== ÉMOTIONS AVANCÉES ==========
    surprised: {
      eyes: { left: '⚪', right: '⚪', scale: 1.4 },
      mouth: 'O',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      bodyModifiers: {
        position: { x: 0, y: 0.1, z: 0 },
      },
    },

    proud: {
      eyes: { left: '^', right: '_', scale: 1.0 },
      mouth: '\\_/',
      color: {
        body: '#FFF4E0',
        dots: '#2C3E50',
      },
      effects: {
        accessories: [
          { type: 'crown', position: { x: 0, y: 1.2, z: 0 }, scale: 0.3 },
        ],
      },
      bodyModifiers: {
        scale: 1.05,
      },
    },

    mischievous: {
      eyes: { left: '●', right: '•' },
      mouth: '\\_‾',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      bodyModifiers: {
        rotation: { x: 0, y: 0, z: -0.15 },
      },
    },

    tired: {
      eyes: { left: '-', right: '-' },
      mouth: '~',
      color: {
        body: '#E8E8DC',
        dots: '#2C3E50',
      },
      effects: {
        particles: [
          { type: 'sparkle', count: 3, color: '#87CEEB' }, // Zzz simulés
        ],
      },
    },

    focused: {
      eyes: { left: '>', right: '<' },
      mouth: '__',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      effects: {
        aura: {
          color: '#4A90E2',
          intensity: 0.5,
          type: 'electric',
        },
      },
    },

    epic_victory: {
      eyes: { left: '☆', right: '☆' },
      mouth: '\\____/',
      color: {
        body: '#FFD700',
        dots: '#2C3E50',
        emissive: '#FFD700',
      },
      effects: {
        particles: [
          { type: 'confetti', count: 100, color: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3'], continuous: true },
          { type: 'firework', count: 5, color: '#FFD700', interval: 300 },
          { type: 'sparkle', count: 50, color: '#FFFFFF', orbit: true },
        ],
        aura: {
          color: '#FFD700',
          intensity: 0.8,
          pulse: true,
          type: 'rainbow',
        },
        screenFlash: {
          color: '#FFD700',
          opacity: 0.3,
        },
        accessories: [
          { type: 'crown', position: { x: 0, y: 1.2, z: 0 }, scale: 0.4 },
        ],
      },
      bodyModifiers: {
        scale: 1.2,
      },
    },

    defeated: {
      eyes: { left: 'X', right: 'X' },
      mouth: '~',
      color: {
        body: '#D4C5B9',
        dots: '#2C3E50',
      },
      bodyModifiers: {
        rotation: { x: 0, y: 0, z: 1.57 }, // 90 degrés (tombé sur le côté)
        scale: 0.9,
      },
      effects: {
        particles: [
          { type: 'star', count: 3, color: '#FFD700' }, // Étoiles qui tournent
        ],
      },
    },

    love: {
      eyes: { left: '♥', right: '♥' },
      mouth: '\\_____/',
      color: {
        body: '#FFE4E1',
        dots: '#FF69B4',
      },
      effects: {
        particles: [
          { type: 'heart', count: 10, color: '#FF69B4', continuous: true },
        ],
      },
    },

    panic: {
      eyes: { left: '◉', right: '◉', scale: 1.5 },
      mouth: '╳',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
    },

    determined: {
      eyes: { left: '•', right: '•' },
      mouth: '___',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      effects: {
        aura: {
          color: '#4A90E2',
          intensity: 0.6,
          pulse: true,
          type: 'flame',
        },
      },
    },

    // ========== ÉMOTIONS CONTEXTUELLES ==========
    tutorial: {
      eyes: { left: '●', right: '●' },
      mouth: 'o',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      effects: {
        accessories: [
          { type: 'pointer', position: { x: 0.8, y: 0, z: 0 }, scale: 0.5 },
        ],
      },
    },

    waiting: {
      eyes: { left: '●', right: '●' },
      mouth: '___',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
      effects: {
        accessories: [
          { type: 'clock', position: { x: 0, y: 1.2, z: 0 }, scale: 0.3 },
        ],
      },
    },

    celebration: {
      eyes: { left: '^', right: '^' },
      mouth: '\\____/',
      color: {
        body: '#FFF4E0',
        dots: '#2C3E50',
      },
      effects: {
        particles: [
          { type: 'confetti', count: 50, color: ['#FF6B6B', '#4ECDC4', '#FFD93D'] },
        ],
        accessories: [
          { type: 'hat', position: { x: 0, y: 1.2, z: 0 }, scale: 0.3 },
        ],
      },
    },

    combo: {
      eyes: { left: '●', right: '●' },
      mouth: '!',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
        emissive: '#FF6B6B',
      },
      effects: {
        aura: {
          color: '#FF6B6B',
          intensity: 0.7,
          pulse: true,
          type: 'flame',
        },
      },
    },

    record: {
      eyes: { left: '☆', right: '☆' },
      mouth: 'O',
      color: {
        body: '#FFD700',
        dots: '#2C3E50',
        emissive: '#FFD700',
      },
      effects: {
        particles: [
          { type: 'sparkle', count: 30, color: '#FFD700', orbit: true },
        ],
        aura: {
          color: '#FFD700',
          intensity: 0.8,
          pulse: true,
          type: 'rainbow',
        },
        accessories: [
          { type: 'trophy', position: { x: 0, y: -1.2, z: 0 }, scale: 0.4 },
        ],
      },
    },

    sleeping: {
      eyes: { left: '-', right: '-' },
      mouth: '~',
      color: {
        body: '#E8E8DC',
        dots: '#2C3E50',
      },
      bodyModifiers: {
        rotation: { x: 0, y: 0, z: 0.3 },
      },
      effects: {
        particles: [
          { type: 'sparkle', count: 3, color: '#87CEEB', continuous: true, interval: 2000 },
        ],
      },
    },

    error: {
      eyes: { left: '@', right: '@' },
      mouth: '?',
      color: {
        body: '#F5F5DC',
        dots: '#2C3E50',
      },
    },
  };

  static getExpression(expression: LuckyExpression): LuckyExpressionData {
    return this.expressions[expression] || this.expressions.neutral;
  }

  static getRandomExpression(category?: 'happy' | 'sad' | 'neutral'): LuckyExpression {
    const categories = {
      happy: ['happy', 'very_happy', 'excited', 'proud', 'celebration'] as LuckyExpression[],
      sad: ['sad', 'disappointed', 'tired', 'defeated'] as LuckyExpression[],
      neutral: ['neutral', 'thinking', 'waiting'] as LuckyExpression[],
    };

    const pool = category ? categories[category] : Object.keys(this.expressions) as LuckyExpression[];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  static getExpressionForScore(scoreValue: number): LuckyExpression {
    if (scoreValue === 0) return 'sad';
    if (scoreValue < 15) return 'neutral';
    if (scoreValue < 25) return 'happy';
    if (scoreValue < 40) return 'very_happy';
    if (scoreValue >= 50) return 'epic_victory'; // Yams
    return 'excited';
  }
}
