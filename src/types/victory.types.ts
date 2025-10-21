/**
 * Types pour l'écran de victoire et partage
 */

import { Player } from './player.types';

export interface PodiumPlayer {
  player: Player;
  position: 1 | 2 | 3;
  score: number;
  achievements: Achievement[];
  highlights: Highlight[];
}

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  emoji: string;
}

export type AchievementType =
  | 'winner'
  | 'second_place'
  | 'third_place'
  | 'highest_score'
  | 'bonus_master'
  | 'yams_king'
  | 'perfect_player'
  | 'comeback_hero'
  | 'strategic_genius'
  | 'lucky_roller';

export interface Highlight {
  type: HighlightType;
  label: string;
  value: string | number;
  emoji: string;
  color?: string;
}

export type HighlightType =
  | 'best_score'
  | 'total_score'
  | 'bonus_achieved'
  | 'perfect_scores'
  | 'yams_count'
  | 'average_score'
  | 'completion_rate'
  | 'comeback'
  | 'domination';

export interface GameSummary {
  // Game info
  gameId: string;
  completedAt: Date;
  duration: number; // milliseconds

  // Players
  players: PodiumPlayer[];
  winner: PodiumPlayer;

  // Stats
  totalTurns: 13;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;

  // Highlights
  gameMoments: GameMoment[];
  records: Record[];
}

export interface GameMoment {
  id: string;
  turn: number;
  playerId: string;
  playerName: string;
  description: string;
  emoji: string;
  timestamp: Date;
}

export interface Record {
  type: RecordType;
  playerId: string;
  playerName: string;
  value: number;
  description: string;
  emoji: string;
}

export type RecordType =
  | 'highest_single_score'
  | 'most_yams'
  | 'most_perfect_scores'
  | 'fastest_bonus'
  | 'most_points'
  | 'best_average'
  | 'most_consistent';

export interface ShareCardData {
  // Game result
  winnerName: string;
  winnerScore: number;
  winnerAvatar: string;

  // Podium
  podium: {
    first: { name: string; score: number; avatar: string };
    second?: { name: string; score: number; avatar: string };
    third?: { name: string; score: number; avatar: string };
  };

  // Stats
  gameDate: Date;
  totalPlayers: number;
  gameDuration: string;
  highlights: string[];

  // Styling
  backgroundColor: string;
  accentColor: string;
}
