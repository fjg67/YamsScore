import {
  PlayerLevel,
  PlayerProfile,
  XPAction,
  XPMultiplier,
  XP_CONFIG,
  calculateXPForLevel,
  AchievementProgress,
  PlayerPrestige,
  PRESTIGE_LEVELS,
} from '../types/progression';
import { ACHIEVEMENTS } from '../data/achievements';
import { BADGES } from '../data/badges';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@yams_player_profile';

export class ProgressionService {
  private static instance: ProgressionService;
  private profile: PlayerProfile | null = null;

  private constructor() {}

  static getInstance(): ProgressionService {
    if (!ProgressionService.instance) {
      ProgressionService.instance = new ProgressionService();
    }
    return ProgressionService.instance;
  }

  // ========== XP SYSTEM ==========

  /**
   * Ajoute de l'XP au joueur avec tous les multiplicateurs actifs
   */
  async addXP(action: XPAction, customAmount?: number): Promise<{
    xpGained: number;
    leveledUp: boolean;
    newLevel?: number;
    totalXP: number;
  }> {
    const profile = await this.getProfile();

    // Trouver le montant XP de base
    const xpConfig = XP_CONFIG.find((c) => c.action === action);
    const baseXP = customAmount || xpConfig?.baseXP || 0;

    // Appliquer tous les multiplicateurs
    const totalMultiplier = this.calculateTotalMultiplier(profile.activeMultipliers);
    const finalXP = Math.floor(baseXP * totalMultiplier);

    // Mettre à jour le profil
    const oldLevel = profile.level.level;
    const newTotalXP = profile.level.totalXP + finalXP;
    const newCurrentXP = profile.level.currentXP + finalXP;

    // Calculer le nouveau niveau
    let currentLevel = profile.level.level;
    let remainingXP = newCurrentXP;
    let leveledUp = false;
    let levelsGained = 0;

    while (remainingXP >= calculateXPForLevel(currentLevel)) {
      remainingXP -= calculateXPForLevel(currentLevel);
      currentLevel++;
      leveledUp = true;
      levelsGained++;
    }

    profile.level = {
      level: currentLevel,
      currentXP: remainingXP,
      xpToNextLevel: calculateXPForLevel(currentLevel),
      totalXP: newTotalXP,
      prestige: profile.prestige.currentPrestige,
    };

    // Vérifier si le joueur peut maintenant prestige
    if (currentLevel >= 50) {
      profile.prestige.canPrestige = true;
      profile.prestige.nextPrestigeAt = 50;
    }

    await this.saveProfile(profile);

    return {
      xpGained: finalXP,
      leveledUp,
      newLevel: leveledUp ? currentLevel : undefined,
      totalXP: newTotalXP,
    };
  }

  /**
   * Calcule le multiplicateur total actif
   */
  private calculateTotalMultiplier(multipliers: XPMultiplier[]): number {
    const now = new Date();

    // Filtrer les multiplicateurs expirés
    const activeMultipliers = multipliers.filter((m) => {
      if (!m.expiresAt) return true; // Permanent
      return new Date(m.expiresAt) > now;
    });

    // Additionner tous les multiplicateurs
    // Formula: base(1.0) + sum(multipliers - 1.0)
    // Exemple: 1.0 + (1.5-1.0) + (1.2-1.0) = 1.0 + 0.5 + 0.2 = 1.7x
    return activeMultipliers.reduce((total, m) => {
      return total + (m.multiplier - 1.0);
    }, 1.0);
  }

  /**
   * Ajoute un multiplicateur XP temporaire ou permanent
   */
  async addXPMultiplier(multiplier: XPMultiplier): Promise<void> {
    const profile = await this.getProfile();

    // Vérifier si ce multiplicateur existe déjà
    const existingIndex = profile.activeMultipliers.findIndex((m) => m.id === multiplier.id);

    if (existingIndex >= 0) {
      // Remplacer l'ancien
      profile.activeMultipliers[existingIndex] = multiplier;
    } else {
      // Ajouter nouveau
      profile.activeMultipliers.push(multiplier);
    }

    await this.saveProfile(profile);
  }

  /**
   * Nettoie les multiplicateurs expirés
   */
  async cleanExpiredMultipliers(): Promise<void> {
    const profile = await this.getProfile();
    const now = new Date();

    profile.activeMultipliers = profile.activeMultipliers.filter((m) => {
      if (!m.expiresAt) return true; // Permanent
      return new Date(m.expiresAt) > now;
    });

    await this.saveProfile(profile);
  }

