/**
 * Upper Section Animations Configuration
 * Animations pour les catégories 1-6 + Bonus
 */

import { ScoreAnimationConfig } from '../types';

/**
 * AS (1) - Animations selon le score
 */
export const getOnesAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    // Score barré
    return {
      name: 'ones_zero',
      intensity: 'minimal',
      cell: {
        scale: [1.0, 1.05, 1.0],
        duration: 300,
      },
      haptic: {
        type: 'light',
        pattern: [50],
      },
      sound: {
        file: 'cross-out.mp3',
        volume: 0.3,
      },
    };
  }

  if (score === 1) {
    // 1 seul as
    return {
      name: 'ones_single',
      intensity: 'minimal',
      cell: {
        scale: [1.0, 1.1, 1.0],
        duration: 500,
      },
      particles: {
        type: 'circle',
        count: 8,
        colors: ['#4A90E2', '#6BB6FF'],
        size: 8,
        spread: 70,
        velocity: 10,
        gravity: 0.35,
        duration: 1200,
      },
      haptic: {
        type: 'light',
        pattern: [],
      },
      message: {
        text: '🎯 Un As',
        fontSize: 18,
        color: '#4A90E2',
        position: 'above',
        animation: {
          scale: [0, 1.2, 1.0],
          opacity: [0, 1, 0],
          translateY: [-20, -40],
          duration: 1200,
        },
      },
    };
  }

  if (score === 2) {
    // 2 as
    return {
      name: 'ones_double',
      intensity: 'standard',
      cell: {
        scale: [1.0, 1.2, 1.0],
        duration: 650,
      },
      confetti: {
        count: 20,
        colors: ['#4A90E2', '#6BB6FF'],
        spread: 100,
        velocity: 15,
        gravity: 0.45,
        duration: 1800,
      },
      glow: {
        color: '#4A90E2',
        intensity: 0.4,
        radius: 30,
        duration: 800,
      },
      haptic: {
        type: 'light',
        pattern: [40],
      },
      message: {
        text: '🎯 Paire d\'As',
        fontSize: 20,
        color: '#4A90E2',
        position: 'above',
        animation: {
          scale: [0, 1.3, 1.0],
          opacity: [0, 1, 0],
          translateY: [-25, -50],
          duration: 1500,
        },
      },
    };
  }

  if (score === 3) {
    // 3 as
    return {
      name: 'ones_triple',
      intensity: 'bon',
      cell: {
        scale: [1.0, 1.35, 1.0],
        rotate: [0, 180, 360],
        duration: 900,
        ease: 'easeOutBack',
      },
      confetti: {
        count: 40,
        colors: ['#4A90E2', '#5DADE2', '#87CEEB'],
        spread: 130,
        velocity: 22,
        gravity: 0.42,
        duration: 2200,
      },
      glow: {
        color: '#4A90E2',
        intensity: 0.6,
        radius: 45,
        duration: 1200,
        pulse: true,
      },
      flash: {
        color: '#4A90E2',
        opacity: 0.3,
        duration: 200,
      },
      haptic: {
        type: 'medium',
        pattern: [50, 50],
      },
      sound: {
        file: 'score-standard.mp3',
        volume: 0.45,
      },
      message: {
        text: '🎯 Trio d\'As!',
        fontSize: 23,
        color: '#4A90E2',
        position: 'above',
        animation: {
          scale: [0, 1.4, 1.0],
          opacity: [0, 1, 1, 0],
          translateY: [-28, -60],
          duration: 1800,
        },
      },
    };
  }

  if (score === 4) {
    // 4 as
    return {
      name: 'ones_quadruple',
      intensity: 'excellent',
      cell: {
        scale: [1.0, 1.55, 1.1, 1.3, 1.0],
        rotate: [0, 270, 360],
        duration: 1150,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 70,
        colors: ['#4A90E2', '#5DADE2', '#87CEEB', '#00BFFF'],
        spread: 155,
        velocity: 28,
        gravity: 0.4,
        duration: 2800,
      },
      particles: {
        type: 'star',
        count: 28,
        colors: ['#4A90E2', '#FFD700'],
        size: 10,
        spread: 135,
        velocity: 24,
        gravity: 0.32,
        duration: 2500,
      },
      glow: {
        color: '#4A90E2',
        intensity: 0.75,
        radius: 55,
        duration: 1600,
        pulse: true,
      },
      flash: {
        color: '#4A90E2',
        opacity: 0.38,
        duration: 240,
        repeat: 2,
      },
      haptic: {
        type: 'heavy',
        pattern: [65, 40, 85],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.52,
      },
      message: {
        text: '🎯 Carré d\'As! ✨',
        fontSize: 26,
        color: '#4A90E2',
        position: 'above',
        animation: {
          scale: [0, 1.5, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-32, -72],
          duration: 2100,
        },
      },
    };
  }

  // Score 5 (maximum) - ULTRA PREMIUM 🎯
  return {
    name: 'ones_ultra_max',
    intensity: 'excellent',
    duration: 2500,
    cell: {
      scale: [1.0, 1.8, 1.2, 1.5, 1.0],
      rotate: [0, 360, 540],
      duration: 1400,
      ease: 'easeOutElastic',
    },
    confetti: {
      count: 100,
      colors: ['#4A90E2', '#5DADE2', '#87CEEB', '#00BFFF', '#1E90FF', '#FFD700'],
      spread: 170,
      velocity: 30,
      gravity: 0.4,
      duration: 3500,
    },
    particles: {
      type: 'star',
      count: 40,
      colors: ['#4A90E2', '#FFD700', '#FFFFFF'],
      size: 11,
      spread: 150,
      velocity: 28,
      gravity: 0.3,
      duration: 3000,
    },
    glow: {
      color: '#4A90E2',
      intensity: 0.9,
      radius: 65,
      duration: 2000,
      pulse: true,
    },
    flash: {
      color: '#4A90E2',
      opacity: 0.45,
      duration: 270,
      repeat: 3,
    },
    haptic: {
      type: 'heavy',
      pattern: [80, 50, 100, 50, 120],
    },
    sound: {
      file: 'score-good.mp3',
      volume: 0.6,
    },
    message: {
      text: '⭐ AS PARFAIT! 🎯',
      fontSize: 28,
      color: '#4A90E2',
      position: 'above',
      animation: {
        scale: [0, 1.6, 1.0],
        opacity: [0, 1, 1, 0.9, 0],
        translateY: [-35, -80],
        duration: 2500,
      },
    },
  };
};

