/**
 * Strategy Library Service - Bibliothèque de stratégies et astuces
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StrategyTip,
  StrategyType,
  StrategyCategory,
  StrategyLibrary,
} from '../src/types/learning';

const STRATEGY_LIBRARY_KEY = '@yams_strategy_library';

// ============================================================================
// STRATEGY TIPS DATA
// ============================================================================

export const STRATEGY_TIPS: StrategyTip[] = [
  // STRATÉGIES DE BASE
  {
    id: 'basic_1',
    title: 'Le Bonus de 35 Points',
    shortDescription: 'Votre objectif prioritaire en début de partie',
    fullDescription:
      'Le bonus de la section supérieure (35 points) est crucial pour gagner. Il faut obtenir au moins 63 points dans les catégories 1-6. Cela représente en moyenne 3 dés de chaque valeur.',
    category: 'bonus',
    type: 'basic',
    keyPoints: [
      'Visez 63 points ou plus dans la section supérieure',
      'En moyenne : 3 dés de chaque valeur (3×1 + 3×2 + ... + 3×6 = 63)',
      'Le bonus représente presque un tour gratuit',
      'Priorisez-le en milieu de partie (tours 5-10)',
    ],
    examples: [
      {
        situation: 'Tour 8/13 : Section sup à 48/63',
        dice: [5, 5, 5, 2, 3],
        recommendation: 'Jouez les "5" (15 pts) pour atteindre 63',
        explanation:
          'Même si le Brelan (23 pts) rapporte plus, le bonus (35 pts) vaut mieux que 15 pts supplémentaires',
      },
    ],
    isPremium: false,
    views: 0,
    likes: 0,
    difficulty: 1,
  },
  {
    id: 'basic_2',
    title: 'L\'Ordre des Catégories',
    shortDescription: 'Jouez d abord les catégories difficiles',
    fullDescription:
      'Les combinaisons rares (suites, Yams, Full) doivent être jouées dès qu\'elles apparaissent. Les catégories simples (section supérieure) peuvent attendre.',
    category: 'general',
    type: 'basic',
    keyPoints: [
      'Suites et Yams : jouez-les immédiatement',
      'Section supérieure : flexible, peut attendre',
      'Full et Carré : modérément rares',
      'Ne gaspillez pas une Grande Suite en Chance !',
    ],
    examples: [
      {
        situation: 'Vous avez 1-2-3-4-5',
        dice: [1, 2, 3, 4, 5],
        recommendation: 'Grande Suite (40 pts)',
        explanation: 'C\'est rare ! Ne la jouez JAMAIS en Chance ou section supérieure',
      },
    ],
    isPremium: false,
    views: 0,
    likes: 0,
    difficulty: 1,
  },

  // STRATÉGIES INTERMÉDIAIRES
  {
    id: 'inter_1',
    title: 'Gestion des Relances',
    shortDescription: 'Quand garder et quand relancer',
    fullDescription:
      'La décision de relancer est critique. Évaluez vos chances d\'amélioration vs le risque de perdre ce que vous avez.',
    category: 'general',
    type: 'intermediate',
    keyPoints: [
      'Avec 2-3 dés identiques au 1er lancer : visez Brelan/Carré',
      'Avec une paire au 3e lancer : jouez en section supérieure',
      'Suite partielle (3-4 consécutifs) : tentez la suite',
      'Dernier lancer : évaluez le score actuel vs espérance',
    ],
    examples: [
      {
        situation: '1er lancer : 4-4-2-3-5, 2 relances restantes',
        dice: [4, 4, 2, 3, 5],
        recommendation: 'Gardez 4-4 et relancez le reste',
        explanation: 'Chances d\'obtenir un 3e dé "4" : ~39% sur 2 lancers',
      },
    ],
    isPremium: false,
    views: 0,
    likes: 0,
    difficulty: 2,
  },
  {
    id: 'inter_2',
    title: 'Sacrifier une Case',
    shortDescription: 'Quand et comment barrer stratégiquement',
    fullDescription:
      'Parfois, il faut accepter de marquer 0 dans une catégorie pour protéger les cases importantes.',
    category: 'risk_management',
    type: 'intermediate',
    keyPoints: [
      'En cas de mauvais lancer, sacrifiez une petite catégorie',
      'Barrez de préférence : As (1) ou Deux (2)',
      'Ne sacrifiez JAMAIS : Yams, Suites, Chance',
      'Pensez au bonus avant de barrer la section supérieure',
    ],
    examples: [
      {
        situation: 'Mauvais lancer : 1-2-2-3-4, aucune combo',
        dice: [1, 2, 2, 3, 4],
        recommendation: 'Barrez les "As" (1)',
        explanation: 'Au pire, vous perdez 5 points max. Mieux que gaspiller Chance ou Yams',
      },
    ],
    isPremium: false,
    views: 0,
    likes: 0,
    difficulty: 3,
  },

  // STRATÉGIES AVANCÉES
  {
    id: 'adv_1',
    title: 'Calcul d\'Espérance',
    shortDescription: 'Probabilités et décisions mathématiques',
    fullDescription:
      'Les meilleurs joueurs calculent mentalement les probabilités pour prendre les meilleures décisions.',
    category: 'general',
    type: 'advanced',
    keyPoints: [
      '1 dé : 1/6 chance (16.7%) d\'obtenir une valeur',
      '2 lancers : ~31% de chances',
      '3 lancers : ~42% de chances',
      'Carré → Yams : ~17% sur 1 lancer, ~31% sur 2',
    ],
    examples: [
      {
        situation: '3 dés identiques, 2 relances, viser Carré ou Yams ?',
        dice: [6, 6, 6, 2, 3],
        recommendation: 'Visez le Carré (Yams = bonus si obtenu)',
        explanation: '~51% de Carré sur 2 lancers, seulement ~31% de Yams. Soyez réaliste !',
      },
    ],
    isPremium: true,
    views: 0,
    likes: 0,
    difficulty: 4,
  },
  {
    id: 'adv_2',
    title: 'Optimisation de Fin de Partie',
    shortDescription: 'Les 3 derniers tours : maximisez chaque point',
    fullDescription:
      'Les derniers tours requièrent une analyse précise. Calculez toutes les options et choisissez celle qui maximise votre score final.',
    category: 'endgame',
    type: 'advanced',
    keyPoints: [
      'Listez les catégories restantes',
      'Calculez le score maximum possible pour chacune',
      'Si bonus hors d\'atteinte, maximisez les autres catégories',
      'Chance = bonne option en dernier recours',
    ],
    examples: [
      {
        situation: 'Tour 12/13 : reste Brelan et Chance',
        dice: [4, 4, 3, 2, 1],
        recommendation: 'Jouez en Chance (14 pts), gardez Brelan pour le prochain',
        explanation: 'Maximisez les chances d\'un bon Brelan au prochain tour',
      },
    ],
    isPremium: true,
    views: 0,
    likes: 0,
    difficulty: 5,
  },

  // STRATÉGIES EXPERT
  {
    id: 'expert_1',
    title: 'Analyse Multifactorielle',
    shortDescription: 'Considérez tous les facteurs simultanément',
    fullDescription:
      'Les experts analysent : score actuel, bonus, catégories restantes, position dans la partie, adversaires (en multi), probabilités...',
    category: 'general',
    type: 'expert',
    keyPoints: [
      'Évaluez le contexte complet avant chaque décision',
      'Anticipez 2-3 tours à l\'avance',
      'Adaptez votre stratégie selon votre position',
      'En multi : bloquez les adversaires',
    ],
    examples: [
      {
        situation:
          'Tour 10/13, section sup 58/63, reste 6 et Chance, adversaire à +20 pts',
        dice: [6, 6, 5, 4, 3],
        recommendation: 'Jouez les 6 (12 pts) pour le bonus',
        explanation:
          'Bonus = 35 pts, vous comblez le retard. Analysez contexte global, pas juste ce tour',
      },
    ],
    isPremium: true,
    views: 0,
    likes: 0,
    difficulty: 5,
  },

  // STRATÉGIES PAR CATÉGORIE
  {
    id: 'upper_1',
    title: 'Maximiser la Section Supérieure',
    shortDescription: 'Techniques pour optimiser les catégories 1-6',
    fullDescription:
      'La section supérieure offre de la flexibilité. Utilisez-la stratégiquement.',
    category: 'upper_section',
    type: 'intermediate',
    keyPoints: [
      'Visez 4-5 dés pour les valeurs élevées (5, 6)',
      '3 dés suffisent pour les petites valeurs (1, 2)',
      'En milieu de partie, priorisez le bonus',
      'Si bonus hors d\'atteinte, minimisez les pertes',
    ],
    examples: [
      {
        situation: 'Trois 6 obtenus',
        dice: [6, 6, 6, 2, 3],
        recommendation: 'Si bonus possible, jouez-les. Sinon, visez Brelan',
        explanation: '18 pts en section sup OU 21 pts en Brelan. Décidez selon le bonus',
      },
    ],
    isPremium: false,
    views: 0,
    likes: 0,
    difficulty: 2,
  },
  {
    id: 'lower_1',
    title: 'Maîtriser la Section Inférieure',
    shortDescription: 'Full, Suites et combinaisons spéciales',
    fullDescription:
      'La section inférieure rapporte gros mais est moins prévisible. Soyez opportuniste.',
    category: 'lower_section',
    type: 'intermediate',
    keyPoints: [
      'Full (25 pts) : plus facile que Yams, excellent rapport',
      'Suites : cherchez 3-4 dés consécutifs',
      'Brelan/Carré : gardez les dés élevés (5, 6)',
      'Chance : dernier recours, visez 25+ points',
    ],
    examples: [
      {
        situation: 'Deux paires : 3-3-5-5-2',
        dice: [3, 3, 5, 5, 2],
        recommendation: 'Gardez 5-5, relancez pour tenter un Full',
        explanation: 'Full = 25 pts. Si raté, vous aurez peut-être un Brelan de 5',
      },
    ],
    isPremium: false,
    views: 0,
    likes: 0,
    difficulty: 2,
  },
];

// ============================================================================
// STRATEGY LIBRARY SERVICE
// ============================================================================

export class StrategyLibraryService {
  /**
   * Obtenir la bibliothèque de stratégies
   */
  static async getLibrary(): Promise<StrategyLibrary> {
    try {
      const data = await AsyncStorage.getItem(STRATEGY_LIBRARY_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading strategy library:', error);
    }

    // Bibliothèque par défaut
    return {
      tips: STRATEGY_TIPS,
      categories: {
        general: {
          name: 'Général',
          description: 'Stratégies générales et principes fondamentaux',
          icon: '🎯',
        },
        upper_section: {
          name: 'Section Supérieure',
          description: 'Optimiser les catégories 1-6',
          icon: '🔢',
        },
        lower_section: {
          name: 'Section Inférieure',
          description: 'Brelans, Full, Suites, Yams',
          icon: '🎲',
        },
        bonus: {
          name: 'Bonus',
          description: 'Stratégies pour obtenir le bonus de 35 points',
          icon: '⭐',
        },
        endgame: {
          name: 'Fin de Partie',
          description: 'Optimisation des derniers tours',
          icon: '🏁',
        },
        risk_management: {
          name: 'Gestion du Risque',
          description: 'Quand prendre des risques, quand sécuriser',
          icon: '⚖️',
        },
      },
      userProgress: {
        readTips: [],
        likedTips: [],
        bookmarkedTips: [],
      },
    };
  }

  /**
   * Sauvegarder la bibliothèque
   */
  static async saveLibrary(library: StrategyLibrary): Promise<void> {
    try {
      await AsyncStorage.setItem(STRATEGY_LIBRARY_KEY, JSON.stringify(library));
    } catch (error) {
      console.error('Error saving strategy library:', error);
    }
  }

  /**
   * Marquer un tip comme lu
   */
  static async markAsRead(tipId: string): Promise<void> {
    const library = await this.getLibrary();
    if (!library.userProgress.readTips.includes(tipId)) {
      library.userProgress.readTips.push(tipId);
      await this.saveLibrary(library);
    }

    // Incrémenter le compteur de vues
    const tip = library.tips.find((t) => t.id === tipId);
    if (tip) {
      tip.views++;
      await this.saveLibrary(library);
    }
  }

  /**
   * Liker un tip
   */
  static async toggleLike(tipId: string): Promise<boolean> {
    const library = await this.getLibrary();
    const index = library.userProgress.likedTips.indexOf(tipId);
    const isLiked = index === -1;

    if (isLiked) {
      library.userProgress.likedTips.push(tipId);
    } else {
      library.userProgress.likedTips.splice(index, 1);
    }

    // Mettre à jour le compteur
    const tip = library.tips.find((t) => t.id === tipId);
    if (tip) {
      tip.likes += isLiked ? 1 : -1;
    }

    await this.saveLibrary(library);
    return isLiked;
  }

  /**
   * Mettre en favoris
   */
  static async toggleBookmark(tipId: string): Promise<boolean> {
    const library = await this.getLibrary();
    const index = library.userProgress.bookmarkedTips.indexOf(tipId);
    const isBookmarked = index === -1;

    if (isBookmarked) {
      library.userProgress.bookmarkedTips.push(tipId);
    } else {
      library.userProgress.bookmarkedTips.splice(index, 1);
    }

    await this.saveLibrary(library);
    return isBookmarked;
  }

  /**
   * Obtenir les tips par catégorie
   */
  static async getTipsByCategory(category: StrategyCategory): Promise<StrategyTip[]> {
    const library = await this.getLibrary();
    return library.tips.filter((tip) => tip.category === category);
  }

  /**
   * Obtenir les tips par type
   */
  static async getTipsByType(type: StrategyType): Promise<StrategyTip[]> {
    const library = await this.getLibrary();
    return library.tips.filter((tip) => tip.type === type);
  }

  /**
   * Rechercher des tips
   */
  static async searchTips(query: string): Promise<StrategyTip[]> {
    const library = await this.getLibrary();
    const lowerQuery = query.toLowerCase();

    return library.tips.filter(
      (tip) =>
        tip.title.toLowerCase().includes(lowerQuery) ||
        tip.shortDescription.toLowerCase().includes(lowerQuery) ||
        tip.fullDescription.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Obtenir les tips recommandés
   */
  static async getRecommendedTips(limit: number = 5): Promise<StrategyTip[]> {
    const library = await this.getLibrary();

    // Tips non lus, triés par difficulté et popularité
    return library.tips
      .filter((tip) => !library.userProgress.readTips.includes(tip.id))
      .sort((a, b) => {
        // Prioriser les tips basiques non lus
        if (a.difficulty !== b.difficulty) {
          return a.difficulty - b.difficulty;
        }
        // Puis par popularité
        return b.views - a.views;
      })
      .slice(0, limit);
  }

  /**
   * Obtenir les statistiques
   */
  static async getStats(): Promise<{
    totalTips: number;
    readTips: number;
    likedTips: number;
    bookmarkedTips: number;
    completionPercent: number;
  }> {
    const library = await this.getLibrary();

    return {
      totalTips: library.tips.length,
      readTips: library.userProgress.readTips.length,
      likedTips: library.userProgress.likedTips.length,
      bookmarkedTips: library.userProgress.bookmarkedTips.length,
      completionPercent: Math.round(
        (library.userProgress.readTips.length / library.tips.length) * 100
      ),
    };
  }
}
