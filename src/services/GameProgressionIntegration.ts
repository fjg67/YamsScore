import { ProgressionService } from './ProgressionService';
import { QuestService } from './QuestService';
import { CategoryType } from '../types/game';

/**
 * Service pour intégrer le système de progression dans le gameplay
 */
export class GameProgressionIntegration {
  private static service = ProgressionService.getInstance();

  /**
   * Appelé quand une partie se termine
   */
  static async onGameEnd(params: {
    won: boolean;
    score: number;
    isAI: boolean;
    aiDifficulty?: 'easy' | 'normal' | 'hard';
    isPerfectGame: boolean;
    yamsCount: number;
    bonusAchieved: boolean;
  }): Promise<{
    levelUp: boolean;
    newLevel?: number;
    xpGained: number;
    achievementsUnlocked: string[];
  }> {
    const { won, score, isAI, aiDifficulty, isPerfectGame, yamsCount, bonusAchieved } = params;

    const achievementsUnlocked: string[] = [];
    let totalXP = 0;

    // XP pour avoir terminé la partie
    const completeResult = await this.service.addXP('game_complete');
    totalXP += completeResult.xpGained;

    // XP si victoire
    let levelUp = false;
    let newLevel: number | undefined;

    if (won) {
      const winResult = await this.service.addXP('game_win');
      totalXP += winResult.xpGained;

      if (winResult.leveledUp) {
        levelUp = true;
        newLevel = winResult.newLevel;
      }

      // XP supplémentaire si victoire contre IA
      if (isAI && aiDifficulty) {
        const aiAction = `ai_defeated_${aiDifficulty}` as any;
        const aiResult = await this.service.addXP(aiAction);
        totalXP += aiResult.xpGained;
      }
    }

    // XP pour partie parfaite
    if (isPerfectGame) {
      const perfectResult = await this.service.addXP('perfect_game');
      totalXP += perfectResult.xpGained;

      const achievement = await this.service.updateAchievementProgress('perfect_game', 1);
      if (achievement.unlocked) {
        achievementsUnlocked.push('perfect_game');
      }
    }

    // XP pour bonus
    if (bonusAchieved) {
      await this.service.addXP('bonus_achieved');
    }

    // Update stats
    await this.service.incrementStat('gamesPlayed', 1);
    if (won) {
      await this.service.incrementStat('gamesWon', 1);
    }
    await this.service.incrementStat('yamsScored', yamsCount);
    if (score > (await this.service.getProfile()).stats.highestScore) {
      await this.service.updateStats({ highestScore: score });
    }

    // Achievements de victoires
    if (won) {
      await this.service.updateAchievementProgress('first_win', 1);
      await this.service.updateAchievementProgress('win_10', 1);
      await this.service.updateAchievementProgress('win_50', 1);
      await this.service.updateAchievementProgress('win_100', 1);
      await this.service.updateAchievementProgress('win_250', 1);
      await this.service.updateAchievementProgress('win_500', 1);
    }

    // Achievements de parties jouées
    await this.service.updateAchievementProgress('play_100', 1);
    await this.service.updateAchievementProgress('play_500', 1);
    await this.service.updateAchievementProgress('play_1000', 1);

    // Achievements de score
    if (score >= 200) {
      await this.service.updateAchievementProgress('score_200', score);
    }
    if (score >= 250) {
      await this.service.updateAchievementProgress('score_250', score);
    }
    if (score >= 300) {
      await this.service.updateAchievementProgress('score_300', score);
    }
    if (score >= 350) {
      await this.service.updateAchievementProgress('score_350', score);
    }

    // Mettre à jour les quêtes
    await this.updateQuests('play', 1);
    if (won) {
      await this.updateQuests('win', 1);
    }
    await this.updateQuests('score', score);

    return {
      levelUp,
      newLevel,
      xpGained: totalXP,
      achievementsUnlocked,
    };
  }

  /**
   * Appelé quand une combinaison est réalisée
   */
  static async onCombinationScored(category: CategoryType, score: number): Promise<void> {
    // XP pour les combinaisons spéciales
    switch (category) {
      case 'yams':
        await this.service.addXP('yams_scored');
        await this.service.updateAchievementProgress('first_yams', 1);
        await this.service.updateAchievementProgress('yams_10', 1);
        await this.service.updateAchievementProgress('yams_50', 1);
        await this.service.updateAchievementProgress('yams_100', 1);
        await this.updateQuests('yams', 1);
        break;

      case 'fullHouse':
        await this.service.addXP('full_scored');
        await this.service.updateAchievementProgress('full_master', 1);
        break;

      case 'largeStraight':
        await this.service.addXP('grand_scored');
        await this.service.updateAchievementProgress('grande_suite_master', 1);
        await this.service.updateAchievementProgress('suite_master', 1);
        break;

      case 'smallStraight':
        await this.service.addXP('suite_scored');
        await this.service.updateAchievementProgress('suite_master', 1);
        break;

      case 'fourOfKind':
        await this.service.addXP('carre_scored');
        await this.service.updateAchievementProgress('carre_master', 1);
        break;

      case 'threeOfKind':
        await this.service.addXP('brelan_scored');
        await this.service.updateAchievementProgress('brelan_master', 1);
        break;
    }
  }

  /**
   * Appelé quand le bonus est obtenu
   */
  static async onBonusAchieved(): Promise<void> {
    await this.service.addXP('bonus_achieved');
    await this.service.updateAchievementProgress('bonus_master', 1);
  }

  /**
   * Mettre à jour les quêtes
   */
  private static async updateQuests(
    type: 'win' | 'play' | 'yams' | 'score' | 'defeat_ai',
    value: number
  ): Promise<void> {
    const profile = await this.service.getProfile();

    // Update daily quests
    for (let quest of profile.dailyQuests) {
      for (let objective of quest.objectives) {
        if (
          (type === 'win' && objective.type === 'win_games') ||
          (type === 'play' && objective.type === 'play_streak') ||
          (type === 'yams' && objective.type === 'get_yams') ||
          (type === 'score' && objective.type === 'score_points') ||
          (type === 'defeat_ai' && objective.type === 'defeat_ai')
        ) {
          quest = QuestService.updateQuestProgress(quest, objective.id, value);
        }
      }
    }

    // Update weekly quests
    for (let quest of profile.weeklyQuests) {
      for (let objective of quest.objectives) {
        if (
          (type === 'win' && objective.type === 'win_games') ||
          (type === 'play' && objective.type === 'play_streak') ||
          (type === 'yams' && objective.type === 'get_yams') ||
          (type === 'score' && objective.type === 'score_points') ||
          (type === 'defeat_ai' && objective.type === 'defeat_ai')
        ) {
          quest = QuestService.updateQuestProgress(quest, objective.id, value);
        }
      }
    }

    // Update monthly quest
    if (profile.monthlyQuest) {
      for (let objective of profile.monthlyQuest.objectives) {
        if (
          (type === 'win' && objective.type === 'win_games') ||
          (type === 'play' && objective.type === 'play_streak') ||
          (type === 'yams' && objective.type === 'get_yams') ||
          (type === 'score' && objective.type === 'score_points') ||
          (type === 'defeat_ai' && objective.type === 'defeat_ai')
        ) {
          profile.monthlyQuest = QuestService.updateQuestProgress(
            profile.monthlyQuest,
            objective.id,
            value
          );
        }
      }
    }

    await this.service.saveProfile(profile);
  }

  /**
   * Obtenir les infos de progression du joueur
   */
  static async getPlayerProgression() {
    return await this.service.getProfile();
  }
}
