import AsyncStorage from "@react-native-async-storage/async-storage";
import { Player, SavedPlayer, PlayerType } from "../types/player";
import { getXPForLevel } from "../constants/playerConstants";

export class PlayerService {
  
  // Créer un nouveau joueur humain
  static createHumanPlayer(name: string, color: string, emoji: string): Player {
    return {
      id: `player_${Date.now()}_${Math.random()}`,
      type: PlayerType.HUMAN,
      name,
      avatar: {
        emoji,
        initial: name.charAt(0).toUpperCase(),
        color
      },
      color,
      level: 1,
      xp: 0,
      totalXP: 0,
      theme: {
        primary: color,
        secondary: `${color}80`,
        accent: "#FFD93D"
      },
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: 0,
        yamsScored: 0,
        bonusEarned: 0,
        aiEasyWins: 0,
        aiNormalWins: 0,
        aiHardWins: 0,
        currentWinStreak: 0,
        bestWinStreak: 0
      },
      preferences: {
        soundEnabled: true,
        hapticEnabled: true,
        animationsEnabled: true,
        theme: "light"
      },
      createdAt: new Date(),
      lastPlayed: new Date()
    };
  }

  // Créer un joueur IA
  static createAIPlayer(difficulty: "easy" | "normal" | "hard"): Player {
    const aiConfigs = {
      easy: {
        type: PlayerType.AI_EASY,
        name: "IA Débutant",
        color: "#50C878",
        emoji: "🤖",
        strategicMultiplier: 0.3,
        winRate: 90
      },
      normal: {
        type: PlayerType.AI_NORMAL,
        name: "IA Normal",
        color: "#FFD93D",
        emoji: "🤖",
        strategicMultiplier: 0.6,
        winRate: 60
      },
      hard: {
        type: PlayerType.AI_HARD,
        name: "IA Difficile",
        color: "#FF6B6B",
        emoji: "🤖",
        strategicMultiplier: 0.95,
        winRate: 30
      }
    };

    const config = aiConfigs[difficulty];

    return {
      id: `ai_${difficulty}_${Date.now()}`,
      type: config.type,
      name: config.name,
      avatar: {
        emoji: config.emoji,
        initial: "IA",
        color: config.color
      },
      color: config.color,
      level: difficulty === "hard" ? 20 : difficulty === "normal" ? 12 : 5,
      xp: 0,
      totalXP: 0,
      theme: {
        primary: config.color,
        secondary: `${config.color}80`,
        accent: "#FFD93D"
      },
      stats: {
        gamesPlayed: 1000,
        gamesWon: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: 0,
        yamsScored: 0,
        bonusEarned: 0,
        aiEasyWins: 0,
        aiNormalWins: 0,
        aiHardWins: 0,
        currentWinStreak: 0,
        bestWinStreak: 0
      },
      aiConfig: {
        difficulty,
        personality: `IA ${difficulty}`,
        winRate: config.winRate,
        strategicMultiplier: config.strategicMultiplier
      },
      preferences: {
        soundEnabled: true,
        hapticEnabled: false,
        animationsEnabled: true,
        theme: "light"
      },
      createdAt: new Date(),
      lastPlayed: new Date()
    };
  }

  // Ajouter XP et gérer level up
  static addXP(
    player: Player,
    amount: number
  ): { player: Player; leveledUp: boolean } {
    const newTotalXP = player.totalXP + amount;
    const newXP = player.xp + amount;
    const nextLevelXP = getXPForLevel(player.level + 1);

    if (newXP >= nextLevelXP) {
      const overflow = newXP - nextLevelXP;
      return {
        player: {
          ...player,
          level: player.level + 1,
          xp: overflow,
          totalXP: newTotalXP
        },
        leveledUp: true
      };
    }

    return {
      player: {
        ...player,
        xp: newXP,
        totalXP: newTotalXP
      },
      leveledUp: false
    };
  }

  // Mettre à jour les stats après une partie
  static updateStatsAfterGame(
    player: Player,
    score: number,
    won: boolean,
    bonusEarned: boolean,
    yamsCount: number
  ): Player {
    const newStats = { ...player.stats };
    newStats.gamesPlayed += 1;
    newStats.totalScore += score;
    newStats.bestScore = Math.max(newStats.bestScore, score);
    newStats.averageScore = Math.round(newStats.totalScore / newStats.gamesPlayed);
    newStats.yamsScored += yamsCount;

    if (bonusEarned) {
      newStats.bonusEarned += 1;
    }

    if (won) {
      newStats.gamesWon += 1;
      newStats.currentWinStreak += 1;
      newStats.bestWinStreak = Math.max(
        newStats.bestWinStreak,
        newStats.currentWinStreak
      );
    } else {
      newStats.currentWinStreak = 0;
    }

    return { ...player, stats: newStats };
  }

  // Sauvegarder joueur (avec sync cloud)
  static async savePlayer(player: SavedPlayer | Player): Promise<void> {
    try {
      // Sauvegarder localement
      await AsyncStorage.setItem(`player_${player.id}`, JSON.stringify(player));

      // Ajouter à la liste des joueurs
      const playersList = await PlayerService.getPlayersList();
      if (!playersList.includes(player.id)) {
        playersList.push(player.id);
        await AsyncStorage.setItem("players_list", JSON.stringify(playersList));
      }

      // Tracker le changement pour sync
      const { SyncService } = await import("./syncService");
      await SyncService.trackPlayerChange(player.id, "update");

      // Sync cloud si disponible
      try {
        const { CloudService } = await import("./cloudService");
        if (CloudService.isConnected()) {
          await CloudService.savePlayerToCloud(player);
        }
      } catch (error) {
        console.warn("Cloud save failed, will retry later:", error);
      }
    } catch (error) {
      console.error("Error saving player:", error);
    }
  }

  // Charger tous les joueurs
  static async loadAllPlayers(): Promise<SavedPlayer[]> {
    try {
      const playersList = await this.getPlayersList();
      const players = await Promise.all(
        playersList.map(id => this.loadPlayer(id))
      );
      return players.filter(p => p !== null) as SavedPlayer[];
    } catch (error) {
      console.error("Error loading players:", error);
      return [];
    }
  }

  // Récupérer liste des IDs joueurs
  private static async getPlayersList(): Promise<string[]> {
    try {
      const list = await AsyncStorage.getItem("players_list");
      return list ? JSON.parse(list) : [];
    } catch (error) {
      console.error("Error getting players list:", error);
      return [];
    }
  }

  // Charger un joueur
  static async loadPlayer(playerId: string): Promise<SavedPlayer | null> {
    try {
      const playerData = await AsyncStorage.getItem(`player_${playerId}`);
      return playerData ? JSON.parse(playerData) : null;
    } catch (error) {
      console.error("Error loading player:", error);
      return null;
    }
  }

  // Supprimer un joueur (avec sync cloud)
  static async deletePlayer(playerId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`player_${playerId}`);

      const playersList = await PlayerService.getPlayersList();
      const updated = playersList.filter(id => id !== playerId);
      await AsyncStorage.setItem("players_list", JSON.stringify(updated));

      // Tracker le changement
      const { SyncService } = await import("./syncService");
      await SyncService.trackPlayerChange(playerId, "delete");

      // Sync cloud
      try {
        const { CloudService } = await import("./cloudService");
        if (CloudService.isConnected()) {
          await CloudService.deletePlayerFromCloud(playerId);
        }
      } catch (error) {
        console.warn("Cloud delete failed, will retry later:", error);
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  }

  // Vérifier achievements
  static checkAchievements(player: Player, event: string): string[] {
    const unlockedAchievements: string[] = [];

    switch (event) {
      case "first_yams":
        unlockedAchievements.push("first_yams");
        break;
      case "level_5":
        if (player.level >= 5) unlockedAchievements.push("level_5");
        break;
      case "win_vs_hard":
        unlockedAchievements.push("beat_ai_hard");
        break;
      case "win_streak_5":
        if (player.stats.currentWinStreak >= 5) {
          unlockedAchievements.push("win_streak_5");
        }
        break;
      case "perfect_game":
        if (player.stats.totalScore >= 300) {
          unlockedAchievements.push("perfect_game");
        }
        break;
    }

    return unlockedAchievements;
  }

  // Obtenir les couleurs déverrouillées pour un joueur
  static getUnlockedColors(player: Player): string[] {
    const UNLOCKABLE_COLORS = [
      { level: 1, color: "#4A90E2", name: "Bleu" },
      { level: 1, color: "#50C878", name: "Vert" },
      { level: 1, color: "#FF6B6B", name: "Rouge" },
      { level: 1, color: "#FFD93D", name: "Jaune" },
      { level: 3, color: "#9B59B6", name: "Violet" },
      { level: 5, color: "#FF69B4", name: "Rose" },
      { level: 8, color: "#FF8C00", name: "Orange" },
      { level: 10, color: "#00CED1", name: "Turquoise" },
      { level: 15, color: "#FFD700", name: "Or" },
      { level: 20, color: "#C0C0C0", name: "Argent" }
    ];
    
    return UNLOCKABLE_COLORS
      .filter((c) => c.level <= player.level)
      .map((c) => c.color);
  }

  // Obtenir les avatars déverrouillés pour un joueur
  static getUnlockedAvatars(player: Player): string[] {
    const UNLOCKABLE_AVATARS = [
      { level: 1, emoji: "😀", name: "Sourire" },
      { level: 1, emoji: "😎", name: "Cool" },
      { level: 2, emoji: "🤓", name: "Intello" },
      { level: 3, emoji: "😈", name: "Diable" },
      { level: 4, emoji: "👑", name: "Roi" },
      { level: 5, emoji: "🦄", name: "Licorne" },
      { level: 7, emoji: "🦁", name: "Lion" },
      { level: 10, emoji: "🔥", name: "Feu" },
      { level: 12, emoji: "⚡", name: "Éclair" },
      { level: 15, emoji: "🌟", name: "Étoile" },
      { level: 20, emoji: "💎", name: "Diamant" }
    ];
    
    return UNLOCKABLE_AVATARS
      .filter((a) => a.level <= player.level)
      .map((a) => a.emoji);
  }

  // Obtenir les titres déverrouillés pour un joueur
  static getUnlockedTitles(player: Player): string[] {
    const UNLOCKABLE_TITLES = [
      { level: 1, title: "Débutant" },
      { level: 5, title: "Expert" },
      { level: 8, title: "Champion" },
      { level: 12, title: "Légende" },
      { level: 15, title: "Maître" },
      { level: 20, title: "Divinité" }
    ];
    
    return UNLOCKABLE_TITLES
      .filter((t) => t.level <= player.level)
      .map((t) => t.title);
  }

  // Obtenir les badges déverrouillés pour un joueur
  static getUnlockedBadges(player: Player): string[] {
    const badges: string[] = [];
    
    if (player.level >= 5) badges.push("🎯");
    if (player.level >= 8) badges.push("🏆");
    if (player.level >= 12) badges.push("🔥");
    if (player.level >= 15) badges.push("💫");
    if (player.level >= 20) badges.push("👑");
    if (player.level >= 25) badges.push("💎");

    return badges;
  }

  // Déverrouiller difficulté IA
  static getUnlockedAIDifficulties(player: Player): string[] {
    const difficulties = ["easy", "normal"];

    // Difficile déverrouillée après 5 victoires vs Normal
    if (player.stats.aiNormalWins >= 5) {
      difficulties.push("hard");
    }

    return difficulties;
  }

  // Mettre à jour profil
  static updatePlayerProfile(
    player: Player,
    updates: Partial<Player>
  ): Player {
    return { ...player, ...updates };
  }

  // Mettre à jour avec validation des unlocks
  static updatePlayerWithValidation(
    player: Player,
    updates: Partial<Player>
  ): Player {
    const updated = { ...player, ...updates };

    // Valider couleur
    if (updates.color) {
      const unlockedColors = this.getUnlockedColors(player);
      if (!unlockedColors.includes(updates.color)) {
        console.warn("Couleur non déverrouillée");
        return player;
      }
    }

    // Valider avatar
    if (updates.avatar?.emoji) {
      const unlockedAvatars = this.getUnlockedAvatars(player);
      if (!unlockedAvatars.includes(updates.avatar.emoji)) {
        console.warn("Avatar non déverrouillé");
        return player;
      }
    }

    // Valider titre
    if (updates.title) {
      const unlockedTitles = this.getUnlockedTitles(player);
      if (!unlockedTitles.includes(updates.title)) {
        console.warn("Titre non déverrouillé");
        return player;
      }
    }

    return updated;
  }

  // Calculer prochain achievement
  static getNextAchievements(player: Player): Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    maxProgress: number;
  }> {
    return [
      {
        id: "level_5",
        title: "5e Niveau",
        description: "Atteindre le niveau 5",
        progress: player.level,
        maxProgress: 5
      },
      {
        id: "level_10",
        title: "10e Niveau",
        description: "Atteindre le niveau 10",
        progress: player.level,
        maxProgress: 10
      },
      {
        id: "win_vs_hard",
        title: "Batteur d'IA",
        description: "Battre l'IA Difficile",
        progress: player.stats.aiHardWins,
        maxProgress: 1
      },
      {
        id: "100_games",
        title: "Centenaire",
        description: "Jouer 100 parties",
        progress: player.stats.gamesPlayed,
        maxProgress: 100
      },
      {
        id: "10_yams",
        title: "Collecteur de Yams",
        description: "Scorer 10 Yams",
        progress: player.stats.yamsScored,
        maxProgress: 10
      }
    ];
  }

  // Exporter données joueur (pour backup/partage)
  static exportPlayerData(player: Player): string {
    return JSON.stringify(player, null, 2);
  }

  // Importer données joueur
  static importPlayerData(jsonData: string): Player | null {
    try {
      const data = JSON.parse(jsonData);
      if (!data.id || !data.name) return null;
      return data as Player;
    } catch (error) {
      console.error("Error importing player data:", error);
      return null;
    }
  }

  // Réinitialiser progression (avec sauvegarde avant)
  static async resetPlayerProgress(playerId: string): Promise<void> {
    const player = await this.loadPlayer(playerId);
    if (!player) return;

    // Sauvegarder backup
    const backup = {
      ...player,
      id: `${player.id}_backup_${Date.now()}`
    };
    await this.savePlayer(backup);

    // Réinitialiser
    const reset: Player = {
      ...player,
      level: 1,
      xp: 0,
      totalXP: 0,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: 0,
        yamsScored: 0,
        bonusEarned: 0,
        aiEasyWins: 0,
        aiNormalWins: 0,
        aiHardWins: 0,
        currentWinStreak: 0,
        bestWinStreak: 0
      }
    };

    await this.savePlayer(reset);
  }

  // Obtenir statistiques globales de tous les joueurs
  static async getGlobalStats(): Promise<{
    totalGames: number;
    totalPlayers: number;
    averageLevel: number;
    topPlayer: { name: string; score: number } | null;
  }> {
    const allPlayers = await this.loadAllPlayers();

    if (allPlayers.length === 0) {
      return {
        totalGames: 0,
        totalPlayers: 0,
        averageLevel: 0,
        topPlayer: null
      };
    }

    const totalGames = allPlayers.reduce((sum, p) => sum + p.stats.gamesPlayed, 0);
    const averageLevel = Math.round(
      allPlayers.reduce((sum, p) => sum + p.level, 0) / allPlayers.length
    );
    const topPlayer = allPlayers.reduce((top, p) =>
      p.stats.bestScore > (top?.stats.bestScore || 0) ? p : top
    );

    return {
      totalGames,
      totalPlayers: allPlayers.length,
      averageLevel,
      topPlayer: topPlayer ? { name: topPlayer.name, score: topPlayer.stats.bestScore } : null
    };
  }
}