import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from "../types/player";

interface SyncResult {
  synced: number;
  failed: number;
  conflicts: number;
}

const STORAGE_KEYS = {
  PLAYERS: '@yams_players',
  GAMES: '@yams_games',
  USER_ID: '@yams_user_id',
  LAST_SYNC: '@yams_last_sync',
};

export class CloudService {
  private static userId: string | null = null;
  
  static async initialize(): Promise<void> {
    try {
      let userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) {
        userId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      }
      this.userId = userId;
      console.log("Cloud service initialized - User:", this.userId);
    } catch (error) {
      console.error("Error initializing cloud service:", error);
      throw error;
    }
  }

  static isConnected(): boolean {
    return this.userId !== null;
  }

  static getUserId(): string | null {
    return this.userId;
  }

  static getDeviceId(): string {
    return this.userId || 'unknown';
  }

  static async savePlayerToCloud(player: Player): Promise<void> {
    if (!this.userId) throw new Error("Cloud service not initialized");
    try {
      const playersData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
      const players: any[] = playersData ? JSON.parse(playersData) : [];
      const existingIndex = players.findIndex(p => p.id === player.id);
      const playerToSave = {
        ...player,
        createdAt: player.createdAt instanceof Date ? player.createdAt.toISOString() : player.createdAt,
        lastPlayed: player.lastPlayed instanceof Date ? player.lastPlayed.toISOString() : player.lastPlayed,
      };
      if (existingIndex >= 0) {
        players[existingIndex] = playerToSave;
      } else {
        players.push(playerToSave);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error("Error saving player:", error);
      throw error;
    }
  }

  static async loadPlayerFromCloud(playerId: string): Promise<Player | null> {
    try {
      const playersData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
      const players: any[] = playersData ? JSON.parse(playersData) : [];
      const player = players.find(p => p.id === playerId);
      return player ? { ...player, createdAt: new Date(player.createdAt), lastPlayed: new Date(player.lastPlayed) } : null;
    } catch (error) {
      return null;
    }
  }

  static async loadAllPlayersFromCloud(): Promise<Player[]> {
    try {
      const playersData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
      const players: any[] = playersData ? JSON.parse(playersData) : [];
      return players.map(p => ({ ...p, createdAt: new Date(p.createdAt), lastPlayed: new Date(p.lastPlayed) }));
    } catch (error) {
      return [];
    }
  }

  static async deletePlayerFromCloud(playerId: string): Promise<void> {
    try {
      const playersData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
      const players: any[] = playersData ? JSON.parse(playersData) : [];
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players.filter(p => p.id !== playerId)));
    } catch (error) {
      throw error;
    }
  }

  static async saveGameStats(gameStats: any): Promise<void> {
    try {
      const gamesData = await AsyncStorage.getItem(STORAGE_KEYS.GAMES);
      const games = gamesData ? JSON.parse(gamesData) : [];
      games.push({ ...gameStats, playedAt: new Date().toISOString(), deviceId: this.getDeviceId() });
      await AsyncStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch (error) {
      throw error;
    }
  }

  static async loadGameHistory(playerId: string, limit: number = 20): Promise<any[]> {
    try {
      const gamesData = await AsyncStorage.getItem(STORAGE_KEYS.GAMES);
      const games = gamesData ? JSON.parse(gamesData) : [];
      return games
        .filter((g: any) => g.playerId === playerId)
        .map((g: any) => ({ ...g, playedAt: new Date(g.playedAt) }))
        .sort((a: any, b: any) => b.playedAt.getTime() - a.playedAt.getTime())
        .slice(0, limit);
    } catch (error) {
      return [];
    }
  }

  static async syncAllPlayers(localPlayers: Player[]): Promise<SyncResult> {
    let synced = 0, failed = 0;
    for (const player of localPlayers) {
      try {
        await this.savePlayerToCloud(player);
        synced++;
      } catch (error) {
        failed++;
      }
    }
    return { synced, failed, conflicts: 0 };
  }

  static async exportBackup(): Promise<string> {
    const players = await this.loadAllPlayersFromCloud();
    const gamesData = await AsyncStorage.getItem(STORAGE_KEYS.GAMES);
    return JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), userId: this.userId, players, games: gamesData ? JSON.parse(gamesData) : [] }, null, 2);
  }

  static async importBackup(backupJson: string): Promise<number> {
    const backup = JSON.parse(backupJson);
    let imported = 0;
    for (const player of backup.players) {
      try { await this.savePlayerToCloud(player); imported++; } catch (e) {}
    }
    if (backup.games) await AsyncStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(backup.games));
    return imported;
  }

  static async getCloudStats(): Promise<{ totalPlayers: number; totalGames: number; averageLevel: number }> {
    const players = await this.loadAllPlayersFromCloud();
    const gamesData = await AsyncStorage.getItem(STORAGE_KEYS.GAMES);
    const games = gamesData ? JSON.parse(gamesData) : [];
    return {
      totalPlayers: players.length,
      totalGames: games.length,
      averageLevel: players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.level, 0) / players.length) : 0
    };
  }

  static async deleteAllData(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.PLAYERS, STORAGE_KEYS.GAMES, STORAGE_KEYS.LAST_SYNC]);
  }
}
