import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp,
  Firestore,
  QueryConstraint
} from "firebase/firestore";
import { getAuth, signInAnonymously, User, Auth } from "firebase/auth";
import { Player } from "../types/player";

// Configuration Firebase
const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || ""
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let currentUser: User | null = null;

interface SyncResult {
  synced: number;
  failed: number;
  conflicts: number;
}

export class CloudService {
  
  // Initialiser Firebase
  static async initialize(): Promise<void> {
    try {
      if (!app) {
        app = initializeApp(FIREBASE_CONFIG);
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Auth anonyme
        const result = await signInAnonymously(auth);
        currentUser = result.user;
        console.log("Cloud service initialized - User:", currentUser?.uid);
      }
    } catch (error) {
      console.error("Error initializing cloud service:", error);
      throw error;
    }
  }

  // Vérifier si connecté
  static isConnected(): boolean {
    return currentUser !== null;
  }

  // Obtenir l'ID utilisateur
  static getUserId(): string | null {
    return currentUser?.uid || null;
  }

  // Sauvegarder un joueur dans le cloud
  static async savePlayerToCloud(player: Player): Promise<void> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const playerRef = doc(
        collection(db, `users/${currentUser.uid}/players`),
        player.id
      );

      const cloudData = {
        ...player,
        createdAt: player.createdAt instanceof Date 
          ? Timestamp.fromDate(player.createdAt)
          : player.createdAt,
        lastPlayed: player.lastPlayed instanceof Date
          ? Timestamp.fromDate(player.lastPlayed)
          : player.lastPlayed,
        syncedAt: Timestamp.now(),
        deviceId: CloudService.getDeviceId()
      };

