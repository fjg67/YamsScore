import { Game } from '../../../types/game.types';
import {
  TimePeriod,
  PeriodStats,
  TrendData,
  CategoryStats,
  HeatMapData,
  PerformancePoint,
} from '../types';
import { subDays, startOfYear, isAfter, format, getDay, getHours } from 'date-fns';

const CURRENT_USER_ID = 'user';

/**
 * Filtre les parties selon la période sélectionnée
 */
export const filterGamesByPeriod = (games: Game[], period: TimePeriod): Game[] => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case '7d':
      startDate = subDays(now, 7);
      break;
    case '30d':
      startDate = subDays(now, 30);
      break;
    case '90d':
      startDate = subDays(now, 90);
      break;
    case 'ytd':
      startDate = startOfYear(now);
      break;
    case 'all':
      return games;
    default:
      return games;
  }

  return games.filter((game) => {
    const gameDate = new Date(game.completedAt || game.createdAt);
    return isAfter(gameDate, startDate);
  });
};

/**
 * Calcule les stats pour une période donnée
 */
export const calculatePeriodStats = (
  games: Game[],
  userId: string = CURRENT_USER_ID
): PeriodStats => {
  const userGames = games.map((game) => {
    const userScore = game.scores.find((s) => s.playerId === userId);
    return {
      game,
      score: userScore?.grandTotal || 0,
      isWin: game.winnerId === userId,
    };
  });

  const totalGames = userGames.length;
  const wins = userGames.filter((g) => g.isWin).length;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  const scores = userGames.map((g) => g.score);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const bestScore = Math.max(...scores, 0);

  // Estimation temps total (15 min par partie en moyenne)
  const totalTime = totalGames * 15;

  // Streak actuel (simplifi é pour le moment)
  const currentStreak = calculateCurrentStreak(games, userId);

  return {
    games: totalGames,
    wins,
    winRate,
    avgScore: Math.round(avgScore),
    bestScore,
    currentStreak,
    totalTime,
  };
};

/**
 * Calcule le trend par rapport à la période précédente
 */
export const calculateTrend = (
  currentPeriodStats: PeriodStats,
  previousPeriodStats: PeriodStats,
  metric: keyof PeriodStats
): TrendData => {
  const current = currentPeriodStats[metric] as number;
  const previous = previousPeriodStats[metric] as number;

  if (previous === 0) {
    return {
      value: current,
      change: current,
      direction: 'neutral',
      percentage: 0,
    };
  }

  const change = current - previous;
  const percentage = (change / previous) * 100;

  return {
    value: current,
    change,
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    percentage: Math.abs(Math.round(percentage)),
  };
};

/**
 * Calcule les stats par catégorie
 */
export const calculateCategoryStats = (
  games: Game[],
  userId: string = CURRENT_USER_ID
): CategoryStats[] => {
  const categories: CategoryStats[] = [
    { name: 'Brelan', emoji: '🎯', avg: 0, max: 30, successRate: 0, frequency: 0, best: 0 },
    { name: 'Carré', emoji: '💎', avg: 0, max: 30, successRate: 0, frequency: 0, best: 0 },
    { name: 'Full', emoji: '🏠', avg: 0, max: 25, successRate: 0, frequency: 0, best: 0 },
    { name: 'Petite Suite', emoji: '📊', avg: 0, max: 30, successRate: 0, frequency: 0, best: 0 },
    { name: 'Grande Suite', emoji: '🚀', avg: 0, max: 40, successRate: 0, frequency: 0, best: 0 },
    { name: 'Yams', emoji: '👑', avg: 0, max: 50, successRate: 0, frequency: 0, best: 0 },
    { name: 'Chance', emoji: '🍀', avg: 0, max: 30, successRate: 0, frequency: 0, best: 0 },
  ];

  const categoryMap: Record<string, string> = {
    'Brelan': 'threeOfKind',
    'Carré': 'fourOfKind',
    'Full': 'fullHouse',
    'Petite Suite': 'smallStraight',
    'Grande Suite': 'largeStraight',
    'Yams': 'yams',
    'Chance': 'chance',
  };

  games.forEach((game) => {
    const userScore = game.scores.find((s) => s.playerId === userId);
    if (!userScore) return;

    categories.forEach((cat) => {
      const key = categoryMap[cat.name] as keyof typeof userScore;
      const value = userScore[key];

      if (typeof value === 'number') {
        cat.avg += value;
        cat.frequency += value > 0 ? 1 : 0;
        cat.best = Math.max(cat.best, value);
      }
    });
  });

  return categories.map((cat) => ({
    ...cat,
    avg: games.length > 0 ? Math.round(cat.avg / games.length) : 0,
    successRate: games.length > 0 ? Math.round((cat.frequency / games.length) * 100) : 0,
  }));
};

