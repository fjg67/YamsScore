// Types pour le système de progression et récompenses

export type XPAction =
  | 'game_win'
  | 'game_complete'
  | 'yams_scored'
  | 'full_scored'
  | 'grand_scored'
  | 'brelan_scored'
  | 'carre_scored'
  | 'suite_scored'
  | 'bonus_achieved'
  | 'perfect_game'
  | 'ai_defeated_easy'
  | 'ai_defeated_normal'
  | 'ai_defeated_hard'
  | 'daily_quest_complete'
  | 'weekly_quest_complete'
  | 'achievement_unlocked';

export interface XPConfig {
  action: XPAction;
  baseXP: number;
  description: string;
}

export interface XPMultiplier {
  id: string;
  name: string;
  multiplier: number;
  duration?: number; // en minutes, undefined = permanent
  source: 'premium' | 'event' | 'achievement' | 'item';
  expiresAt?: Date;
}

export interface PlayerLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  prestige: number;
}

// Achievements
export type AchievementCategory =
  | 'gameplay'
  | 'mastery'
  | 'collection'
  | 'social'
  | 'special'
  | 'secret';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  xpReward: number;
  hidden: boolean; // Pour les achievements secrets

  // Critères de progression
  requirement: {
    type: 'count' | 'value' | 'condition';
    target: number;
    current: number;
  };

  // Récompenses
  rewards?: {
    badge?: string;
    title?: string;
    emote?: string;
    coins?: number;
  };
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  completed: boolean;
  completedAt?: Date;
  claimedReward: boolean;
}

// Quêtes
export type QuestType = 'daily' | 'weekly' | 'monthly';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;

  // Objectifs
  objectives: QuestObjective[];

  // Récompenses
  rewards: QuestReward;

  // Timing
  startDate: Date;
  endDate: Date;

  // État
  completed: boolean;
  claimed: boolean;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'win_games' | 'score_points' | 'get_yams' | 'defeat_ai' | 'play_streak';
  target: number;
  current: number;
  completed: boolean;
}

export interface QuestReward {
  xp: number;
  coins?: number;
  battlePassXP?: number;
  items?: string[];
}

// Badges
export type BadgeType = 'mastery' | 'event' | 'prestige' | 'achievement' | 'special';

export interface Badge {
  id: string;
  name: string;
  description: string;
  type: BadgeType;
  icon: string;
  rarity: AchievementRarity;

  // Conditions d'obtention
  requirement: string;
  unlockedAt?: Date;
}

// Battle Pass
export interface BattlePassTier {
  tier: number;
  xpRequired: number;
  freeRewards: Reward[];
  premiumRewards: Reward[];
}

export interface Reward {
  type: 'xp_boost' | 'coins' | 'badge' | 'emote' | 'title' | 'border' | 'dice_skin' | 'background';
  id: string;
  name: string;
  description?: string;
  icon?: string;
  rarity?: AchievementRarity;
}

export interface BattlePass {
  season: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;

  currentTier: number;
  currentXP: number;
  maxTier: number;

  isPremium: boolean;
  tiers: BattlePassTier[];
}

// Prestige
export interface PrestigeLevel {
  level: number; // 1-10
  name: string;
  icon: string;
  borderColor: string;

  // Avantages
  benefits: {
    xpBoost: number; // Multiplicateur permanent
    exclusiveEmotes: string[];
    exclusiveTitles: string[];
    exclusiveBorder: string;
  };

  // Requis
  requiredLevel: number; // Niveau à atteindre avant de pouvoir prestige
}

export interface PlayerPrestige {
  currentPrestige: number;
  totalPrestiges: number;
  canPrestige: boolean;
  nextPrestigeAt: number; // Niveau requis
}

// Profil joueur complet
export interface PlayerProfile {
  userId: string;
  displayName: string;

  // Progression
  level: PlayerLevel;
  prestige: PlayerPrestige;

  // XP et multiplicateurs
  activeMultipliers: XPMultiplier[];

  // Achievements
  achievements: AchievementProgress[];
  achievementPoints: number;

  // Quêtes
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  monthlyQuest?: Quest;
  questsCompleted: number;

  // Badges
  unlockedBadges: Badge[];
  equippedBadge?: string;

  // Battle Pass
  battlePass: BattlePass;

  // Cosmétiques équipés
  equipped: {
    title?: string;
    badge?: string;
    border?: string;
    diceSkin?: string;
    background?: string;
  };

  // Stats
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    highestScore: number;
    yamsScored: number;
    perfectGames: number;
  };

  // Monnaie
  coins: number;
}