      await setDoc(playerRef, cloudData);
      console.log(`Player ${player.id} saved to cloud`);
    } catch (error) {
      console.error("Error saving player to cloud:", error);
      throw error;
    }
  }

  // Charger un joueur depuis le cloud
  static async loadPlayerFromCloud(playerId: string): Promise<Player | null> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const playerRef = doc(
        collection(db, `users/${currentUser.uid}/players`),
        playerId
      );

      const playerSnap = await getDoc(playerRef);

      if (playerSnap.exists()) {
        const data = playerSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          lastPlayed: data.lastPlayed?.toDate?.() || new Date(data.lastPlayed)
        } as Player;
      }

      return null;
    } catch (error) {
      console.error("Error loading player from cloud:", error);
      throw error;
    }
  }

  // Charger tous les joueurs du cloud
  static async loadAllPlayersFromCloud(): Promise<Player[]> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const playersRef = collection(db, `users/${currentUser.uid}/players`);
      const playersSnap = await getDocs(playersRef);

      const players: Player[] = [];
      playersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        players.push({
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          lastPlayed: data.lastPlayed?.toDate?.() || new Date(data.lastPlayed)
        } as Player);
      });

      return players;
    } catch (error) {
      console.error("Error loading all players from cloud:", error);
      throw error;
    }
  }

  // Supprimer un joueur du cloud
  static async deletePlayerFromCloud(playerId: string): Promise<void> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const playerRef = doc(
        collection(db, `users/${currentUser.uid}/players`),
        playerId
      );

      await deleteDoc(playerRef);
      console.log(`Player ${playerId} deleted from cloud`);
    } catch (error) {
      console.error("Error deleting player from cloud:", error);
      throw error;
    }
  }

  // Sauvegarder une partie (statistiques)
  static async saveGameStats(gameStats: {
    playerId: string;
    finalScore: number;
    position: number;
    duration: number;
    opponents: string[];
    mode: "multiplayer" | "vs_ai";
    aiDifficulty?: string;
  }): Promise<void> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const gamesRef = collection(db, `users/${currentUser.uid}/games`);
      const gameRef = doc(gamesRef);

      await setDoc(gameRef, {
        ...gameStats,
        playedAt: Timestamp.now(),
        deviceId: CloudService.getDeviceId()
      });

      console.log("Game stats saved to cloud");
    } catch (error) {
      console.error("Error saving game stats to cloud:", error);
      throw error;
    }
  }

  // Charger l'historique des parties
  static async loadGameHistory(
    playerId: string,
    limit: number = 20
  ): Promise<Array<{
    playerId: string;
    finalScore: number;
    position: number;
    duration: number;
    opponents: string[];
    mode: string;
    aiDifficulty?: string;
    playedAt: Date;
  }>> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const gamesRef = collection(db, `users/${currentUser.uid}/games`);
      const constraints: QueryConstraint[] = [
        where("playerId", "==", playerId)
      ];
      const q = query(gamesRef, ...constraints);

      const gamesSnap = await getDocs(q);
      const games: Array<{
        playerId: string;
        finalScore: number;
        position: number;
        duration: number;
        opponents: string[];
        mode: string;
        aiDifficulty?: string;
        playedAt: Date;
      }> = [];

      gamesSnap.forEach((docSnap) => {
        const data = docSnap.data();
        games.push({
          ...data,
          playedAt: data.playedAt?.toDate?.() || new Date(data.playedAt)
        } as any);
      });

      return games
        .sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error("Error loading game history:", error);
      throw error;
    }
  }

  // Synchroniser les données locales avec le cloud
  static async syncAllPlayers(localPlayers: Player[]): Promise<SyncResult> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    let synced = 0;
    let failed = 0;
    let conflicts = 0;

    for (const player of localPlayers) {
      try {
        // Charger version cloud
        const cloudPlayer = await CloudService.loadPlayerFromCloud(player.id);

        // Vérifier les conflits (cloud plus récent)
        if (
          cloudPlayer &&
          cloudPlayer.lastPlayed instanceof Date &&
          player.lastPlayed instanceof Date &&
          cloudPlayer.lastPlayed.getTime() > player.lastPlayed.getTime()
        ) {
          conflicts++;
          console.warn(`Conflict detected for player ${player.id}`);
          // Fusionner les stats (garder les meilleurs)
          const merged = CloudService.mergePlayerStats(player, cloudPlayer);
          await CloudService.savePlayerToCloud(merged);
        } else {
          // Sauvegarder la version locale
          await CloudService.savePlayerToCloud(player);
          synced++;
        }
      } catch (error) {
        console.error(`Error syncing player ${player.id}:`, error);
        failed++;
      }
    }

    return { synced, failed, conflicts };
  }

  // Fusionner les statistiques de deux versions d'un joueur
  private static mergePlayerStats(local: Player, cloud: Player): Player {
    return {
      ...cloud,
      name: local.name,
      nickname: local.nickname,
      color: local.color,
      avatar: local.avatar,
      title: local.title,
      theme: local.theme,
      preferences: local.preferences,
      
      level: Math.max(local.level, cloud.level),
      totalXP: Math.max(local.totalXP, cloud.totalXP),
      xp: Math.max(local.xp, cloud.xp),
      stats: {
        gamesPlayed: Math.max(local.stats.gamesPlayed, cloud.stats.gamesPlayed),
        gamesWon: Math.max(local.stats.gamesWon, cloud.stats.gamesWon),
        totalScore: Math.max(local.stats.totalScore, cloud.stats.totalScore),
        bestScore: Math.max(local.stats.bestScore, cloud.stats.bestScore),
        averageScore: Math.max(local.stats.averageScore, cloud.stats.averageScore),
        yamsScored: Math.max(local.stats.yamsScored, cloud.stats.yamsScored),
        bonusEarned: Math.max(local.stats.bonusEarned, cloud.stats.bonusEarned),
        aiEasyWins: Math.max(local.stats.aiEasyWins, cloud.stats.aiEasyWins),
        aiNormalWins: Math.max(local.stats.aiNormalWins, cloud.stats.aiNormalWins),
        aiHardWins: Math.max(local.stats.aiHardWins, cloud.stats.aiHardWins),
        currentWinStreak: Math.max(local.stats.currentWinStreak, cloud.stats.currentWinStreak),
        bestWinStreak: Math.max(local.stats.bestWinStreak, cloud.stats.bestWinStreak)
      },
      lastPlayed: new Date(
        Math.max(
          (local.lastPlayed as Date).getTime(),
          (cloud.lastPlayed as Date).getTime()
        )
      )
    };
  }

  // Exporter données pour backup
  static async exportBackup(): Promise<string> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const players = await CloudService.loadAllPlayersFromCloud();
      const backup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        userId: currentUser.uid,
        players
      };

      return JSON.stringify(backup, null, 2);
    } catch (error) {
      console.error("Error exporting backup:", error);
      throw error;
    }
  }

  // Importer données depuis backup
  static async importBackup(backupJson: string): Promise<number> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const backup = JSON.parse(backupJson);
      let imported = 0;

      for (const player of backup.players) {
        try {
          await CloudService.savePlayerToCloud(player);
          imported++;
        } catch (error) {
          console.error(`Error importing player ${player.id}:`, error);
        }
      }

      console.log(`Imported ${imported} players from backup`);
      return imported;
    } catch (error) {
      console.error("Error importing backup:", error);
      throw error;
    }
  }

  // Obtenir les statistiques globales depuis le cloud
  static async getCloudStats(): Promise<{
    totalPlayers: number;
    totalGames: number;
    averageLevel: number;
  }> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const players = await CloudService.loadAllPlayersFromCloud();
      const games = await getDocs(
        collection(db, `users/${currentUser.uid}/games`)
      );

      const totalPlayers = players.length;
      const totalGames = games.size;
      const averageLevel = players.length > 0
        ? Math.round(
            players.reduce((sum, p) => sum + p.level, 0) / players.length
          )
        : 0;

      return {
        totalPlayers,
        totalGames,
        averageLevel
      };
    } catch (error) {
      console.error("Error getting cloud stats:", error);
      throw error;
    }
  }

  // Supprimer tous les données (attention!)
  static async deleteAllData(): Promise<void> {
    if (!currentUser || !db) {
      throw new Error("Cloud service not initialized");
    }

    try {
      const players = await CloudService.loadAllPlayersFromCloud();
      
      for (const player of players) {
        await CloudService.deletePlayerFromCloud(player.id);
      }

      const games = await getDocs(
        collection(db, `users/${currentUser.uid}/games`)
      );

      for (const gameDoc of games.docs) {
        await deleteDoc(gameDoc.ref);
      }

      console.log("All cloud data deleted");
    } catch (error) {
      console.error("Error deleting all cloud data:", error);
      throw error;
    }
  }

  // Obtenir l'ID du device
  private static getDeviceId(): string {
    return "device_id";
  }
}