  // ========== ACHIEVEMENT SYSTEM ==========

  /**
   * Met à jour la progression d'un achievement
   */
  async updateAchievementProgress(
    achievementId: string,
    progress: number
  ): Promise<{ unlocked: boolean; achievement?: AchievementProgress }> {
    const profile = await this.getProfile();

    const achievementDef = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievementDef) return { unlocked: false };

    let achievementProgress = profile.achievements.find((a) => a.achievementId === achievementId);

    if (!achievementProgress) {
      // Créer nouveau
      achievementProgress = {
        achievementId,
        current: 0,
        completed: false,
        claimedReward: false,
      };
      profile.achievements.push(achievementProgress);
    }

    // Déjà complété
    if (achievementProgress.completed) {
      return { unlocked: false, achievement: achievementProgress };
    }

    // Mettre à jour progression
    achievementProgress.current = Math.min(
      achievementProgress.current + progress,
      achievementDef.requirement.target
    );

    // Vérifier si débloqué
    const unlocked = achievementProgress.current >= achievementDef.requirement.target;

    if (unlocked && !achievementProgress.completed) {
      achievementProgress.completed = true;
      achievementProgress.completedAt = new Date();

      // Ajouter XP reward
      await this.addXP('achievement_unlocked', achievementDef.xpReward);

      // Ajouter récompenses
      if (achievementDef.rewards) {
        if (achievementDef.rewards.coins) {
          profile.coins += achievementDef.rewards.coins;
        }

        if (achievementDef.rewards.badge) {
          const badge = BADGES.find((b) => b.id === achievementDef.rewards!.badge);
          if (badge && !profile.unlockedBadges.find((b) => b.id === badge.id)) {
            profile.unlockedBadges.push({ ...badge, unlockedAt: new Date() });
          }
        }
      }

      // Incrémenter achievement points
      profile.achievementPoints += achievementDef.xpReward;
    }

    await this.saveProfile(profile);

