/**
 * Achievement System - Système de succès
 * Gamification pour encourager l'engagement
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = '@yams_achievements';

export enum AchievementId {
  FIRST_GAME = 'first_game',
  STREAK_3 = 'streak_3',
  STREAK_7 = 'streak_7',
  STREAK_30 = 'streak_30',
  GAMES_10 = 'games_10',
  GAMES_50 = 'games_50',
  GAMES_100 = 'games_100',
  PERFECT_SCORE = 'perfect_score',
  YAMS_MASTER = 'yams_master',
  SOCIAL_BUTTERFLY = 'social_butterfly',
  EXPLORER = 'explorer',
}

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string; // ISO date
  progress?: number; // 0-100
  maxProgress?: number;
}

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: AchievementId.FIRST_GAME,
    title: 'Premier Pas',
    description: 'Jouer votre première partie',
    emoji: '🎯',
  },
  {
    id: AchievementId.STREAK_3,
    title: 'Habitude',
    description: '3 jours consécutifs',
    emoji: '🔥',
    maxProgress: 3,
  },
  {
    id: AchievementId.STREAK_7,
    title: 'Dévotion',
    description: '7 jours consécutifs',
    emoji: '⚡',
    maxProgress: 7,
  },
  {
    id: AchievementId.STREAK_30,
    title: 'Légende',
    description: '30 jours consécutifs',
    emoji: '👑',
    maxProgress: 30,
  },
  {
    id: AchievementId.GAMES_10,
    title: 'Novice',
    description: 'Jouer 10 parties',
    emoji: '🎲',
    maxProgress: 10,
  },
  {
    id: AchievementId.GAMES_50,
    title: 'Vétéran',
    description: 'Jouer 50 parties',
    emoji: '🎖️',
    maxProgress: 50,
  },
  {
    id: AchievementId.GAMES_100,
    title: 'Maître',
    description: 'Jouer 100 parties',
    emoji: '🏆',
    maxProgress: 100,
  },
  {
    id: AchievementId.PERFECT_SCORE,
    title: 'Perfection',
    description: 'Obtenir un score parfait',
    emoji: '💎',
  },
  {
    id: AchievementId.YAMS_MASTER,
    title: 'Maître Yams',
    description: 'Réaliser 5 Yams',
    emoji: '🌟',
    maxProgress: 5,
  },
  {
    id: AchievementId.SOCIAL_BUTTERFLY,
    title: 'Papillon Social',
    description: 'Partager 3 parties',
    emoji: '🦋',
    maxProgress: 3,
  },
  {
    id: AchievementId.EXPLORER,
    title: 'Explorateur',
    description: 'Découvrir toutes les sections',
    emoji: '🗺️',
  },
];

class AchievementManager {
  private static instance: AchievementManager;
  private achievements: Achievement[] = [];

  private constructor() {
    this.initializeAchievements();
  }

  static getInstance(): AchievementManager {
    if (!AchievementManager.instance) {
      AchievementManager.instance = new AchievementManager();
    }
    return AchievementManager.instance;
  }

  /**
   * Initialise les achievements
   */
  private async initializeAchievements(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);

      if (stored) {
        this.achievements = JSON.parse(stored);
      } else {
        this.achievements = ACHIEVEMENT_DEFINITIONS.map(def => ({
          ...def,
          unlocked: false,
          progress: 0,
        }));
        await this.saveAchievements();
      }
    } catch (error) {
      console.error('Error initializing achievements:', error);
      this.achievements = ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        unlocked: false,
        progress: 0,
      }));
    }
  }

  /**
   * Sauvegarde les achievements
   */
  private async saveAchievements(): Promise<void> {
    try {
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(this.achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  /**
   * Récupère tous les achievements
   */
  async getAchievements(): Promise<Achievement[]> {
    if (this.achievements.length === 0) {
      await this.initializeAchievements();
    }
    return this.achievements;
  }

  /**
   * Débloque un achievement
   */
  async unlock(id: AchievementId): Promise<Achievement | null> {
    const achievement = this.achievements.find(a => a.id === id);

    if (!achievement) {
      return null;
    }

    if (achievement.unlocked) {
      return null; // Déjà débloqué
    }

    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();
    achievement.progress = achievement.maxProgress || 100;

    await this.saveAchievements();

    return achievement;
  }

  /**
   * Met à jour la progression d'un achievement
   */
  async updateProgress(id: AchievementId, progress: number): Promise<Achievement | null> {
    const achievement = this.achievements.find(a => a.id === id);

    if (!achievement || achievement.unlocked) {
      return null;
    }

    achievement.progress = progress;

    // Auto-unlock si la progression atteint le max
    if (achievement.maxProgress && progress >= achievement.maxProgress) {
      return await this.unlock(id);
    }

    await this.saveAchievements();
    return achievement;
  }

  /**
   * Récupère les achievements débloqués
   */
  async getUnlockedAchievements(): Promise<Achievement[]> {
    const all = await this.getAchievements();
    return all.filter(a => a.unlocked);
  }

  /**
   * Récupère le pourcentage de complétion
   */
  async getCompletionPercentage(): Promise<number> {
    const all = await this.getAchievements();
    const unlocked = all.filter(a => a.unlocked).length;
    return Math.round((unlocked / all.length) * 100);
  }

  /**
   * Vérifie les achievements liés au streak
   */
  async checkStreakAchievements(streak: number): Promise<Achievement[]> {
    const unlocked: Achievement[] = [];

    if (streak >= 3) {
      const achievement = await this.unlock(AchievementId.STREAK_3);
      if (achievement) {
        unlocked.push(achievement);
      }
    }

    if (streak >= 7) {
      const achievement = await this.unlock(AchievementId.STREAK_7);
      if (achievement) {
        unlocked.push(achievement);
      }
    }

    if (streak >= 30) {
      const achievement = await this.unlock(AchievementId.STREAK_30);
      if (achievement) {
        unlocked.push(achievement);
      }
    }

    return unlocked;
  }

  /**
   * Réinitialise tous les achievements (pour testing)
   */
  async reset(): Promise<void> {
    this.achievements = ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      unlocked: false,
      progress: 0,
    }));
    await this.saveAchievements();
  }
}

export const achievements = AchievementManager.getInstance();
