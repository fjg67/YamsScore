/**
 * Données pour les suggestions de fonctionnalités
 * Structure complète des suggestions, catégories, et utilisateurs
 */

export interface User {
  id: string;
  name: string;
  emoji: string;
  badge: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legend';
  level: number;
  points: number;
  totalSuggestions: number;
  implementedSuggestions: number;
}

export interface Suggestion {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  author: User;
  votes: number;
  status: 'new' | 'studying' | 'planned' | 'dev' | 'done' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  popular?: boolean;
  featured?: boolean;
  hasOfficialResponse?: boolean;
  officialResponse?: {
    message: string;
    date: Date;
    planning?: string;
  };
  mockupUrl?: string;
  commentCount: number;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  count: number;
  gradient: [string, string];
  popular?: boolean;
}

// Catégories de suggestions
export const categories: Category[] = [
  {
    id: 'ui',
    title: 'UI/UX',
    icon: '🎨',
    count: 45,
    gradient: ['#FF6B9D', '#C44569'],
    popular: true,
  },
  {
    id: 'game',
    title: 'Gameplay',
    icon: '🎮',
    count: 67,
    gradient: ['#4A90E2', '#2E5C8A'],
    popular: true,
  },
  {
    id: 'social',
    title: 'Social',
    icon: '👥',
    count: 23,
    gradient: ['#50C878', '#3FA065'],
  },
  {
    id: 'perf',
    title: 'Performance',
    icon: '⚡',
    count: 12,
    gradient: ['#F39C12', '#D68910'],
  },
  {
    id: 'stats',
    title: 'Statistiques',
    icon: '📊',
    count: 34,
    gradient: ['#9B59B6', '#7D3C98'],
  },
  {
    id: 'other',
    title: 'Autre',
    icon: '🌟',
    count: 18,
    gradient: ['#95A5A6', '#7F8C8D'],
  },
];

// Utilisateurs mock
const mockUsers: User[] = [
  {
    id: '1',
    name: 'DesignGuru',
    emoji: '🎨',
    badge: 'gold',
    level: 7,
    points: 847,
    totalSuggestions: 12,
    implementedSuggestions: 3,
  },
  {
    id: '2',
    name: 'GamerPro',
    emoji: '🎮',
    badge: 'silver',
    level: 5,
    points: 423,
    totalSuggestions: 8,
    implementedSuggestions: 1,
  },
  {
    id: '3',
    name: 'TechNinja',
    emoji: '⚡',
    badge: 'platinum',
    level: 12,
    points: 2340,
    totalSuggestions: 25,
    implementedSuggestions: 8,
  },
];

