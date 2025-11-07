import { AIPersonality } from '../../types/aiPersonality';

export interface Player {
  id: string;
  name: string;
  color: string;
  colorName: string;
  position: number;
  avatarUrl?: string;
  gamesPlayed?: number;
  isAI?: boolean;
  aiDifficulty?: 'easy' | 'normal' | 'hard';
  aiPersonality?: AIPersonality;
}

export interface GameConfig {
  mode: 'classic' | 'descendant';
  orderType: 'manual' | 'random';
  timerEnabled?: boolean;
  timerDuration?: number;
  tournamentMode?: boolean;
  soundEnabled?: boolean;
  saveConfig?: boolean;
}

export interface PlayerColor {
  id: string;
  hex: string;
  name: string;
  emoji: string;
}

export type SetupPhase = 1 | 2 | 3 | 4;