/**
 * DEUX (2) - Animations par paires
 */
export const getTwosAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return getOnesAnimation(0);
  }

  const maxScore = 10;

  // Animations proportionnelles au score (2, 4, 6, 8 points)
  if (score < maxScore) {
    const ratio = score / maxScore;
    return {
      name: `twos_${score}`,
      intensity: ratio >= 0.8 ? 'excellent' : ratio >= 0.6 ? 'bon' : ratio >= 0.4 ? 'standard' : 'minimal',
      cell: {
        scale: [1.0, 1.0 + (ratio * 1.0), 1.0],
        rotate: ratio >= 0.6 ? [0, 180 * ratio] : undefined,
        duration: 600 + (ratio * 700),
        ease: ratio >= 0.6 ? 'easeOutElastic' : undefined,
      },
      confetti: ratio >= 0.4 ? {
        count: Math.floor(20 + (ratio * 70)),
        colors: ['#50C878', '#66CDAA', '#90EE90'],
        spread: 100 + (ratio * 65),
        velocity: 15 + (ratio * 17),
        gravity: 0.45 - (ratio * 0.07),
        duration: 1800 + (ratio * 1400),
      } : undefined,
      particles: ratio >= 0.3 ? {
        type: 'circle',
        count: Math.floor(8 + (ratio * 28)),
        colors: ['#50C878', '#90EE90'],
        spread: 90 + (ratio * 55),
        velocity: 15 + (ratio * 13),
        duration: 1200 + (ratio * 1600),
      } : undefined,
      glow: ratio >= 0.4 ? {
        color: '#50C878',
        intensity: 0.4 + (ratio * 0.45),
        radius: 30 + (ratio * 30),
        duration: 800 + (ratio * 1000),
        pulse: ratio >= 0.6,
      } : undefined,
      flash: ratio >= 0.8 ? {
        color: '#50C878',
        opacity: 0.35,
        duration: 250,
        repeat: 2,
      } : undefined,
      haptic: {
        type: ratio >= 0.6 ? 'heavy' : ratio >= 0.4 ? 'medium' : 'light',
        pattern: ratio >= 0.6 ? [70, 40, 70] : ratio >= 0.4 ? [60] : [],
      },
      sound: ratio >= 0.6 ? {
        file: 'score-good.mp3',
        volume: 0.45 + (ratio * 0.13),
      } : undefined,
      message: {
        text: `💚 ${score} point${score > 1 ? 's' : ''}`,
        fontSize: 18 + (ratio * 9),
        color: '#50C878',
        position: 'above',
        animation: {
          scale: [0, 1.2 + (ratio * 0.35), 1.0],
          opacity: [0, 1, 0],
          translateY: [-25, -45 - (ratio * 32)],
          duration: 1300 + (ratio * 1100),
        },
      },
    };
  }
  if (score === maxScore) {
    return {
      name: 'twos_ultra_max',
      intensity: 'excellent',
      duration: 2400,
      cell: {
        scale: [1.0, 1.15, 1.05, 1.15, 1.05, 1.15, 1.0], // Triple pulse (paire!)
        rotate: [0, 180, 360],
        duration: 1300,
        ease: 'easeOutBack',
      },
      confetti: {
        count: 90,
        colors: ['#50C878', '#66CDAA', '#90EE90', '#98FB98', '#00FA9A', '#FFD700'],
        spread: 165,
        velocity: 32,
        gravity: 0.38,
        duration: 3200,
      },
      particles: {
        type: 'circle',
        count: 36,
        colors: ['#50C878', '#FFD700', '#90EE90'],
        size: 10,
        spread: 145,
        velocity: 27,
        gravity: 0.32,
        duration: 2800,
      },
      glow: {
        color: '#50C878',
        intensity: 0.85,
        radius: 60,
        duration: 1800,
        pulse: true,
      },
      flash: {
        color: '#50C878',
        opacity: 0.42,
        duration: 260,
        repeat: 2,
      },
      haptic: {
        type: 'heavy',
        pattern: [70, 40, 70, 40, 110],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.58,
      },
      message: {
        text: '💚 PAIRE PARFAITE! ✨',
        fontSize: 27,
        color: '#50C878',
        position: 'above',
        animation: {
          scale: [0, 1.55, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-33, -77],
          duration: 2400,
        },
      },
    };
  }

  // Fallback (ne devrait pas arriver)
  return {
    name: 'twos_standard',
    intensity: 'standard',
    cell: {
      scale: [1.0, 1.1, 1.0],
      duration: 400,
    },
  };
};

