// Types pour l'écran Statistiques Premium

export type TimePeriod = '7d' | '30d' | '90d' | 'ytd' | 'all';

export interface PeriodStats {
  games: number;
  wins: number;
  winRate: number;
  avgScore: number;
  bestScore: number;
  currentStreak: number;
  totalTime: number; // en minutes
}

export interface TrendData {
  value: number;
  change: number;
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
}

export interface CategoryStats {
  name: string;
  emoji: string;
  avg: number;
  max: number;
  successRate: number;
  frequency: number;
  best: number;
}

export interface HeatMapData {
  label: string;
  value: number;
  count: number;
  color?: string;
}

export interface PerformancePoint {
  date: Date;
  score: number;
  isWin: boolean;
  isPB: boolean;
  hasYams: boolean;
}

export interface StrengthWeakness {
  category: string;
  emoji: string;
  rate: number;
  rank: number;
  type: 'strength' | 'weakness';
  tip?: string;
}
