/**
 * Easter Eggs System
 */

import { Alert } from 'react-native';
import { store } from '../../../store/store';
import { setAccentColor, toggleDebugMode } from '../../../store/slices/settingsSlice';
import { haptics } from '../../../utils/haptics';

// Track taps for easter eggs
const tapCounters: Record<string, number> = {};

/**
 * Easter Egg: Tap logo 7 times → Developer Mode
 */
export const handleLogoTap = (): void => {
  const key = 'logo';
  tapCounters[key] = (tapCounters[key] || 0) + 1;

  if (tapCounters[key] === 7) {
    haptics.celebrate();
    store.dispatch(toggleDebugMode());
    Alert.alert(
      '🧪 Mode Développeur Activé',
      'Tu as découvert le mode développeur ! Des options avancées sont maintenant disponibles.',
      [{ text: 'Cool !', style: 'default' }]
    );
    tapCounters[key] = 0; // Reset
  }
};

/**
 * Easter Egg: Tap version 10 times → Rainbow Theme
 */
export const handleVersionTap = (): void => {
  const key = 'version';
  tapCounters[key] = (tapCounters[key] || 0) + 1;

  if (tapCounters[key] === 10) {
    haptics.celebrate();
    store.dispatch(setAccentColor('gold'));
    Alert.alert(
      '🌈 Thème Arc-en-ciel Débloqué',
      'Félicitations ! Tu as débloqué la couleur d\'accent Or premium !',
      [{ text: 'Génial !', style: 'default' }]
    );
    tapCounters[key] = 0; // Reset
  }
};

/**
 * Easter Egg: Scroll to bottom 5 times → Achievement
 */
export const handleScrollToBottom = (): void => {
  const key = 'scroll';
  tapCounters[key] = (tapCounters[key] || 0) + 1;

  if (tapCounters[key] === 5) {
    haptics.success();
    Alert.alert(
      '🔍 Badge Débloqué: Curieux',
      'Tu as exploré chaque recoin des paramètres !',
      [{ text: 'Merci !', style: 'default' }]
    );
    tapCounters[key] = 0; // Reset
  }
};

/**
 * Reset all easter egg counters
 */
export const resetEasterEggs = (): void => {
  Object.keys(tapCounters).forEach((key) => {
    tapCounters[key] = 0;
  });
};
