import { Achievement, PlayerStatistics } from '../types';

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-game',
    title: 'Premier Pas 👶',
    description: 'Joue ta première partie',
    emoji: '👶',
    rarity: 'common',
    condition: (stats: PlayerStatistics) => stats.totalGames >= 1,
    gradient: ['#50C878', '#3FA065'],
  },
  {
    id: 'first-win',
    title: 'Première Victoire 🥇',
    description: 'Gagne ta première partie',
    emoji: '🥇',
    rarity: 'common',
    condition: (stats: PlayerStatistics) => stats.totalWins >= 1,
    gradient: ['#FFD700', '#FFA500'],
  },
  {
    id: 'yams-master',
    title: 'Roi du Yams 👑',
    description: 'Réalise ton premier Yams',
    emoji: '👑',
    rarity: 'rare',
    condition: (stats: PlayerStatistics) => stats.totalYams >= 1,
    gradient: ['#9B59B6', '#8E44AD'],
  },
  {
    id: 'streak-7',
    title: 'Semaine Parfaite 🔥',
    description: '7 jours consécutifs',
    emoji: '🔥',
    rarity: 'rare',
    condition: (stats: PlayerStatistics) => stats.maxStreak >= 7,
    gradient: ['#FF6B6B', '#FF8E53'],
  },
  {
    id: 'high-roller',
    title: 'High Roller 🎰',
    description: 'Score supérieur à 300 points',
    emoji: '🎰',
    rarity: 'epic',
    condition: (stats: PlayerStatistics) => stats.bestScore >= 300,
    gradient: ['#E91E63', '#C2185B'],
  },
  {
    id: 'marathon',
    title: 'Marathonien 🏃',
    description: '50 parties jouées',
    emoji: '🏃',
    rarity: 'epic',
    condition: (stats: PlayerStatistics) => stats.totalGames >= 50,
    gradient: ['#00BCD4', '#0097A7'],
  },
  {
    id: 'perfect-game',
    title: 'Partie Parfaite 💎',
    description: 'Aucune case barrée',
    emoji: '💎',
    rarity: 'legendary',
    condition: (stats: PlayerStatistics) => stats.perfectGames >= 1,
    gradient: ['#1ABC9C', '#16A085'],
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly 🦋',
    description: 'Partage 5 résultats',
    emoji: '🦋',
    rarity: 'common',
    condition: (stats: PlayerStatistics) => stats.sharedResults >= 5,
    gradient: ['#3F51B5', '#303F9F'],
  },
  {
    id: 'win-streak-5',
    title: 'Série Victorieuse 🎯',
    description: '5 victoires consécutives',
    emoji: '🎯',
    rarity: 'rare',
    condition: (stats: PlayerStatistics) => stats.maxConsecutiveWins >= 5,
    gradient: ['#50C878', '#3FA065'],
  },
  {
    id: 'yams-collector',
    title: 'Collectionneur 🏆',
    description: '10 Yams réalisés',
    emoji: '🏆',
    rarity: 'epic',
    condition: (stats: PlayerStatistics) => stats.totalYams >= 10,
    gradient: ['#FFD700', '#FFA500'],
  },
  {
    id: 'fullhouse-master',
    title: 'Roi du Full 🏠',
    description: '20 Full réalisés',
    emoji: '🏠',
    rarity: 'rare',
    condition: (stats: PlayerStatistics) => stats.totalFullHouse >= 20,
    gradient: ['#FF9800', '#F57C00'],
  },
  {
    id: 'suite-expert',
    title: 'Expert des Suites 🎢',
    description: '30 grandes suites',
    emoji: '🎢',
    rarity: 'rare',
    condition: (stats: PlayerStatistics) => stats.totalLargeStraight >= 30,
    gradient: ['#2196F3', '#1976D2'],
  },
  {
    id: 'centurion',
    title: 'Centurion 💯',
    description: '100 parties jouées',
    emoji: '💯',
    rarity: 'legendary',
    condition: (stats: PlayerStatistics) => stats.totalGames >= 100,
    gradient: ['#9C27B0', '#7B1FA2'],
  },
  {
    id: 'champion',
    title: 'Champion 🌟',
    description: '75% de taux de victoire (min 20 parties)',
    emoji: '🌟',
    rarity: 'legendary',
    condition: (stats: PlayerStatistics) =>
      stats.totalGames >= 20 && stats.winRate >= 75,
    gradient: ['#FFD700', '#FF6B6B'],
  },
  {
    id: 'score-master',
    title: 'Score Master ⭐',
    description: 'Dépasse 350 points',
    emoji: '⭐',
    rarity: 'legendary',
    condition: (stats: PlayerStatistics) => stats.bestScore >= 350,
    gradient: ['#FFA726', '#FB8C00'],
  },
];

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return '#95A5A6';
    case 'rare':
      return '#3498DB';
    case 'epic':
      return '#9B59B6';
    case 'legendary':
      return '#F39C12';
    default:
      return '#95A5A6';
  }
};

export const getRarityLabel = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'Commun';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Épique';
    case 'legendary':
      return 'Légendaire';
    default:
      return 'Commun';
  }
};
