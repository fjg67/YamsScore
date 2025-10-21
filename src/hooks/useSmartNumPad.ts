/**
 * Hook pour générer la configuration intelligente du NumPad selon la catégorie
 */

import { useMemo } from 'react';
import { ScoreCategory } from '../types/game.types';
import { SmartNumPadConfig, CategoryRuleExplained } from '../types/numpad.types';
import { ScoreValidationRules, CategoryLabels, CategoryDescriptions } from '../constants';

export const useSmartNumPad = (category: ScoreCategory): SmartNumPadConfig => {
  const config = useMemo<SmartNumPadConfig>(() => {
    const rule = ScoreValidationRules[category];
    const isFixedValue = rule.fixedValue !== undefined;

    // Génération des valeurs possibles selon la catégorie
    const getPossibleValues = (): number[] => {
      if (isFixedValue) {
        return [0, rule.fixedValue!];
      }

      // Pour la section supérieure (1-6)
      if (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].includes(category)) {
        const diceValue = parseInt(category.replace(/[^0-9]/g, '')) ||
          (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(category) + 1);
        return [0, ...Array.from({ length: 5 }, (_, i) => (i + 1) * diceValue)];
      }

      // Pour brelan, carré, chance (total libre)
      if (['threeOfKind', 'fourOfKind', 'chance'].includes(category)) {
        // Valeurs communes tous les 5 points
        return [0, 5, 10, 15, 20, 25, 30];
      }

      return [0, rule.fixedValue || rule.maxValue];
    };

    // Valeurs rapides (les plus fréquentes)
    const getQuickValues = (): number[] => {
      if (isFixedValue) {
        return [rule.fixedValue!]; // Seulement la valeur fixe (0 est dans barrer)
      }

      switch (category) {
        // Section supérieure: valeurs hautes
        case 'ones':
          return [3, 4, 5];
        case 'twos':
          return [6, 8, 10];
        case 'threes':
          return [9, 12, 15];
        case 'fours':
          return [12, 16, 20];
        case 'fives':
          return [15, 20, 25];
        case 'sixes':
          return [18, 24, 30];

        // Brelan: valeurs communes
        case 'threeOfKind':
          return [15, 18, 20, 25];

        // Carré: valeurs hautes
        case 'fourOfKind':
          return [20, 24, 28];

        // Chance: valeurs communes
        case 'chance':
          return [15, 20, 25, 30];

        default:
          return [];
      }
    };

    // Texte d'aide contextuel
    const getHelperText = (): string => {
      if (isFixedValue) {
        return `${rule.fixedValue} points si réussi, sinon barrer (0)`;
      }

      switch (category) {
        case 'ones':
        case 'twos':
        case 'threes':
        case 'fours':
        case 'fives':
        case 'sixes':
          return 'Somme de tous les dés de cette valeur';

        case 'threeOfKind':
          return 'Total des 5 dés si vous avez 3 identiques';

        case 'fourOfKind':
          return 'Total des 5 dés si vous avez 4 identiques';

        case 'chance':
          return 'Total des 5 dés (n\'importe quelle combinaison)';

        default:
          return CategoryDescriptions[category];
      }
    };

    // Exemples de dés
    const getExamples = (): string[] => {
      switch (category) {
        case 'ones':
          return ['🎲 1-1-1-2-3 = 3 pts', '🎲 1-1-1-1-1 = 5 pts'];
        case 'twos':
          return ['🎲 2-2-2-4-5 = 6 pts', '🎲 2-2-2-2-2 = 10 pts'];
        case 'threes':
          return ['🎲 3-3-3-1-2 = 9 pts', '🎲 3-3-3-3-3 = 15 pts'];
        case 'fours':
          return ['🎲 4-4-4-2-5 = 12 pts', '🎲 4-4-4-4-4 = 20 pts'];
        case 'fives':
          return ['🎲 5-5-5-3-4 = 15 pts', '🎲 5-5-5-5-5 = 25 pts'];
        case 'sixes':
          return ['🎲 6-6-6-2-3 = 18 pts', '🎲 6-6-6-6-6 = 30 pts'];

        case 'threeOfKind':
          return ['🎲 3-3-3-5-6 = 20 pts', '🎲 6-6-6-5-4 = 27 pts'];
        case 'fourOfKind':
          return ['🎲 4-4-4-4-2 = 18 pts', '🎲 6-6-6-6-5 = 29 pts'];

        case 'fullHouse':
          return ['🎲 3-3-3-5-5 = 25 pts', '🎲 2-2-6-6-6 = 25 pts'];

        case 'smallStraight':
          return ['🎲 1-2-3-4-6 = 30 pts', '🎲 2-3-4-5-6 = 30 pts'];

        case 'largeStraight':
          return ['🎲 1-2-3-4-5 = 40 pts', '🎲 2-3-4-5-6 = 40 pts'];

        case 'yams':
          return ['🎲 5-5-5-5-5 = 50 pts', '🎲 6-6-6-6-6 = 50 pts'];

        case 'chance':
          return ['🎲 1-2-3-4-5 = 15 pts', '🎲 6-6-6-5-4 = 27 pts'];

        default:
          return [];
      }
    };

    return {
      category,
      possibleValues: getPossibleValues(),
      quickValues: getQuickValues(),
      maxValue: rule.maxValue,
      minValue: rule.minValue,
      isFixedValue,
      fixedValue: rule.fixedValue,
      helperText: getHelperText(),
      examples: getExamples(),
    };
  }, [category]);

  return config;
};