/**
 * TROIS (3) - Motifs triangulaires
 */
export const getThreesAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return getOnesAnimation(0);
  }

  const maxScore = 15;

  // Animations progressives pour tous les scores
  if (score < maxScore) {
    const ratio = score / maxScore;
    return {
      name: `threes_${score}`,
      intensity: ratio >= 0.8 ? 'excellent' : ratio >= 0.6 ? 'bon' : ratio >= 0.4 ? 'standard' : 'minimal',
      cell: {
        scale: [1.0, 1.0 + (ratio * 1.1), 1.0],
        rotate: ratio >= 0.5 ? [0, 120 * ratio, 240 * ratio] : undefined,
        duration: 600 + (ratio * 850),
        ease: ratio >= 0.6 ? 'easeOutElastic' : undefined,
      },
      confetti: ratio >= 0.4 ? {
        count: Math.floor(20 + (ratio * 85)),
        colors: ['#FF6B6B', '#FF8787', '#FFA5A5'],
        spread: 100 + (ratio * 68),
        velocity: 15 + (ratio * 18),
        gravity: 0.45 - (ratio * 0.06),
        duration: 1800 + (ratio * 1500),
      } : undefined,
      particles: ratio >= 0.3 ? {
        type: 'star',
        count: Math.floor(9 + (ratio * 36)),
        colors: ['#FF6B6B', '#FFD700'],
        spread: 90 + (ratio * 62),
        velocity: 15 + (ratio * 14),
        duration: 1200 + (ratio * 1700),
      } : undefined,
      glow: ratio >= 0.4 ? {
        color: '#FF6B6B',
        intensity: 0.4 + (ratio * 0.48),
        radius: 30 + (ratio * 33),
        duration: 800 + (ratio * 1100),
        pulse: ratio >= 0.6,
      } : undefined,
      flash: ratio >= 0.7 ? {
        color: '#FF6B6B',
        opacity: 0.38,
        duration: 250,
        repeat: Math.floor(ratio * 3),
      } : undefined,
      haptic: {
        type: ratio >= 0.6 ? 'heavy' : ratio >= 0.4 ? 'medium' : 'light',
        pattern: ratio >= 0.6 ? [75, 45, 75, 45] : ratio >= 0.4 ? [60] : [],
      },
      sound: ratio >= 0.6 ? {
        file: 'score-good.mp3',
        volume: 0.45 + (ratio * 0.15),
      } : undefined,
      message: {
        text: `🔺 ${score} point${score > 1 ? 's' : ''}`,
        fontSize: 18 + (ratio * 10),
        color: '#FF6B6B',
        position: 'above',
        animation: {
          scale: [0, 1.2 + (ratio * 0.45), 1.0],
          opacity: [0, 1, ratio >= 0.6 ? 0.9 : 1, 0],
          translateY: [-25, -45 - (ratio * 37)],
          duration: 1300 + (ratio * 1300),
        },
      },
    };
  }
  if (score === maxScore) {
    return {
      name: 'threes_ultra_max',
      intensity: 'excellent',
      duration: 2600,
      cell: {
        rotate: [0, 120, 240, 360, 480, 600], // Double rotation triangulaire
        scale: [1.0, 1.7, 1.15, 1.45, 1.0],
        duration: 1450,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 105,
        colors: ['#FF6B6B', '#FF8787', '#FFA5A5', '#FF5252', '#FF4757', '#FFD700'],
        spread: 168,
        velocity: 33,
        gravity: 0.39,
        duration: 3300,
      },
      particles: {
        type: 'star',
        count: 45,
        colors: ['#FF6B6B', '#FFD700', '#FF8787'],
        size: 11,
        spread: 152,
        velocity: 29,
        gravity: 0.33,
        duration: 2900,
      },
      glow: {
        color: '#FF6B6B',
        intensity: 0.88,
        radius: 63,
        duration: 1900,
        pulse: true,
      },
      flash: {
        color: '#FF6B6B',
        opacity: 0.44,
        duration: 265,
        repeat: 3,
      },
      haptic: {
        type: 'heavy',
        pattern: [75, 45, 75, 45, 75, 115],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.6,
      },
      message: {
        text: '🔺 TRIO PARFAIT! 🔥',
        fontSize: 28,
        color: '#FF6B6B',
        position: 'above',
        animation: {
          scale: [0, 1.65, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-36, -82],
          duration: 2600,
        },
      },
    };
  }

  return { name: 'threes_fallback', intensity: 'standard', cell: { scale: [1.0, 1.1, 1.0], duration: 400 } };
};

