/**
 * Learning System Types - Type definitions for tutorials, practice, and learning features
 */

import { CategoryType } from './game';

// ============================================================================
// TUTORIAL TYPES
// ============================================================================

export type TutorialLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type TutorialStepType =
  | 'explanation' // Explication textuelle
  | 'demonstration' // Démonstration visuelle
  | 'practice' // Pratique guidée
  | 'quiz' // Question de validation
  | 'challenge'; // Défi à relever

export interface TutorialStep {
  id: string;
  type: TutorialStepType;
  title: string;
  content: string;
  explanation?: string; // Explication stratégique
  luckyDialogue?: string; // Ce que dit Lucky
  luckyMood?: 'happy' | 'neutral' | 'excited' | 'thinking' | 'celebrating';

  // Pour les démonstrations
  demoData?: {
    dice: number[];
    suggestedCategory?: CategoryType;
    explanation: string;
  };

  // Pour les quiz
  quizData?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };

  // Pour les challenges
  challengeData?: {
    objective: string;
    startDice: number[];
    targetCategory: CategoryType;
    minScore?: number;
    hint?: string;
  };
}

export interface TutorialLevelData {
  level: TutorialLevel;
  title: string;
  description: string;
  icon: string;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
  estimatedDuration: number; // en minutes
  steps: TutorialStep[];
  requiredLevel?: TutorialLevel; // Niveau précédent requis
  unlockMessage?: string;
}

export interface TutorialProgress {
  currentLevel: TutorialLevel;
  currentStepIndex: number;
  completedLevels: TutorialLevel[];
  completedSteps: string[]; // IDs des steps complétés
  quizScores: Record<string, number>; // stepId -> score
  startedAt: number;
  lastUpdated: number;
  totalTimeSpent: number; // en secondes
}

// ============================================================================
// PRACTICE MODE TYPES
// ============================================================================

export type PracticeCategoryType =
  | 'upper_section' // Section supérieure
  | 'brelan_carre' // Brelan et carré
  | 'full_house' // Full
  | 'straights' // Suites
  | 'yams' // Yams
  | 'chance' // Chance
  | 'decision_making' // Prise de décision
  | 'optimization'; // Optimisation du score

export interface PracticeScenario {
  id: string;
  category: PracticeCategoryType;
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile' | 'expert';

  // Configuration du scenario
  initialDice: number[];
  rollsRemaining: number;
  availableCategories: CategoryType[];
  currentScores?: Partial<Record<CategoryType, number>>; // Scores déjà remplis

  // Objectifs
  objective: string;
  targetScore?: number;
  targetCategory?: CategoryType;

  // Indices et aide
  hints: string[];
  optimalSolution?: {
    dicesToKeep: number[];
    targetCategory: CategoryType;
    expectedScore: number;
    reasoning: string;
  };
}

export interface PracticeSession {
  id: string;
  category: PracticeCategoryType;
  scenarios: PracticeScenario[];
  currentScenarioIndex: number;
  startedAt: number;
  completedScenarios: string[];
  scores: Record<string, number>; // scenarioId -> score obtenu
  hintsUsed: Record<string, number>; // scenarioId -> nombre d'indices utilisés
}

export interface PracticeProgress {
  completedSessions: string[];
  totalScenariosCompleted: number;
  averageScore: number;
  bestCategories: PracticeCategoryType[];
  weakCategories: PracticeCategoryType[];
  totalPracticeTime: number; // en secondes
  lastPracticeDate: number;
}

// ============================================================================
// STRATEGY LIBRARY TYPES
// ============================================================================

export type StrategyType =
  | 'basic' // Stratégies de base
  | 'intermediate' // Stratégies intermédiaires
  | 'advanced' // Stratégies avancées
  | 'expert'; // Stratégies d'expert

export type StrategyCategory =
  | 'general' // Stratégies générales
  | 'upper_section' // Section supérieure
  | 'lower_section' // Section inférieure
  | 'bonus' // Optimisation du bonus
  | 'endgame' // Fin de partie
  | 'risk_management'; // Gestion du risque

export interface StrategyTip {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: StrategyCategory;
  type: StrategyType;

  // Contenu
  keyPoints: string[];
  examples: {
    situation: string;
    dice: number[];
    recommendation: string;
    explanation: string;
  }[];

  // Métadonnées
  isPremium: boolean;
  videoUrl?: string; // URL de vidéo explicative
  relatedTips: string[]; // IDs d'autres tips liés

