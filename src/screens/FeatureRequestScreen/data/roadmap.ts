/**
 * Roadmap Data - Timeline & Kanban
 */

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type RoadmapStatus = 'ideas' | 'planned' | 'in_development' | 'done';

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  quarter: Quarter;
  year: number;
  category: string;
  progress: number; // 0-100
  team: string[];
  estimatedCompletion?: string; // "2 weeks", "1 month"
  votes?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

export interface QuarterData {
  quarter: Quarter;
  year: number;
  label: string;
  features: RoadmapFeature[];
}

export interface KanbanColumn {
  id: RoadmapStatus;
  title: string;
  icon: string;
  color: string;
  features: RoadmapFeature[];
}

// Mock Roadmap Features
export const ROADMAP_FEATURES: RoadmapFeature[] = [
  // Q1 2026 - Done
  {
    id: 'feat_dark_mode',
    title: 'Mode Sombre',
    description: 'Thème sombre complet avec transitions fluides',
    status: 'done',
    quarter: 'Q1',
    year: 2026,
    category: 'ui',
    progress: 100,
    team: ['@Alex', '@Sophie'],
    votes: 342,
    priority: 'high',
    tags: ['#ui', '#theme', '#accessibility'],
  },
  {
    id: 'feat_offline_mode',
    title: 'Mode Hors-ligne',
    description: 'Jouer sans connexion internet',
    status: 'done',
    quarter: 'Q1',
    year: 2026,
    category: 'performance',
    progress: 100,
    team: ['@Marc', '@Julie'],
    votes: 289,
    priority: 'high',
    tags: ['#offline', '#performance'],
  },
  {
    id: 'feat_statistics',
    title: 'Statistiques Avancées',
    description: 'Graphiques et stats détaillées',
    status: 'done',
    quarter: 'Q1',
    year: 2026,
    category: 'stats',
    progress: 100,
    team: ['@Pierre'],
    votes: 234,
    priority: 'medium',
    tags: ['#stats', '#charts'],
  },

  // Q2 2026 - In Development
  {
    id: 'feat_multiplayer',
    title: 'Mode Multijoueur en Ligne',
    description: 'Jouer avec des amis en temps réel',
    status: 'in_development',
    quarter: 'Q2',
    year: 2026,
    category: 'social',
    progress: 65,
    team: ['@Alex', '@Marc', '@Lisa'],
    estimatedCompletion: '2 weeks',
    votes: 456,
    priority: 'critical',
    tags: ['#multiplayer', '#realtime', '#social'],
  },
  {
    id: 'feat_achievements',
    title: 'Système de Succès',
    description: '50 succès déblocables avec récompenses',
    status: 'in_development',
    quarter: 'Q2',
    year: 2026,
    category: 'social',
    progress: 40,
    team: ['@Sophie', '@Julie'],
    estimatedCompletion: '3 weeks',
    votes: 312,
    priority: 'medium',
    tags: ['#gamification', '#achievements'],
  },
  {
    id: 'feat_custom_rules',
    title: 'Règles Personnalisées',
    description: 'Créer vos propres variantes de jeu',
    status: 'in_development',
    quarter: 'Q2',
    year: 2026,
    category: 'gameplay',
    progress: 25,
    team: ['@Pierre'],
    estimatedCompletion: '1 month',
    votes: 278,
    priority: 'medium',
    tags: ['#gameplay', '#custom'],
  },

  // Q2 2026 - Planned
  {
    id: 'feat_tournaments',
    title: 'Tournois Hebdomadaires',
    description: 'Compétitions avec classements et récompenses',
    status: 'planned',
    quarter: 'Q2',
    year: 2026,
    category: 'social',
    progress: 0,
    team: ['@Alex'],
    estimatedCompletion: '6 weeks',
    votes: 389,
    priority: 'high',
    tags: ['#tournaments', '#competitive'],
  },
  {
    id: 'feat_voice_chat',
    title: 'Chat Vocal',
    description: 'Communication vocale pendant les parties',
    status: 'planned',
    quarter: 'Q2',
    year: 2026,
    category: 'social',
    progress: 0,
    team: ['@Marc'],
    votes: 267,
    priority: 'medium',
    tags: ['#voice', '#chat', '#social'],
  },

  // Q3 2026 - Planned
  {
    id: 'feat_ai_opponent',
    title: 'Adversaire IA',
    description: 'IA avec 5 niveaux de difficulté',
    status: 'planned',
    quarter: 'Q3',
    year: 2026,
    category: 'gameplay',
    progress: 0,
    team: ['@Pierre', '@Lisa'],
    estimatedCompletion: '2 months',
    votes: 423,
    priority: 'high',
    tags: ['#ai', '#singleplayer'],
  },
  {
    id: 'feat_themes',
    title: 'Thèmes Premium',
    description: '10 thèmes visuels exclusifs',
    status: 'planned',
    quarter: 'Q3',
    year: 2026,
    category: 'ui',
    progress: 0,
    team: ['@Sophie'],
    votes: 298,
    priority: 'low',
    tags: ['#themes', '#customization'],
  },
  {
    id: 'feat_leaderboard',
    title: 'Classement Mondial',
    description: 'Leaderboard global par pays et région',
    status: 'planned',
    quarter: 'Q3',
    year: 2026,
    category: 'social',
    progress: 0,
    team: ['@Alex', '@Marc'],
    votes: 356,
    priority: 'high',
    tags: ['#leaderboard', '#competitive'],
  },

  // Q4 2026 - Ideas
  {
    id: 'feat_replay',
    title: 'Rejeu de Parties',
    description: 'Revoir et partager vos meilleures parties',
    status: 'ideas',
    quarter: 'Q4',
    year: 2026,
    category: 'social',
    progress: 0,
    team: [],
    votes: 234,
    priority: 'low',
    tags: ['#replay', '#sharing'],
  },
  {
    id: 'feat_streaming',
    title: 'Intégration Twitch',
    description: 'Streamer vos parties directement',
    status: 'ideas',
    quarter: 'Q4',
    year: 2026,
    category: 'social',
    progress: 0,
    team: [],
    votes: 189,
    priority: 'low',
    tags: ['#streaming', '#twitch'],
  },
  {
    id: 'feat_ar_mode',
    title: 'Mode Réalité Augmentée',
    description: 'Jouer en AR sur table physique',
    status: 'ideas',
    quarter: 'Q4',
    year: 2026,
    category: 'gameplay',
    progress: 0,
    team: [],
    votes: 412,
    priority: 'low',
    tags: ['#ar', '#innovation'],
  },
];