/**
 * QUATRE (4) - Motifs carrés
 */
export const getFoursAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return getOnesAnimation(0);
  }

  const maxScore = 20;

  if (score < maxScore) {
    const ratio = score / maxScore;
    return {
      name: `fours_${score}`,
      intensity: ratio >= 0.8 ? 'excellent' : ratio >= 0.6 ? 'bon' : ratio >= 0.4 ? 'standard' : 'minimal',
      cell: {
        scale: [1.0, 1.0 + (ratio * 1.15), 1.0],
        rotate: ratio >= 0.5 ? [0, 90 * ratio, 180 * ratio, 270 * ratio, 360 * ratio] : undefined,
        duration: 600 + (ratio * 900),
        ease: ratio >= 0.6 ? 'easeOutElastic' : undefined,
      },
      confetti: ratio >= 0.4 ? {
        count: Math.floor(20 + (ratio * 95)),
        colors: ['#FFD93D', '#FFC700', '#FFE066'],
        spread: 100 + (ratio * 72),
        velocity: 15 + (ratio * 19),
        gravity: 0.45 - (ratio * 0.08),
        duration: 1800 + (ratio * 1600),
      } : undefined,
      particles: ratio >= 0.3 ? {
        type: 'star',
        count: Math.floor(12 + (ratio * 36)),
        colors: ['#FFD93D', '#FFD700'],
        spread: 90 + (ratio * 65),
        velocity: 15 + (ratio * 15),
        duration: 1200 + (ratio * 1800),
      } : undefined,
      glow: ratio >= 0.4 ? {
        color: '#FFD700',
        intensity: 0.4 + (ratio * 0.52),
        radius: 30 + (ratio * 36),
        duration: 800 + (ratio * 1200),
        pulse: ratio >= 0.6,
      } : undefined,
      flash: ratio >= 0.7 ? {
        color: '#FFD700',
        opacity: 0.4,
        duration: 255,
        repeat: Math.floor(ratio * 4),
      } : undefined,
      haptic: {
        type: ratio >= 0.6 ? 'heavy' : ratio >= 0.4 ? 'medium' : 'light',
        pattern: ratio >= 0.6 ? [80, 48, 80, 48] : ratio >= 0.4 ? [65] : [],
      },
      sound: ratio >= 0.6 ? {
        file: 'score-good.mp3',
        volume: 0.45 + (ratio * 0.17),
      } : undefined,
      message: {
        text: `⬛ ${score} point${score > 1 ? 's' : ''}`,
        fontSize: 18 + (ratio * 11),
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 1.2 + (ratio * 0.5), 1.0],
          opacity: [0, 1, ratio >= 0.6 ? 0.9 : 1, 0],
          translateY: [-25, -45 - (ratio * 39)],
          duration: 1300 + (ratio * 1400),
        },
      },
    };
  }
  if (score === maxScore) {
    return {
      name: 'fours_ultra_max',
      intensity: 'excellent',
      duration: 2700,
      cell: {
        scale: [1.0, 1.75, 1.18, 1.48, 1.0],
        rotate: [0, 90, 180, 270, 360, 450], // Rotation carrée (90°×5)
        duration: 1500,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 115,
        colors: ['#FFD93D', '#FFC700', '#FFE066', '#FFEB3B', '#FFA500', '#FFD700'],
        spread: 172,
        velocity: 34,
        gravity: 0.37,
        duration: 3400,
      },
      particles: {
        type: 'star',
        count: 48,
        colors: ['#FFD93D', '#FFD700', '#FFA500'],
        size: 12,
        spread: 155,
        velocity: 30,
        gravity: 0.31,
        duration: 3000,
      },
      glow: {
        color: '#FFD700',
        intensity: 0.92,
        radius: 66,
        duration: 2000,
        pulse: true,
      },
      flash: {
        color: '#FFD700',
        opacity: 0.47,
        duration: 270,
        repeat: 4,
      },
      haptic: {
        type: 'heavy',
        pattern: [80, 48, 80, 48, 80, 48, 120],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.62,
      },
      message: {
        text: '⬛ CARRÉ PARFAIT! ✨',
        fontSize: 29,
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 1.7, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-37, -84],
          duration: 2700,
        },
      },
    };
  }

  return {
    name: 'fours_standard',
    intensity: 'standard',
    cell: {
      scale: [1.0, 1.1, 1.0],
      duration: 400,
    },
    particles: {
      type: 'star',
      count: 12,
      colors: ['#FFD93D'],
      spread: 90,
      velocity: 15,
      duration: 800,
    },
    haptic: {
      type: 'light',
      pattern: [],
    },
  };
};

