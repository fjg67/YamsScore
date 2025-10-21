/**
 * Gamification System - XP, Levels, Badges, Leaderboard
 * Complete data structures and mock data
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type BadgeCategory =
  | 'contribution'    // Voting, commenting, suggesting
  | 'social'          // Sharing, following, community
  | 'achievement'     // Milestones, special actions
  | 'streak'          // Daily/weekly activity
  | 'special';        // Limited time, unique

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;                    // Emoji icon
  category: BadgeCategory;
  rarity: BadgeRarity;
  xpReward: number;               // XP earned when unlocking
  requirement: string;             // What user needs to do
  requirementCount: number;        // How many times
  progress?: number;               // Current progress (0-requirementCount)
  unlocked: boolean;
  unlockedAt?: string;             // ISO date string
}

export interface Level {
  level: number;
  title: string;
  xpRequired: number;              // Total XP needed to reach this level
  xpForNext: number;               // XP needed for next level
  icon: string;
  color: string;
  rewards: string[];               // Rewards at this level
}

export interface UserStats {
  userId: string;
  username: string;
  avatar: string;                  // Emoji avatar
  xp: number;
  level: number;
  rank: number;                    // Global rank
  badgesUnlocked: number;
  totalBadges: number;
  streak: number;                  // Current daily streak
  longestStreak: number;
  contributions: {
    votes: number;
    comments: number;
    suggestions: number;
  };
  joinedAt: string;                // ISO date string
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
  badgesUnlocked: number;
  streak: number;
}

export interface StreakDay {
  date: string;                    // YYYY-MM-DD
  active: boolean;
  xpEarned: number;
}

export interface ActivityFeed {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  type: 'badge_unlock' | 'level_up' | 'streak_milestone' | 'contribution';
  description: string;
  timestamp: string;               // ISO date string
  xpGained?: number;
  badgeId?: string;
  level?: number;
}

// ============================================================================
// LEVELS SYSTEM (20 levels)
// ============================================================================

export const LEVELS: Level[] = [
  {
    level: 1,
    title: 'Nouveau Contributeur',
    xpRequired: 0,
    xpForNext: 100,
    icon: '🌱',
    color: '#10B981',
    rewards: ['Accès au système de vote'],
  },
  {
    level: 2,
    title: 'Contributeur Actif',
    xpRequired: 100,
    xpForNext: 200,
    icon: '🌿',
    color: '#10B981',
    rewards: ['Badge "Premier Pas"', 'Accès aux commentaires'],
  },
  {
    level: 3,
    title: 'Membre Engagé',
    xpRequired: 300,
    xpForNext: 300,
    icon: '🍀',
    color: '#10B981',
    rewards: ['Votes comptent double', 'Avatar personnalisé'],
  },
  {
    level: 4,
    title: 'Contributeur Dévoué',
    xpRequired: 600,
    xpForNext: 400,
    icon: '⭐',
    color: '#3B82F6',
    rewards: ['Badge "Voix de la Communauté"'],
  },
  {
    level: 5,
    title: 'Expert Communauté',
    xpRequired: 1000,
    xpForNext: 500,
    icon: '🌟',
    color: '#3B82F6',
    rewards: ['Accès roadmap avancée', 'Suggestions prioritaires'],
  },
  {
    level: 6,
    title: 'Visionnaire',
    xpRequired: 1500,
    xpForNext: 600,
    icon: '💡',
    color: '#3B82F6',
    rewards: ['Badge "Innovateur"'],
  },
  {
    level: 7,
    title: 'Influenceur',
    xpRequired: 2100,
    xpForNext: 700,
    icon: '📣',
    color: '#8B5CF6',
    rewards: ['Accès bêta features', 'Nom dans crédits'],
  },
  {
    level: 8,
    title: 'Leader Communauté',
    xpRequired: 2800,
    xpForNext: 800,
    icon: '👑',
    color: '#8B5CF6',
    rewards: ['Badge "Leader"', 'Accès Discord VIP'],
  },
  {
    level: 9,
    title: 'Ambassadeur',
    xpRequired: 3600,
    xpForNext: 900,
    icon: '🎖️',
    color: '#8B5CF6',
    rewards: ['Suggestions auto-approuvées'],
  },
  {
    level: 10,
    title: 'Champion',
    xpRequired: 4500,
    xpForNext: 1000,
    icon: '🏆',
    color: '#F59E0B',
    rewards: ['Badge "Champion"', 'Consultation directe dev team'],
  },
  {
    level: 11,
    title: 'Maître Contributeur',
    xpRequired: 5500,
    xpForNext: 1200,
    icon: '🎯',
    color: '#F59E0B',
    rewards: ['Features nommées selon vous'],
  },
  {
    level: 12,
    title: 'Architecte',
    xpRequired: 6700,
    xpForNext: 1400,
    icon: '🏗️',
    color: '#F59E0B',
    rewards: ['Badge "Architecte"', 'Design review meetings'],
  },
  {
    level: 13,
    title: 'Pionnier',
    xpRequired: 8100,
    xpForNext: 1600,
    icon: '🚀',
    color: '#EF4444',
    rewards: ['Accès code repository'],
  },
  {
    level: 14,
    title: 'Innovateur Elite',
    xpRequired: 9700,
    xpForNext: 1800,
    icon: '💎',
    color: '#EF4444',
    rewards: ['Badge "Élite"', 'Merchandise exclusif'],
  },
  {
    level: 15,
    title: 'Légende',
    xpRequired: 11500,
    xpForNext: 2000,
    icon: '⚡',
    color: '#EF4444',
    rewards: ['Badge "Légende"', 'Lifetime premium'],
  },
  {
    level: 16,
    title: 'Titan',
    xpRequired: 13500,
    xpForNext: 2500,
    icon: '🔥',
    color: '#DC2626',
    rewards: ['Custom feature naming rights'],
  },
  {
    level: 17,
    title: 'Mythique',
    xpRequired: 16000,
    xpForNext: 3000,
    icon: '✨',
    color: '#DC2626',
    rewards: ['Badge "Mythique"', 'Dev team member for a day'],
  },
  {
    level: 18,
    title: 'Transcendant',
    xpRequired: 19000,
    xpForNext: 3500,
    icon: '🌌',
    color: '#7C3AED',
    rewards: ['Holographic badge', 'App startup splash credit'],
  },
  {
    level: 19,
    title: 'Divin',
    xpRequired: 22500,
    xpForNext: 4000,
    icon: '👼',
    color: '#7C3AED',
    rewards: ['Badge "Divin"', 'Profit sharing program'],
  },
  {
    level: 20,
    title: 'Co-Créateur',
    xpRequired: 26500,
    xpForNext: 0,
    icon: '🌟',
    color: '#FCD34D',
    rewards: ['Badge "Co-Créateur"', 'Official co-creator title', 'All future updates free'],
  },
];

// ============================================================================
// BADGES SYSTEM (30 badges)
// ============================================================================

export const BADGES: Badge[] = [
  // === CONTRIBUTION BADGES (10) ===
  {
    id: 'first_vote',
    title: 'Premier Vote',
    description: 'Votez pour votre première suggestion',
    icon: '🗳️',
    category: 'contribution',
    rarity: 'common',
    xpReward: 10,
    requirement: 'Vote sur une suggestion',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'voter_enthusiast',
    title: 'Voteur Enthousiaste',
    description: 'Votez pour 10 suggestions différentes',
    icon: '📊',
    category: 'contribution',
    rarity: 'common',
    xpReward: 25,
    requirement: 'Votes',
    requirementCount: 10,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'voting_champion',
    title: 'Champion du Vote',
    description: 'Votez pour 50 suggestions',
    icon: '🏅',
    category: 'contribution',
    rarity: 'rare',
    xpReward: 100,
    requirement: 'Votes',
    requirementCount: 50,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'first_comment',
    title: 'Premier Commentaire',
    description: 'Laissez votre premier commentaire',
    icon: '💬',
    category: 'contribution',
    rarity: 'common',
    xpReward: 15,
    requirement: 'Commentaire',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'commentator',
    title: 'Commentateur Actif',
    description: 'Laissez 20 commentaires constructifs',
    icon: '💭',
    category: 'contribution',
    rarity: 'rare',
    xpReward: 75,
    requirement: 'Commentaires',
    requirementCount: 20,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'first_suggestion',
    title: 'Première Idée',
    description: 'Soumettez votre première suggestion',
    icon: '💡',
    category: 'contribution',
    rarity: 'common',
    xpReward: 50,
    requirement: 'Suggestion soumise',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'idea_generator',
    title: 'Générateur d\'Idées',
    description: 'Soumettez 5 suggestions',
    icon: '🧠',
    category: 'contribution',
    rarity: 'rare',
    xpReward: 150,
    requirement: 'Suggestions',
    requirementCount: 5,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'visionary',
    title: 'Visionnaire',
    description: 'Une de vos suggestions atteint 100 votes',
    icon: '🔮',
    category: 'contribution',
    rarity: 'epic',
    xpReward: 250,
    requirement: 'Suggestion avec 100+ votes',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'implemented',
    title: 'Implémenté !',
    description: 'Une de vos suggestions est implémentée',
    icon: '✅',
    category: 'contribution',
    rarity: 'legendary',
    xpReward: 500,
    requirement: 'Suggestion implémentée',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'super_contributor',
    title: 'Super Contributeur',
    description: 'Atteignez 1000 XP total',
    icon: '🌟',
    category: 'contribution',
    rarity: 'epic',
    xpReward: 200,
    requirement: 'XP total',
    requirementCount: 1000,
    progress: 0,
    unlocked: false,
  },

  // === SOCIAL BADGES (8) ===
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Rejoignez le système de contribution',
    icon: '🎉',
    category: 'social',
    rarity: 'common',
    xpReward: 20,
    requirement: 'Créer un profil',
    requirementCount: 1,
    progress: 1,
    unlocked: true,
    unlockedAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'helpful_neighbor',
    title: 'Voisin Serviable',
    description: 'Aidez 5 personnes via commentaires',
    icon: '🤝',
    category: 'social',
    rarity: 'rare',
    xpReward: 80,
    requirement: 'Commentaires utiles',
    requirementCount: 5,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'community_builder',
    title: 'Bâtisseur Communauté',
    description: 'Invitez 10 amis au système',
    icon: '🏘️',
    category: 'social',
    rarity: 'epic',
    xpReward: 200,
    requirement: 'Invitations acceptées',
    requirementCount: 10,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'trending_topic',
    title: 'Sujet Tendance',
    description: 'Créez une suggestion qui devient trending',
    icon: '🔥',
    category: 'social',
    rarity: 'epic',
    xpReward: 180,
    requirement: 'Suggestion trending',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'influencer',
    title: 'Influenceur',
    description: 'Vos suggestions totalisent 500 votes',
    icon: '📣',
    category: 'social',
    rarity: 'legendary',
    xpReward: 400,
    requirement: 'Votes totaux sur vos suggestions',
    requirementCount: 500,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'ambassador',
    title: 'Ambassadeur',
    description: 'Partagez 20 suggestions sur réseaux sociaux',
    icon: '🌍',
    category: 'social',
    rarity: 'rare',
    xpReward: 90,
    requirement: 'Partages',
    requirementCount: 20,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'top_10',
    title: 'Top 10',
    description: 'Entrez dans le top 10 du leaderboard',
    icon: '🏆',
    category: 'social',
    rarity: 'epic',
    xpReward: 300,
    requirement: 'Rang top 10',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'number_one',
    title: 'Numéro 1',
    description: 'Atteignez la 1ère place du leaderboard',
    icon: '👑',
    category: 'social',
    rarity: 'legendary',
    xpReward: 1000,
    requirement: 'Rang #1',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },

  // === STREAK BADGES (6) ===
  {
    id: 'streak_3',
    title: 'Série de 3',
    description: 'Contribuez 3 jours consécutifs',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpReward: 30,
    requirement: 'Jours consécutifs',
    requirementCount: 3,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'streak_7',
    title: 'Semaine Parfaite',
    description: 'Contribuez 7 jours consécutifs',
    icon: '⚡',
    category: 'streak',
    rarity: 'rare',
    xpReward: 100,
    requirement: 'Jours consécutifs',
    requirementCount: 7,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'streak_30',
    title: 'Mois Complet',
    description: 'Contribuez 30 jours consécutifs',
    icon: '💪',
    category: 'streak',
    rarity: 'epic',
    xpReward: 300,
    requirement: 'Jours consécutifs',
    requirementCount: 30,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'streak_100',
    title: 'Centenaire',
    description: 'Contribuez 100 jours consécutifs',
    icon: '💯',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1000,
    requirement: 'Jours consécutifs',
    requirementCount: 100,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'weekend_warrior',
    title: 'Guerrier du Week-end',
    description: 'Contribuez 10 week-ends consécutifs',
    icon: '🎮',
    category: 'streak',
    rarity: 'rare',
    xpReward: 120,
    requirement: 'Week-ends',
    requirementCount: 10,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'night_owl',
    title: 'Oiseau de Nuit',
    description: 'Contribuez après minuit 20 fois',
    icon: '🦉',
    category: 'streak',
    rarity: 'rare',
    xpReward: 80,
    requirement: 'Contributions nocturnes',
    requirementCount: 20,
    progress: 0,
    unlocked: false,
  },

  // === ACHIEVEMENT BADGES (4) ===
  {
    id: 'speed_voter',
    title: 'Voteur Éclair',
    description: 'Votez dans les 5 min après publication',
    icon: '⚡',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 60,
    requirement: 'Votes rapides',
    requirementCount: 10,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'detailed_feedback',
    title: 'Feedback Détaillé',
    description: 'Écrivez 5 commentaires de 200+ caractères',
    icon: '📝',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 100,
    requirement: 'Commentaires longs',
    requirementCount: 5,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'beta_tester',
    title: 'Beta Testeur',
    description: 'Testez une feature en beta',
    icon: '🧪',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 150,
    requirement: 'Participation beta',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'bug_hunter',
    title: 'Chasseur de Bugs',
    description: 'Signalez 10 bugs confirmés',
    icon: '🐛',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 200,
    requirement: 'Bugs signalés',
    requirementCount: 10,
    progress: 0,
    unlocked: false,
  },

  // === SPECIAL BADGES (2) ===
  {
    id: 'founding_member',
    title: 'Membre Fondateur',
    description: 'Présent dès le lancement du système',
    icon: '⭐',
    category: 'special',
    rarity: 'legendary',
    xpReward: 500,
    requirement: 'Inscription avant 2026',
    requirementCount: 1,
    progress: 0,
    unlocked: false,
  },
  {
    id: 'all_badges',
    title: 'Collectionneur Ultime',
    description: 'Débloquez tous les autres badges',
    icon: '🎖️',
    category: 'special',
    rarity: 'legendary',
    xpReward: 2000,
    requirement: 'Tous les badges',
    requirementCount: 29,
    progress: 0,
    unlocked: false,
  },
];

// ============================================================================
// LEADERBOARD (Mock Data - 20 users)
// ============================================================================

export const LEADERBOARD: LeaderboardEntry[] = [
  {
    userId: '1',
    username: 'MaxPower',
    avatar: '👑',
    xp: 12450,
    level: 15,
    rank: 1,
    badgesUnlocked: 28,
    streak: 87,
  },
  {
    userId: '2',
    username: 'DevQueen',
    avatar: '💎',
    xp: 10230,
    level: 14,
    rank: 2,
    badgesUnlocked: 25,
    streak: 45,
  },
  {
    userId: '3',
    username: 'CodeNinja',
    avatar: '🥷',
    xp: 9100,
    level: 13,
    rank: 3,
    badgesUnlocked: 23,
    streak: 62,
  },
  {
    userId: '4',
    username: 'UXMaestro',
    avatar: '🎨',
    xp: 8450,
    level: 13,
    rank: 4,
    badgesUnlocked: 22,
    streak: 31,
  },
  {
    userId: '5',
    username: 'BugHunter',
    avatar: '🐛',
    xp: 7890,
    level: 12,
    rank: 5,
    badgesUnlocked: 21,
    streak: 28,
  },
  {
    userId: '6',
    username: 'FeatureFan',
    avatar: '⚡',
    xp: 7250,
    level: 12,
    rank: 6,
    badgesUnlocked: 19,
    streak: 15,
  },
  {
    userId: '7',
    username: 'VoteKing',
    avatar: '🗳️',
    xp: 6800,
    level: 12,
    rank: 7,
    badgesUnlocked: 18,
    streak: 42,
  },
  {
    userId: '8',
    username: 'IdeaMachine',
    avatar: '💡',
    xp: 6340,
    level: 11,
    rank: 8,
    badgesUnlocked: 17,
    streak: 9,
  },
  {
    userId: '9',
    username: 'CommunityHero',
    avatar: '🦸',
    xp: 5920,
    level: 11,
    rank: 9,
    badgesUnlocked: 16,
    streak: 51,
  },
  {
    userId: '10',
    username: 'You',
    avatar: '😎',
    xp: 5500,
    level: 10,
    rank: 10,
    badgesUnlocked: 15,
    streak: 12,
  },
  {
    userId: '11',
    username: 'TechGuru',
    avatar: '🧙',
    xp: 5100,
    level: 10,
    rank: 11,
    badgesUnlocked: 14,
    streak: 7,
  },
  {
    userId: '12',
    username: 'DesignWizard',
    avatar: '🎭',
    xp: 4750,
    level: 10,
    rank: 12,
    badgesUnlocked: 13,
    streak: 22,
  },
  {
    userId: '13',
    username: 'Contributor',
    avatar: '🌟',
    xp: 4320,
    level: 9,
    rank: 13,
    badgesUnlocked: 12,
    streak: 5,
  },
  {
    userId: '14',
    username: 'Innovator',
    avatar: '🚀',
    xp: 3980,
    level: 9,
    rank: 14,
    badgesUnlocked: 11,
    streak: 18,
  },
  {
    userId: '15',
    username: 'CreativeMinds',
    avatar: '🧠',
    xp: 3650,
    level: 9,
    rank: 15,
    badgesUnlocked: 10,
    streak: 3,
  },
  {
    userId: '16',
    username: 'ProGamer',
    avatar: '🎮',
    xp: 3200,
    level: 8,
    rank: 16,
    badgesUnlocked: 9,
    streak: 34,
  },
  {
    userId: '17',
    username: 'QualityFirst',
    avatar: '✨',
    xp: 2890,
    level: 8,
    rank: 17,
    badgesUnlocked: 8,
    streak: 11,
  },
  {
    userId: '18',
    username: 'FeedbackPro',
    avatar: '💬',
    xp: 2540,
    level: 7,
    rank: 18,
    badgesUnlocked: 7,
    streak: 6,
  },
  {
    userId: '19',
    username: 'EngagedUser',
    avatar: '👍',
    xp: 2200,
    level: 7,
    rank: 19,
    badgesUnlocked: 6,
    streak: 2,
  },
  {
    userId: '20',
    username: 'NewContrib',
    avatar: '🌱',
    xp: 1850,
    level: 6,
    rank: 20,
    badgesUnlocked: 5,
    streak: 1,
  },
];

// ============================================================================
// STREAK CALENDAR (Last 30 days)
// ============================================================================

const today = new Date();
const generateStreakCalendar = (): StreakDay[] => {
  const calendar: StreakDay[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Mock pattern: active if day is in the last 12 days
    const active = i < 12;

    calendar.push({
      date: date.toISOString().split('T')[0],
      active,
      xpEarned: active ? Math.floor(Math.random() * 50) + 10 : 0,
    });
  }

  return calendar;
};

export const STREAK_CALENDAR = generateStreakCalendar();

// ============================================================================
// ACTIVITY FEED (Recent 20 activities)
// ============================================================================

export const ACTIVITY_FEED: ActivityFeed[] = [
  {
    id: 'a1',
    userId: '1',
    username: 'MaxPower',
    avatar: '👑',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Collectionneur Ultime"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    xpGained: 2000,
    badgeId: 'all_badges',
  },
  {
    id: 'a2',
    userId: '2',
    username: 'DevQueen',
    avatar: '💎',
    type: 'level_up',
    description: 'est passé niveau 14 !',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    level: 14,
  },
  {
    id: 'a3',
    userId: '10',
    username: 'You',
    avatar: '😎',
    type: 'streak_milestone',
    description: 'a atteint 12 jours de contribution consécutifs',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    xpGained: 50,
  },
  {
    id: 'a4',
    userId: '3',
    username: 'CodeNinja',
    avatar: '🥷',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Centenaire"',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    xpGained: 1000,
    badgeId: 'streak_100',
  },
  {
    id: 'a5',
    userId: '5',
    username: 'BugHunter',
    avatar: '🐛',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Chasseur de Bugs"',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    xpGained: 200,
    badgeId: 'bug_hunter',
  },
  {
    id: 'a6',
    userId: '8',
    username: 'IdeaMachine',
    avatar: '💡',
    type: 'contribution',
    description: 'a soumis une nouvelle suggestion',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    xpGained: 50,
  },
  {
    id: 'a7',
    userId: '4',
    username: 'UXMaestro',
    avatar: '🎨',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Visionnaire"',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    xpGained: 250,
    badgeId: 'visionary',
  },
  {
    id: 'a8',
    userId: '9',
    username: 'CommunityHero',
    avatar: '🦸',
    type: 'level_up',
    description: 'est passé niveau 11 !',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    level: 11,
  },
  {
    id: 'a9',
    userId: '6',
    username: 'FeatureFan',
    avatar: '⚡',
    type: 'contribution',
    description: 'a voté pour 5 nouvelles suggestions',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    xpGained: 25,
  },
  {
    id: 'a10',
    userId: '7',
    username: 'VoteKing',
    avatar: '🗳️',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Champion du Vote"',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    xpGained: 100,
    badgeId: 'voting_champion',
  },
  {
    id: 'a11',
    userId: '11',
    username: 'TechGuru',
    avatar: '🧙',
    type: 'streak_milestone',
    description: 'a atteint 7 jours de streak',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    xpGained: 35,
  },
  {
    id: 'a12',
    userId: '12',
    username: 'DesignWizard',
    avatar: '🎭',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Semaine Parfaite"',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    xpGained: 100,
    badgeId: 'streak_7',
  },
  {
    id: 'a13',
    userId: '13',
    username: 'Contributor',
    avatar: '🌟',
    type: 'contribution',
    description: 'a laissé un commentaire détaillé',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    xpGained: 15,
  },
  {
    id: 'a14',
    userId: '14',
    username: 'Innovator',
    avatar: '🚀',
    type: 'level_up',
    description: 'est passé niveau 9 !',
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    level: 9,
  },
  {
    id: 'a15',
    userId: '15',
    username: 'CreativeMinds',
    avatar: '🧠',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Générateur d\'Idées"',
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    xpGained: 150,
    badgeId: 'idea_generator',
  },
  {
    id: 'a16',
    userId: '16',
    username: 'ProGamer',
    avatar: '🎮',
    type: 'contribution',
    description: 'a partagé une suggestion',
    timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    xpGained: 10,
  },
  {
    id: 'a17',
    userId: '17',
    username: 'QualityFirst',
    avatar: '✨',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Beta Testeur"',
    timestamp: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
    xpGained: 150,
    badgeId: 'beta_tester',
  },
  {
    id: 'a18',
    userId: '18',
    username: 'FeedbackPro',
    avatar: '💬',
    type: 'level_up',
    description: 'est passé niveau 7 !',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    level: 7,
  },
  {
    id: 'a19',
    userId: '19',
    username: 'EngagedUser',
    avatar: '👍',
    type: 'contribution',
    description: 'a voté pour une suggestion trending',
    timestamp: new Date(Date.now() - 38 * 60 * 60 * 1000).toISOString(),
    xpGained: 20,
  },
  {
    id: 'a20',
    userId: '20',
    username: 'NewContrib',
    avatar: '🌱',
    type: 'badge_unlock',
    description: 'a débloqué le badge "Early Adopter"',
    timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    xpGained: 20,
    badgeId: 'early_adopter',
  },
];

// ============================================================================
// CURRENT USER (Mock)
// ============================================================================

export const CURRENT_USER: UserStats = {
  userId: '10',
  username: 'You',
  avatar: '😎',
  xp: 5500,
  level: 10,
  rank: 10,
  badgesUnlocked: 15,
  totalBadges: 30,
  streak: 12,
  longestStreak: 28,
  contributions: {
    votes: 87,
    comments: 23,
    suggestions: 8,
  },
  joinedAt: '2025-09-01T10:00:00Z',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get level info from XP
 */
