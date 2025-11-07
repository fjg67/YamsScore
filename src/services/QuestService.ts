import { Quest, QuestObjective, QuestReward } from '../types/progression';

// Générateur de quêtes quotidiennes
export class QuestService {
  // Templates de quêtes quotidiennes (faciles)
  private static dailyQuestTemplates = [
    {
      name: 'Partie du Jour',
      description: 'Jouez {count} partie(s)',
      difficulty: 'easy' as const,
      objectives: (count: number) => [
        {
          id: 'daily_play',
          description: `Jouez ${count} partie(s)`,
          type: 'play_streak' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 150, coins: 100, battlePassXP: 50 },
    },
    {
      name: 'Victoires du Jour',
      description: 'Gagnez {count} partie(s)',
      difficulty: 'easy' as const,
      objectives: (count: number) => [
        {
          id: 'daily_wins',
          description: `Gagnez ${count} partie(s)`,
          type: 'win_games' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 200, coins: 150, battlePassXP: 75 },
    },
    {
      name: 'Maître du Score',
      description: 'Atteignez {points} points dans une partie',
      difficulty: 'medium' as const,
      objectives: (points: number) => [
        {
          id: 'daily_score',
          description: `Atteignez ${points} points`,
          type: 'score_points' as const,
          target: points,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 250, coins: 200, battlePassXP: 100 },
    },
    {
      name: 'Chasseur de Yams',
      description: 'Réalisez {count} Yams',
      difficulty: 'hard' as const,
      objectives: (count: number) => [
        {
          id: 'daily_yams',
          description: `Réalisez ${count} Yams`,
          type: 'get_yams' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 300, coins: 250, battlePassXP: 150 },
    },
    {
      name: 'Tueur d\'IA',
      description: 'Battez {count} IA',
      difficulty: 'medium' as const,
      objectives: (count: number) => [
        {
          id: 'daily_defeat_ai',
          description: `Battez ${count} IA`,
          type: 'defeat_ai' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 250, coins: 200, battlePassXP: 100 },
    },
  ];

  // Templates de quêtes hebdomadaires (plus difficiles)
  private static weeklyQuestTemplates = [
    {
      name: 'Marathon Hebdomadaire',
      description: 'Gagnez {count} parties cette semaine',
      difficulty: 'medium' as const,
      objectives: (count: number) => [
        {
          id: 'weekly_wins',
          description: `Gagnez ${count} parties`,
          type: 'win_games' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 500, coins: 500, battlePassXP: 250 },
    },
    {
      name: 'Maître des Yams',
      description: 'Réalisez {count} Yams cette semaine',
      difficulty: 'hard' as const,
      objectives: (count: number) => [
        {
          id: 'weekly_yams',
          description: `Réalisez ${count} Yams`,
          type: 'get_yams' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 750, coins: 750, battlePassXP: 400 },
    },
    {
      name: 'Score Cumulé',
      description: 'Cumulez {points} points cette semaine',
      difficulty: 'medium' as const,
      objectives: (points: number) => [
        {
          id: 'weekly_total_score',
          description: `Cumulez ${points} points`,
          type: 'score_points' as const,
          target: points,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 600, coins: 600, battlePassXP: 300 },
    },
    {
      name: 'Série Victorieuse',
      description: 'Gagnez {count} parties d\'affilée',
      difficulty: 'hard' as const,
      objectives: (count: number) => [
        {
          id: 'weekly_streak',
          description: `Gagnez ${count} parties d'affilée`,
          type: 'win_games' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 800, coins: 800, battlePassXP: 450 },
    },
    {
      name: 'Chasseur d\'IA',
      description: 'Battez {count} IA cette semaine',
      difficulty: 'medium' as const,
      objectives: (count: number) => [
        {
          id: 'weekly_defeat_ai',
          description: `Battez ${count} IA`,
          type: 'defeat_ai' as const,
          target: count,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 650, coins: 650, battlePassXP: 350 },
    },
    {
      name: 'Perfection Hebdomadaire',
      description: 'Atteignez 300+ points dans une partie',
      difficulty: 'epic' as const,
      objectives: () => [
        {
          id: 'weekly_high_score',
          description: 'Atteignez 300+ points',
          type: 'score_points' as const,
          target: 300,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 1000, coins: 1000, battlePassXP: 500 },
    },
  ];

  // Templates de méga-quête mensuelle
  private static monthlyQuestTemplates = [
    {
      name: 'Défi du Mois',
      description: 'Complétez tous les objectifs mensuels',
      difficulty: 'epic' as const,
      objectives: () => [
        {
          id: 'monthly_wins',
          description: 'Gagnez 50 parties',
          type: 'win_games' as const,
          target: 50,
          current: 0,
          completed: false,
        },
        {
          id: 'monthly_yams',
          description: 'Réalisez 20 Yams',
          type: 'get_yams' as const,
          target: 20,
          current: 0,
          completed: false,
        },
        {
          id: 'monthly_score',
          description: 'Cumulez 10000 points',
          type: 'score_points' as const,
          target: 10000,
          current: 0,
          completed: false,
        },
        {
          id: 'monthly_ai',
          description: 'Battez 30 IA',
          type: 'defeat_ai' as const,
          target: 30,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 2500, coins: 3000, battlePassXP: 1000, items: ['legendary_badge', 'premium_emote'] },
    },
    {
      name: 'Maître du Mois',
      description: 'Devenez le maître du Yams ce mois-ci',
      difficulty: 'epic' as const,
      objectives: () => [
        {
          id: 'monthly_perfect',
          description: 'Réalisez une partie parfaite (375 pts)',
          type: 'score_points' as const,
          target: 375,
          current: 0,
          completed: false,
        },
        {
          id: 'monthly_streak',
          description: 'Gagnez 10 parties d\'affilée',
          type: 'win_games' as const,
          target: 10,
          current: 0,
          completed: false,
        },
        {
          id: 'monthly_yams_master',
          description: 'Réalisez 30 Yams',
          type: 'get_yams' as const,
          target: 30,
          current: 0,
          completed: false,
        },
      ],
      rewards: { xp: 3000, coins: 5000, battlePassXP: 1500, items: ['master_title', 'golden_dice'] },
    },
  ];

  // Génère 3 quêtes quotidiennes aléatoires
  static generateDailyQuests(): Quest[] {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Shuffle et prendre 3 quêtes
    const shuffled = [...this.dailyQuestTemplates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    return selected.map((template, index) => {
      // Ajuster les valeurs selon la difficulté
      let count = 0;
      let points = 0;

      switch (template.difficulty) {
        case 'easy':
          count = Math.floor(Math.random() * 2) + 1; // 1-2
          points = 150 + Math.floor(Math.random() * 50); // 150-200
          break;
        case 'medium':
          count = Math.floor(Math.random() * 2) + 2; // 2-3
          points = 200 + Math.floor(Math.random() * 50); // 200-250
          break;
        case 'hard':
          count = Math.floor(Math.random() * 2) + 1; // 1-2
          points = 250 + Math.floor(Math.random() * 50); // 250-300
          break;
      }

      const objectives = template.objectives(template.name.includes('Score') ? points : count);

      return {
        id: `daily_${now.toISOString().split('T')[0]}_${index}`,
        name: template.name,
        description: template.description
          .replace('{count}', count.toString())
          .replace('{points}', points.toString()),
        type: 'daily',
        difficulty: template.difficulty,
        objectives,
        rewards: template.rewards,
        startDate: now,
        endDate: endOfDay,
        completed: false,
        claimed: false,
      };
    });
  }

  // Génère 3 quêtes hebdomadaires
  static generateWeeklyQuests(): Quest[] {
    const now = new Date();
    const endOfWeek = new Date(now);
    const daysUntilSunday = 7 - now.getDay();
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    const shuffled = [...this.weeklyQuestTemplates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    return selected.map((template, index) => {
      let count = 0;
      let points = 0;

      switch (template.difficulty) {
        case 'medium':
          count = Math.floor(Math.random() * 5) + 10; // 10-15
          points = 1500 + Math.floor(Math.random() * 500); // 1500-2000
          break;
        case 'hard':
          count = Math.floor(Math.random() * 3) + 5; // 5-8
          points = 2000 + Math.floor(Math.random() * 500); // 2000-2500
          break;
        case 'epic':
          count = Math.floor(Math.random() * 2) + 3; // 3-5
          points = 300; // Fixed
          break;
      }

      const objectives = template.objectives(template.name.includes('Score') ? points : count);

      return {
        id: `weekly_${now.toISOString().split('T')[0]}_${index}`,
        name: template.name,
        description: template.description
          .replace('{count}', count.toString())
          .replace('{points}', points.toString()),
        type: 'weekly',
        difficulty: template.difficulty,
        objectives,
        rewards: template.rewards,
        startDate: now,
        endDate: endOfWeek,
        completed: false,
        claimed: false,
      };
    });
  }

  // Génère la méga-quête mensuelle
  static generateMonthlyQuest(): Quest {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const template = this.monthlyQuestTemplates[Math.floor(Math.random() * this.monthlyQuestTemplates.length)];
    const objectives = template.objectives();

    return {
      id: `monthly_${now.toISOString().split('T')[0].substring(0, 7)}`,
      name: template.name,
      description: template.description,
      type: 'monthly',
      difficulty: template.difficulty,
      objectives,
      rewards: template.rewards,
      startDate: now,
      endDate: endOfMonth,
      completed: false,
      claimed: false,
    };
  }

  // Vérifie si les quêtes doivent être renouvelées
  static shouldRefreshQuests(quests: Quest[], type: 'daily' | 'weekly' | 'monthly'): boolean {
    if (!quests || quests.length === 0) return true;

    const now = new Date();
    const quest = quests[0];

    if (!quest || !quest.endDate) return true;

    return now > new Date(quest.endDate);
  }

  // Met à jour la progression d'une quête
  static updateQuestProgress(
    quest: Quest,
    objectiveId: string,
    progress: number
  ): Quest {
    const updatedObjectives = quest.objectives.map((obj) => {
      if (obj.id === objectiveId) {
        const newCurrent = obj.current + progress;
        return {
          ...obj,
          current: Math.min(newCurrent, obj.target),
          completed: newCurrent >= obj.target,
        };
      }
      return obj;
    });

    const allCompleted = updatedObjectives.every((obj) => obj.completed);

    return {
      ...quest,
      objectives: updatedObjectives,
      completed: allCompleted,
    };
  }

  // Calcule les récompenses totales pour affichage
  static calculateTotalRewards(quests: Quest[]): {
    totalXP: number;
    totalCoins: number;
    totalBattlePassXP: number;
  } {
    return quests.reduce(
      (acc, quest) => ({
        totalXP: acc.totalXP + quest.rewards.xp,
        totalCoins: acc.totalCoins + (quest.rewards.coins || 0),
        totalBattlePassXP: acc.totalBattlePassXP + (quest.rewards.battlePassXP || 0),
      }),
      { totalXP: 0, totalCoins: 0, totalBattlePassXP: 0 }
    );
  }
}