/**
 * CINQ (5) - Motifs en étoile
 */
export const getFivesAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return getOnesAnimation(0);
  }

  const maxScore = 25;
  if (score === maxScore) {
    return {
      name: 'fives_ultra_max',
      intensity: 'ÉPIQUE',
      duration: 3000,
      cell: {
        scale: [1.0, 2.0, 1.3, 1.7, 1.0],
        rotate: [0, 72, 144, 216, 288, 360, 432, 504, 576], // Rotation étoile 5 branches (72°×8)
        duration: 1700,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 140,
        colors: ['#FFD700', '#FFEB3B', '#FFA500', '#FFFF00', '#FFC107', '#FF9800'],
        spread: 180,
        velocity: 38,
        gravity: 0.35,
        duration: 3800,
      },
      particles: {
        type: 'star',
        count: 60,
        colors: ['#FFD700', '#FFFF00', '#FFFFFF'],
        size: 14,
        spread: 165,
        velocity: 35,
        gravity: 0.28,
        duration: 3500,
      },
      glow: {
        color: '#FFD700',
        intensity: 1.0,
        radius: 75,
        duration: 2200,
        pulse: true,
      },
      flash: {
        color: '#FFD700',
        opacity: 0.55,
        duration: 290,
        repeat: 5,
      },
      haptic: {
        type: 'heavy',
        pattern: [100, 55, 100, 55, 100, 55, 100, 140],
      },
      sound: {
        file: 'score-excellent.mp3',
        volume: 0.7,
      },
      message: {
        text: '⭐ ÉTOILE PARFAITE! ⭐',
        fontSize: 32,
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 1.9, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-40, -95],
          duration: 3000,
        },
      },
      modal: {
        show: true,
        background: 'rgba(0, 0, 0, 0.85)',
        content: {
          icon: '⭐',
          iconSize: 100,
          title: 'CINQ PARFAIT!',
          titleSize: 42,
          titleColor: '#FFD700',
          subtitle: '✨ 25 POINTS ✨',
          subtitleSize: 26,
          subtitleColor: '#FFFFFF',
        },
        animation: {
          scale: [0, 1.45, 1.0],
          opacity: [0, 1],
          duration: 850,
          ease: 'easeOutElastic',
        },
        duration: 2700,
        closable: true,
      },
    };
  }

  if (score === 20) {
    // 4 cinq - Excellent!
    return {
      name: 'fives_four',
      intensity: 'excellent',
      duration: 2000,
      cell: {
        scale: [1.0, 1.6, 1.15, 1.35, 1.0],
        rotate: [0, 72, 144, 216, 288],
        duration: 1400,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 90,
        colors: ['#FFD700', '#FFEB3B', '#FFA500', '#FFC107'],
        spread: 160,
        velocity: 30,
        gravity: 0.38,
        duration: 2800,
      },
      particles: {
        type: 'star',
        count: 40,
        colors: ['#FFD700', '#FFFF00', '#FFA500'],
        size: 12,
        spread: 150,
        velocity: 28,
        gravity: 0.32,
        duration: 2500,
      },
      glow: {
        color: '#FFD700',
        intensity: 0.8,
        radius: 55,
        duration: 1600,
        pulse: true,
      },
      flash: {
        color: '#FFD700',
        opacity: 0.42,
        duration: 240,
        repeat: 3,
      },
      haptic: {
        type: 'medium',
        pattern: [80, 50, 80, 110],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.6,
      },
      message: {
        text: '⭐ Quatre Étoiles! ⭐',
        fontSize: 26,
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 1.6, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-35, -75],
          duration: 2000,
        },
      },
    };
  }

  if (score === 15) {
    // 3 cinq - Bon!
    return {
      name: 'fives_three',
      intensity: 'bon',
      duration: 1600,
      cell: {
        scale: [1.0, 1.45, 1.0],
        rotate: [0, 72, 144, 216],
        duration: 1100,
        ease: 'easeOutBack',
      },
      confetti: {
        count: 55,
        colors: ['#FFD700', '#FFEB3B', '#FFA500'],
        spread: 140,
        velocity: 24,
        gravity: 0.42,
        duration: 2300,
      },
      particles: {
        type: 'star',
        count: 28,
        colors: ['#FFD700', '#FFEB3B'],
        size: 10,
        spread: 130,
        velocity: 22,
        gravity: 0.35,
        duration: 2000,
      },
      glow: {
        color: '#FFD700',
        intensity: 0.65,
        radius: 45,
        duration: 1300,
        pulse: true,
      },
      flash: {
        color: '#FFD700',
        opacity: 0.35,
        duration: 220,
        repeat: 2,
      },
      haptic: {
        type: 'medium',
        pattern: [70, 45, 70],
      },
      sound: {
        file: 'score-standard.mp3',
        volume: 0.5,
      },
      message: {
        text: '⭐ Triple Étoile!',
        fontSize: 23,
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 1.5, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-30, -65],
          duration: 1600,
        },
      },
    };
  }

  if (score === 10) {
    // 2 cinq - Standard
    return {
      name: 'fives_two',
      intensity: 'standard',
      duration: 1200,
      cell: {
        scale: [1.0, 1.3, 1.0],
        duration: 800,
      },
      confetti: {
        count: 35,
        colors: ['#FFD700', '#FFEB3B'],
        spread: 120,
        velocity: 18,
        gravity: 0.45,
        duration: 1800,
      },
      particles: {
        type: 'star',
        count: 18,
        colors: ['#FFD700'],
        size: 9,
        spread: 110,
        velocity: 18,
        gravity: 0.38,
        duration: 1500,
      },
      glow: {
        color: '#FFD700',
        intensity: 0.5,
        radius: 35,
        duration: 1000,
      },
      haptic: {
        type: 'light',
        pattern: [55, 40],
      },
      message: {
        text: '⭐ Double Étoile',
        fontSize: 20,
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 1.3, 1.0],
          opacity: [0, 1, 0],
          translateY: [-25, -55],
          duration: 1200,
        },
      },
    };
  }

  if (score === 5) {
    // 1 cinq - Minimal
    return {
      name: 'fives_one',
      intensity: 'minimal',
      cell: {
        scale: [1.0, 1.15, 1.0],
        duration: 600,
      },
      particles: {
        type: 'star',
        count: 10,
        colors: ['#FFD700', '#FFEB3B'],
        size: 8,
        spread: 90,
        velocity: 12,
        gravity: 0.4,
        duration: 1200,
      },
      haptic: {
        type: 'light',
        pattern: [40],
      },
      message: {
        text: '⭐ Une Étoile',
        fontSize: 18,
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 1.2, 1.0],
          opacity: [0, 1, 0],
          translateY: [-20, -45],
          duration: 1000,
        },
      },
    };
  }

  // Score quelconque
  return {
    name: 'fives_standard',
    intensity: 'standard',
    cell: {
      scale: [1.0, 1.1, 1.0],
      duration: 400,
    },
    particles: {
      type: 'star',
      count: 15,
      colors: ['#FFD700'],
      spread: 100,
      velocity: 18,
      duration: 900,
    },
    haptic: {
      type: 'medium',
      pattern: [],
    },
  };
};

