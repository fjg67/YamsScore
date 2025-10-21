/**
 * Système de Streaks - Jours consécutifs d'utilisation
 * Encourage l'engagement quotidien
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@yams_streak';
const LAST_VISIT_KEY = '@yams_last_visit';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string; // ISO date
  totalDays: number;
}

class StreakManager {
  private static instance: StreakManager;

  private constructor() {}

  static getInstance(): StreakManager {
    if (!StreakManager.instance) {
      StreakManager.instance = new StreakManager();
    }
    return StreakManager.instance;
  }

  /**
   * Vérifie et met à jour le streak
   */
  async checkAndUpdateStreak(): Promise<StreakData> {
    try {
      const today = this.getDateString(new Date());
      const storedData = await AsyncStorage.getItem(STREAK_KEY);
      const lastVisit = await AsyncStorage.getItem(LAST_VISIT_KEY);

      let streakData: StreakData;

      if (!storedData) {
        // Premier jour
        streakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: today,
          totalDays: 1,
        };
      } else {
        streakData = JSON.parse(storedData);

        if (lastVisit === today) {
          // Déjà visité aujourd'hui, pas de changement
          return streakData;
        }

        const yesterday = this.getYesterdayString();

        if (lastVisit === yesterday) {
          // Streak continue !
          streakData.currentStreak += 1;
          streakData.totalDays += 1;
          streakData.lastVisit = today;

          if (streakData.currentStreak > streakData.longestStreak) {
            streakData.longestStreak = streakData.currentStreak;
          }
        } else {
          // Streak cassée 😢
          streakData.currentStreak = 1;
          streakData.totalDays += 1;
          streakData.lastVisit = today;
        }
      }

      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
      await AsyncStorage.setItem(LAST_VISIT_KEY, today);

      return streakData;
    } catch (error) {
      console.error('Error checking streak:', error);
      return {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: this.getDateString(new Date()),
        totalDays: 1,
      };
    }
  }

  /**
   * Récupère les données de streak actuelles
   */
  async getStreakData(): Promise<StreakData> {
    try {
      const storedData = await AsyncStorage.getItem(STREAK_KEY);
      if (!storedData) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastVisit: '',
          totalDays: 0,
        };
      }
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error getting streak:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        totalDays: 0,
      };
    }
  }

  /**
   * Réinitialise le streak (pour testing)
   */
  async resetStreak(): Promise<void> {
    await AsyncStorage.removeItem(STREAK_KEY);
    await AsyncStorage.removeItem(LAST_VISIT_KEY);
  }

  /**
   * Retourne une string de date YYYY-MM-DD
   */
  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Retourne la date d'hier
   */
  private getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.getDateString(yesterday);
  }

  /**
   * Obtient le message motivationnel selon le streak
   */
  getStreakMessage(streak: number): string {
    if (streak === 0) {
      return 'Commencez votre aventure !';
    }
    if (streak === 1) {
      return 'Bon début ! Revenez demain 🔥';
    }
    if (streak < 7) {
      return `${streak} jours ! Continuez comme ça 🚀`;
    }
    if (streak < 30) {
      return `${streak} jours de suite ! Incroyable 🌟`;
    }
    if (streak < 100) {
      return `${streak} jours ! Vous êtes légendaire 👑`;
    }
    return `${streak} jours ! MAÎTRE ABSOLU 🏆`;
  }

  /**
   * Obtient l'emoji selon le streak
   */
  getStreakEmoji(streak: number): string {
    if (streak === 0) return '🎯';
    if (streak < 3) return '🔥';
    if (streak < 7) return '⚡';
    if (streak < 30) return '🌟';
    if (streak < 100) return '👑';
    return '🏆';
  }
}

export const streaks = StreakManager.getInstance();
