/**
 * Types pour les composants premium
 */

import { ScoreCategory } from './game.types';

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  avatar: string;
  color: string;
  score: number;
  position: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CellState {
  playerId: string;
  category: ScoreCategory;
  value?: number;
  isLocked: boolean;
  isEmpty: boolean;
  isSelected: boolean;
  isActiveTurn: boolean;
  scoreQuality?: 'excellent' | 'good' | 'average' | 'poor';
}

export interface PlayerBadgeData {
  id: string;
  name: string;
  avatar: string;
  color: string;
  score: number;
  isActive: boolean;
  isWinning: boolean;
  position: number;
}

export interface TotalRowData {
  label: string;
  emoji: string;
  playerScores: {
    playerId: string;
    value: number;
  }[];
  isGrandTotal?: boolean;
}

export interface BonusRowData {
  playerBonuses: {
    playerId: string;
    currentTotal: number;
    threshold: number;
    achieved: boolean;
    value: number;
  }[];
}

export interface SectionHeaderData {
  title: string;
  icon: string;
  description: string;
  gradient: [string, string];
}

export interface NumPadContext {
  category: ScoreCategory;
  categoryName: string;
  categoryEmoji: string;
  playerId: string;
  playerName: string;
  playerColor: string;
  possibleValues: number[];
  quickValues: number[];
  maxValue: number;
}

export interface AnimationConfig {
  duration: number;
  easing: 'smooth' | 'bounce' | 'elastic' | 'linear';
  delay?: number;
}

export interface CelebrationConfig {
  type: 'yams' | 'bonus' | 'fullHouse' | 'largeStraight' | 'comeback' | 'perfectGame';
  emoji: string;
  title: string;
  subtitle?: string;
  sound?: string;
  haptic?: 'light' | 'medium' | 'heavy' | 'success';
  confettiColors?: string[];
  duration?: number;
}
