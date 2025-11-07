/**
 * Practice Service - Gère le mode pratique avec exercices ciblés
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PracticeCategoryType,
  PracticeScenario,
  PracticeSession,
  PracticeProgress,
} from '../src/types/learning';

const PRACTICE_PROGRESS_KEY = '@yams_practice_progress';
const PRACTICE_SESSION_KEY = '@yams_practice_session';

// ============================================================================
// PRACTICE SCENARIOS DATA
// ============================================================================

export const PRACTICE_SCENARIOS: Record<PracticeCategoryType, PracticeScenario[]> = {
  upper_section: [
    {
      id: 'upper_1',
      category: 'upper_section',
      title: 'Maximiser les As',
      description: 'Apprenez à obtenir le maximum de points avec les As',
      difficulty: 'facile',
      initialDice: [1, 1, 3, 4, 6],
      rollsRemaining: 2,
      availableCategories: ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'],
      objective: 'Obtenir au moins 4 As (4 points)',
      targetCategory: 'ones',
      targetScore: 4,
      hints: [
        'Gardez les deux As et relancez les autres dés',
        'Vous avez 2 lancers pour obtenir plus d\'As',
        'Chaque As supplémentaire = +1 point',
      ],
      optimalSolution: {
        dicesToKeep: [1, 1],
        targetCategory: 'ones',
        expectedScore: 3,
        reasoning: 'Garder les As et relancer augmente vos chances d\'en obtenir plus',
      },
    },
    {
      id: 'upper_2',
      category: 'upper_section',
      title: 'Viser le bonus',
      description: 'Stratégie pour atteindre les 63 points du bonus',
      difficulty: 'moyen',
      initialDice: [5, 5, 5, 2, 3],
      rollsRemaining: 1,
      availableCategories: ['fives'],
      currentScores: {
        ones: 3,
        twos: 6,
        threes: 9,
        fours: 12,
        sixes: 18,
      },
      objective: 'Vous êtes à 48/63. Maximisez vos 5 pour le bonus !',
      targetScore: 15,
      hints: [
        'Vous avez déjà trois 5 (15 points)',
        'Avec 48 + 15 = 63, vous obtenez exactement le bonus !',
        'C\'est pile le score nécessaire !',
      ],
      optimalSolution: {
        dicesToKeep: [5, 5, 5],
        targetCategory: 'fives',
        expectedScore: 15,
        reasoning: 'Ces 15 points vous donnent exactement le bonus de 35 points',
      },
    },
    {
      id: 'upper_3',
      category: 'upper_section',
      title: 'Choix difficile',
      description: 'Section supérieure vs combinaison spéciale',
      difficulty: 'difficile',
      initialDice: [6, 6, 6, 1, 2],
      rollsRemaining: 0,
      availableCategories: ['sixes', 'threeOfKind'],
      currentScores: {
        ones: 3,
        twos: 6,
        threes: 9,
        fours: 12,
        fives: 15,
      },
      objective: 'Section sup (18 pts) ou Brelan (21 pts) ? Pensez au bonus !',
      hints: [
        'Vous êtes à 45/63 pour le bonus',
        'Il vous faut encore 18 points',
        'Les 6 vous donnent exactement 18 points !',
      ],
      optimalSolution: {
        dicesToKeep: [6, 6, 6],
        targetCategory: 'sixes',
        expectedScore: 18,
        reasoning: 'Les 18 points vous donnent le bonus (35 pts), mieux que 21 pts du Brelan',
      },
    },
  ],

  brelan_carre: [
    {
      id: 'brelan_1',
      category: 'brelan_carre',
      title: 'Reconnaître un Brelan',
      description: 'Identifiez et jouez un Brelan correctement',
      difficulty: 'facile',
      initialDice: [4, 4, 4, 6, 6],
      rollsRemaining: 0,
      availableCategories: ['threeOfKind', 'fourOfKind', 'fullHouse'],
      objective: 'Vous avez un Brelan ET un Full ! Lequel choisir ?',
      hints: [
        'Brelan = 4+4+4+6+6 = 24 points',
        'Full = 25 points fixes',
        'Le Full est plus rare et difficile',
      ],
      optimalSolution: {
        dicesToKeep: [4, 4, 4, 6, 6],
        targetCategory: 'fullHouse',
        expectedScore: 25,
        reasoning: 'Le Full (25) est plus avantageux ET plus rare que le Brelan (24)',
      },
    },
    {
      id: 'brelan_2',
      category: 'brelan_carre',
      title: 'Viser le Carré',
      description: 'Transformez un Brelan en Carré',
      difficulty: 'moyen',
      initialDice: [6, 6, 6, 2, 3],
      rollsRemaining: 2,
      availableCategories: ['threeOfKind', 'fourOfKind'],
      objective: 'Tentez d\'obtenir un Carré de 6',
      targetCategory: 'fourOfKind',
      targetScore: 25,
      hints: [
        'Vous avez un Brelan de 6',
        'Gardez les trois 6 et relancez le reste',
        'Vous avez 2 chances (2 lancers)',
      ],
      optimalSolution: {
        dicesToKeep: [6, 6, 6],
        targetCategory: 'fourOfKind',
        expectedScore: 26,
        reasoning: 'Avec 2 lancers, vous avez ~31% de chances d\'obtenir le 4e dé',
      },
    },
    {
      id: 'brelan_3',
      category: 'brelan_carre',
      title: 'Risque vs Sécurité',
      description: 'Dernier lancer : sécuriser ou prendre un risque ?',
      difficulty: 'expert',
      initialDice: [5, 5, 5, 6, 6],
      rollsRemaining: 1,
      availableCategories: ['threeOfKind', 'fourOfKind', 'fullHouse', 'yams'],
      objective: 'Tour 12/13 : quelle est la meilleure stratégie ?',
      hints: [
        'Full = 25 points garantis',
        'Relancer pour Carré = risqué (perte du Full)',
        'Fin de partie = privilégier la sécurité',
      ],
      optimalSolution: {
        dicesToKeep: [5, 5, 5, 6, 6],
        targetCategory: 'fullHouse',
        expectedScore: 25,
        reasoning: 'Fin de partie : sécurisez le Full. Ne risquez pas de tout perdre',
      },
    },
  ],

  full_house: [
    {
      id: 'full_1',
      category: 'full_house',
      title: 'Comprendre le Full',
      description: 'Reconnaissez un Full valide',
      difficulty: 'facile',
      initialDice: [2, 2, 2, 5, 5],
      rollsRemaining: 0,
      availableCategories: ['fullHouse', 'threeOfKind'],
      objective: 'Avez-vous un Full ?',
      hints: [
        'Full = Brelan (3 identiques) + Paire (2 identiques)',
        'Vous avez 2-2-2 (Brelan) et 5-5 (Paire)',
        'C\'est un Full parfait !',
      ],
      optimalSolution: {
        dicesToKeep: [2, 2, 2, 5, 5],
        targetCategory: 'fullHouse',
        expectedScore: 25,
        reasoning: 'Brelan + Paire = Full = 25 points',
      },
    },
    {
      id: 'full_2',
      category: 'full_house',
      title: 'Construire un Full',
      description: 'Transformez deux paires en Full',
      difficulty: 'moyen',
      initialDice: [3, 3, 4, 4, 6],
      rollsRemaining: 2,
      availableCategories: ['fullHouse'],
      objective: 'Vous avez deux paires. Obtenez un Full !',
      targetCategory: 'fullHouse',
      targetScore: 25,
      hints: [
        'Choisissez une paire à transformer en Brelan',
        'Les 4 sont mieux que les 3 (plus de points si raté)',
        'Gardez 4-4 et relancez pour un 3e dé de 4',
      ],
      optimalSolution: {
        dicesToKeep: [4, 4],
        targetCategory: 'fullHouse',
        expectedScore: 25,
        reasoning: 'Garder la paire la plus élevée maximise les chances',
      },
    },
  ],

  straights: [
    {
      id: 'straight_1',
      category: 'straights',
      title: 'Petite Suite facile',
      description: 'Complétez une Petite Suite',
      difficulty: 'facile',
      initialDice: [1, 2, 3, 4, 6],
      rollsRemaining: 1,
      availableCategories: ['smallStraight', 'largeStraight'],
      objective: 'Vous avez presque une Grande Suite !',
      hints: [
        'Il vous manque juste le 5',
        'Vous avez déjà 1-2-3-4',
        'Relancez le 6 pour tenter le 5',
      ],
      optimalSolution: {
        dicesToKeep: [1, 2, 3, 4],
        targetCategory: 'largeStraight',
        expectedScore: 40,
        reasoning: 'Avec 1 lancer, vous avez 1/6 chance. Si raté, Petite Suite garantie',
      },
    },
    {
      id: 'straight_2',
      category: 'straights',
      title: 'Grande Suite parfaite',
      description: 'Identifiez une Grande Suite',
      difficulty: 'facile',
      initialDice: [2, 3, 4, 5, 6],
      rollsRemaining: 0,
      availableCategories: ['smallStraight', 'largeStraight'],
      objective: 'Quelle catégorie jouer ?',
      hints: [
        'Vous avez 2-3-4-5-6 : suite complète !',
        'Grande Suite = 40 points',
        'Ne la gaspillez pas en Petite Suite !',
      ],
      optimalSolution: {
        dicesToKeep: [2, 3, 4, 5, 6],
        targetCategory: 'largeStraight',
        expectedScore: 40,
        reasoning: 'C\'est une Grande Suite parfaite = 40 points',
      },
    },
  ],

  yams: [
    {
      id: 'yams_1',
      category: 'yams',
      title: 'Opportunité Yams',
      description: 'Quand tenter un Yams ?',
      difficulty: 'moyen',
      initialDice: [5, 5, 5, 5, 2],
      rollsRemaining: 2,
      availableCategories: ['fourOfKind', 'yams'],
      objective: 'Carré garanti ou tentative Yams ?',
      hints: [
        'Vous avez déjà un Carré',
        'Avec 2 lancers, ~31% de chance de Yams',
        'Carré = ~22 pts sûrs, Yams = 50 pts',
      ],
      optimalSolution: {
        dicesToKeep: [5, 5, 5, 5],
        targetCategory: 'yams',
        expectedScore: 50,
        reasoning: 'Début de partie avec 2 lancers : tentez le Yams !',
      },
    },
  ],

  chance: [
    {
      id: 'chance_1',
      category: 'chance',
      title: 'Maximiser Chance',
      description: 'Obtenez le meilleur score en Chance',
      difficulty: 'moyen',
      initialDice: [6, 5, 4, 3, 2],
      rollsRemaining: 2,
      availableCategories: ['chance'],
      objective: 'Marquez au moins 28 points',
      targetScore: 28,
      hints: [
        'Total actuel : 6+5+4+3+2 = 20',
        'Gardez les gros dés (6, 5)',
        'Relancez les petits pour augmenter',
      ],
      optimalSolution: {
        dicesToKeep: [6, 5],
        targetCategory: 'chance',
        expectedScore: 25,
        reasoning: 'Garder les dés élevés et relancer les bas maximise l\'espérance',
      },
    },
  ],

  decision_making: [
    {
      id: 'decision_1',
      category: 'decision_making',
      title: 'Choix stratégique',
      description: 'Plusieurs options : laquelle choisir ?',
      difficulty: 'difficile',
      initialDice: [1, 2, 3, 4, 5],
      rollsRemaining: 0,
      availableCategories: ['largeStraight', 'chance'],
      currentScores: {},
      objective: 'Grande Suite ou Chance ?',
      hints: [
        'Grande Suite = 40 points',
        'Chance = 1+2+3+4+5 = 15 points',
        'La Grande Suite est rare !',
      ],
      optimalSolution: {
        dicesToKeep: [1, 2, 3, 4, 5],
        targetCategory: 'largeStraight',
        expectedScore: 40,
        reasoning: 'Toujours jouer les combinaisons rares quand disponibles',
      },
    },
  ],

  optimization: [
    {
      id: 'optim_1',
      category: 'optimization',
      title: 'Optimisation finale',
      description: 'Derniers tours : optimisez chaque point',
      difficulty: 'expert',
      initialDice: [6, 6, 5, 4, 3],
      rollsRemaining: 0,
      availableCategories: ['sixes', 'chance'],
      currentScores: {
        ones: 3,
        twos: 6,
        threes: 9,
        fours: 12,
        fives: 15,
      },
      objective: 'Tour 12/13 : maximisez votre score !',
      hints: [
        'Sixes = 12 points (pour bonus : 45+12=57, manque 6)',
        'Chance = 24 points',
        'Le bonus est hors d\'atteinte',
      ],
      optimalSolution: {
        dicesToKeep: [6, 6, 5, 4, 3],
        targetCategory: 'chance',
        expectedScore: 24,
        reasoning: 'Bonus impossible : Chance (24) > Sixes (12)',
      },
    },
  ],
};

// ============================================================================
// PRACTICE SERVICE
// ============================================================================

export class PracticeService {
  /**
   * Obtenir la progression du mode pratique
   */
  static async getProgress(): Promise<PracticeProgress | null> {
    try {
      const data = await AsyncStorage.getItem(PRACTICE_PROGRESS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading practice progress:', error);
      return null;
    }
  }

  /**
   * Initialiser une nouvelle progression
   */
  static async initializeProgress(): Promise<PracticeProgress> {
    const progress: PracticeProgress = {
      completedSessions: [],
      totalScenariosCompleted: 0,
      averageScore: 0,
      bestCategories: [],
      weakCategories: [],
      totalPracticeTime: 0,
      lastPracticeDate: Date.now(),
    };

    await this.saveProgress(progress);
    return progress;
  }

  /**
   * Sauvegarder la progression
   */
  static async saveProgress(progress: PracticeProgress): Promise<void> {
    try {
      progress.lastPracticeDate = Date.now();
      await AsyncStorage.setItem(PRACTICE_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving practice progress:', error);
    }
  }

  /**
   * Créer une nouvelle session de pratique
   */
  static async createSession(category: PracticeCategoryType): Promise<PracticeSession> {
    const scenarios = PRACTICE_SCENARIOS[category] || [];

    const session: PracticeSession = {
      id: `session_${Date.now()}`,
      category,
      scenarios,
      currentScenarioIndex: 0,
      startedAt: Date.now(),
      completedScenarios: [],
      scores: {},
      hintsUsed: {},
    };

    await AsyncStorage.setItem(PRACTICE_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  /**
   * Obtenir la session en cours
   */
  static async getCurrentSession(): Promise<PracticeSession | null> {
    try {
      const data = await AsyncStorage.getItem(PRACTICE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading practice session:', error);
      return null;
    }
  }

  /**
   * Sauvegarder la session
   */
  static async saveSession(session: PracticeSession): Promise<void> {
    try {
      await AsyncStorage.setItem(PRACTICE_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving practice session:', error);
    }
  }

  /**
   * Compléter un scénario
   */
  static async completeScenario(
    session: PracticeSession,
    scenarioId: string,
    score: number,
    hintsUsed: number
  ): Promise<PracticeSession> {
    if (!session.completedScenarios.includes(scenarioId)) {
      session.completedScenarios.push(scenarioId);
    }

    session.scores[scenarioId] = score;
    session.hintsUsed[scenarioId] = hintsUsed;

    await this.saveSession(session);
    return session;
  }

  /**
   * Passer au scénario suivant
   */
  static async nextScenario(session: PracticeSession): Promise<PracticeSession> {
    if (session.currentScenarioIndex < session.scenarios.length - 1) {
      session.currentScenarioIndex++;
      await this.saveSession(session);
    }
    return session;
  }

  /**
   * Terminer la session et mettre à jour la progression
   */
  static async completeSession(session: PracticeSession): Promise<void> {
    let progress = await this.getProgress();
    if (!progress) {
      progress = await this.initializeProgress();
    }

    // Ajouter la session aux complétées
    if (!progress.completedSessions.includes(session.id)) {
      progress.completedSessions.push(session.id);
    }

    // Mettre à jour les stats
    progress.totalScenariosCompleted += session.completedScenarios.length;

    // Calculer le score moyen
    const scores = Object.values(session.scores);
    const sessionAverage = scores.reduce((a, b) => a + b, 0) / scores.length;
    progress.averageScore =
      (progress.averageScore + sessionAverage) / 2;

    await this.saveProgress(progress);
    await AsyncStorage.removeItem(PRACTICE_SESSION_KEY);
  }

  /**
   * Obtenir les scénarios par catégorie
   */
  static getScenariosByCategory(category: PracticeCategoryType): PracticeScenario[] {
    return PRACTICE_SCENARIOS[category] || [];
  }

  /**
   * Obtenir toutes les catégories
   */
  static getAllCategories(): PracticeCategoryType[] {
    return Object.keys(PRACTICE_SCENARIOS) as PracticeCategoryType[];
  }

  /**
   * Obtenir les informations d'une catégorie
   */
  static getCategoryInfo(category: PracticeCategoryType): {
    name: string;
    description: string;
    icon: string;
  } {
    const categoryInfo: Record<
      PracticeCategoryType,
      { name: string; description: string; icon: string }
    > = {
      upper_section: {
        name: 'Section Supérieure',
        description: 'Maîtrisez les catégories 1-6 et le bonus',
        icon: '🔢',
      },
      brelan_carre: {
        name: 'Brelan & Carré',
        description: 'Optimisez vos Brelans et Carrés',
        icon: '🎲',
      },
      full_house: {
        name: 'Full House',
        description: 'Apprenez à construire et jouer les Fulls',
        icon: '🏠',
      },
      straights: {
        name: 'Suites',
        description: 'Petites et Grandes Suites',
        icon: '⚀⚁⚂⚃⚄',
      },
      yams: {
        name: 'Yams',
        description: 'Le coup parfait : 5 dés identiques',
        icon: '🎯',
      },
      chance: {
        name: 'Chance',
        description: 'Maximisez votre catégorie Chance',
        icon: '🍀',
      },
      decision_making: {
        name: 'Prise de décision',
        description: 'Choix stratégiques complexes',
        icon: '🧠',
      },
      optimization: {
        name: 'Optimisation',
        description: 'Maximisez chaque point',
        icon: '📊',
      },
    };

    return categoryInfo[category];
  }
}
