/**
 * Système de design premium pour l'écran Rules
 */

// ============================================
// COLOR SYSTEM
// ============================================

export const RulesColors = {
  // Section Colors
  sections: {
    upper: {
      primary: '#4A90E2',
      gradient: ['#4A90E2', '#5DADE2'],
      background: 'rgba(74, 144, 226, 0.08)',
      light: 'rgba(74, 144, 226, 0.15)',
    },
    lower: {
      primary: '#50C878',
      gradient: ['#50C878', '#58D68D'],
      background: 'rgba(80, 200, 120, 0.08)',
      light: 'rgba(80, 200, 120, 0.15)',
    },
  },

  // Difficulty Colors
  difficulty: {
    Facile: '#50C878',
    Moyen: '#4A90E2',
    Difficile: '#F39C12',
    'Très Difficile': '#E74C3C',
    Légendaire: '#9B59B6',
  },

  // Special Features
  bonus: {
    primary: '#FFD700',
    gradient: ['#FFD700', '#FFA500'],
    background: 'rgba(255, 215, 0, 0.1)',
    glow: 'rgba(255, 215, 0, 0.3)',
  },

  yams: {
    primary: '#9B59B6',
    gradient: ['#9B59B6', '#8E44AD'],
    background: 'rgba(155, 89, 182, 0.1)',
  },

  // UI Colors
  ui: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    white: '#FFFFFF',
    link: '#4A90E2',
  },

  // Semantic Colors
  semantic: {
    success: '#50C878',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#4A90E2',
  },

  // Priority Colors
  priority: {
    high: '#E74C3C',
    medium: '#F39C12',
    low: '#4A90E2',
  },

  // Hero Gradient
  hero: {
    gradient: ['#4A90E2', '#5E3AEE', '#50C878'],
    overlay: 'rgba(0, 0, 0, 0.1)',
  },
};

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================

export const RulesTypography = {
  // Font Families
  fonts: {
    display: 'System', // SF Pro Display on iOS
    text: 'System', // SF Pro Text on iOS
    mono: 'Menlo',
  },

  // Font Sizes
  sizes: {
    hero: 32,
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    bodySmall: 15,
    caption: 13,
    tiny: 11,
  },

  // Font Weights
  weights: {
    black: '900' as const,
    bold: '700' as const,
    semibold: '600' as const,
    medium: '500' as const,
    regular: '400' as const,
    light: '300' as const,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// ============================================
// SPACING SYSTEM
// ============================================

export const RulesSpacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
};

// ============================================
// BORDER RADIUS
// ============================================

export const RulesBorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 1000,
};

// ============================================
// SHADOWS
// ============================================

export const RulesShadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
};

// ============================================
// ANIMATION DURATIONS
// ============================================

export const RulesAnimations = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'spring',
  },
};

// ============================================
// DICE SIZES
// ============================================

export const DiceSizes = {
  tiny: 24,
  small: 32,
  medium: 40,
  large: 48,
  huge: 56,
  massive: 64,
};

// ============================================
// LAYOUT CONSTANTS
// ============================================

export const RulesLayout = {
  hero: {
    height: 220,
    borderRadius: [0, 0, 32, 32],
  },
  quickAccessBar: {
    height: 64,
    overlap: -16,
  },
  card: {
    padding: 20,
    gap: 16,
  },
  grid: {
    columns: 1,
    gap: 16,
  },
};

// ============================================
// Z-INDEX LAYERS
// ============================================

export const ZIndex = {
  base: 0,
  card: 1,
  sticky: 10,
  overlay: 100,
  modal: 1000,
  tooltip: 2000,
  toast: 3000,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getDifficultyColor = (difficulty: string): string => {
  return RulesColors.difficulty[difficulty as keyof typeof RulesColors.difficulty] || '#4A90E2';
};

export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  return RulesColors.priority[priority];
};

export const getSectionColor = (section: 'upper' | 'lower'): string => {
  return section === 'upper'
    ? RulesColors.sections.upper.primary
    : RulesColors.sections.lower.primary;
};

export const getSectionGradient = (section: 'upper' | 'lower'): string[] => {
  return section === 'upper'
    ? RulesColors.sections.upper.gradient
    : RulesColors.sections.lower.gradient;
};

export const getSectionBackground = (section: 'upper' | 'lower'): string => {
  return section === 'upper'
    ? RulesColors.sections.upper.background
    : RulesColors.sections.lower.background;
};
