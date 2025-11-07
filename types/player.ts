export enum PlayerType {
  HUMAN = "human",
  AI_EASY = "ai_easy",
  AI_NORMAL = "ai_normal",
  AI_HARD = "ai_hard"
}

export interface AvatarConfig {
  emoji: string;
  initial: string;
  color: string;
}

export interface PlayerTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Badge {
  id: string;
  icon: string;
  title: string;
  unlockedAt: Date;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  averageScore: number;
  yamsScored: number;
  bonusEarned: number;
  aiEasyWins: number;
  aiNormalWins: number;
  aiHardWins: number;
  currentWinStreak: number;
  bestWinStreak: number;
}

export interface PlayerPreferences {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  animationsEnabled: boolean;
  theme: string;
}

export interface AIConfig {
  difficulty: "easy" | "normal" | "hard";
  personality: string;
  winRate: number;
  strategicMultiplier: number;
}

export interface Player {
  id: string;
  type: PlayerType;
  name: string;
  nickname?: string;
  avatar: AvatarConfig;
  color: string;
  icon?: string;
  theme: PlayerTheme;
  badge?: Badge;
  title?: string;
  stats: PlayerStats;
  level: number;
  xp: number;
  totalXP: number;
  preferences: PlayerPreferences;
  aiConfig?: AIConfig;
  createdAt: Date;
  lastPlayed: Date;
}

export interface SavedPlayer extends Player {
  unlockedColors: string[];
  unlockedAvatars: string[];
  unlockedBadges: string[];
  unlockedTitles: string[];
  unlockedThemes: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlockedAt?: Date;
  progress?: number;
}

export type GameMode = "multiplayer" | "vs_ai";