export const getLevelFromXP = (xp: number): Level => {
  let currentLevel = LEVELS[0];

  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }

  return currentLevel;
};

/**
 * Get progress to next level
 */
export const getProgressToNextLevel = (xp: number): {
  currentLevel: Level;
  nextLevel: Level | null;
  progressXP: number;
  neededXP: number;
  percentage: number;
} => {
  const currentLevel = getLevelFromXP(xp);
  const levelIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = levelIndex < LEVELS.length - 1 ? LEVELS[levelIndex + 1] : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressXP: 0,
      neededXP: 0,
      percentage: 100,
    };
  }

  const progressXP = xp - currentLevel.xpRequired;
  const neededXP = currentLevel.xpForNext;
  const percentage = Math.min(100, Math.round((progressXP / neededXP) * 100));

  return {
    currentLevel,
    nextLevel,
    progressXP,
    neededXP,
    percentage,
  };
};

/**
 * Get badges by category
 */
export const getBadgesByCategory = (category: BadgeCategory): Badge[] => {
  return BADGES.filter(badge => badge.category === category);
};

/**
 * Get badges by rarity
 */
export const getBadgesByRarity = (rarity: BadgeRarity): Badge[] => {
  return BADGES.filter(badge => badge.rarity === rarity);
};

/**
 * Get unlocked badges
 */