  // Stats
  views: number;
  likes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface StrategyLibrary {
  tips: StrategyTip[];
  categories: Record<StrategyCategory, {
    name: string;
    description: string;
    icon: string;
  }>;
  userProgress: {
    readTips: string[];
    likedTips: string[];
    bookmarkedTips: string[];
  };
}

// ============================================================================
// CONTEXTUAL TIPS TYPES
// ============================================================================

export type TipContext =
  | 'dice_roll' // Après un lancer de dés
  | 'category_selection' // Lors du choix d'une catégorie
  | 'reroll_decision' // Décision de relancer
  | 'bonus_tracking' // Suivi du bonus
  | 'endgame' // Fin de partie proche
  | 'mistake_prevention'; // Prévention d'erreur

export interface ContextualTip {
  id: string;
  context: TipContext;
  priority: 'low' | 'medium' | 'high' | 'critical';

  // Conditions d'affichage
  condition: {
    minTurn?: number;
    maxTurn?: number;
    dicePattern?: string; // Pattern de dés déclencheur
    scoreCondition?: string; // Condition sur le score
  };

  // Contenu
  message: string;
  explanation: string;
  suggestedAction?: string;
  luckyDialogue?: string;

  // Comportement
  showOnce?: boolean; // Ne montrer qu'une fois
  dismissible: boolean;
  autoHideAfter?: number; // Secondes avant auto-hide
}

export interface ContextualTipsSettings {
  enabled: boolean;
  frequency: 'minimal' | 'normal' | 'frequent';
  categories: Record<TipContext, boolean>; // Activer/désactiver par catégorie
  showLucky: boolean; // Afficher Lucky avec les tips
}

// ============================================================================
// REPLAY ANALYSIS TYPES
// ============================================================================

export interface TurnAnalysis {
  turnNumber: number;
  playerId: string;
  playerName: string;

  // État du tour
  diceRolled: number[];
  categoryChosen: CategoryType;
  scoreObtained: number;

  // Analyse
  wasOptimal: boolean;
  optimalChoice?: {
    category: CategoryType;
    expectedScore: number;
    reasoning: string;
  };
  alternativeChoices?: {
    category: CategoryType;
    expectedScore: number;
    pros: string[];
    cons: string[];
  }[];

  // Commentaire IA
  aiComment: string;
  aiRating: 1 | 2 | 3 | 4 | 5; // Étoiles
  tips?: string[];
}

export interface GameReplay {
  gameId: string;
  gameName: string;
  playedAt: number;
  duration: number; // en secondes

  // Joueurs
  players: {
    id: string;
    name: string;
    finalScore: number;
    rank: number;
  }[];

  // Analyse globale
  turnAnalyses: TurnAnalysis[];
  overallAnalysis: {
    strengths: string[];
    weaknesses: string[];
    keyMoments: {
      turn: number;
      description: string;
      impact: 'positive' | 'negative' | 'neutral';
    }[];
    improvementAreas: string[];
  };

  // Stats
  averageOptimalityRate: number; // % de coups optimaux
  bestTurn?: number;
  worstTurn?: number;

  // Métadonnées
  aiAnalysisGenerated: boolean;
  analysisVersion: string;
}

export interface ReplayFilters {
  dateRange?: { start: number; end: number };
  players?: string[]; // Filter by player IDs
  minScore?: number;
  maxScore?: number;
  hasAIAnalysis?: boolean;
}

// ============================================================================
// LEARNING PROGRESS TYPES
// ============================================================================

export interface LearningStats {
  // Tutoriels
  tutorialProgress: TutorialProgress;

  // Pratique
  practiceProgress: PracticeProgress;

  // Stratégies
  strategiesRead: number;
  strategiesLiked: number;

  // Replays
  gamesAnalyzed: number;
  averageOptimality: number;

  // Global
  totalLearningTime: number; // en secondes
  currentLevel: number; // Niveau global du joueur (1-100)
  achievements: string[]; // IDs des achievements débloqués
  lastActivity: number;
}

export interface LearningAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;

  // Conditions
  requirement: {
    type: 'tutorial' | 'practice' | 'replay' | 'strategy' | 'mixed';
    value: number;
    description: string;
  };

  // Récompenses
  reward?: {
    type: 'badge' | 'avatar' | 'theme' | 'feature';
    value: string;
  };
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

export interface LearningPreferences {
  // Tutoriels
  skipIntroductions: boolean;
  autoAdvanceTutorial: boolean;

  // Tips contextuels
  contextualTips: ContextualTipsSettings;

  // Lucky mascotte
  luckyEnabled: boolean;
  luckyVoice: boolean;
  luckyAnimations: boolean;

  // Replays
  autoAnalyzeGames: boolean;
  detailedAnalysis: boolean;

  // Notifications
  dailyTipNotification: boolean;
  practiceReminder: boolean;
  reminderTime?: string; // HH:MM format
}
