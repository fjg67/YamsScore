/**
 * Lower Section Animations Configuration
 * Animations pour Brelan, Carré, Full, Suites, Yams, Chance
 */

import { ScoreAnimationConfig } from '../types';

/**
 * BRELAN (Three of a Kind) - ULTRA PREMIUM ✨
 */
export const getThreeOfKindAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return {
      name: 'three_of_kind_crossed',
      intensity: 'minimal',
      cell: {
        scale: [1.0, 1.05, 1.0],
        duration: 300,
      },
      haptic: {
        type: 'light',
        pattern: [],
      },
      sound: {
        file: 'cross-out.mp3',
        volume: 0.3,
      },
    };
  }

  if (score >= 25) {
    // Score premium ULTRA ⭐
    return {
      name: 'three_of_kind_ultra_premium',
      intensity: 'excellent',
      duration: 2800,
      cell: {
        scale: [1.0, 2.0, 1.3, 1.5, 1.0],
        rotate: [0, 360, 720],
        duration: 1500,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 120,
        colors: ['#9B59B6', '#8E44AD', '#FFD700', '#FF6B9D', '#E056FD', '#BB6BD9'],
        spread: 180,
        velocity: 35,
        gravity: 0.35,
        duration: 3500,
      },
      particles: {
        type: 'star',
        count: 50,
        colors: ['#9B59B6', '#FFD700', '#FF6B9D'],
        size: 12,
        spread: 160,
        velocity: 30,
        gravity: 0.3,
        duration: 3000,
      },
      glow: {
        color: '#9B59B6',
        intensity: 1.0,
        radius: 70,
        duration: 2000,
        pulse: true,
      },
      flash: {
        color: '#9B59B6',
        opacity: 0.4,
        duration: 250,
        repeat: 3,
      },
      haptic: {
        type: 'heavy',
        pattern: [80, 50, 100, 50, 120],
      },
      sound: {
        file: 'three-of-kind.mp3',
        volume: 0.65,
      },
      message: {
        text: '✨ SUPER BRELAN! 🎲',
        fontSize: 32,
        color: '#9B59B6',
        position: 'above',
        animation: {
          scale: [0, 1.8, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-40, -90],
          duration: 2800,
        },
      },
      modal: {
        show: true,
        background: 'rgba(0, 0, 0, 0.85)',
        content: {
          icon: '🎲',
          iconSize: 100,
          title: 'BRELAN!',
          titleSize: 44,
          titleColor: '#9B59B6',
          subtitle: `✨ ${score} POINTS ✨`,
          subtitleSize: 28,
          subtitleColor: '#FFFFFF',
        },
        animation: {
          scale: [0, 1.4, 1.0],
          opacity: [0, 1],
          duration: 800,
        },
        duration: 2500,
        closable: true,
      },
    };
  }

  // Score standard amélioré
  return {
    name: 'three_of_kind_standard',
    intensity: 'bon',
    cell: {
      scale: [1.0, 1.3, 1.05, 1.2, 1.0],
      duration: 1000,
    },
    particles: {
      type: 'circle',
      count: 30,
      colors: ['#9B59B6', '#8E44AD', '#BB6BD9'],
      spread: 120,
      velocity: 20,
      duration: 1200,
    },
    glow: {
      color: '#9B59B6',
      intensity: 0.5,
      radius: 35,
      duration: 900,
    },
    haptic: {
      type: 'medium',
      pattern: [50, 70],
    },
    message: {
      text: 'BRELAN! 🎲',
      fontSize: 24,
      color: '#9B59B6',
      position: 'above',
      animation: {
        scale: [0.5, 1.3, 1.0],
        opacity: [0, 1, 1, 0],
        duration: 1600,
      },
    },
  };
};

/**
 * CARRÉ (Four of a Kind) - ULTRA PREMIUM 💎
 */