export const getUnlockedBadges = (): Badge[] => {
  return BADGES.filter(badge => badge.unlocked);
};

/**
 * Get locked badges
 */
export const getLockedBadges = (): Badge[] => {
  return BADGES.filter(badge => !badge.unlocked);
};

/**
 * Get badges in progress (has progress)
 */
export const getBadgesInProgress = (): Badge[] => {
  return BADGES.filter(badge => !badge.unlocked && badge.progress && badge.progress > 0);
};

/**
 * Get badge rarity color
 */
export const getBadgeRarityColor = (rarity: BadgeRarity): string => {
  switch (rarity) {
    case 'common':
      return '#9CA3AF'; // Gray
    case 'rare':
      return '#3B82F6'; // Blue
    case 'epic':
      return '#8B5CF6'; // Purple
    case 'legendary':
      return '#F59E0B'; // Gold
  }
};

/**
 * Get current streak from calendar
 */
export const getCurrentStreak = (): number => {
  let streak = 0;

  for (let i = STREAK_CALENDAR.length - 1; i >= 0; i--) {
    if (STREAK_CALENDAR[i].active) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Format time ago
 */
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'À l\'instant';
  } else if (diffHours < 24) {
    return `Il y a ${diffHours}h`;
  } else if (diffDays < 7) {
    return `Il y a ${diffDays}j`;
  } else {
    const weeks = Math.floor(diffDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
};

/**
 * Get leaderboard position change
 */
export const getPositionChange = (_userId: string): number => {
  // Mock: random change -5 to +5
  return Math.floor(Math.random() * 11) - 5;
};
