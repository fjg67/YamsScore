/**
 * Design System Premium - Yams Score
 * Couleurs, gradients, ombres, animations
 */

export const premiumTheme = {
  colors: {
    // Gradients
    gradients: {
      primary: ['#4A90E2', '#5DADE2'],
      success: ['#50C878', '#3FA065'],
      warning: ['#F39C12', '#E67E22'],
      danger: ['#FF6B6B', '#FF8E53'],
      gold: ['#FFD700', '#FFA500'],
      winner: ['rgba(80,200,120,0.95)', 'rgba(74,144,226,0.95)'],
      upperSection: ['#4A90E2', '#5DADE2'],
      lowerSection: ['#50C878', '#3FA065'],
    },

    // Shadows
    shadows: {
      soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
      },
      medium: {
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
      },
      heavy: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
      },
      glow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 10,
      }),
    },

    // Glassmorphism
    glassmorphism: {
      background: 'rgba(255,255,255,0.7)',
      backdropBlur: 20,
      borderColor: 'rgba(255,255,255,0.3)',
      borderWidth: 2,
    },

    // Score colors
    scoreColors: {
      excellent: '#50C878', // > 80% optimal
      good: '#4A90E2', // > 50%
      average: '#F39C12', // > 20%
      poor: '#FF6B6B', // <= 20%
      zero: '#FF6B6B',
    },

    // UI Elements
    ui: {
      cardBackground: '#FFFFFF',
      cardBorder: 'rgba(0,0,0,0.08)',
      textPrimary: '#1A1A1A',
      textSecondary: '#666666',
      textTertiary: '#999999',
      disabled: '#CCCCCC',
      background: '#F8F9FA',
      surface: '#FFFFFF',
      overlay: 'rgba(0,0,0,0.4)',
    },
  },

  // Animations
  animations: {
    durations: {
      instant: 100,
      fast: 200,
      medium: 300,
      normal: 500,
      slow: 800,
      verySlow: 1000,
      celebration: 2500,
    },
    easings: {
      smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      linear: 'linear',
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    huge: 32,
    cellGap: 2,
    sectionGap: 16,
    badgeSpacing: 12,
  },

  // Border Radius
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
    round: 999,
  },

  // Typography
  typography: {
    fontFamily: {
      regular: 'SF Pro Text',
      medium: 'SF Pro Text Medium',
      semibold: 'SF Pro Text Semibold',
      bold: 'SF Pro Display Bold',
      black: 'SF Pro Display Black',
      monospace: 'monospace',
    },
    fontSize: {
      xs: 11,
      sm: 12,
      md: 13,
      base: 14,
      lg: 15,
      xl: 16,
      xxl: 18,
      huge: 20,
      display: 24,
      hero: 36,
    },
  },

  // Component Sizes
  sizes: {
    playerBadge: {
      width: 72,
      height: 96,
      avatarSize: 48,
    },
    scoreCell: {
      width: 60,
      minWidth: 60,
      maxWidth: 90,
      height: 52,
    },
    sectionHeader: {
      height: 48,
    },
    totalRow: {
      height: 64,
    },
    bonusRow: {
      height: 56,
    },
    leaderboardMini: {
      height: 40,
    },
  },
} as const;

// Helper functions
export const getScoreColor = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;

  if (score === 0) return premiumTheme.colors.scoreColors.zero;
  if (percentage > 80) return premiumTheme.colors.scoreColors.excellent;
  if (percentage > 50) return premiumTheme.colors.scoreColors.good;
  if (percentage > 20) return premiumTheme.colors.scoreColors.average;
  return premiumTheme.colors.scoreColors.poor;
};

export const getCategoryMaxScore = (category: string): number => {
  const maxScores: Record<string, number> = {
    ones: 5,
    twos: 10,
    threes: 15,
    fours: 20,
    fives: 25,
    sixes: 30,
    threeOfAKind: 30,
    fourOfAKind: 30,
    fullHouse: 25,
    smallStraight: 30,
    largeStraight: 40,
    yams: 50,
    chance: 30,
  };

  return maxScores[category] || 50;
};

export type PremiumTheme = typeof premiumTheme;
