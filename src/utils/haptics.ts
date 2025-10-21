/**
 * Haptic Feedback Manager
 * Gestion centralisée des retours haptiques
 */

import { Platform } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Options pour iOS
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export enum HapticType {
  LIGHT = 'impactLight',
  MEDIUM = 'impactMedium',
  HEAVY = 'impactHeavy',
  SUCCESS = 'notificationSuccess',
  WARNING = 'notificationWarning',
  ERROR = 'notificationError',
  SELECTION = 'selection',
  SOFT = 'soft',
  RIGID = 'rigid',
}

class HapticManager {
  private enabled: boolean = true;

  /**
   * Active ou désactive les retours haptiques
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Déclenche un retour haptique
   */
  trigger(type: HapticType = HapticType.LIGHT) {
    if (!this.enabled) return;

    try {
      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger(type, hapticOptions);
      } else if (Platform.OS === 'android') {
        // Sur Android, on utilise un mapping simplifié
        const androidMapping: Record<HapticType, string> = {
          [HapticType.LIGHT]: 'impactLight',
          [HapticType.MEDIUM]: 'impactMedium',
          [HapticType.HEAVY]: 'impactHeavy',
          [HapticType.SUCCESS]: 'notificationSuccess',
          [HapticType.WARNING]: 'notificationWarning',
          [HapticType.ERROR]: 'notificationError',
          [HapticType.SELECTION]: 'selection',
          [HapticType.SOFT]: 'impactLight',
          [HapticType.RIGID]: 'impactHeavy',
        };

        ReactNativeHapticFeedback.trigger(androidMapping[type] as any, hapticOptions);
      }
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * Helpers pour les cas d'usage courants
   */
  light() {
    this.trigger(HapticType.LIGHT);
  }

  medium() {
    this.trigger(HapticType.MEDIUM);
  }

  heavy() {
    this.trigger(HapticType.HEAVY);
  }

  success() {
    this.trigger(HapticType.SUCCESS);
  }

  warning() {
    this.trigger(HapticType.WARNING);
  }

  error() {
    this.trigger(HapticType.ERROR);
  }

  selection() {
    this.trigger(HapticType.SELECTION);
  }

  /**
   * Séquences haptiques complexes
   */
  async sequence(types: HapticType[], delays: number[]) {
    if (!this.enabled) return;

    for (let i = 0; i < types.length; i++) {
      this.trigger(types[i]);
      if (i < delays.length) {
        await new Promise<void>(resolve => setTimeout(resolve, delays[i]));
      }
    }
  }

  /**
   * Haptic pour célébration (succès avec séquence)
   */
  async celebrate() {
    await this.sequence(
      [HapticType.LIGHT, HapticType.MEDIUM, HapticType.HEAVY, HapticType.SUCCESS],
      [50, 50, 50, 0]
    );
  }
}

// Export singleton
export const haptics = new HapticManager();
