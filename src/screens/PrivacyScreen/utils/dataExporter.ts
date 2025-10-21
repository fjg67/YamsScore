import AsyncStorage from '@react-native-async-storage/async-storage';
import {Share, Alert} from 'react-native';

interface ExportedData {
  exportDate: string;
  appVersion: string;
  data: {
    games: any[];
    preferences: any;
    achievements: any[];
    stats: any;
  };
}

export const exportUserData = async (): Promise<ExportedData> => {
  try {
    // Récupérer toutes les données de l'utilisateur
    const [games, preferences, achievements, stats] = await Promise.all([
      AsyncStorage.getItem('games').then(data => (data ? JSON.parse(data) : [])),
      AsyncStorage.getItem('settings').then(data => (data ? JSON.parse(data) : {})),
      AsyncStorage.getItem('achievements').then(data => (data ? JSON.parse(data) : [])),
      AsyncStorage.getItem('stats').then(data => (data ? JSON.parse(data) : {})),
    ]);

    const exportData: ExportedData = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      data: {
        games,
        preferences,
        achievements,
        stats,
      },
    };

    return exportData;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const shareUserData = async (): Promise<void> => {
  try {
    const data = await exportUserData();
    const jsonString = JSON.stringify(data, null, 2);

    // Utiliser le Share natif de React Native pour partager les données
    await Share.share({
      message: `Mes données Yams Score:\n\n${jsonString}`,
      title: 'Export de mes données Yams Score',
    });
  } catch (error) {
    if ((error as any).message !== 'User did not share') {
      console.error('Error sharing data:', error);
      throw error;
    }
  }
};

export const getDataSummary = async (): Promise<{
  gamesCount: number;
  achievementsCount: number;
  settingsCount: number;
  totalSize: string;
}> => {
  try {
    const data = await exportUserData();
    const jsonString = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);

    return {
      gamesCount: data.data.games.length,
      achievementsCount: data.data.achievements.length,
      settingsCount: Object.keys(data.data.preferences).length,
      totalSize: `${sizeInKB} KB`,
    };
  } catch (error) {
    console.error('Error getting data summary:', error);
    return {
      gamesCount: 0,
      achievementsCount: 0,
      settingsCount: 0,
      totalSize: '0 KB',
    };
  }
};
