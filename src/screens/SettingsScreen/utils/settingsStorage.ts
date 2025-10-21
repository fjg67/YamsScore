/**
 * Settings Storage Manager - AsyncStorage Persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../../../store/store';
import { loadSettings } from '../../../store/slices/settingsSlice';

const SETTINGS_STORAGE_KEY = '@yams_settings';

/**
 * Sauvegarde les settings dans AsyncStorage
 */
export const saveSettings = async (): Promise<void> => {
  try {
    const state = store.getState();
    const settings = state.settings;

    // Serialiser en JSON
    const settingsJson = JSON.stringify(settings);

    // Sauvegarder dans AsyncStorage
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, settingsJson);

    console.log('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

/**
 * Charge les settings depuis AsyncStorage
 */
export const loadSettingsFromStorage = async (): Promise<void> => {
  try {
    // Récupérer depuis AsyncStorage
    const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

    if (settingsJson !== null) {
      // Parser le JSON
      const settings = JSON.parse(settingsJson);

      // Charger dans Redux
      store.dispatch(loadSettings(settings));

      console.log('Settings loaded successfully');
    } else {
      console.log('No saved settings found, using defaults');
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
};

/**
 * Réinitialise tous les settings (supprime le storage)
 */
export const clearSettings = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
    console.log('Settings cleared successfully');
  } catch (error) {
    console.error('Error clearing settings:', error);
  }
};

/**
 * Hook pour initialiser le storage au démarrage de l'app
 */
export const initializeSettingsStorage = async (): Promise<void> => {
  // Charger les settings au démarrage
  await loadSettingsFromStorage();

  // S'abonner aux changements pour auto-save
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  store.subscribe(() => {
    // Debounce: sauvegarder 500ms après le dernier changement
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
      saveSettings();
    }, 500);
  });
};

/**
 * Export manuel des settings (pour partage ou backup)
 */
export const exportSettings = (): string => {
  const state = store.getState();
  return JSON.stringify(state.settings, null, 2);
};

/**
 * Import manuel des settings (depuis backup)
 */
export const importSettings = async (settingsJson: string): Promise<boolean> => {
  try {
    const settings = JSON.parse(settingsJson);

    // Valider la structure (basique)
    if (typeof settings !== 'object') {
      throw new Error('Invalid settings format');
    }

    // Charger dans Redux
    store.dispatch(loadSettings(settings));

    // Sauvegarder
    await saveSettings();

    return true;
  } catch (error) {
    console.error('Error importing settings:', error);
    return false;
  }
};