export const getFourOfKindAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return getThreeOfKindAnimation(0);
  }

  // Le carré est toujours ULTRA excellent 💎
  return {
    name: 'four_of_kind_ultra',
    intensity: 'ÉPIQUE',
    duration: 3800,
    cell: {
      scale: [1.0, 2.5, 1.5, 2.0, 1.0],
      rotate: [0, 720, 1080],
      duration: 1800,
      ease: 'easeOutElastic',
    },
    confetti: {
      count: 200,
      colors: ['#C0C0C0', '#E8E8E8', '#FFFFFF', '#D3D3D3', '#B8B8B8', '#F5F5F5'],
      spread: 180,
      velocity: 45,
      gravity: 0.3,
      duration: 4000,
    },
    particles: {
      type: 'sparkle',
      count: 80,
      colors: ['#FFFFFF', '#E8E8E8', '#FFD700'],
      size: 14,
      spread: 180,
      velocity: 40,
      gravity: 0.25,
      duration: 3500,
    },
    glow: {
      color: '#FFFFFF',
      intensity: 1.0,
      radius: 80,
      duration: 2500,
      pulse: true,
    },
    flash: {
      color: '#FFFFFF',
      opacity: 0.6,
      duration: 300,
      repeat: 5,
    },
    haptic: {
      type: 'heavy',
      pattern: [120, 60, 120, 60, 120, 80, 150],
    },
    sound: {
      file: 'four-of-kind.mp3',
      volume: 0.75,
    },
    message: {
      text: '💎 CARRÉ ÉPIQUE! 🔥',
      fontSize: 36,
      color: '#FFFFFF',
      position: 'above',
      animation: {
        scale: [0, 2.0, 1.0],
        opacity: [0, 1, 1, 0.9, 0],
        translateY: [-50, -110],
        duration: 3200,
      },
    },
    modal: {
      show: true,
      background: 'rgba(0, 0, 0, 0.9)',
      content: {
        icon: '💎',
        iconSize: 120,
        title: 'CARRÉ!',
        titleSize: 52,
        titleColor: '#FFFFFF',
        subtitle: `✨ ${score} POINTS ✨`,
        subtitleSize: 32,
        subtitleColor: '#E8E8E8',
      },
      animation: {
        scale: [0, 1.6, 1.0],
        opacity: [0, 1],
        duration: 1000,
        ease: 'easeOutElastic',
      },
      duration: 3500,
      closable: true,
    },
  };
};

/**
 * FULL HOUSE - ULTRA PREMIUM 🏠
 */
export const getFullHouseAnimation = (): ScoreAnimationConfig => {
  return {
    name: 'full_house_ultra',
    intensity: 'ÉPIQUE',
    duration: 3400,
    cell: {
      scale: [1.0, 2.3, 1.5, 1.9, 1.0],
      rotate: [0, 450, 720],
      duration: 1700,
      ease: 'easeOutElastic',
    },
    confetti: {
      count: 170,
      colors: ['#FF6B6B', '#4A90E2', '#FFD93D', '#FF8C94', '#6BAED6', '#FFE066'],
      spread: 180,
      velocity: 42,
      gravity: 0.32,
      duration: 3600,
    },
    particles: {
      type: 'star',
      count: 75,
      colors: ['#FF6B6B', '#FFD93D', '#4A90E2'],
      size: 13,
      spread: 175,
      velocity: 39,
      gravity: 0.27,
      duration: 3300,
    },
    glow: {
      color: '#FF6B6B',
      intensity: 0.98,
      radius: 78,
      duration: 2300,
      pulse: true,
    },
    flash: {
      color: '#FFD93D',
      opacity: 0.52,
      duration: 290,
      repeat: 4,
    },
    haptic: {
      type: 'heavy',
      pattern: [110, 55, 110, 55, 110, 75, 145],
    },
    sound: {
      file: 'full-house.mp3',
      volume: 0.72,
    },
    message: {
      text: '🏠 FULL HOUSE ÉPIQUE! 🎉',
      fontSize: 35,
      color: '#FF6B6B',
      position: 'above',
      animation: {
        scale: [0, 1.95, 1.0],
        opacity: [0, 1, 1, 0.9, 0],
        translateY: [-48, -108],
        duration: 3100,
      },
    },
    modal: {
      show: true,
      background: 'rgba(0, 0, 0, 0.87)',
      content: {
        icon: '🏠',
        iconSize: 115,
        title: 'FULL HOUSE!',
        titleSize: 50,
        titleColor: '#FF6B6B',
        subtitle: '✨ 25 POINTS ✨',
        subtitleSize: 31,
        subtitleColor: '#FFFFFF',
      },
      animation: {
        scale: [0, 1.55, 1.0],
        opacity: [0, 1],
        duration: 950,
        ease: 'easeOutElastic',
      },
      duration: 3100,
      closable: true,
    },
  };
};

