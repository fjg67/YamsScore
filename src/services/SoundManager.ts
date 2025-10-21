/**
 * Gestionnaire centralisé des sons
 * Note: Pour l'instant, utilise Vibration comme fallback
 * TODO: Intégrer react-native-sound ou expo-av pour vrais sons
 */

import { Vibration, Platform } from 'react-native';

class SoundManagerClass {
  private soundEnabled: boolean = true;
  private volume: number = 1.0;

  // TODO: Load actual sound files
  // private sounds: Map<string, Sound> = new Map();

  setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  async play(soundKey: string) {
    if (!this.soundEnabled) return;

    // TODO: Implement with react-native-sound
    // For now, use vibration as feedback
    if (Platform.OS === 'ios') {
      this.playVibrationPattern(soundKey);
    }
  }

  private playVibrationPattern(soundKey: string) {
    // Different patterns for different sounds
    const patterns: Record<string, number[]> = {
      yams_fanfare: [0, 100, 50, 100, 50, 200],
      rocket_launch: [0, 50, 30, 50, 30, 100],
      house_build: [0, 80, 40, 80],
      bonus_unlock: [0, 100, 50, 100],
      perfect: [0, 50, 30, 50, 30, 50],
      comeback: [0, 100, 80, 100, 80, 100],
      lead_change: [0, 80, 50, 80],
      first_score: [0, 30],
      tension: [0, 50, 50, 50],
      perfect_game: [0, 100, 50, 100, 50, 100, 50, 200],
      domination: [0, 100, 100, 100],
      legendary: [0, 150, 80, 150],
      tap: [0, 10],
      score_entry: [0, 20],
    };

    const pattern = patterns[soundKey] || [0, 50];
    Vibration.vibrate(pattern);
  }

  stop() {
    Vibration.cancel();
  }

  // Preload sounds (for future implementation)
  async preload(soundKeys: string[]) {
    // TODO: Implement sound preloading
    console.log('Preloading sounds:', soundKeys);
  }

  // Release resources
  release() {
    this.stop();
    // TODO: Release loaded sounds
  }
}

export const SoundManager = new SoundManagerClass();