/**
 * Hook pour obtenir les explications détaillées d'une catégorie
 */
export const useCategoryHelp = (category: ScoreCategory): CategoryRuleExplained => {
  return useMemo<CategoryRuleExplained>(() => {
    const config = ScoreValidationRules[category];
    const label = CategoryLabels[category];
    const description = CategoryDescriptions[category];

    const getTips = (): string[] => {
      switch (category) {
        case 'ones':
        case 'twos':
        case 'threes':
        case 'fours':
        case 'fives':
        case 'sixes':
          return [
            'Gardez cette ligne pour le bonus de 63 points',
            'Privilégiez les valeurs hautes (4, 5, 6)',
          ];

        case 'threeOfKind':
          return [
            'Additionne TOUS les 5 dés, pas seulement le brelan',
            'Utilisez cette case pour des scores élevés même sans brelan parfait',
          ];

        case 'fourOfKind':
          return [
            'Additionne TOUS les 5 dés',
            'Un carré de 6 avec un 5 = 29 points !',
          ];

        case 'fullHouse':
          return [
            'Toujours 25 points si réussi',
            'Ex: 3-3-3-5-5 ou 2-2-6-6-6',
          ];

        case 'smallStraight':
          return [
            '4 dés consécutifs minimum',
            'Ex: 1-2-3-4 ou 3-4-5-6',
          ];

        case 'largeStraight':
          return [
            '5 dés consécutifs',
            'Seulement 2 possibilités: 1-2-3-4-5 ou 2-3-4-5-6',
          ];

        case 'yams':
          return [
            'Les 5 dés doivent être identiques',
            'Le score le plus rare et prestigieux !',
          ];

        case 'chance':
          return [
            'Aucune restriction, total libre',
            'Utilisez pour sauver un mauvais lancer',
          ];

        default:
          return [];
      }
    };

    const getPossibleScores = (): number[] => {
      if (config.fixedValue !== undefined) {
        return [0, config.fixedValue];
      }

      const scores: number[] = [0];
      for (let i = config.minValue; i <= config.maxValue; i++) {
        if (i > 0 && !scores.includes(i)) {
          scores.push(i);
        }
      }

      return scores;
    };

    return {
      title: label,
      description,
      examples: [],
      tips: getTips(),
      possibleScores: getPossibleScores(),
    };
  }, [category]);
};