/**
 * SIX (6) - Le meilleur de la section supérieure
 */
export const getSixesAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return getOnesAnimation(0);
  }

  const maxScore = 30;
  if (score === maxScore) {
    return {
      name: 'sixes_ultra_max',
      intensity: 'ÉPIQUE',
      duration: 3500,
      cell: {
        scale: [1.0, 2.2, 1.4, 1.9, 1.0],
        rotate: [0, 360, 720, 1080], // Triple rotation complète!
        duration: 1900,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 180,
        colors: ['#FF6B6B', '#4A90E2', '#50C878', '#FFD93D', '#9B59B6', '#FF1493', '#00CED1', '#FFD700'],
        spread: 180,
        velocity: 42,
        gravity: 0.3,
        duration: 4200,
      },
      particles: {
        type: 'star',
        count: 72,
        colors: ['#FFD700', '#FFFFFF', '#FFA500', '#FF6B6B', '#4A90E2'],
        size: 15,
        spread: 180,
        velocity: 38,
        gravity: 0.25,
        duration: 3900,
      },
      glow: {
        color: '#FFD700',
        intensity: 1.0,
        radius: 85,
        duration: 2500,
        pulse: true,
      },
      flash: {
        color: '#FFFFFF',
        opacity: 0.6,
        duration: 310,
        repeat: 6,
      },
      haptic: {
        type: 'heavy',
        pattern: [110, 60, 110, 60, 110, 60, 110, 60, 110, 170],
      },
      sound: {
        file: 'score-perfect.mp3',
        volume: 0.8,
      },
      message: {
        text: '🎯 SIX LÉGENDAIRE! 👑',
        fontSize: 34,
        color: '#FFD700',
        position: 'above',
        animation: {
          scale: [0, 2.0, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-45, -110],
          duration: 3500,
        },
      },
      modal: {
        show: true,
        background: 'rgba(0, 0, 0, 0.9)',
        content: {
          icon: '👑',
          iconSize: 120,
          title: 'SIX PARFAIT!',
          titleSize: 52,
          titleColor: '#FFD700',
          subtitle: '🌟 30 POINTS 🌟',
          subtitleSize: 32,
          subtitleColor: '#FFFFFF',
        },
        animation: {
          scale: [0, 1.7, 1.0],
          opacity: [0, 1],
          duration: 1000,
          ease: 'easeOutElastic',
        },
        duration: 3200,
        closable: true,
      },
    };
  }

  if (score === 24) {
    // 4 six - Excellent!
    return {
      name: 'sixes_four',
      intensity: 'excellent',
      duration: 2200,
      cell: {
        scale: [1.0, 1.7, 1.2, 1.4, 1.0],
        rotate: [0, 360, 720],
        duration: 1500,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 110,
        colors: ['#9B59B6', '#8E44AD', '#E91E63', '#FF6B6B', '#4A90E2', '#FFD700'],
        spread: 170,
        velocity: 34,
        gravity: 0.35,
        duration: 3200,
      },
      particles: {
        type: 'star',
        count: 48,
        colors: ['#9B59B6', '#E91E63', '#FFD700', '#FFFFFF'],
        size: 13,
        spread: 160,
        velocity: 30,
        gravity: 0.3,
        duration: 2800,
      },
      glow: {
        color: '#9B59B6',
        intensity: 0.85,
        radius: 60,
        duration: 1800,
        pulse: true,
      },
      flash: {
        color: '#9B59B6',
        opacity: 0.48,
        duration: 260,
        repeat: 4,
      },
      haptic: {
        type: 'medium',
        pattern: [90, 55, 90, 55, 90, 120],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.65,
      },
      message: {
        text: '👑 Quatre Couronnes! 👑',
        fontSize: 28,
        color: '#9B59B6',
        position: 'above',
        animation: {
          scale: [0, 1.7, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-38, -80],
          duration: 2200,
        },
      },
    };
  }

  if (score === 18) {
    // 3 six - Bon!
    return {
      name: 'sixes_three',
      intensity: 'bon',
      duration: 1800,
      cell: {
        scale: [1.0, 1.5, 1.0],
        rotate: [0, 360, 540],
        duration: 1200,
        ease: 'easeOutBack',
      },
      confetti: {
        count: 70,
        colors: ['#9B59B6', '#8E44AD', '#E91E63', '#4A90E2'],
        spread: 150,
        velocity: 26,
        gravity: 0.4,
        duration: 2500,
      },
      particles: {
        type: 'star',
        count: 32,
        colors: ['#9B59B6', '#E91E63', '#FFFFFF'],
        size: 11,
        spread: 140,
        velocity: 24,
        gravity: 0.35,
        duration: 2200,
      },
      glow: {
        color: '#9B59B6',
        intensity: 0.7,
        radius: 48,
        duration: 1400,
        pulse: true,
      },
      flash: {
        color: '#9B59B6',
        opacity: 0.38,
        duration: 240,
        repeat: 3,
      },
      haptic: {
        type: 'medium',
        pattern: [75, 48, 75],
      },
      sound: {
        file: 'score-standard.mp3',
        volume: 0.55,
      },
      message: {
        text: '👑 Triple Couronne!',
        fontSize: 24,
        color: '#9B59B6',
        position: 'above',
        animation: {
          scale: [0, 1.55, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-32, -68],
          duration: 1800,
        },
      },
    };
  }

  if (score === 12) {
    // 2 six - Standard
    return {
      name: 'sixes_two',
      intensity: 'standard',
      duration: 1400,
      cell: {
        scale: [1.0, 1.35, 1.0],
        duration: 900,
      },
      confetti: {
        count: 45,
        colors: ['#9B59B6', '#8E44AD'],
        spread: 130,
        velocity: 20,
        gravity: 0.45,
        duration: 2000,
      },
      particles: {
        type: 'star',
        count: 22,
        colors: ['#9B59B6', '#FFFFFF'],
        size: 10,
        spread: 120,
        velocity: 20,
        gravity: 0.38,
        duration: 1700,
      },
      glow: {
        color: '#9B59B6',
        intensity: 0.55,
        radius: 38,
        duration: 1100,
      },
      haptic: {
        type: 'light',
        pattern: [60, 45],
      },
      message: {
        text: '👑 Double Couronne',
        fontSize: 21,
        color: '#9B59B6',
        position: 'above',
        animation: {
          scale: [0, 1.35, 1.0],
          opacity: [0, 1, 0],
          translateY: [-27, -58],
          duration: 1400,
        },
      },
    };
  }

  if (score === 6) {
    // 1 six - Minimal
    return {
      name: 'sixes_one',
      intensity: 'minimal',
      cell: {
        scale: [1.0, 1.2, 1.0],
        duration: 700,
      },
      particles: {
        type: 'star',
        count: 12,
        colors: ['#9B59B6', '#8E44AD'],
        size: 8,
        spread: 95,
        velocity: 14,
        gravity: 0.4,
        duration: 1300,
      },
      haptic: {
        type: 'light',
        pattern: [45],
      },
      message: {
        text: '👑 Une Couronne',
        fontSize: 19,
        color: '#9B59B6',
        position: 'above',
        animation: {
          scale: [0, 1.25, 1.0],
          opacity: [0, 1, 0],
          translateY: [-22, -48],
          duration: 1100,
        },
      },
    };
  }

  // Score quelconque
  return {
    name: 'sixes_good',
    intensity: 'bon',
    cell: {
      scale: [1.0, 1.15, 1.0],
      duration: 500,
    },
    particles: {
      type: 'star',
      count: 20,
      colors: ['#9B59B6', '#8E44AD'],
      spread: 120,
      velocity: 20,
      duration: 1000,
    },
    haptic: {
      type: 'medium',
      pattern: [60, 60],
    },
    sound: {
      file: 'score-good.mp3',
      volume: 0.5,
    },
  };
};