/**
 * PETITE SUITE (Small Straight) - ULTRA PREMIUM 🌊
 */
export const getSmallStraightAnimation = (): ScoreAnimationConfig => {
  return {
    name: 'small_straight_ultra',
    intensity: 'ÉPIQUE',
    duration: 3200,
    cell: {
      scale: [1.0, 2.2, 1.4, 1.8, 1.0],
      rotate: [0, 540, 720],
      duration: 1600,
      ease: 'easeOutElastic',
    },
    confetti: {
      count: 150,
      colors: ['#4A90E2', '#5DADE2', '#87CEEB', '#00BFFF', '#1E90FF', '#ADD8E6'],
      spread: 180,
      velocity: 40,
      gravity: 0.35,
      duration: 3500,
    },
    particles: {
      type: 'star',
      count: 70,
      colors: ['#4A90E2', '#87CEEB', '#FFD700'],
      size: 13,
      spread: 170,
      velocity: 38,
      gravity: 0.28,
      duration: 3200,
    },
    glow: {
      color: '#4A90E2',
      intensity: 0.95,
      radius: 75,
      duration: 2200,
      pulse: true,
    },
    flash: {
      color: '#87CEEB',
      opacity: 0.5,
      duration: 280,
      repeat: 4,
    },
    haptic: {
      type: 'heavy',
      pattern: [100, 50, 100, 50, 100, 70, 140],
    },
    sound: {
      file: 'small-straight.mp3',
      volume: 0.7,
    },
    message: {
      text: '🌊 PETITE SUITE ÉPIQUE! ➜',
      fontSize: 34,
      color: '#4A90E2',
      position: 'above',
      animation: {
        scale: [0, 1.9, 1.0],
        opacity: [0, 1, 1, 0.9, 0],
        translateY: [-45, -105],
        duration: 3000,
      },
    },
    modal: {
      show: true,
      background: 'rgba(0, 0, 0, 0.88)',
      content: {
        icon: '🌊',
        iconSize: 110,
        title: 'PETITE SUITE!',
        titleSize: 48,
        titleColor: '#4A90E2',
        subtitle: '✨ 30 POINTS ✨',
        subtitleSize: 30,
        subtitleColor: '#FFFFFF',
      },
      animation: {
        scale: [0, 1.5, 1.0],
        opacity: [0, 1],
        duration: 900,
        ease: 'easeOutElastic',
      },
      duration: 3000,
      closable: true,
    },
  };
};

/**
 * GRANDE SUITE (Large Straight) - TRÈS RARE ⭐
 */
