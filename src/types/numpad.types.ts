/**
 * Types pour le NumPad premium révolutionnaire
 */

import { ScoreCategory } from './game.types';

export interface SmartNumPadConfig {
  category: ScoreCategory;
  possibleValues: number[];
  quickValues: number[]; // Valeurs fréquentes en gros boutons
  suggestedValue?: number; // Suggestion AI basée sur stats
  maxValue: number;
  minValue: number;
  isFixedValue: boolean; // true pour Full, Suites, Yams
  fixedValue?: number;
  helperText: string;
  examples: string[]; // Exemples de dés
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  quality?: 'excellent' | 'good' | 'average' | 'poor'; // Pour colorier le feedback
}

export interface NumPadButton {
  value: number;
  label?: string;
  variant: 'normal' | 'quick' | 'suggested' | 'cross' | 'custom';
  disabled?: boolean;
}

export interface CategoryRuleExplained {
  title: string;
  description: string;
  examples: string[];
  tips?: string[];
  possibleScores: number[];
}
