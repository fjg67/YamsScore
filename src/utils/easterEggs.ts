/**
 * Easter Eggs - Secrets cachés pour les utilisateurs curieux
 * Augmente l'engagement et le bouche-à-oreille
 */

import { haptics, HapticType } from './haptics';
import { sounds, SoundType } from './sounds';

export enum EasterEggType {
  KONAMI_CODE = 'konami_code',
  TRIPLE_TAP = 'triple_tap',
  LONG_PRESS = 'long_press',
  SHAKE_FRENZY = 'shake_frenzy',
  SECRET_GESTURE = 'secret_gesture',
}

export interface EasterEgg {
  type: EasterEggType;
  title: string;
  message: string;
  emoji: string;
  reward?: string;
}

const EASTER_EGGS: Record<EasterEggType, EasterEgg> = {
  [EasterEggType.KONAMI_CODE]: {
    type: EasterEggType.KONAMI_CODE,
    title: 'Code Konami !',
    message: 'Vous avez découvert le code secret ! Mode développeur activé.',
    emoji: '🎮',
    reward: 'dev_mode',
  },
  [EasterEggType.TRIPLE_TAP]: {
    type: EasterEggType.TRIPLE_TAP,
    title: 'Triple Tap !',
    message: 'Vous êtes rapide ! Voici un bonus de 100 points.',
    emoji: '⚡',
    reward: 'bonus_points',
  },
  [EasterEggType.LONG_PRESS]: {
    type: EasterEggType.LONG_PRESS,
    title: 'Patience récompensée',
    message: 'Vous avez trouvé le secret de la patience !',
    emoji: '🧘',
    reward: 'zen_mode',
  },
  [EasterEggType.SHAKE_FRENZY]: {
    type: EasterEggType.SHAKE_FRENZY,
    title: 'Shake Master !',
    message: 'Secouez comme un pro ! Danse des dés activée.',
    emoji: '💃',
    reward: 'dice_dance',
  },
  [EasterEggType.SECRET_GESTURE]: {
    type: EasterEggType.SECRET_GESTURE,
    title: 'Geste Secret',
    message: 'Vous connaissez les bonnes manières ! Skin premium débloqué.',
    emoji: '🎨',
    reward: 'premium_skin',
  },
};

class EasterEggManager {
  private static instance: EasterEggManager;
  private discoveredEggs: Set<EasterEggType> = new Set();
  private tapCount: number = 0;
  private tapTimer: ReturnType<typeof setTimeout> | null = null;
  private shakeCount: number = 0;
  private shakeTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  static getInstance(): EasterEggManager {
    if (!EasterEggManager.instance) {
      EasterEggManager.instance = new EasterEggManager();
    }
    return EasterEggManager.instance;
  }

  /**
   * Enregistre un tap (pour triple tap)
   */
  registerTap(): EasterEgg | null {
    this.tapCount++;

    if (this.tapTimer) {
      clearTimeout(this.tapTimer);
    }

    this.tapTimer = setTimeout(() => {
      this.tapCount = 0;
    }, 500);

    if (this.tapCount === 3 && !this.discoveredEggs.has(EasterEggType.TRIPLE_TAP)) {
      this.discoveredEggs.add(EasterEggType.TRIPLE_TAP);
      this.celebrate();
      return EASTER_EGGS[EasterEggType.TRIPLE_TAP];
    }

    return null;
  }

  /**
   * Enregistre un long press
   */
  registerLongPress(duration: number): EasterEgg | null {
    if (duration >= 3000 && !this.discoveredEggs.has(EasterEggType.LONG_PRESS)) {
      this.discoveredEggs.add(EasterEggType.LONG_PRESS);
      this.celebrate();
      return EASTER_EGGS[EasterEggType.LONG_PRESS];
    }

    return null;
  }

  /**
   * Enregistre un shake
   */
  registerShake(): EasterEgg | null {
    this.shakeCount++;

    if (this.shakeTimer) {
      clearTimeout(this.shakeTimer);
    }

    this.shakeTimer = setTimeout(() => {
      this.shakeCount = 0;
    }, 2000);

    if (this.shakeCount >= 5 && !this.discoveredEggs.has(EasterEggType.SHAKE_FRENZY)) {
      this.discoveredEggs.add(EasterEggType.SHAKE_FRENZY);
      this.celebrate();
      return EASTER_EGGS[EasterEggType.SHAKE_FRENZY];
    }

    return null;
  }

  /**
   * Vérifie le code Konami (séquence de swipes)
   */
  checkKonamiCode(sequence: string[]): EasterEgg | null {
    const konamiSequence = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right'];

    if (sequence.length === konamiSequence.length) {
      const isKonami = sequence.every((dir, i) => dir === konamiSequence[i]);

      if (isKonami && !this.discoveredEggs.has(EasterEggType.KONAMI_CODE)) {
        this.discoveredEggs.add(EasterEggType.KONAMI_CODE);
        this.celebrate();
        return EASTER_EGGS[EasterEggType.KONAMI_CODE];
      }
    }

    return null;
  }

  /**
   * Célébration pour un easter egg découvert
   */
  private async celebrate(): Promise<void> {
    await haptics.celebrate();
    await sounds.celebrate();
  }

  /**
   * Récupère tous les easter eggs découverts
   */
  getDiscoveredEggs(): EasterEgg[] {
    return Array.from(this.discoveredEggs).map(type => EASTER_EGGS[type]);
  }

  /**
   * Récupère le nombre d'easter eggs découverts
   */
  getDiscoveryCount(): number {
    return this.discoveredEggs.size;
  }

  /**
   * Récupère le nombre total d'easter eggs
   */
  getTotalCount(): number {
    return Object.keys(EASTER_EGGS).length;
  }

  /**
   * Vérifie si un easter egg est découvert
   */
  isDiscovered(type: EasterEggType): boolean {
    return this.discoveredEggs.has(type);
  }

  /**
   * Réinitialise les easter eggs (pour testing)
   */
  reset(): void {
    this.discoveredEggs.clear();
    this.tapCount = 0;
    this.shakeCount = 0;
    if (this.tapTimer) {
      clearTimeout(this.tapTimer);
    }
    if (this.shakeTimer) {
      clearTimeout(this.shakeTimer);
    }
  }
}

export const easterEggs = EasterEggManager.getInstance();
