/**
 * Animation Config Resolver
 * Résout la configuration d'animation selon la catégorie et le score
 */

import { CategoryType } from '../../types/game';
import { ScoreAnimationConfig, AnimationContext } from '../types';
import {
  getOnesAnimation,
  getTwosAnimation,
  getThreesAnimation,
  getFoursAnimation,
  getFivesAnimation,
  getSixesAnimation,
  getBonusAnimation,
} from './upperSection';
import {
  getThreeOfKindAnimation,
  getFourOfKindAnimation,
  getFullHouseAnimation,
  getSmallStraightAnimation,
  getLargeStraightAnimation,
  getYamsAnimation,
  getChanceAnimation,
} from './lowerSection';

/**
 * Récupère la configuration d'animation pour une catégorie et un score donnés
 */
export const getAnimationConfig = (
  category: CategoryType,
  score: number,
  context: AnimationContext = {}
): ScoreAnimationConfig | null => {
  // Si bonus gagné, retourner animation bonus
  if (context.isBonusEarned) {
    return getBonusAnimation();
  }

  // Résolution par catégorie
  switch (category) {
    // Section supérieure
    case 'ones':
      return getOnesAnimation(score);
    case 'twos':
      return getTwosAnimation(score);
    case 'threes':
      return getThreesAnimation(score);
    case 'fours':
      return getFoursAnimation(score);
    case 'fives':
      return getFivesAnimation(score);
    case 'sixes':
      return getSixesAnimation(score);

    // Section inférieure
    case 'threeOfKind':
      return getThreeOfKindAnimation(score);
    case 'fourOfKind':
      return getFourOfKindAnimation(score);
    case 'fullHouse':
      return getFullHouseAnimation();
    case 'smallStraight':
      return getSmallStraightAnimation();
    case 'largeStraight':
      return getLargeStraightAnimation();
    case 'yams':
      return getYamsAnimation();
    case 'chance':
      return getChanceAnimation(score);

    default:
      return null;
  }
};

/**
 * Export de toutes les fonctions
 */
export * from './upperSection';
export * from './lowerSection';
