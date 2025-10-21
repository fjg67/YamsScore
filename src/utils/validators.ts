/**
 * Validateurs pour les entrées utilisateur
 */

import { ScoreCategory } from '../types';
import { ScoreValidationRules, GameConfig } from '../constants';

/**
 * Valide un nom de joueur
 */
export const validatePlayerName = (name: string): {
  isValid: boolean;
  error?: string;
} => {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Le nom ne peut pas être vide' };
  }

  if (trimmedName.length > 20) {
    return {
      isValid: false,
      error: 'Le nom ne peut pas dépasser 20 caractères',
    };
  }

  return { isValid: true };
};

/**
 * Valide un score pour une catégorie donnée
 */
export const validateScore = (
  category: ScoreCategory,
  value: number
): { isValid: boolean; error?: string } => {
  const rule = ScoreValidationRules[category];

  if (!rule) {
    return { isValid: false, error: 'Catégorie invalide' };
  }

  // Vérifier si le score est un nombre entier
  if (!Number.isInteger(value)) {
    return { isValid: false, error: 'Le score doit être un nombre entier' };
  }

  // Vérifier les limites min/max
  if (value < rule.minValue || value > rule.maxValue) {
    return {
      isValid: false,
      error: `Le score doit être entre ${rule.minValue} et ${rule.maxValue}`,
    };
  }

  // Pour les catégories à valeur fixe, vérifier que c'est soit 0 (barré) soit la valeur fixe
  if (rule.fixedValue !== undefined && value !== 0 && value !== rule.fixedValue) {
    return {
      isValid: false,
      error: `Le score doit être 0 ou ${rule.fixedValue}`,
    };
  }

  return { isValid: true };
};

/**
 * Valide le nombre de joueurs
 */
export const validatePlayerCount = (count: number): {
  isValid: boolean;
  error?: string;
} => {
  if (count < GameConfig.MIN_PLAYERS) {
    return {
      isValid: false,
      error: `Minimum ${GameConfig.MIN_PLAYERS} joueurs requis`,
    };
  }

  if (count > GameConfig.MAX_PLAYERS) {
    return {
      isValid: false,
      error: `Maximum ${GameConfig.MAX_PLAYERS} joueurs autorisés`,
    };
  }

  return { isValid: true };
};

/**
 * Valide qu'il n'y a pas de noms de joueurs en double
 */
export const validateUniquePlayerNames = (names: string[]): {
  isValid: boolean;
  error?: string;
} => {
  const trimmedNames = names.map((name) => name.trim().toLowerCase());
  const uniqueNames = new Set(trimmedNames);

  if (uniqueNames.size !== names.length) {
    return {
      isValid: false,
      error: 'Les noms des joueurs doivent être uniques',
    };
  }

  return { isValid: true };
};

/**
 * Valide une couleur hexadécimale
 */
export const validateHexColor = (color: string): {
  isValid: boolean;
  error?: string;
} => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (!hexColorRegex.test(color)) {
    return { isValid: false, error: 'Couleur hexadécimale invalide' };
  }

  return { isValid: true };
};
