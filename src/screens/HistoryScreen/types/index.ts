// Types pour l'écran Historique Premium

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (stats: PlayerStatistics) => boolean;
  gradient: [string, string];
}

export interface PlayerStatistics {
  // Stats générales
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  winRate: number;

  // Scores
  bestScore: number;
  bestScoreDate?: Date;
  averageScore: number;
  worstScore: number;

  // Achievements spéciaux
  totalYams: number;
  totalFullHouse: number;
  totalLargeStraight: number;
  totalSmallStraight: number;
  perfectGames: number; // Parties sans case barrée

  // Streaks
  currentStreak: number;
  maxStreak: number;
  maxStreakDate?: Date;
  consecutiveWins: number;
  maxConsecutiveWins: number;

  // Moyennes par catégorie
  avgUpperSection: number;
  avgBrelans: number;
  avgSuites: number;
  avgChance: number;

  // Social
  sharedResults: number;

  // Dates
  firstGameDate?: Date;
  lastGameDate?: Date;

  // Progression
  recentGames: number[]; // Derniers 20 scores pour le graphique
  gameHistory: Array<{
    date: Date;
    score: number;
    isWin: boolean;
    isPB: boolean;
  }>;
}

export interface Milestone {
  id: string;
  date: Date;
  icon: string;
  title: string;
  description: string;
  color: string;
  highlight?: boolean;
}

export interface RivalStats {
  opponentId: string;
  opponentName: string;
  opponentEmoji: string;
  opponentColor: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  lastPlayed?: Date;
}

export interface MonthlyRecapData {
  month: string;
  year: number;
  totalGames: number;
  totalWins: number;
  bestScore: number;
  bestMoment: {
    title: string;
    description: string;
    date: Date;
  };
  newAchievements: Achievement[];
  progressPercentage: number;
}

export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
  highlight?: boolean;
}

export interface CategoryPerformance {
  category: string;
  average: number;
  max: number;
  percentage: number;
}
