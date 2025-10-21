import { Game, PlayerScore } from '../../../types/game.types';
import { PlayerStatistics, Milestone, RivalStats } from '../types';
import { differenceInDays, format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

const CURRENT_USER_ID = 'user'; // ID du joueur principal (à adapter selon votre logique)

/**
 * Calcule toutes les statistiques d'un joueur à partir de l'historique
 */
export const calculatePlayerStatistics = (
  games: Game[],
  userId: string = CURRENT_USER_ID
): PlayerStatistics => {
  const completedGames = games.filter((g) => g.status === 'completed');

  if (completedGames.length === 0) {
    return getEmptyStats();
  }

  // Trier par date
  const sortedGames = [...completedGames].sort(
    (a, b) =>
      new Date(a.completedAt || a.createdAt).getTime() -
      new Date(b.completedAt || b.createdAt).getTime()
  );

  // Récupérer les scores du joueur
  const userScores = sortedGames.map((game) => {
    const score = game.scores.find((s) => s.playerId === userId);
    return {
      game,
      score: score ? score.grandTotal : 0,
      scoreData: score,
      isWin: game.winnerId === userId,
      date: new Date(game.completedAt || game.createdAt),
    };
  });

  // Stats générales
  const totalGames = userScores.length;
  const totalWins = userScores.filter((s) => s.isWin).length;
  const totalDraws = sortedGames.filter((g) => !g.winnerId).length;
  const totalLosses = totalGames - totalWins - totalDraws;
  const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

  // Scores
  const scores = userScores.map((s) => s.score);
  const bestScore = Math.max(...scores, 0);
  const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const worstScore = Math.min(...scores.filter((s) => s > 0), 0);

  const bestScoreGame = userScores.find((s) => s.score === bestScore);
  const bestScoreDate = bestScoreGame?.date;

  // Achievements spéciaux
  const totalYams = countCategoryScores(userScores, 'yams', 50);
  const totalFullHouse = countCategoryScores(userScores, 'fullHouse', 25);
  const totalLargeStraight = countCategoryScores(userScores, 'largeStraight', 40);
  const totalSmallStraight = countCategoryScores(userScores, 'smallStraight', 30);
  const perfectGames = countPerfectGames(userScores);

  // Streaks
  const { currentStreak, maxStreak, maxStreakDate } = calculateStreaks(sortedGames, userId);
  const { consecutiveWins, maxConsecutiveWins } = calculateWinStreaks(userScores);

  // Moyennes par catégorie
  const avgUpperSection = calculateCategoryAverage(userScores, 'upperTotal');
  const avgBrelans = (
    calculateCategoryAverage(userScores, 'threeOfKind') +
    calculateCategoryAverage(userScores, 'fourOfKind')
  ) / 2;
  const avgSuites = (
    calculateCategoryAverage(userScores, 'smallStraight') +
    calculateCategoryAverage(userScores, 'largeStraight')
  ) / 2;
  const avgChance = calculateCategoryAverage(userScores, 'chance');

  // Social (à implémenter avec le système de partage)
  const sharedResults = 0; // TODO: compter depuis AsyncStorage

  // Dates
  const firstGameDate = userScores[0]?.date;
  const lastGameDate = userScores[userScores.length - 1]?.date;

  // Progression
  const recentGames = userScores.slice(-20).map((s) => s.score);

  const gameHistory = userScores.map((s) => ({
    date: s.date,
    score: s.score,
    isWin: s.isWin,
    isPB: s.score === bestScore,
  }));

  return {
    totalGames,
    totalWins,
    totalLosses,
    totalDraws,
    winRate,
    bestScore,
    bestScoreDate,
    averageScore,
    worstScore,
    totalYams,
    totalFullHouse,
    totalLargeStraight,
    totalSmallStraight,
    perfectGames,
    currentStreak,
    maxStreak,
    maxStreakDate,
    consecutiveWins,
    maxConsecutiveWins,
    avgUpperSection,
    avgBrelans,
    avgSuites,
    avgChance,
    sharedResults,
    firstGameDate,
    lastGameDate,
    recentGames,
    gameHistory,
  };
};

/**
 * Compte le nombre de fois qu'une catégorie a été complétée avec le score max
 */
const countCategoryScores = (
  userScores: Array<{ scoreData?: PlayerScore }>,
  category: keyof PlayerScore,
  maxScore: number
): number => {
  return userScores.filter((s) => {
    if (!s.scoreData) return false;
    const value = s.scoreData[category];
    return typeof value === 'number' && value === maxScore;
  }).length;
};

/**
 * Compte les parties parfaites (aucune case à 0)
 */
const countPerfectGames = (userScores: Array<{ scoreData?: PlayerScore }>): number => {
  return userScores.filter((s) => {
    if (!s.scoreData) return false;

    const categories: Array<keyof PlayerScore> = [
      'ones',
      'twos',
      'threes',
      'fours',
      'fives',
      'sixes',
      'threeOfKind',
      'fourOfKind',
      'fullHouse',
      'smallStraight',
      'largeStraight',
      'yams',
      'chance',
    ];

    return categories.every((cat) => {
      const value = s.scoreData![cat];
      return typeof value === 'number' && value > 0;
    });
  }).length;
};

/**
 * Calcule les streaks de jours consécutifs
 */
const calculateStreaks = (
  sortedGames: Game[],
  userId: string
): { currentStreak: number; maxStreak: number; maxStreakDate?: Date } => {
  if (sortedGames.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  let currentStreak = 0;
  let maxStreak = 0;
  let maxStreakDate: Date | undefined;
  let lastDate: Date | null = null;

  const uniqueDates = Array.from(
    new Set(
      sortedGames.map((g) => format(new Date(g.completedAt || g.createdAt), 'yyyy-MM-dd'))
    )
  ).sort();

  uniqueDates.forEach((dateStr, index) => {
    const currentDate = new Date(dateStr);

    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const daysDiff = differenceInDays(currentDate, lastDate);
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
      maxStreakDate = currentDate;
    }

    lastDate = currentDate;
  });

  // Vérifier si le streak est toujours actif
  const today = new Date();
  if (lastDate && differenceInDays(today, lastDate) > 1) {
    currentStreak = 0;
  }

  return { currentStreak, maxStreak, maxStreakDate };
};

/**
 * Calcule les séries de victoires consécutives
 */
const calculateWinStreaks = (
  userScores: Array<{ isWin: boolean }>
): { consecutiveWins: number; maxConsecutiveWins: number } => {
  let consecutiveWins = 0;
  let maxConsecutiveWins = 0;

  for (let i = userScores.length - 1; i >= 0; i--) {
    if (userScores[i].isWin) {
      consecutiveWins++;
    } else {
      break;
    }
  }

  let tempStreak = 0;
  userScores.forEach((s) => {
    if (s.isWin) {
      tempStreak++;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  return { consecutiveWins, maxConsecutiveWins };
};

/**
 * Calcule la moyenne d'une catégorie
 */
const calculateCategoryAverage = (
  userScores: Array<{ scoreData?: PlayerScore }>,
  category: keyof PlayerScore
): number => {
  const values = userScores
    .map((s) => s.scoreData?.[category])
    .filter((v): v is number => typeof v === 'number' && v > 0);

  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

/**
 * Stats vides pour initialisation
 */
const getEmptyStats = (): PlayerStatistics => ({
  totalGames: 0,
  totalWins: 0,
  totalLosses: 0,
  totalDraws: 0,
  winRate: 0,
  bestScore: 0,
  averageScore: 0,
  worstScore: 0,
  totalYams: 0,
  totalFullHouse: 0,
  totalLargeStraight: 0,
  totalSmallStraight: 0,
  perfectGames: 0,
  currentStreak: 0,
  maxStreak: 0,
  consecutiveWins: 0,
  maxConsecutiveWins: 0,
  avgUpperSection: 0,
  avgBrelans: 0,
  avgSuites: 0,
  avgChance: 0,
  sharedResults: 0,
  recentGames: [],
  gameHistory: [],
});

/**
 * Génère les milestones du parcours du joueur
 */
export const generateMilestones = (
  games: Game[],
  stats: PlayerStatistics,
  userId: string = CURRENT_USER_ID
): Milestone[] => {
  const milestones: Milestone[] = [];

  if (stats.firstGameDate) {
    milestones.push({
      id: 'first-game',
      date: stats.firstGameDate,
      icon: '🎲',
      title: 'Première Partie',
      description: "Le début de l'aventure",
      color: '#4A90E2',
    });
  }

  const firstWin = games.find((g) => g.winnerId === userId);
  if (firstWin && firstWin.completedAt) {
    const winScore = firstWin.scores.find((s) => s.playerId === userId)?.grandTotal || 0;
    milestones.push({
      id: 'first-win',
      date: new Date(firstWin.completedAt),
      icon: '🏆',
      title: 'Première Victoire',
      description: `Score : ${winScore} pts`,
      color: '#50C878',
      highlight: true,
    });
  }

  // Premier Yams
  const firstYamsGame = games.find((g) => {
    const userScore = g.scores.find((s) => s.playerId === userId);
    return userScore && userScore.yams === 50;
  });
  if (firstYamsGame && firstYamsGame.completedAt) {
    milestones.push({
      id: 'first-yams',
      date: new Date(firstYamsGame.completedAt),
      icon: '👑',
      title: 'Premier Yams',
      description: 'Moment légendaire !',
      color: '#FFD700',
    });
  }

  // Record personnel
  if (stats.bestScoreDate) {
    milestones.push({
      id: 'best-score',
      date: stats.bestScoreDate,
      icon: '⭐',
      title: 'Record Personnel',
      description: `${stats.bestScore} points`,
      color: '#9B59B6',
    });
  }

  // Plus longue série
  if (stats.maxStreakDate) {
    milestones.push({
      id: 'max-streak',
      date: stats.maxStreakDate,
      icon: '🔥',
      title: 'Plus Longue Série',
      description: `${stats.maxStreak} jours`,
      color: '#FF6B6B',
    });
  }

  return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
};

/**
 * Calcule les stats par rival
 */
export const calculateRivalStats = (games: Game[], userId: string = CURRENT_USER_ID): RivalStats[] => {
  const rivalMap = new Map<string, RivalStats>();

  games
    .filter((g) => g.status === 'completed')
    .forEach((game) => {
      const userInGame = game.players.find((p) => p.id === userId);
      if (!userInGame) return;

      game.players.forEach((opponent) => {
        if (opponent.id === userId) return;

        let rivalStats = rivalMap.get(opponent.id);
        if (!rivalStats) {
          rivalStats = {
            opponentId: opponent.id,
            opponentName: opponent.name,
            opponentEmoji: opponent.emoji || '😀',
            opponentColor: opponent.color,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: 0,
          };
          rivalMap.set(opponent.id, rivalStats);
        }

        rivalStats.gamesPlayed++;
        rivalStats.lastPlayed = new Date(game.completedAt || game.createdAt);

        if (game.winnerId === userId) {
          rivalStats.wins++;
        } else if (game.winnerId === opponent.id) {
          rivalStats.losses++;
        } else {
          rivalStats.draws++;
        }

        rivalStats.winRate =
          rivalStats.gamesPlayed > 0 ? (rivalStats.wins / rivalStats.gamesPlayed) * 100 : 0;
      });
    });

  return Array.from(rivalMap.values()).sort((a, b) => b.gamesPlayed - a.gamesPlayed);
};

/**
 * Formatte une date en format relatif
 */
export const formatRelativeDate = (date: Date): string => {
  if (isToday(date)) {
    return `Aujourd'hui à ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `Hier à ${format(date, 'HH:mm')}`;
  }

  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff < 7) {
    return format(date, "EEEE 'à' HH:mm", { locale: fr });
  }

  return format(date, 'dd MMMM yyyy', { locale: fr });
};

/**
 * Génère un insight motivant basé sur les stats
 */
export const generateInsight = (stats: PlayerStatistics): string => {
  if (stats.totalGames === 0) {
    return "Commence ton aventure ! 🎲";
  }

  if (stats.recentGames.length >= 5) {
    const last5 = stats.recentGames.slice(-5);
    const avg = last5.reduce((a, b) => a + b, 0) / last5.length;
    const improvement = avg - stats.averageScore;

    if (improvement > 10) {
      return `Tu progresses ! +${Math.round(improvement)} pts en moyenne 📈`;
    }
  }

  if (stats.consecutiveWins >= 3) {
    return `Série de ${stats.consecutiveWins} victoires ! Continue ! 🔥`;
  }

  if (stats.currentStreak >= 3) {
    return `${stats.currentStreak} jours d'affilée ! Tu assures ! 🎯`;
  }

  if (stats.winRate >= 70) {
    return `${Math.round(stats.winRate)}% de victoires ! Champion ! 🏆`;
  }

  return "Continue comme ça ! 💪";
};