export const getLargeStraightAnimation = (): ScoreAnimationConfig => {
  return {
    name: 'large_straight',
    intensity: 'ÉPIQUE',
    duration: 3500,
    cell: {
      scale: [1.0, 2.5, 1.3],
      rotate: [0, 1080],
      duration: 1200,
      ease: 'easeOutBack',
    },
    confetti: {
      count: 150,
      colors: ['#FF6B6B', '#FFD93D', '#50C878', '#4A90E2', '#9B59B6'],
      spread: 180,
      velocity: 45,
      gravity: 0.5,
      duration: 3000,
    },
    particles: {
      type: 'sparkle',
      count: 60,
      colors: ['#FFD700', '#FFFFFF', '#FFA500'],
      size: 12,
      spread: 180,
      velocity: 40,
      gravity: 0.3,
      duration: 2800,
    },
    glow: {
      color: '#FFD700',
      intensity: 0.9,
      radius: 60,
      duration: 1800,
      pulse: true,
    },
    flash: {
      color: '#FFFFFF',
      opacity: 0.5,
      duration: 300,
      repeat: 4,
    },
    haptic: {
      type: 'heavy',
      pattern: [120, 60, 120, 60, 120, 150],
    },
    sound: {
      file: 'large-straight.mp3',
      volume: 0.8,
    },
    modal: {
      show: true,
      background: 'rgba(0, 0, 0, 0.9)',
      content: {
        icon: '🌟',
        iconSize: 120,
        title: 'GRANDE SUITE!',
        titleSize: 48,
        titleColor: '#FFD700',
        subtitle: '✨ 40 POINTS ✨',
        subtitleSize: 30,
        subtitleColor: '#FFFFFF',
      },
      animation: {
        scale: [0, 1.5, 1.0],
        opacity: [0, 1],
        duration: 900,
      },
      duration: 3000,
      closable: true,
    },
    message: {
      text: 'ÉPIQUE! 🎯',
      fontSize: 36,
      color: '#FFD700',
      position: 'above',
      animation: {
        scale: [0, 1.6, 1.0],
        opacity: [0, 1, 1, 1, 0],
        translateY: [-50, -100],
        duration: 3000,
      },
    },
  };
};

/**
 * YAMS - L'ANIMATION ULTIME 🏆
 * Animation ultra premium avec tous les effets possibles !
 */
export const getYamsAnimation = (): ScoreAnimationConfig => {
  return {
    name: 'yams_ultimate',
    intensity: 'LÉGENDAIRE',
    duration: 6000,
    cell: {
      scale: [1.0, 4.0, 2.0, 1.5],
      rotate: [0, 1800],
      opacity: [1, 0.5, 1],
      duration: 2500,
      ease: 'easeOutElastic',
    },
    // CONFETTI EXPLOSION MASSIVE
    confetti: {
      count: 500,
      colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4A90E2', '#50C878', '#9B59B6', '#FF1493', '#00CED1', '#FFFFFF'],
      spread: 360,
      velocity: 30,
      gravity: 0.25,
      duration: 6000,
    },
    // PARTICULES ÉTOILES DORÉES
    particles: {
      type: 'star',
      count: 100,
      colors: ['#FFD700', '#FFA500', '#FFFF00'],
      size: 15,
      spread: 360,
      velocity: 35,
      gravity: 0.2,
      duration: 5000,
    },
    // GLOW DORÉ INTENSE
    glow: {
      color: '#FFD700',
      intensity: 1.0,
      radius: 100,
      duration: 3000,
      pulse: true,
    },
    // FLASH BLANC RÉPÉTÉ
    flash: {
      color: '#FFFFFF',
      opacity: 0.9,
      duration: 400,
      repeat: 6,
    },
    // VIBRATIONS PUISSANTES
    haptic: {
      type: 'heavy',
      pattern: [150, 100, 150, 100, 150, 150, 250, 150],
    },
    // SON ÉPIQUE
    sound: {
      file: 'yams-explosion.mp3',
      volume: 1.0,
    },
    // MODAL DE CÉLÉBRATION SPECTACULAIRE
    modal: {
      show: true,
      background: 'radial-gradient(circle, rgba(255,215,0,0.3), rgba(0,0,0,0.95))',
      content: {
        icon: '🏆',
        iconSize: 150,
        title: 'YAMS!',
        titleSize: 80,
        titleColor: '#FFD700',
        subtitle: '⭐ 50 POINTS ⭐',
        subtitleSize: 36,
        subtitleColor: '#FFFFFF',
      },
      animation: {
        scale: [0, 1.8, 1.0],
        opacity: [0, 1],
        duration: 1500,
        ease: 'easeOutElastic',
      },
      duration: 5000,
      closable: true,
    },
    // MESSAGE LÉGENDAIRE
    message: {
      text: '✨ LÉGENDAIRE! 👑 ✨',
      fontSize: 42,
      color: '#FFD700',
      position: 'above',
      animation: {
        scale: [0, 2.0, 1.2],
        opacity: [0, 1, 1, 1, 0.8, 0],
        translateY: [-50, -120],
        duration: 4500,
      },
    },
  };
};

