/**
 * Sound Manager
 * Gestion centralisée des effets sonores
 */

import { SoundConfig } from '../types';

// NOTE: react-native-sound nécessite des fichiers audio réels
// Pour l'instant, on simule avec des logs (placeholder)
// Remplacer par la vraie implémentation quand les fichiers audio seront disponibles

// Cache des sons chargés
const soundCache: Record<string, any> = {};

// Sons disponibles (placeholders)
export const SOUNDS: Record<string, string> = {
  'score-minimal.mp3': 'placeholder',
  'score-standard.mp3': 'placeholder',
  'score-good.mp3': 'placeholder',
  'score-excellent.mp3': 'placeholder',
  'score-perfect.mp3': 'placeholder',
  'three-of-kind.mp3': 'placeholder',
  'four-of-kind.mp3': 'placeholder',
  'full-house.mp3': 'placeholder',
  'small-straight.mp3': 'placeholder',
  'large-straight.mp3': 'placeholder',
  'bonus-charge.mp3': 'placeholder',
  'bonus-explosion.mp3': 'placeholder',
  'yams-suspense.mp3': 'placeholder',
  'yams-explosion.mp3': 'placeholder',
  'cross-out.mp3': 'placeholder',
  'new-record.mp3': 'placeholder',
};

/**
 * Précharge un son (placeholder)
 */
export const preloadSound = async (filename: string): Promise<void> => {
  console.log(`🔊 [Sound] Preload: ${filename}`);
  soundCache[filename] = { loaded: true };
};

/**
 * Joue un son avec configuration (placeholder)
 */
export const playSound = async (config: SoundConfig): Promise<void> => {
  try {
    console.log(`🔊 [Sound] Play: ${config.file} (volume: ${config.volume})`);

    // TODO: Implémenter avec react-native-sound quand les fichiers seront disponibles
    // Exemple d'implémentation future:
    //
    // import Sound from 'react-native-sound';
    // Sound.setCategory('Playback');
    //
    // const sound = new Sound(config.file, Sound.MAIN_BUNDLE, (error) => {
    //   if (error) {
    //     console.error('Erreur chargement son:', error);
    //     return;
    //   }
    //   sound.setVolume(config.volume);
    //   sound.play();
    // });
  } catch (error) {
    console.error('Erreur playSound:', error);
  }
};

/**
 * Arrête tous les sons
 */
export const stopAllSounds = (): void => {
  console.log('🔊 [Sound] Stop all');
};

/**
 * Libère la mémoire des sons
 */
export const releaseAllSounds = (): void => {
  console.log('🔊 [Sound] Release all');
  Object.keys(soundCache).forEach((key) => {
    delete soundCache[key];
  });
};

/**
 * Précharge tous les sons au démarrage
 */
export const preloadAllSounds = async (): Promise<void> => {
  const soundFiles = Object.keys(SOUNDS);
  console.log(`🔊 [Sound] Préchargement de ${soundFiles.length} sons...`);

  await Promise.all(soundFiles.map((file) => preloadSound(file)));

  console.log(`✅ [Sound] ${soundFiles.length} sons préchargés (placeholder)`);
};
