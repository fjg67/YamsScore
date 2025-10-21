/**
 * Utilitaires pour la persistance des données (AsyncStorage)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from '../types';

const STORAGE_KEYS = {
  GAMES: '@yams_games',
  CURRENT_GAME: '@yams_current_game',
  SETTINGS: '@yams_settings',
  PLAYER_STATS: '@yams_player_stats',
};

/**
 * Sauvegarde une partie
 */
export const saveGame = async (game: Game): Promise<void> => {
  try {
    // Convertir les dates en strings pour la sérialisation
    const gameToSave = {
      ...game,
      createdAt: game.createdAt.toISOString(),
      completedAt: game.completedAt?.toISOString(),
    };

    const jsonValue = JSON.stringify(gameToSave);
    await AsyncStorage.setItem(`${STORAGE_KEYS.GAMES}_${game.id}`, jsonValue);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la partie:', error);
    throw error;
  }
};

/**
 * Charge une partie par son ID
 */
export const loadGame = async (gameId: string): Promise<Game | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(
      `${STORAGE_KEYS.GAMES}_${gameId}`
    );

    if (jsonValue === null) {
      return null;
    }

    const game = JSON.parse(jsonValue);

    // Reconvertir les strings en dates
    return {
      ...game,
      createdAt: new Date(game.createdAt),
      completedAt: game.completedAt ? new Date(game.completedAt) : undefined,
    };
  } catch (error) {
    console.error('Erreur lors du chargement de la partie:', error);
    throw error;
  }
};

/**
 * Récupère toutes les parties sauvegardées
 */
export const loadAllGames = async (): Promise<Game[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const gameKeys = keys.filter((key) => key.startsWith(STORAGE_KEYS.GAMES));

    const games: Game[] = [];

    for (const key of gameKeys) {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue) {
        const game = JSON.parse(jsonValue);
        games.push({
          ...game,
          createdAt: new Date(game.createdAt),
          completedAt: game.completedAt ? new Date(game.completedAt) : undefined,
        });
      }
    }

    // Trier par date de création (plus récent en premier)
    return games.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error('Erreur lors du chargement des parties:', error);
    throw error;
  }
};

/**
 * Supprime une partie
 */
export const deleteGame = async (gameId: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEYS.GAMES}_${gameId}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de la partie:', error);
    throw error;
  }
};

/**
 * Sauvegarde la partie en cours
 */
export const saveCurrentGame = async (gameId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_GAME, gameId);
  } catch (error) {
    console.error(
      'Erreur lors de la sauvegarde de la partie en cours:',
      error
    );
    throw error;
  }
};

/**
 * Récupère l'ID de la partie en cours
 */
export const loadCurrentGameId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
  } catch (error) {
    console.error(
      'Erreur lors du chargement de la partie en cours:',
      error
    );
    throw error;
  }
};

/**
 * Supprime la référence à la partie en cours
 */
export const clearCurrentGame = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
  } catch (error) {
    console.error(
      'Erreur lors de la suppression de la partie en cours:',
      error
    );
    throw error;
  }
};

/**
 * Sauvegarde les paramètres de l'application
 */
export const saveSettings = async (settings: {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error);
    throw error;
  }
};

/**
 * Charge les paramètres de l'application
 */
export const loadSettings = async (): Promise<{
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
} | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
    throw error;
  }
};

/**
 * Efface toutes les données de l'application
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    throw error;
  }
};
