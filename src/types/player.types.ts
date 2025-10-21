/**
 * Types pour la gestion des joueurs
 */

export interface Player {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  emoji?: string; // Emoji pour avatar premium
  colorGradient?: [string, string]; // Gradient de couleur
}

export interface PlayerStats {
  playerId: string;
  gamesPlayed: number;
  gamesWon: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalYams: number;
  totalFullHouse: number;
  totalLargeStraight: number;
}