    return { unlocked, achievement: achievementProgress };
  }

  /**
   * Récupère tous les achievements avec progression
   */
  async getAchievementsWithProgress(): Promise<
    Array<{
      definition: typeof ACHIEVEMENTS[0];
      progress: AchievementProgress;
    }>
  > {
    const profile = await this.getProfile();

    return ACHIEVEMENTS.map((def) => {
      const progress = profile.achievements.find((a) => a.achievementId === def.id) || {
        achievementId: def.id,
        current: 0,
        completed: false,
        claimedReward: false,
      };

      return { definition: def, progress };
    });
  }

  // ========== PRESTIGE SYSTEM ==========

  /**
   * Effectue un prestige (reset niveau, gain bonus permanent)
   */
  async performPrestige(): Promise<{ success: boolean; newPrestige: number }> {
    const profile = await this.getProfile();

    if (!profile.prestige.canPrestige || profile.level.level < 50) {
      return { success: false, newPrestige: profile.prestige.currentPrestige };
    }

    // Maximum prestige 10
    if (profile.prestige.currentPrestige >= 10) {
      return { success: false, newPrestige: 10 };
    }

    const newPrestigeLevel = profile.prestige.currentPrestige + 1;
    const prestigeData = PRESTIGE_LEVELS.find((p) => p.level === newPrestigeLevel);

    if (!prestigeData) {
      return { success: false, newPrestige: profile.prestige.currentPrestige };
    }

    // Reset niveau à 1, mais garde total XP
    const totalXPKept = profile.level.totalXP;

    profile.level = {
      level: 1,
      currentXP: 0,
      xpToNextLevel: calculateXPForLevel(1),
      totalXP: totalXPKept,
      prestige: newPrestigeLevel,
    };

    profile.prestige = {
      currentPrestige: newPrestigeLevel,
      totalPrestiges: profile.prestige.totalPrestiges + 1,
      canPrestige: false,
      nextPrestigeAt: 50,
    };

    // Ajouter le multiplicateur XP permanent de prestige
    await this.addXPMultiplier({
      id: `prestige_${newPrestigeLevel}`,
      name: prestigeData.name,
      multiplier: prestigeData.benefits.xpBoost,
      source: 'achievement',
    });

    // Débloquer badge de prestige
    const prestigeBadge = BADGES.find((b) => b.id === `prestige_${newPrestigeLevel}`);
    if (prestigeBadge && !profile.unlockedBadges.find((b) => b.id === prestigeBadge.id)) {
      profile.unlockedBadges.push({ ...prestigeBadge, unlockedAt: new Date() });
    }

    await this.saveProfile(profile);

    return { success: true, newPrestige: newPrestigeLevel };
  }

  /**
   * Récupère les infos du prestige actuel
   */
  getPrestigeInfo(prestige: number): typeof PRESTIGE_LEVELS[0] | null {
    return PRESTIGE_LEVELS.find((p) => p.level === prestige) || null;
  }

  // ========== COINS ==========

  async addCoins(amount: number): Promise<number> {
    const profile = await this.getProfile();
    profile.coins += amount;
    await this.saveProfile(profile);
    return profile.coins;
  }

  async spendCoins(amount: number): Promise<{ success: boolean; remaining: number }> {
    const profile = await this.getProfile();

    if (profile.coins < amount) {
      return { success: false, remaining: profile.coins };
    }

    profile.coins -= amount;
    await this.saveProfile(profile);
    return { success: true, remaining: profile.coins };
  }

  // ========== QUEST REWARDS ==========

  /**
   * Applique les récompenses d'une quête complétée
   */
  async applyQuestRewards(rewards: {
    xp: number;
    coins?: number;
    battlePassXP?: number;
    items?: string[];
  }): Promise<{
    xpResult: { xpGained: number; leveledUp: boolean; newLevel?: number };
    coinsGained: number;
  }> {
    // Ajouter XP
    const xpResult = await this.addXP('quest_complete', rewards.xp);

    // Ajouter coins
    let coinsGained = 0;
    if (rewards.coins) {
      await this.addCoins(rewards.coins);
      coinsGained = rewards.coins;
    }

    // TODO: Ajouter Battle Pass XP quand le système sera implémenté
    // TODO: Ajouter items quand le système d'inventaire sera implémenté

    return {
      xpResult,
      coinsGained,
    };
  }

  // ========== STATS ==========

  async updateStats(stats: Partial<PlayerProfile['stats']>): Promise<void> {
    const profile = await this.getProfile();

    profile.stats = {
      ...profile.stats,
      ...stats,
    };

    await this.saveProfile(profile);
  }

  async incrementStat(stat: keyof PlayerProfile['stats'], amount: number = 1): Promise<void> {
    const profile = await this.getProfile();
    (profile.stats[stat] as number) += amount;
    await this.saveProfile(profile);
  }

  // ========== PROFILE MANAGEMENT ==========

  /**
   * Récupère le profil du joueur (ou en crée un nouveau)
   */
  async getProfile(): Promise<PlayerProfile> {
    if (this.profile) return this.profile;

    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        this.profile = JSON.parse(stored);
        return this.profile!;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }

    // Créer nouveau profil
    this.profile = this.createDefaultProfile();
    await this.saveProfile(this.profile);
    return this.profile;
  }

  /**
   * Sauvegarde le profil
   */
  async saveProfile(profile: PlayerProfile): Promise<void> {
    this.profile = profile;
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  /**
   * Crée un profil par défaut
   */
  private createDefaultProfile(): PlayerProfile {
    return {
      userId: `player_${Date.now()}`,
      displayName: 'Joueur',
      level: {
        level: 1,
        currentXP: 0,
        xpToNextLevel: calculateXPForLevel(1),
        totalXP: 0,
        prestige: 0,
      },
      prestige: {
        currentPrestige: 0,
        totalPrestiges: 0,
        canPrestige: false,
        nextPrestigeAt: 50,
      },
      activeMultipliers: [],
      achievements: [],
      achievementPoints: 0,
      dailyQuests: [],
      weeklyQuests: [],
      questsCompleted: 0,
      unlockedBadges: [],
      battlePass: {
        season: 1,
        name: 'Saison 1',
        description: 'Première saison du Battle Pass',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
        currentTier: 0,
        currentXP: 0,
        maxTier: 50,
        isPremium: false,
        tiers: [],
      },
      equipped: {},
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        highestScore: 0,
        yamsScored: 0,
        perfectGames: 0,
      },
      coins: 0,
    };
  }

  /**
   * Reset le profil (pour debug)
   */
  async resetProfile(): Promise<void> {
    this.profile = this.createDefaultProfile();
    await this.saveProfile(this.profile);
  }
}