// Get features by quarter
export const getFeaturesByQuarter = (quarter: Quarter, year: number): RoadmapFeature[] => {
  return ROADMAP_FEATURES.filter(f => f.quarter === quarter && f.year === year);
};

// Get features by status
export const getFeaturesByStatus = (status: RoadmapStatus): RoadmapFeature[] => {
  return ROADMAP_FEATURES.filter(f => f.status === status);
};

// Get features by category
export const getFeaturesByCategory = (category: string): RoadmapFeature[] => {
  return ROADMAP_FEATURES.filter(f => f.category === category);
};

// Get quarter data
export const getQuarterData = (year: number): QuarterData[] => {
  const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  return quarters.map(quarter => ({
    quarter,
    year,
    label: `${quarter} ${year}`,
    features: getFeaturesByQuarter(quarter, year),
  }));
};

// Get Kanban columns
export const getKanbanColumns = (): KanbanColumn[] => {
  return [
    {
      id: 'ideas',
      title: 'Ideas',
      icon: '💡',
      color: '#9CA3AF',
      features: getFeaturesByStatus('ideas'),
    },
    {
      id: 'planned',
      title: 'Planned',
      icon: '📋',
      color: '#3B82F6',
      features: getFeaturesByStatus('planned'),
    },
    {
      id: 'in_development',
      title: 'In Development',
      icon: '⚙️',
      color: '#F59E0B',
      features: getFeaturesByStatus('in_development'),
    },
    {
      id: 'done',
      title: 'Done',
      icon: '✅',
      color: '#10B981',
      features: getFeaturesByStatus('done'),
    },
  ];
};

// Get roadmap stats
export const getRoadmapStats = () => {
  const total = ROADMAP_FEATURES.length;
  const done = getFeaturesByStatus('done').length;
  const inDev = getFeaturesByStatus('in_development').length;
  const planned = getFeaturesByStatus('planned').length;
  const ideas = getFeaturesByStatus('ideas').length;

  const avgProgress = Math.round(
    ROADMAP_FEATURES.reduce((sum, f) => sum + f.progress, 0) / total
  );

  return {
    total,
    done,
    inDev,
    planned,
    ideas,
    avgProgress,
    completionRate: Math.round((done / total) * 100),
  };
};

// Priority colors
export const PRIORITY_COLORS = {
  low: '#9CA3AF',
  medium: '#3B82F6',
  high: '#F59E0B',
  critical: '#EF4444',
};

// Status labels
export const STATUS_LABELS: Record<RoadmapStatus, string> = {
  ideas: 'Idées',
  planned: 'Planifié',
  in_development: 'En Développement',
  done: 'Terminé',
};
