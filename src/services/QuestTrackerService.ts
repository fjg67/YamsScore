import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quest } from '../types/progression';
import { QuestService } from './QuestService';

export type GameAction =
  | { type: 'GAME_PLAYED'; playerCount: number; hasAI: boolean }
  | { type: 'GAME_WON'; score: number; againstAI: boolean }
  | { type: 'YAMS_SCORED'; count: number }
  | { type: 'SCORE_ACHIEVED'; score: number }
  | { type: 'AI_DEFEATED' };

export class QuestTrackerService {
  private static QUESTS_KEY = '@yams_active_quests';
  private static QUEST_PROGRESS_KEY = '@yams_quest_progress';

  // Récupère toutes les quêtes actives
  static async getActiveQuests(): Promise<{
    daily: Quest[];
    weekly: Quest[];
    monthly: Quest | null;
  }> {
    try {
      const questsJson = await AsyncStorage.getItem(this.QUESTS_KEY);
      if (questsJson) {
        return JSON.parse(questsJson);
      }

      // Initialiser les quêtes si aucune n'existe
      return await this.initializeQuests();
    } catch (error) {
      console.error('Error getting active quests:', error);
      return { daily: [], weekly: [], monthly: null };
    }
  }

  // Initialise les quêtes (première fois ou renouvellement)
  static async initializeQuests(): Promise<{
    daily: Quest[];
    weekly: Quest[];
    monthly: Quest | null;
  }> {
    const daily = QuestService.generateDailyQuests();
    const weekly = QuestService.generateWeeklyQuests();
    const monthly = QuestService.generateMonthlyQuest();

    const quests = { daily, weekly, monthly };
    await AsyncStorage.setItem(this.QUESTS_KEY, JSON.stringify(quests));
    return quests;
  }

  // Vérifie et renouvelle les quêtes expirées
  static async checkAndRefreshQuests(): Promise<void> {
    const quests = await this.getActiveQuests();
    let needsUpdate = false;

    // Vérifier les quêtes quotidiennes
    if (QuestService.shouldRefreshQuests(quests.daily, 'daily')) {
      quests.daily = QuestService.generateDailyQuests();
      needsUpdate = true;
    }

    // Vérifier les quêtes hebdomadaires
    if (QuestService.shouldRefreshQuests(quests.weekly, 'weekly')) {
      quests.weekly = QuestService.generateWeeklyQuests();
      needsUpdate = true;
    }

    // Vérifier la quête mensuelle
    if (quests.monthly && QuestService.shouldRefreshQuests([quests.monthly], 'monthly')) {
      quests.monthly = QuestService.generateMonthlyQuest();
      needsUpdate = true;
    }

    if (needsUpdate) {
      await AsyncStorage.setItem(this.QUESTS_KEY, JSON.stringify(quests));
    }
  }

