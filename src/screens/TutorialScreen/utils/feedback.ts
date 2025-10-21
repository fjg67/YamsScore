/**
 * Système de feedback multi-sensoriel (haptic + sound)
 */

import { Platform } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { HAPTIC_PATTERNS } from '../data/constants';

// Types de feedback haptique
export type FeedbackType = 'success' | 'error' | 'progression' | 'achievement';

// Options pour les haptiques
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * Déclenche un feedback haptique selon le pattern spécifié
 */
export const triggerHaptic = async (
  type: FeedbackType,
  enabled: boolean = true
): Promise<void> => {
  if (!enabled || Platform.OS === 'web') return;

  try {
    switch (type) {
      case 'success':
        ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
        break;
      case 'error':
        ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
        break;
      case 'progression':
        ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
        break;
      case 'achievement':
        // Séquence spéciale pour les achievements
        ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
        setTimeout(
          () => ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions),
          100
        );
        setTimeout(
          () => ReactNativeHapticFeedback.trigger('impactLight', hapticOptions),
          200
        );
        break;
    }
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

/**
 * Déclenche un pattern haptique personnalisé
 */
export const triggerCustomHaptic = async (
  pattern: number[],
  enabled: boolean = true
): Promise<void> => {
  if (!enabled || Platform.OS === 'web') return;

  try {
    for (let i = 0; i < pattern.length; i++) {
      if (i % 2 === 0) {
        // Impact sur les indices pairs
        ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
      }
      // Attendre la durée spécifiée
      if (i < pattern.length - 1) {
        await new Promise<void>(resolve => setTimeout(resolve, pattern[i]));
      }
    }
  } catch (error) {
    console.warn('Custom haptic feedback failed:', error);
  }
};

// Système de sons (simplifié pour l'instant, peut être enrichi avec expo-av)
export type SoundType =
  | 'validation'
  | 'error'
  | 'milestone'
  | 'achievement'
  | 'transition';

/**
 * Joue un son UI (version simplifiée)
 * Note: Pour une version complète, intégrer expo-av avec des fichiers audio
 */
export const playSound = async (
  type: SoundType,
  volume: 'mute' | 'low' | 'medium' | 'high' = 'medium'
): Promise<void> => {
  if (volume === 'mute') return;

  // Pour l'instant, on utilise seulement les haptiques
  // TODO: Ajouter expo-av et charger les fichiers audio
  console.log(`[Sound] Playing ${type} at ${volume} volume`);
};

/**
 * Feedback combiné (haptic + sound)
 */
export const triggerFeedback = async (
  type: FeedbackType,
  options: {
    hapticEnabled?: boolean;
    soundVolume?: 'mute' | 'low' | 'medium' | 'high';
  } = {}
): Promise<void> => {
  const { hapticEnabled = true, soundVolume = 'medium' } = options;

  // Lancer en parallèle
  await Promise.all([
    triggerHaptic(type, hapticEnabled),
    playSound(type as SoundType, soundVolume),
  ]);
};

/**
 * Feedback pour validation réussie
 */
export const feedbackSuccess = (
  enabled: boolean = true,
  soundVolume: 'mute' | 'low' | 'medium' | 'high' = 'medium'
) => triggerFeedback('success', { hapticEnabled: enabled, soundVolume });

/**
 * Feedback pour erreur
 */
export const feedbackError = (
  enabled: boolean = true,
  soundVolume: 'mute' | 'low' | 'medium' | 'high' = 'medium'
) => triggerFeedback('error', { hapticEnabled: enabled, soundVolume });

/**
 * Feedback pour progression
 */
export const feedbackProgression = (
  enabled: boolean = true,
  soundVolume: 'mute' | 'low' | 'medium' | 'high' = 'medium'
) => triggerFeedback('progression', { hapticEnabled: enabled, soundVolume });

/**
 * Feedback pour achievement débloqué
 */
export const feedbackAchievement = (
  enabled: boolean = true,
  soundVolume: 'mute' | 'low' | 'medium' | 'high' = 'medium'
) => triggerFeedback('achievement', { hapticEnabled: enabled, soundVolume });
