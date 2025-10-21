import AsyncStorage from '@react-native-async-storage/async-storage';
import {haptics} from '../../../utils/haptics';

interface DeletionProgress {
  step: string;
  progress: number;
}

export const deleteAllUserData = async (
  onProgress?: (progress: DeletionProgress) => void,
): Promise<void> => {
  try {
    const steps = [
      {key: 'games', label: 'Suppression historique...'},
      {key: 'settings', label: 'Suppression préférences...'},
      {key: 'achievements', label: 'Suppression achievements...'},
      {key: 'stats', label: 'Nettoyage cache...'},
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      onProgress?.({
        step: step.label,
        progress: (i / steps.length) * 100,
      });

      await AsyncStorage.removeItem(step.key);

      // Petit délai pour l'UX
      await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
    }

    onProgress?.({
      step: 'Terminé !',
      progress: 100,
    });

    haptics.success();
  } catch (error) {
    console.error('Error deleting user data:', error);
    haptics.error();
    throw error;
  }
};

export const deleteSpecificData = async (dataType: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(dataType);
    haptics.light();
  } catch (error) {
    console.error(`Error deleting ${dataType}:`, error);
    haptics.error();
    throw error;
  }
};

export const getStorageSize = async (): Promise<{
  total: number;
  breakdown: {[key: string]: number};
}> => {
  try {
    const keys = ['games', 'settings', 'achievements', 'stats'];
    const breakdown: {[key: string]: number} = {};
    let total = 0;

    for (const key of keys) {
      const data = await AsyncStorage.getItem(key);
      const size = data ? new Blob([data]).size : 0;
      breakdown[key] = size;
      total += size;
    }

    return {total, breakdown};
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return {total: 0, breakdown: {}};
  }
};
