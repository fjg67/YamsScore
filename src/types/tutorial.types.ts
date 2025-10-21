/**
 * Types pour le système de tutoriel et aide contextuelle
 */

import { ScoreCategory } from './game.types';

export type TutorialStep =
  | 'welcome'
  | 'player_badges'
  | 'leaderboard'
  | 'score_grid'
  | 'category_selection'
  | 'numpad_input'
  | 'bonus_explanation'
  | 'strategies'
  | 'celebrations'
  | 'complete';

export interface TutorialStepConfig {
  id: TutorialStep;
  title: string;
  message: string;
  highlightComponent?: string;
  position: 'top' | 'center' | 'bottom';
  actionButton: string;
  skipButton?: boolean;
  illustration?: string;
}

export interface TutorialState {
  isActive: boolean;
  currentStep: TutorialStep;
  completedSteps: TutorialStep[];
  hasSeenTutorial: boolean;
}

export interface RuleTooltipData {
  category: ScoreCategory;
  title: string;
  description: string;
  examples: string[];
  scoring: string;
  tips: string[];
  maxScore: number;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;

  // Scores
  currentTotal: number;
  upperSectionTotal: number;
  lowerSectionTotal: number;
  bonusProgress: number; // 0-63
  hasBonus: boolean;

  // Performance
  bestScore: { category: ScoreCategory; value: number } | null;
  worstScore: { category: ScoreCategory; value: number } | null;
  averageScore: number;

  // Progress
  categoriesFilled: number;
  categoriesRemaining: number;
  completionRate: number; // 0-100%

  // Achievements
  perfectScores: ScoreCategory[];
  crossedCategories: ScoreCategory[];
}

export interface GameStats {
  // Global
  currentTurn: number;
  totalTurns: number;

  // Players
  playerStats: PlayerStats[];
  leader: PlayerStats | null;

  // Competition
  scoreDifference: number; // Entre 1er et 2ème
  isCloseGame: boolean; // < 10 points

  // Predictions
  projectedWinner: string | null;
  projectedFinalScore: number;
}

export interface StrategicSuggestion {
  category: ScoreCategory;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  expectedValue: number;
}
