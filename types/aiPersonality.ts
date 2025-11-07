export type AIPersonality = 'aggressive' | 'prudent' | 'unpredictable' | 'perfect';

export interface AIPersonalityConfig {
  id: AIPersonality;
  name: string;
  emoji: string;
  description: string;
  color: string;
  gradient: [string, string];
  traits: {
    riskTolerance: number; // 0-1 (0 = very conservative, 1 = very risky)
    optimality: number; // 0-1 (0 = random, 1 = perfect play)
    consistency: number; // 0-1 (0 = erratic, 1 = consistent)
    aggression: number; // 0-1 (0 = passive, 1 = aggressive)
  };
  strategy: {
    // Yams scoring preferences
    prioritizeYams: boolean; // Go for Yams (50pts) early
    prioritizeBonus: boolean; // Focus on upper section bonus
    acceptLowScores: boolean; // Accept low scores to keep options open
    riskZeros: boolean; // Risk zeros for big scores

    // Decision making
    thinkingTime: number; // Simulated thinking time in ms (for realism)
    bluffChance: number; // 0-1 chance to make suboptimal moves
  };
}

export const AI_PERSONALITIES: Record<AIPersonality, AIPersonalityConfig> = {
  aggressive: {
    id: 'aggressive',
    name: 'Agressif',
    emoji: '🔥',
    description: 'Prend des risques pour les gros scores',
    color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
    traits: {
      riskTolerance: 0.9,
      optimality: 0.6,
      consistency: 0.7,
      aggression: 0.95,
    },
    strategy: {
      prioritizeYams: true,
      prioritizeBonus: false,
      acceptLowScores: false,
      riskZeros: true,
      thinkingTime: 800,
      bluffChance: 0.15,
    },
  },

  prudent: {
    id: 'prudent',
    name: 'Prudent',
    emoji: '🛡️',
    description: 'Joue de manière conservatrice et sûre',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    traits: {
      riskTolerance: 0.2,
      optimality: 0.75,
      consistency: 0.9,
      aggression: 0.3,
    },
    strategy: {
      prioritizeYams: false,
      prioritizeBonus: true,
      acceptLowScores: true,
      riskZeros: false,
      thinkingTime: 1200,
      bluffChance: 0.05,
    },
  },

  unpredictable: {
    id: 'unpredictable',
    name: 'Imprévisible',
    emoji: '🎲',
    description: 'Stratégie erratique et surprenante',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
    traits: {
      riskTolerance: 0.6,
      optimality: 0.4,
      consistency: 0.3,
      aggression: 0.6,
    },
    strategy: {
      prioritizeYams: true, // Sometimes
      prioritizeBonus: false,
      acceptLowScores: true, // Sometimes
      riskZeros: true, // Sometimes
      thinkingTime: 600,
      bluffChance: 0.4, // High variance
    },
  },

  perfect: {
    id: 'perfect',
    name: 'Parfait',
    emoji: '🤖',
    description: 'Joue de manière optimale et mathématique',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB'],
    traits: {
      riskTolerance: 0.5, // Balanced, calculated risks
      optimality: 1.0, // Perfect play
      consistency: 1.0, // Always consistent
      aggression: 0.5, // Balanced
    },
    strategy: {
      prioritizeYams: false, // Only when optimal
      prioritizeBonus: true, // Calculated
      acceptLowScores: true, // When optimal
      riskZeros: false, // Only when calculated
      thinkingTime: 1500, // Appears to "think"
      bluffChance: 0, // Never makes mistakes
    },
  },
};

export const getAIPersonalityConfig = (personality: AIPersonality): AIPersonalityConfig => {
  return AI_PERSONALITIES[personality];
};

export const getAIDisplayName = (personality: AIPersonality): string => {
  const config = AI_PERSONALITIES[personality];
  return `${config.emoji} IA ${config.name}`;
};