// Suggestions mock
export const suggestions: Suggestion[] = [
  {
    id: '1',
    categoryId: 'ui',
    title: 'Thème Néon Cyberpunk',
    description: 'Un thème futuriste avec des néons, des animations fluides et une ambiance cyberpunk. Couleurs vives, effets de glow et transitions spectaculaires.',
    author: mockUsers[0],
    votes: 289,
    status: 'studying',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-18'),
    tags: ['thème', 'design', 'cyberpunk'],
    popular: true,
    featured: true,
    hasOfficialResponse: true,
    officialResponse: {
      message: 'Nous adorons cette idée ! Elle s\'aligne parfaitement avec notre vision. En cours d\'étude approfondie.',
      date: new Date('2025-01-16'),
      planning: 'Q2 2026',
    },
    commentCount: 42,
  },
  {
    id: '2',
    categoryId: 'game',
    title: 'Mode Dés Physiques AR',
    description: 'Scanner des dés physiques avec la caméra et utiliser la réalité augmentée pour les afficher en 3D sur la feuille de score.',
    author: mockUsers[1],
    votes: 347,
    status: 'dev',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-20'),
    tags: ['AR', 'innovation', 'dés'],
    popular: true,
    featured: true,
    hasOfficialResponse: true,
    officialResponse: {
      message: 'En développement ! La physique des dés est presque terminée. Les dés roulent de manière ultra réaliste 🎲',
      date: new Date('2025-01-19'),
      planning: 'Mars 2026',
    },
    commentCount: 67,
  },
  {
    id: '3',
    categoryId: 'social',
    title: 'Multijoueur en Ligne',
    description: 'Jouer avec des amis à distance en temps réel, avec chat intégré et partage d\'écran.',
    author: mockUsers[2],
    votes: 512,
    status: 'planned',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-15'),
    tags: ['multijoueur', 'online', 'social'],
    popular: true,
    featured: true,
    hasOfficialResponse: true,
    officialResponse: {
      message: 'Planifié pour 2026 ! C\'est une des features les plus demandées.',
      date: new Date('2025-01-10'),
      planning: 'Q3 2026',
    },
    commentCount: 123,
  },
  {
    id: '4',
    categoryId: 'ui',
    title: 'Couleurs Personnalisables',
    description: 'Permettre de personnaliser individuellement chaque élément de l\'interface avec un color picker premium.',
    author: mockUsers[0],
    votes: 156,
    status: 'new',
    createdAt: new Date('2025-01-19'),
    updatedAt: new Date('2025-01-19'),
    tags: ['couleurs', 'personnalisation'],
    commentCount: 28,
  },
  {
    id: '5',
    categoryId: 'stats',
    title: 'Graphiques Avancés',
    description: 'Statistiques détaillées avec graphiques interactifs, tendances, et analyses prédictives IA.',
    author: mockUsers[2],
    votes: 203,
    status: 'studying',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-17'),
    tags: ['stats', 'graphiques', 'IA'],
    commentCount: 34,
  },
  {
    id: '6',
    categoryId: 'game',
    title: 'Mode Tournoi',
    description: 'Système de tournoi avec brackets, classements en direct et récompenses.',
    author: mockUsers[1],
    votes: 178,
    status: 'planned',
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-14'),
    tags: ['tournoi', 'compétition'],
    hasOfficialResponse: true,
    officialResponse: {
      message: 'Planifié ! Nous travaillons sur le système de brackets.',
      date: new Date('2025-01-12'),
      planning: 'Q4 2026',
    },
    commentCount: 45,
  },
];

// Suggestions tendances (Top 3)
export const getTrendingSuggestions = (): Suggestion[] => {
  return suggestions
    .filter(s => s.status !== 'done' && s.status !== 'archived')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);
};

// Suggestions par catégorie
export const getSuggestionsByCategory = (categoryId: string): Suggestion[] => {
  return suggestions.filter(s => s.categoryId === categoryId);
};

// Suggestion par ID
export const getSuggestionById = (id: string): Suggestion | undefined => {
  return suggestions.find(s => s.id === id);
};

// Status labels
export const statusLabels: Record<Suggestion['status'], { label: string; emoji: string; color: string }> = {
  new: { label: 'Nouveau', emoji: '🔵', color: '#3B82F6' },
  studying: { label: 'En étude', emoji: '🟡', color: '#F59E0B' },
  planned: { label: 'Planifié', emoji: '🟢', color: '#10B981' },
  dev: { label: 'En développement', emoji: '🔧', color: '#06B6D4' },
  done: { label: 'Implémenté', emoji: '✅', color: '#22C55E' },
  archived: { label: 'Archivé', emoji: '❌', color: '#6B7280' },
};

// Badge labels
export const badgeLabels: Record<User['badge'], { label: string; emoji: string; gradient: [string, string] }> = {
  bronze: {
    label: 'Bronze',
    emoji: '🥉',
    gradient: ['#CD7F32', '#B87333'],
  },
  silver: {
    label: 'Silver',
    emoji: '🥈',
    gradient: ['#C0C0C0', '#E8E8E8'],
  },
  gold: {
    label: 'Gold',
    emoji: '🥇',
    gradient: ['#FFD700', '#FFA500'],
  },
  platinum: {
    label: 'Platinum',
    emoji: '💎',
    gradient: ['#E5E4E2', '#B9F2FF'],
  },
  legend: {
    label: 'Legend',
    emoji: '👑',
    gradient: ['#9B59B6', '#E74C3C'],
  },
};

// Stats globales
export interface CommunityStats {
  totalSuggestions: number;
  totalImplemented: number;
  totalUsers: number;
  averageTimeToImplement: string;
}

export const getCommunityStats = (): CommunityStats => {
  return {
    totalSuggestions: suggestions.length,
    totalImplemented: suggestions.filter(s => s.status === 'done').length,
    totalUsers: 847,
    averageTimeToImplement: '3.2 mois',
  };
};