/**
 * Analyse de performance par jour de la semaine
 */
export const analyzeByDayOfWeek = (
  games: Game[],
  userId: string = CURRENT_USER_ID
): HeatMapData[] => {
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dayStats: Record<number, { total: number; count: number }> = {};

  games.forEach((game) => {
    const userScore = game.scores.find((s) => s.playerId === userId);
    if (!userScore) return;

    const gameDate = new Date(game.completedAt || game.createdAt);
    const day = getDay(gameDate);

    if (!dayStats[day]) {
      dayStats[day] = { total: 0, count: 0 };
    }

    dayStats[day].total += userScore.grandTotal;
    dayStats[day].count += 1;
  });

  return dayNames.map((label, index) => {
    const stats = dayStats[index];
    return {
      label,
      value: stats ? Math.round(stats.total / stats.count) : 0,
      count: stats?.count || 0,
    };
  });
};

/**
 * Analyse de performance par tranche horaire
 */
export const analyzeByTimeOfDay = (
  games: Game[],
  userId: string = CURRENT_USER_ID
): HeatMapData[] => {
  const periods = [
    { label: 'Matin', hours: '6-12', range: [6, 12], emoji: '🌅' },
    { label: 'Après-midi', hours: '12-18', range: [12, 18], emoji: '☀️' },
    { label: 'Soirée', hours: '18-23', range: [18, 23], emoji: '🌆' },
    { label: 'Nuit', hours: '23-6', range: [23, 6], emoji: '🌙' },
  ];

  const periodStats: Record<string, { total: number; count: number }> = {};

  games.forEach((game) => {
    const userScore = game.scores.find((s) => s.playerId === userId);
    if (!userScore) return;

    const gameDate = new Date(game.completedAt || game.createdAt);
    const hour = getHours(gameDate);

    const period = periods.find((p) => {
      if (p.range[0] < p.range[1]) {
        return hour >= p.range[0] && hour < p.range[1];
      } else {
        return hour >= p.range[0] || hour < p.range[1];
      }
    });

    if (period) {
      if (!periodStats[period.label]) {
        periodStats[period.label] = { total: 0, count: 0 };
      }
      periodStats[period.label].total += userScore.grandTotal;
      periodStats[period.label].count += 1;
    }
  });

  return periods.map((period) => {
    const stats = periodStats[period.label];
    return {
      label: `${period.emoji} ${period.label}`,
      value: stats ? Math.round(stats.total / stats.count) : 0,
      count: stats?.count || 0,
    };
  });
};

/**
 * Calcule le streak actuel
 */
const calculateCurrentStreak = (games: Game[], userId: string): number => {
  // Simplification: retourne 0 pour le moment
  // TODO: implémenter la vraie logique
  return 0;
};

/**
 * Génère les données pour le graphique d'évolution
 */
export const generatePerformancePoints = (
  games: Game[],
  userId: string = CURRENT_USER_ID
): PerformancePoint[] => {
  return games.map((game) => {
    const userScore = game.scores.find((s) => s.playerId === userId);
    const score = userScore?.grandTotal || 0;

    return {
      date: new Date(game.completedAt || game.createdAt),
      score,
      isWin: game.winnerId === userId,
      isPB: false, // Sera calculé après
      hasYams: (userScore?.yams || 0) === 50,
    };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
};

/**
 * Identifie les forces et faiblesses
 */
export const identifyStrengthsWeaknesses = (
  categoryStats: CategoryStats[]
): { strengths: CategoryStats[]; weaknesses: CategoryStats[] } => {
  const sorted = [...categoryStats].sort((a, b) => b.successRate - a.successRate);

  return {
    strengths: sorted.slice(0, 2),
    weaknesses: sorted.slice(-2).reverse(),
  };
};
