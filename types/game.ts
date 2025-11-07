import { Player } from './player';

export interface DiceValue {
  value: number;
  kept: boolean;
}

export interface ScoreCategory {
  id: string;
  name: string;
  score: number | null;
  isCompleted: boolean;
}

export interface PlayerScore {
  playerId: string;
  categories: {
    // Section supérieure
    ones: number | null;
    twos: number | null;
    threes: number | null;
    fours: number | null;
    fives: number | null;
    sixes: number | null;
    // Bonus
    upperBonus: number;
    // Section inférieure
    threeOfKind: number | null;
    fourOfKind: number | null;
    fullHouse: number | null;
    smallStraight: number | null;
    largeStraight: number | null;
    yams: number | null;
    chance: number | null;
  };
  upperTotal: number;
  lowerTotal: number;
  grandTotal: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  maxRounds: number;
  dices: DiceValue[];
  rollsRemaining: number;
  maxRolls: number;
  scores: PlayerScore[];
  isGameOver: boolean;
  winner: Player | null;
}

export type { Player };
