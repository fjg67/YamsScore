/**
 * Hook pour le feedback haptique
 */

import { useCallback } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const useHaptic = () => {
  const trigger = useCallback((type: HapticType = 'light') => {
    // Désactiver sur Android pour éviter les vibrations trop fortes
    if (Platform.OS !== 'ios') return;

    const hapticMap: Record<HapticType, string> = {
      light: 'impactLight',
      medium: 'impactMedium',
      heavy: 'impactHeavy',
      success: 'notificationSuccess',
      warning: 'notificationWarning',
      error: 'notificationError',
    };

    ReactNativeHapticFeedback.trigger(hapticMap[type] as any, hapticOptions);
  }, []);

  const triggerSelection = useCallback(() => {
    if (Platform.OS !== 'ios') return;
    ReactNativeHapticFeedback.trigger('selection', hapticOptions);
  }, []);

  return {
    trigger,
    triggerSelection,
    light: () => trigger('light'),
    medium: () => trigger('medium'),
    heavy: () => trigger('heavy'),
    success: () => trigger('success'),
    warning: () => trigger('warning'),
    error: () => trigger('error'),
  };
};