/**
 * CHANCE
 */
export const getChanceAnimation = (score: number): ScoreAnimationConfig | null => {
  if (score === 0) {
    return getThreeOfKindAnimation(0);
  }

  if (score >= 28) {
    // Super Lucky ULTRA PREMIUM! 🍀✨
    return {
      name: 'chance_ultra_lucky',
      intensity: 'ÉPIQUE',
      duration: 3200,
      cell: {
        scale: [1.0, 2.1, 1.35, 1.75, 1.0],
        rotate: [0, 360, 720, 900], // Rotation chanceuse!
        duration: 1650,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 160,
        colors: ['#50C878', '#90EE90', '#98FB98', '#00FA9A', '#00FF7F', '#32CD32', '#FFD700'],
        spread: 180,
        velocity: 40,
        gravity: 0.33,
        duration: 3900,
      },
      particles: {
        type: 'sparkle',
        count: 65,
        colors: ['#50C878', '#FFD700', '#00FA9A', '#FFFFFF'],
        size: 13,
        spread: 172,
        velocity: 36,
        gravity: 0.27,
        duration: 3600,
      },
      glow: {
        color: '#50C878',
        intensity: 0.98,
        radius: 80,
        duration: 2300,
        pulse: true,
      },
      flash: {
        color: '#50C878',
        opacity: 0.52,
        duration: 285,
        repeat: 5,
      },
      haptic: {
        type: 'heavy',
        pattern: [95, 57, 95, 57, 95, 57, 95, 145],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.7,
      },
      message: {
        text: '🍀 CHANCE INCROYABLE! ✨',
        fontSize: 33,
        color: '#50C878',
        position: 'above',
        animation: {
          scale: [0, 1.95, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-42, -100],
          duration: 3200,
        },
      },
      modal: {
        show: true,
        background: 'rgba(0, 0, 0, 0.88)',
        content: {
          icon: '🍀',
          iconSize: 115,
          title: 'CHANCE ÉPIQUE!',
          titleSize: 48,
          titleColor: '#50C878',
          subtitle: `✨ ${score} POINTS ✨`,
          subtitleSize: 30,
          subtitleColor: '#FFFFFF',
        },
        animation: {
          scale: [0, 1.6, 1.0],
          opacity: [0, 1],
          duration: 920,
          ease: 'easeOutElastic',
        },
        duration: 2900,
        closable: true,
      },
    };
  }

  if (score >= 25) {
    // Lucky!
    return {
      name: 'chance_lucky',
      intensity: 'excellent',
      duration: 2300,
      cell: {
        scale: [1.0, 1.65, 1.1, 1.4, 1.0],
        rotate: [0, 360, 540],
        duration: 1350,
        ease: 'easeOutElastic',
      },
      confetti: {
        count: 95,
        colors: ['#50C878', '#90EE90', '#98FB98', '#00FA9A', '#FFD700'],
        spread: 160,
        velocity: 32,
        gravity: 0.38,
        duration: 3100,
      },
      particles: {
        type: 'sparkle',
        count: 38,
        colors: ['#50C878', '#FFD700', '#90EE90'],
        size: 11,
        spread: 148,
        velocity: 28,
        gravity: 0.32,
        duration: 2700,
      },
      glow: {
        color: '#50C878',
        intensity: 0.82,
        radius: 58,
        duration: 1750,
        pulse: true,
      },
      flash: {
        color: '#50C878',
        opacity: 0.4,
        duration: 265,
        repeat: 3,
      },
      haptic: {
        type: 'heavy',
        pattern: [72, 45, 95, 55],
      },
      sound: {
        file: 'score-good.mp3',
        volume: 0.58,
      },
      message: {
        text: '🍀 LUCKY! ✨',
        fontSize: 27,
        color: '#50C878',
        position: 'above',
        animation: {
          scale: [0, 1.55, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-35, -78],
          duration: 2300,
        },
      },
    };
  }

  if (score >= 20) {
    // Très bon score!
    return {
      name: 'chance_very_good',
      intensity: 'bon',
      duration: 1800,
      cell: {
        scale: [1.0, 1.5, 1.0],
        rotate: [0, 360],
        duration: 1150,
        ease: 'easeOutBack',
      },
      confetti: {
        count: 60,
        colors: ['#50C878', '#90EE90', '#98FB98', '#00FA9A'],
        spread: 145,
        velocity: 26,
        gravity: 0.42,
        duration: 2400,
      },
      particles: {
        type: 'sparkle',
        count: 28,
        colors: ['#50C878', '#90EE90', '#FFFFFF'],
        size: 10,
        spread: 135,
        velocity: 23,
        gravity: 0.35,
        duration: 2100,
      },
      glow: {
        color: '#50C878',
        intensity: 0.68,
        radius: 46,
        duration: 1400,
        pulse: true,
      },
      flash: {
        color: '#50C878',
        opacity: 0.35,
        duration: 230,
        repeat: 2,
      },
      haptic: {
        type: 'medium',
        pattern: [68, 42, 68],
      },
      sound: {
        file: 'score-standard.mp3',
        volume: 0.52,
      },
      message: {
        text: '🍀 Très Chanceux!',
        fontSize: 23,
        color: '#50C878',
        position: 'above',
        animation: {
          scale: [0, 1.48, 1.0],
          opacity: [0, 1, 1, 0.9, 0],
          translateY: [-30, -64],
          duration: 1800,
        },
      },
    };
  }

  if (score >= 15) {
    // Bon score
    return {
      name: 'chance_good',
      intensity: 'standard',
      duration: 1400,
      cell: {
        scale: [1.0, 1.35, 1.0],
        duration: 850,
      },
      confetti: {
        count: 40,
        colors: ['#50C878', '#90EE90', '#98FB98'],
        spread: 125,
        velocity: 20,
        gravity: 0.45,
        duration: 1900,
      },
      particles: {
        type: 'sparkle',
        count: 20,
        colors: ['#50C878', '#90EE90'],
        size: 9,
        spread: 115,
        velocity: 18,
        gravity: 0.38,
        duration: 1600,
      },
      glow: {
        color: '#50C878',
        intensity: 0.52,
        radius: 36,
        duration: 1050,
      },
      haptic: {
        type: 'light',
        pattern: [58, 38],
      },
      message: {
        text: '🍀 Chanceux!',
        fontSize: 20,
        color: '#50C878',
        position: 'above',
        animation: {
          scale: [0, 1.32, 1.0],
          opacity: [0, 1, 0],
          translateY: [-25, -54],
          duration: 1400,
        },
      },
    };
  }

  if (score >= 10) {
    // Score moyen
    return {
      name: 'chance_decent',
      intensity: 'minimal',
      cell: {
        scale: [1.0, 1.2, 1.0],
        duration: 650,
      },
      particles: {
        type: 'sparkle',
        count: 15,
        colors: ['#50C878', '#90EE90'],
        size: 8,
        spread: 100,
        velocity: 14,
        gravity: 0.4,
        duration: 1200,
      },
      haptic: {
        type: 'light',
        pattern: [42],
      },
      message: {
        text: '🍀 Pas mal!',
        fontSize: 18,
        color: '#50C878',
        position: 'above',
        animation: {
          scale: [0, 1.22, 1.0],
          opacity: [0, 1, 0],
          translateY: [-20, -44],
          duration: 1100,
        },
      },
    };
  }

  // Score faible (moins de 10)
  return {
    name: 'chance_standard',
    intensity: 'standard',
    cell: {
      scale: [1.0, 1.1, 1.0],
      duration: 400,
    },
    particles: {
      type: 'sparkle',
      count: 12,
      colors: ['#50C878', '#90EE90'],
      spread: 100,
      velocity: 15,
      duration: 800,
    },
    haptic: {
      type: 'light',
      pattern: [],
    },
  };
};
