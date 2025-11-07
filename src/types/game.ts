/**
 * Game Types - Type definitions for the Yams game
 */

export type CategoryType =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'threeOfKind'
  | 'fourOfKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yams'
  | 'chance';

export interface Category {
  id: CategoryType;
  name: string;
  shortName: string;
  icon: string;
  section: 'upper' | 'lower';
  fixedPoints?: number; // Pour Full, Suites, Yams
}

export interface Player {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  isAI?: boolean;
  aiDifficulty?: 'easy' | 'normal' | 'hard';
}

export interface ScoreEntry {
  value: number | null; // null = not filled yet
  isCrossed: boolean; // true = barré (0 point)
  turn: number; // Tour où le score a été saisi
}

export interface PlayerScores {
  // Upper section
  ones: ScoreEntry;
  twos: ScoreEntry;
  threes: ScoreEntry;
  fours: ScoreEntry;
  fives: ScoreEntry;
  sixes: ScoreEntry;

  // Lower section
  threeOfKind: ScoreEntry;
  fourOfKind: ScoreEntry;
  fullHouse: ScoreEntry;
  smallStraight: ScoreEntry;
  largeStraight: ScoreEntry;
  yams: ScoreEntry;
  chance: ScoreEntry;

  // Calculated values
  upperTotal: number;
  upperBonus: number;
  lowerTotal: number;
  grandTotal: number;
}

export interface GameState {
  gameId: string;
  gameName: string;
  players: Player[];
  scores: Record<string, PlayerScores>; // playerId -> scores
  currentTurn: number;
  totalTurns: number;
  currentPlayerIndex: number;
  isGameComplete: boolean;
  startedAt: number;
  completedAt?: number;
}

export interface ActiveCell {
  playerId: string;
  category: CategoryType;
}

// Category definitions
export const CATEGORIES: Category[] = [
  // Upper section
  { id: 'ones', name: 'As (1)', shortName: '1', icon: '⚀', section: 'upper' },
  { id: 'twos', name: 'Deux (2)', shortName: '2', icon: '⚁', section: 'upper' },
  { id: 'threes', name: 'Trois (3)', shortName: '3', icon: '⚂', section: 'upper' },
  { id: 'fours', name: 'Quatre (4)', shortName: '4', icon: '⚃', section: 'upper' },
  { id: 'fives', name: 'Cinq (5)', shortName: '5', icon: '⚄', section: 'upper' },
  { id: 'sixes', name: 'Six (6)', shortName: '6', icon: '⚅', section: 'upper' },

  // Lower section
  { id: 'threeOfKind', name: 'Brelan', shortName: 'Brelan', icon: '🎲', section: 'lower' },
  { id: 'fourOfKind', name: 'Carré', shortName: 'Carré', icon: '🎲', section: 'lower' },
  { id: 'fullHouse', name: 'Full', shortName: 'Full', icon: '🎲', section: 'lower', fixedPoints: 25 },
  { id: 'smallStraight', name: 'Petite Suite', shortName: 'P.Suite', icon: '⚀⚁⚂⚃', section: 'lower', fixedPoints: 30 },
  { id: 'largeStraight', name: 'Grande Suite', shortName: 'G.Suite', icon: '⚀⚁⚂⚃⚄', section: 'lower', fixedPoints: 40 },
  { id: 'yams', name: 'Yams', shortName: 'Yams', icon: '⚅', section: 'lower', fixedPoints: 50 },
  { id: 'chance', name: 'Chance', shortName: 'Chance', icon: '🎲', section: 'lower' },
];

// Helper to create empty score entry
export const createEmptyScoreEntry = (): ScoreEntry => ({
  value: null,
  isCrossed: false,
  turn: 0,
});

// Helper to create empty player scores
export const createEmptyPlayerScores = (): PlayerScores => ({
  ones: createEmptyScoreEntry(),
  twos: createEmptyScoreEntry(),
  threes: createEmptyScoreEntry(),
  fours: createEmptyScoreEntry(),
  fives: createEmptyScoreEntry(),
  sixes: createEmptyScoreEntry(),
  threeOfKind: createEmptyScoreEntry(),
  fourOfKind: createEmptyScoreEntry(),
  fullHouse: createEmptyScoreEntry(),
  smallStraight: createEmptyScoreEntry(),
  largeStraight: createEmptyScoreEntry(),
  yams: createEmptyScoreEntry(),
  chance: createEmptyScoreEntry(),
  upperTotal: 0,
  upperBonus: 0,
  lowerTotal: 0,
  grandTotal: 0,
});
