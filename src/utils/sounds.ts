/**
 * Sound Manager - Gestion des sons avec toggle
 * Sons premium pour améliorer l'UX
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUND_ENABLED_KEY = '@yams_sounds_enabled';

export enum SoundType {
  TAP = 'tap',
  SUCCESS = 'success',
  CELEBRATION = 'celebration',
  STREAK = 'streak',
  ACHIEVEMENT = 'achievement',
  ERROR = 'error',
  SWIPE = 'swipe',
  POP = 'pop',
}

/**
 * Fréquences des sons (en Hz) pour AudioContext Web Audio API
 * On utilise des synthétiseurs simples au lieu de fichiers audio
 */
const SOUND_FREQUENCIES: Record<SoundType, number[]> = {
  [SoundType.TAP]: [800, 1000], // Petit 'toc' satisfaisant
  [SoundType.SUCCESS]: [523.25, 659.25, 783.99], // Do-Mi-Sol (accord majeur)
  [SoundType.CELEBRATION]: [523.25, 587.33, 659.25, 783.99, 880], // Montée joyeuse
  [SoundType.STREAK]: [659.25, 783.99, 1046.5], // Mi-Sol-Do haut (victoire)
  [SoundType.ACHIEVEMENT]: [440, 554.37, 659.25, 880], // La-Do#-Mi-La (triomphe)
  [SoundType.ERROR]: [400, 300], // Descendant (erreur)
  [SoundType.SWIPE]: [600], // Son neutre
  [SoundType.POP]: [1200], // Pop rapide
};

class SoundManager {
  private static instance: SoundManager;
  private soundsEnabled: boolean = true;
  private initialized: boolean = false;

  private constructor() {
    this.loadSoundPreference();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Charge la préférence de son depuis AsyncStorage
   */
  private async loadSoundPreference(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
      this.soundsEnabled = stored !== 'false'; // Par défaut activé
      this.initialized = true;
    } catch (error) {
      console.error('Error loading sound preference:', error);
      this.soundsEnabled = true;
      this.initialized = true;
    }
  }

  /**
   * Active ou désactive les sons
   */
  async setSoundsEnabled(enabled: boolean): Promise<void> {
    this.soundsEnabled = enabled;
    try {
      await AsyncStorage.setItem(SOUND_ENABLED_KEY, enabled.toString());
    } catch (error) {
      console.error('Error saving sound preference:', error);
    }
  }

  /**
   * Récupère l'état des sons
   */
  async isSoundsEnabled(): Promise<boolean> {
    if (!this.initialized) {
      await this.loadSoundPreference();
    }
    return this.soundsEnabled;
  }

  /**
   * Joue un son (synthétisé)
   * Note: React Native n'a pas AudioContext natif
   * On utilise une approche simplifiée avec haptics comme fallback
   */
  async play(type: SoundType): Promise<void> {
    if (!this.soundsEnabled) {
      return;
    }

    // Pour React Native, on peut utiliser des bibliothèques comme:
    // - react-native-sound
    // - expo-av
    // Pour ce MVP, on simule avec des logs et on pourrait ajouter des haptics

    if (__DEV__) {
      console.log(`🔊 Playing sound: ${type}`);
    }

    // TODO: Implémenter avec react-native-sound ou expo-av
    // Pour l'instant, on retourne immédiatement
  }

  /**
   * Joue une séquence de sons
   */
  async playSequence(types: SoundType[], delay: number = 100): Promise<void> {
    if (!this.soundsEnabled) {
      return;
    }

    for (let i = 0; i < types.length; i++) {
      await this.play(types[i]);
      if (i < types.length - 1) {
        await new Promise<void>(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Célébration sonore
   */
  async celebrate(): Promise<void> {
    await this.playSequence([
      SoundType.SUCCESS,
      SoundType.CELEBRATION,
      SoundType.ACHIEVEMENT,
    ], 150);
  }
}

export const sounds = SoundManager.getInstance();