/**
 * BONUS (63+ points) - Animation épique
 */
export const getBonusAnimation = (): ScoreAnimationConfig => {
  return {
    name: 'bonus_earned',
    intensity: 'ÉPIQUE',
    duration: 3500,
    cell: {
      scale: [1.0, 2.0, 1.2],
      rotate: [0, 720],
      duration: 1000,
      ease: 'easeOutBack',
    },
    confetti: {
      count: 150,
      colors: ['#50C878', '#66CDAA', '#90EE90', '#98FB98', '#00FA9A'],
      spread: 360,
      velocity: 40,
      gravity: 0.8,
      duration: 3000,
    },
    glow: {
      color: '#50C878',
      intensity: 0.8,
      radius: 50,
      duration: 2000,
      pulse: true,
    },
    flash: {
      color: '#50C878',
      opacity: 0.3,
      duration: 300,
      repeat: 2,
    },
    haptic: {
      type: 'heavy',
      pattern: [100, 100, 100, 200],
    },
    sound: {
      file: 'bonus-explosion.mp3',
      volume: 0.8,
    },
    modal: {
      show: true,
      background: 'rgba(0, 0, 0, 0.85)',
      content: {
        icon: '🏆',
        iconSize: 80,
        title: 'BONUS !',
        titleSize: 48,
        titleColor: '#50C878',
        subtitle: '+35 POINTS',
        subtitleSize: 24,
        subtitleColor: '#FFD700',
      },
      animation: {
        scale: [0, 1.3, 1.0],
        opacity: [0, 1],
        duration: 600,
        ease: 'easeOutBack',
      },
      duration: 2500,
      closable: true,
    },
  };
};
