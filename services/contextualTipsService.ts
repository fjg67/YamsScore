/**
 * Contextual Tips Service - Tips intelligents affichés au bon moment
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ContextualTip,
  ContextualTipsSettings,
  TipContext,
} from '../src/types/learning';
import { CategoryType } from '../src/types/game';

const CONTEXTUAL_TIPS_SETTINGS_KEY = '@yams_contextual_tips_settings';
const SHOWN_TIPS_KEY = '@yams_shown_tips';

// ============================================================================
// CONTEXTUAL TIPS DATA
// ============================================================================

export const CONTEXTUAL_TIPS: ContextualTip[] = [
  // DICE ROLL TIPS
  {
    id: 'dice_1',
    context: 'dice_roll',
    priority: 'medium',
    condition: {
      dicePattern: 'three_of_kind',
    },
    message: 'Vous avez un Brelan !',
    explanation:
      'Trois dés identiques = Brelan. Vous pouvez tenter un Carré en relançant, ou sécuriser le Brelan.',
    suggestedAction: 'Gardez les trois dés identiques et décidez : Carré ou Brelan ?',
    luckyDialogue: 'Nice ! Un Brelan ! Tu peux tenter le Carré ou sécuriser ! 🎲',
    dismissible: true,
    autoHideAfter: 5,
  },
  {
    id: 'dice_2',
    context: 'dice_roll',
    priority: 'high',
    condition: {
      dicePattern: 'four_of_kind',
    },
    message: 'Carré ! Excellent lancer !',
    explanation:
      'Quatre dés identiques, c\'est rare ! Vous pouvez tenter un Yams ou sécuriser le Carré.',
    suggestedAction: 'Évaluez le contexte : début de partie = tentez Yams, fin = sécurisez',
    luckyDialogue: 'Waouh ! Un Carré ! Tu es sur une bonne lancée ! 🔥',
    dismissible: true,
    autoHideAfter: 5,
  },
  {
    id: 'dice_3',
    context: 'dice_roll',
    priority: 'critical',
    condition: {
      dicePattern: 'yams',
    },
    message: 'YAMS ! Le coup parfait ! 🎉',
    explanation:
      'Cinq dés identiques ! 50 points garantis ! C\'est le coup le plus prestigieux du jeu !',
    luckyDialogue: 'INCROYABLE ! Un YAMS ! Tu es une légende ! 🌟',
    dismissible: true,
    autoHideAfter: 10,
  },
  {
    id: 'dice_4',
    context: 'dice_roll',
    priority: 'high',
    condition: {
      dicePattern: 'large_straight',
    },
    message: 'Grande Suite ! 40 points !',
    explanation: 'Cinq dés consécutifs = Grande Suite. Ne la gaspillez pas !',
    suggestedAction: 'Jouez-la immédiatement en Grande Suite',
    luckyDialogue: 'Magnifique ! Une Grande Suite ! Ça, c\'est du talent ! 🎯',
    dismissible: true,
    autoHideAfter: 5,
  },
  {
    id: 'dice_5',
    context: 'dice_roll',
    priority: 'high',
    condition: {
      dicePattern: 'full_house',
    },
    message: 'Full House !',
    explanation: 'Brelan + Paire = Full = 25 points',
    suggestedAction: 'Si le Full est disponible, jouez-le !',
    luckyDialogue: 'Un Full ! La maison est pleine ! 🏠',
    dismissible: true,
    autoHideAfter: 5,
  },

  // CATEGORY SELECTION TIPS
  {
    id: 'category_1',
    context: 'category_selection',
    priority: 'high',
    condition: {
      minTurn: 10,
    },
    message: 'Attention à l\'ordre !',
    explanation:
      'Fin de partie proche. Ne gaspillez pas vos catégories rares (Suites, Yams) !',
    suggestedAction: 'Gardez ces catégories pour les bonnes opportunités',
    luckyDialogue: 'On approche de la fin ! Chaque choix compte maintenant ! ⏰',
    dismissible: true,
    autoHideAfter: 5,
  },

  // BONUS TRACKING TIPS
  {
    id: 'bonus_1',
    context: 'bonus_tracking',
    priority: 'high',
    condition: {
      minTurn: 5,
      maxTurn: 10,
      scoreCondition: 'close_to_bonus',
    },
    message: 'Bonus à portée !',
    explanation:
      'Vous êtes proche des 63 points pour le bonus. Priorisez la section supérieure !',
    suggestedAction: 'Visez les catégories manquantes de la section supérieure',
    luckyDialogue:
      'Le bonus est proche ! 35 points de plus, ça vaut le coup de se concentrer ! 💎',
    showOnce: false,
    dismissible: true,
    autoHideAfter: 7,
  },
  {
    id: 'bonus_2',
    context: 'bonus_tracking',
    priority: 'medium',
    condition: {
      minTurn: 10,
      scoreCondition: 'bonus_impossible',
    },
    message: 'Bonus hors d\'atteinte',
    explanation:
      'Le bonus n\'est plus possible. Concentrez-vous sur maximiser les autres catégories.',
    suggestedAction: 'Optez pour les combinaisons qui rapportent le plus de points',
    luckyDialogue:
      'Le bonus n\'est plus possible, mais on peut quand même faire un gros score ! 💪',
    showOnce: true,
    dismissible: true,
  },

  // REROLL DECISION TIPS
  {
    id: 'reroll_1',
    context: 'reroll_decision',
    priority: 'medium',
    condition: {},
    message: 'Dernier lancer !',
    explanation:
      'C\'est votre dernière chance. Évaluez bien : relancer ou garder ?',
    suggestedAction: 'Relancez seulement si l\'amélioration probable vaut le risque',
    luckyDialogue: 'Dernière chance ! Réfléchis bien avant de relancer ! 🤔',
    dismissible: true,
    autoHideAfter: 4,
  },

  // MISTAKE PREVENTION TIPS
  {
    id: 'mistake_1',
    context: 'mistake_prevention',
    priority: 'critical',
    condition: {},
    message: 'Attention ! ⚠️',
    explanation:
      'Vous allez jouer une Grande Suite en Petite Suite. Vous perdez 10 points !',
    suggestedAction: 'Vérifiez votre choix avant de valider',
    luckyDialogue: 'Stop ! Tu vas perdre 10 points ! Vérifie ton choix ! 🛑',
    dismissible: false,
    autoHideAfter: 10,
  },
  {
    id: 'mistake_2',
    context: 'mistake_prevention',
    priority: 'critical',
    condition: {},
    message: 'Attention au gaspillage !',
    explanation: 'Vous allez jouer un Yams ou une Suite en Chance. C\'est un gros gaspillage !',
    suggestedAction: 'Utilisez la catégorie appropriée !',
    luckyDialogue: 'Noooon ! Ne gaspille pas cette super combo ! 😱',
    dismissible: false,
    autoHideAfter: 10,
  },

  // ENDGAME TIPS
  {
    id: 'endgame_1',
    context: 'endgame',
    priority: 'high',
    condition: {
      minTurn: 11,
    },
    message: 'Fin de partie !',
    explanation: 'Les 3 derniers tours sont cruciaux. Analysez bien chaque option.',
    suggestedAction: 'Listez vos catégories restantes et maximisez chaque coup',
    luckyDialogue: 'C\'est la dernière ligne droite ! Donne tout ! 🏁',
    dismissible: true,
    autoHideAfter: 6,
  },
];

// ============================================================================
// CONTEXTUAL TIPS SERVICE
// ============================================================================

export class ContextualTipsService {
  /**
   * Obtenir les paramètres des tips contextuels
   */
  static async getSettings(): Promise<ContextualTipsSettings> {
    try {
      const data = await AsyncStorage.getItem(CONTEXTUAL_TIPS_SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading contextual tips settings:', error);
    }

    // Paramètres par défaut
    return {
      enabled: true,
      frequency: 'normal',
      categories: {
        dice_roll: true,
        category_selection: true,
        reroll_decision: true,
        bonus_tracking: true,
        endgame: true,
        mistake_prevention: true,
      },
      showLucky: true,
    };
  }

  /**
   * Sauvegarder les paramètres
   */
  static async saveSettings(settings: ContextualTipsSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(CONTEXTUAL_TIPS_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving contextual tips settings:', error);
    }
  }

  /**
   * Obtenir les tips déjà affichés
   */
  static async getShownTips(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(SHOWN_TIPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading shown tips:', error);
      return [];
    }
  }

  /**
   * Marquer un tip comme affiché
   */
  static async markTipAsShown(tipId: string): Promise<void> {
    const shownTips = await this.getShownTips();
    if (!shownTips.includes(tipId)) {
      shownTips.push(tipId);
      await AsyncStorage.setItem(SHOWN_TIPS_KEY, JSON.stringify(shownTips));
    }
  }

  /**
   * Obtenir un tip contextuel approprié
   */
  static async getTipForContext(
    context: TipContext,
    gameState: any
  ): Promise<ContextualTip | null> {
    const settings = await this.getSettings();

    // Vérifier si les tips sont activés
    if (!settings.enabled || !settings.categories[context]) {
      return null;
    }

    const shownTips = await this.getShownTips();

    // Filtrer les tips appropriés
    const applicableTips = CONTEXTUAL_TIPS.filter((tip) => {
      // Vérifier le contexte
      if (tip.context !== context) return false;

      // Si showOnce et déjà affiché, skip
      if (tip.showOnce && shownTips.includes(tip.id)) return false;

      // Vérifier les conditions
      if (tip.condition.minTurn && gameState.currentTurn < tip.condition.minTurn) {
        return false;
      }
      if (tip.condition.maxTurn && gameState.currentTurn > tip.condition.maxTurn) {
        return false;
      }

      return true;
    });

    if (applicableTips.length === 0) return null;

    // Trier par priorité
    const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
    applicableTips.sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    // Appliquer la fréquence
    if (settings.frequency === 'minimal') {
      // Ne montrer que les tips critiques
      const criticalTip = applicableTips.find((t) => t.priority === 'critical');
      return criticalTip || null;
    }

    if (settings.frequency === 'frequent') {
      // Montrer le premier tip applicable
      return applicableTips[0];
    }

    // Fréquence normale : montrer high et critical
    const importantTip = applicableTips.find(
      (t) => t.priority === 'critical' || t.priority === 'high'
    );
    return importantTip || null;
  }

  /**
   * Analyser des dés pour détecter des patterns
   */
  static analyzeDicePattern(dice: number[]): string | null {
    const counts = new Map<number, number>();
    dice.forEach((d) => counts.set(d, (counts.get(d) || 0) + 1));

    const values = Array.from(counts.values()).sort((a, b) => b - a);
    const sortedDice = [...dice].sort((a, b) => a - b);

    // Yams
    if (values[0] === 5) return 'yams';

    // Carré
    if (values[0] === 4) return 'four_of_kind';

    // Full
    if (values[0] === 3 && values[1] === 2) return 'full_house';

    // Grande suite
    const largeStr = sortedDice.join('');
    if (largeStr === '12345' || largeStr === '23456') return 'large_straight';

    // Petite suite
    const uniqueDice = [...new Set(sortedDice)].sort((a, b) => a - b);
    for (let i = 0; i <= uniqueDice.length - 4; i++) {
      const slice = uniqueDice.slice(i, i + 4);
      if (slice[3] - slice[0] === 3 && slice.every((v, idx) => idx === 0 || v === slice[idx - 1] + 1)) {
        return 'small_straight';
      }
    }

    // Brelan
    if (values[0] === 3) return 'three_of_kind';

    return null;
  }

  /**
   * Vérifier si proche du bonus
   */
  static isCloseToBonus(upperSectionScore: number, remainingCategories: number): boolean {
    const needed = 63 - upperSectionScore;
    const averagePerCategory = needed / remainingCategories;
    // Si on a besoin de moins de 4 points par catégorie restante, c'est "proche"
    return averagePerCategory <= 4 && remainingCategories >= 2;
  }

  /**
   * Vérifier si le bonus est impossible
   */
  static isBonusImpossible(upperSectionScore: number, remainingCategories: number): boolean {
    const needed = 63 - upperSectionScore;
    const maxPossible = remainingCategories * 6 * 5; // 6 valeurs max * 5 dés max
    return needed > maxPossible;
  }

  /**
   * Réinitialiser les tips affichés
   */
  static async resetShownTips(): Promise<void> {
    await AsyncStorage.removeItem(SHOWN_TIPS_KEY);
  }
}
