/**
 * Types pour le système de célébrations et achievements
 */

export type MilestoneType =
  | 'yams'              // 50 points au Yams
  | 'largeStraight'     // 40 points Grande Suite
  | 'fullHouse'         // 25 points Full
  | 'bonus'             // Bonus 63+ points débloqué
  | 'perfectScore'      // Score maximum dans une catégorie
  | 'comeback'          // Remontée de dernière place à première
  | 'leadChange'        // Changement de leader
  | 'firstBlood'        // Premier score de la partie
  | 'closeGame'         // Partie serrée (écart < 10)
  | 'perfectGame'       // Aucun 0, toutes cases remplies
  | 'shutout'           // Plus de 100 points d'écart
  | 'highScore';        // Score > 250

export interface CelebrationConfig {
  type: MilestoneType;
  title: string;
  subtitle?: string;
  emoji: string;
  duration: number;          // Durée totale en ms
  confetti: boolean;
  confettiColors?: string[];
  confettiCount?: number;
  sound?: string;
  haptic: 'light' | 'medium' | 'heavy' | 'success';
  fullScreen?: boolean;      // Overlay full-screen ou toast
  priority: number;          // Pour éviter les conflits (1-10, 10 = max)
}

export interface Milestone {
  id: string;
  type: MilestoneType;
  playerId?: string;
  playerName?: string | null;
  value?: number;
  timestamp: number;
  config: CelebrationConfig;
}

export interface Achievement {
  id: string;
  type: MilestoneType;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: Date;
  count: number;            // Nombre de fois débloqué
}

export interface ConfettiParticle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: {
    x: number;
    y: number;
  };
}

export interface ToastNotification {
  id: string;
  message: string;
  emoji?: string;
  duration: number;
  type: 'success' | 'info' | 'warning' | 'achievement';
}