// Configuration XP
export const XP_CONFIG: XPConfig[] = [
  { action: 'game_win', baseXP: 100, description: 'Gagner une partie' },
  { action: 'game_complete', baseXP: 50, description: 'Terminer une partie' },
  { action: 'yams_scored', baseXP: 75, description: 'Réaliser un Yams' },
  { action: 'full_scored', baseXP: 30, description: 'Réaliser un Full' },
  { action: 'grand_scored', baseXP: 40, description: 'Réaliser une Grande Suite' },
  { action: 'brelan_scored', baseXP: 15, description: 'Réaliser un Brelan' },
  { action: 'carre_scored', baseXP: 25, description: 'Réaliser un Carré' },
  { action: 'suite_scored', baseXP: 20, description: 'Réaliser une Petite Suite' },
  { action: 'bonus_achieved', baseXP: 50, description: 'Obtenir le bonus (63+)' },
  { action: 'perfect_game', baseXP: 500, description: 'Partie parfaite (375 points)' },
  { action: 'ai_defeated_easy', baseXP: 50, description: 'Battre une IA facile' },
  { action: 'ai_defeated_normal', baseXP: 100, description: 'Battre une IA normale' },
  { action: 'ai_defeated_hard', baseXP: 200, description: 'Battre une IA difficile' },
  { action: 'daily_quest_complete', baseXP: 150, description: 'Compléter une quête quotidienne' },
  { action: 'weekly_quest_complete', baseXP: 500, description: 'Compléter une quête hebdomadaire' },
  { action: 'achievement_unlocked', baseXP: 100, description: 'Débloquer un achievement' },
];

// Formule de calcul XP pour level up
export const calculateXPForLevel = (level: number): number => {
  // Formule progressive : 100 * level * 1.5
  return Math.floor(100 * level * 1.5);
};

// Prestige levels
export const PRESTIGE_LEVELS: PrestigeLevel[] = [
  {
    level: 1,
    name: 'Bronze Prestige',
    icon: '🥉',
    borderColor: '#CD7F32',
    benefits: {
      xpBoost: 1.1,
      exclusiveEmotes: ['🎖️'],
      exclusiveTitles: ['Bronze Veteran'],
      exclusiveBorder: 'bronze_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 2,
    name: 'Silver Prestige',
    icon: '🥈',
    borderColor: '#C0C0C0',
    benefits: {
      xpBoost: 1.2,
      exclusiveEmotes: ['🎖️', '⚔️'],
      exclusiveTitles: ['Silver Veteran', 'Dedicated Player'],
      exclusiveBorder: 'silver_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 3,
    name: 'Gold Prestige',
    icon: '🥇',
    borderColor: '#FFD700',
    benefits: {
      xpBoost: 1.3,
      exclusiveEmotes: ['🎖️', '⚔️', '👑'],
      exclusiveTitles: ['Gold Veteran', 'Elite Player', 'Champion'],
      exclusiveBorder: 'gold_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 4,
    name: 'Platinum Prestige',
    icon: '💎',
    borderColor: '#E5E4E2',
    benefits: {
      xpBoost: 1.4,
      exclusiveEmotes: ['🎖️', '⚔️', '👑', '💎'],
      exclusiveTitles: ['Platinum Veteran', 'Master', 'Legend'],
      exclusiveBorder: 'platinum_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 5,
    name: 'Diamond Prestige',
    icon: '💠',
    borderColor: '#B9F2FF',
    benefits: {
      xpBoost: 1.5,
      exclusiveEmotes: ['🎖️', '⚔️', '👑', '💎', '💠'],
      exclusiveTitles: ['Diamond Veteran', 'Grandmaster', 'Immortal'],
      exclusiveBorder: 'diamond_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 6,
    name: 'Master Prestige',
    icon: '⚡',
    borderColor: '#FFD700',
    benefits: {
      xpBoost: 1.6,
      exclusiveEmotes: ['🎖️', '⚔️', '👑', '💎', '💠', '⚡'],
      exclusiveTitles: ['Master Veteran', 'Divine', 'Celestial'],
      exclusiveBorder: 'master_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 7,
    name: 'Grandmaster Prestige',
    icon: '🌟',
    borderColor: '#FF69B4',
    benefits: {
      xpBoost: 1.7,
      exclusiveEmotes: ['🎖️', '⚔️', '👑', '💎', '💠', '⚡', '🌟'],
      exclusiveTitles: ['Grandmaster Veteran', 'Mythic', 'Godlike'],
      exclusiveBorder: 'grandmaster_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 8,
    name: 'Challenger Prestige',
    icon: '🔥',
    borderColor: '#FF4500',
    benefits: {
      xpBoost: 1.8,
      exclusiveEmotes: ['🎖️', '⚔️', '👑', '💎', '💠', '⚡', '🌟', '🔥'],
      exclusiveTitles: ['Challenger Veteran', 'Transcendent', 'Beyond'],
      exclusiveBorder: 'challenger_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 9,
    name: 'Cosmic Prestige',
    icon: '🌌',
    borderColor: '#9400D3',
    benefits: {
      xpBoost: 1.9,
      exclusiveEmotes: ['🎖️', '⚔️', '👑', '💎', '💠', '⚡', '🌟', '🔥', '🌌'],
      exclusiveTitles: ['Cosmic Veteran', 'Infinite', 'Eternal'],
      exclusiveBorder: 'cosmic_glow',
    },
    requiredLevel: 50,
  },
  {
    level: 10,
    name: 'Ultimate Prestige',
    icon: '👁️',
    borderColor: '#FF00FF',
    benefits: {
      xpBoost: 2.0,
      exclusiveEmotes: ['🎖️', '⚔️', '👑', '💎', '💠', '⚡', '🌟', '🔥', '🌌', '👁️'],
      exclusiveTitles: ['Ultimate Veteran', 'Omniscient', 'The One', 'Supreme Being'],
      exclusiveBorder: 'ultimate_glow',
    },
    requiredLevel: 50,
  },
];
