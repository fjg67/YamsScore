/**
 * Types pour la gestion des parties de Yams
 */

import { Player } from './player.types';

/**
 * Catégories de score possibles
 */
export type ScoreCategory =
  // Section supérieure
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  // Section inférieure
  | 'threeOfKind'
  | 'fourOfKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yams'
  | 'chance';

/**
 * Ligne de score avec toutes les catégories possibles
 */
export interface ScoreRow {
  // Section supérieure (1-6)
  ones?: number;
  twos?: number;
  threes?: number;
  fours?: number;
  fives?: number;
  sixes?: number;

  // Section inférieure
  threeOfKind?: number; // Brelan - Total des 5 dés
  fourOfKind?: number; // Carré - Total des 5 dés
  fullHouse?: number; // Full - 25 points
  smallStraight?: number; // Petite suite - 30 points
  largeStraight?: number; // Grande suite - 40 points
  yams?: number; // Yams - 50 points
  chance?: number; // Chance - Total des 5 dés
}

/**
 * Score d'un joueur avec tous les totaux calculés
 */
export interface PlayerScore extends ScoreRow {
  playerId: string;
  upperTotal: number; // Total section supérieure
  upperBonus: number; // Bonus si >= 63 points (+35)
  lowerTotal: number; // Total section inférieure
  grandTotal: number; // Score final total
}

/**
 * Mode de jeu
 */
export type GameMode = 'classic' | 'descending';

/**
 * Statut de la partie
 */
export type GameStatus = 'in_progress' | 'completed';

/**
 * Partie de Yams complète
 */
export interface Game {
  id: string;
  players: Player[];
  scores: PlayerScore[];
  currentTurn: number;
  status: GameStatus;
  createdAt: Date;
  completedAt?: Date;
  mode: GameMode;
  winnerId?: string;
}

/**
 * Règles de validation pour chaque catégorie
 */
export interface ScoreValidationRule {
  category: ScoreCategory;
  minValue: number;
  maxValue: number;
  fixedValue?: number; // Pour Full, Petite suite, Grande suite, Yams
}
