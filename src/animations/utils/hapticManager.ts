/**
 * Haptic Manager
 * Gestion des vibrations haptiques (Placeholder version)
 */

import { HapticConfig } from '../types';
import { Vibration } from 'react-native';

/**
 * Joue un feedback haptique simple
 */
export const playHaptic = async (config: HapticConfig): Promise<void> => {
  try {
    // Utilise la vibration native de React Native au lieu d'Expo
    let duration = 10;

    switch (config.type) {
      case 'light':
        duration = 10;
        break;
      case 'medium':
        duration = 20;
        break;
      case 'heavy':
        duration = 40;
        break;
    }

    Vibration.vibrate(duration);
    console.log(`📳 [Haptic] ${config.type} vibration`);

    // Si un pattern est défini, jouer les vibrations successives
    if (config.pattern && config.pattern.length > 1) {
      Vibration.vibrate(config.pattern);
    }
  } catch (error) {
    console.error('Erreur playHaptic:', error);
  }
};

/**
 * Feedback de succès
 */
export const playSuccessHaptic = async (): Promise<void> => {
  try {
    Vibration.vibrate([0, 50, 50, 50]);
    console.log('📳 [Haptic] Success vibration');
  } catch (error) {
    console.error('Erreur playSuccessHaptic:', error);
  }
};

/**
 * Feedback d'erreur
 */
export const playErrorHaptic = async (): Promise<void> => {
  try {
    Vibration.vibrate([0, 100]);
    console.log('📳 [Haptic] Error vibration');
  } catch (error) {
    console.error('Erreur playErrorHaptic:', error);
  }
};

/**
 * Feedback d'avertissement
 */
export const playWarningHaptic = async (): Promise<void> => {
  try {
    Vibration.vibrate([0, 30, 50, 30]);
    console.log('📳 [Haptic] Warning vibration');
  } catch (error) {
    console.error('Erreur playWarningHaptic:', error);
  }
};

/**
 * Pattern de vibration complexe pour animations épiques
 */
export const playEpicHapticPattern = async (): Promise<void> => {
  try {
    // Pattern épique avec vibrations crescendo
    Vibration.vibrate([0, 20, 100, 20, 100, 40, 100, 40, 100, 40, 200]);
    console.log('📳 [Haptic] Epic pattern vibration');
  } catch (error) {
    console.error('Erreur playEpicHapticPattern:', error);
  }
};