  // Track une action de jeu et met à jour les quêtes correspondantes
  static async trackGameAction(action: GameAction): Promise<{
    updatedQuests: Quest[];
    completedQuests: Quest[];
  }> {
    await this.checkAndRefreshQuests();
    const quests = await this.getActiveQuests();
    const allQuests = [...quests.daily, ...quests.weekly];
    if (quests.monthly) allQuests.push(quests.monthly);

    const completedQuests: Quest[] = [];
    const updatedQuests: Quest[] = [];

    // Parcourir toutes les quêtes et mettre à jour celles qui correspondent
    for (const quest of allQuests) {
      if (quest.completed && quest.claimed) continue; // Skip déjà complétées et réclamées

      let questUpdated = false;

      for (const objective of quest.objectives) {
        if (objective.completed) continue;

        let shouldUpdate = false;
        let progressToAdd = 0;

        // Vérifier si l'action correspond à l'objectif
        switch (action.type) {
          case 'GAME_PLAYED':
            if (objective.type === 'play_streak') {
              shouldUpdate = true;
              progressToAdd = 1;
            }
            break;

          case 'GAME_WON':
            if (objective.type === 'win_games') {
              shouldUpdate = true;
              progressToAdd = 1;
            }
            break;

          case 'YAMS_SCORED':
            if (objective.type === 'get_yams') {
              shouldUpdate = true;
              progressToAdd = action.count;
            }
            break;

          case 'SCORE_ACHIEVED':
            if (objective.type === 'score_points') {
              // Pour les objectifs de score unique (max score)
              if (objective.description.includes('Atteignez') ||
                  objective.description.includes('300+') ||
                  objective.description.includes('375')) {
                // Remplacer le current par le score si c'est plus élevé
                if (action.score > objective.current) {
                  const updatedObjective = {
                    ...objective,
                    current: action.score,
                    completed: action.score >= objective.target,
                  };
                  quest.objectives = quest.objectives.map(obj =>
                    obj.id === objective.id ? updatedObjective : obj
                  );
                  questUpdated = true;
                }
              }
              // Pour les objectifs de score cumulé
              else if (objective.description.includes('Cumulez')) {
                shouldUpdate = true;
                progressToAdd = action.score;
              }
            }
            break;

          case 'AI_DEFEATED':
            if (objective.type === 'defeat_ai') {
              shouldUpdate = true;
              progressToAdd = 1;
            }
            break;
        }

        if (shouldUpdate && progressToAdd > 0) {
          const updatedObjective = {
            ...objective,
            current: Math.min(objective.current + progressToAdd, objective.target),
            completed: objective.current + progressToAdd >= objective.target,
          };
          quest.objectives = quest.objectives.map(obj =>
            obj.id === objective.id ? updatedObjective : obj
          );
          questUpdated = true;
        }
      }

      if (questUpdated) {
        // Vérifier si toutes les objectifs sont complétés
        const allObjectivesComplete = quest.objectives.every(obj => obj.completed);
        if (allObjectivesComplete && !quest.completed) {
          quest.completed = true;
          completedQuests.push(quest);
        }
        updatedQuests.push(quest);
      }
    }

    // Sauvegarder les quêtes mises à jour
    if (updatedQuests.length > 0) {
      const newQuests = {
        daily: quests.daily.map(q =>
          updatedQuests.find(uq => uq.id === q.id) || q
        ),
        weekly: quests.weekly.map(q =>
          updatedQuests.find(uq => uq.id === q.id) || q
        ),
        monthly: quests.monthly && updatedQuests.find(uq => uq.id === quests.monthly?.id)
          ? updatedQuests.find(uq => uq.id === quests.monthly?.id)!
          : quests.monthly,
      };
      await AsyncStorage.setItem(this.QUESTS_KEY, JSON.stringify(newQuests));
    }

    return { updatedQuests, completedQuests };
  }

  // Marquer une quête comme réclamée et donner les récompenses
  static async claimQuestRewards(questId: string): Promise<Quest | null> {
    const quests = await this.getActiveQuests();
    const allQuests = [...quests.daily, ...quests.weekly];
    if (quests.monthly) allQuests.push(quests.monthly);

    const quest = allQuests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) {
      return null;
    }

    // Marquer comme réclamée
    quest.claimed = true;

    // Sauvegarder
    const newQuests = {
      daily: quests.daily.map(q => q.id === questId ? quest : q),
      weekly: quests.weekly.map(q => q.id === questId ? quest : q),
      monthly: quests.monthly?.id === questId ? quest : quests.monthly,
    };
    await AsyncStorage.setItem(this.QUESTS_KEY, JSON.stringify(newQuests));

    return quest;
  }

  // Helper pour tracker la fin d'une partie
  static async trackGameEnd(gameData: {
    playerScore: number;
    isWinner: boolean;
    hasYams: number;
    hadAI: boolean;
    defeatedAI: boolean;
  }): Promise<{ completedQuests: Quest[] }> {
    const actions: GameAction[] = [
      { type: 'GAME_PLAYED', playerCount: 1, hasAI: gameData.hadAI }
    ];

    if (gameData.isWinner) {
      actions.push({
        type: 'GAME_WON',
        score: gameData.playerScore,
        againstAI: gameData.hadAI
      });
    }

    if (gameData.hasYams > 0) {
      actions.push({ type: 'YAMS_SCORED', count: gameData.hasYams });
    }

    actions.push({ type: 'SCORE_ACHIEVED', score: gameData.playerScore });

    if (gameData.defeatedAI) {
      actions.push({ type: 'AI_DEFEATED' });
    }

    const allCompletedQuests: Quest[] = [];

    // Tracker toutes les actions
    for (const action of actions) {
      const { completedQuests } = await this.trackGameAction(action);
      completedQuests.forEach(quest => {
        if (!allCompletedQuests.find(q => q.id === quest.id)) {
          allCompletedQuests.push(quest);
        }
      });
    }

    return { completedQuests: allCompletedQuests };
  }
}
