import AsyncStorage from "@react-native-async-storage/async-storage";

interface SyncState {
  lastSyncTime: number;
  pendingChanges: Array<{
    playerId: string;
    action: "create" | "update" | "delete";
    timestamp: number;
  }>;
  syncInProgress: boolean;
}

export class SyncService {
  private static syncState: SyncState = {
    lastSyncTime: 0,
    pendingChanges: [],
    syncInProgress: false
  };

  private static readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_RETRIES = 3;
  private static syncTimer: ReturnType<typeof setInterval> | null = null;

  // Initialiser le service de sync
  static async initialize(): Promise<void> {
    try {
      await SyncService.loadSyncState();

      try {
        const { CloudService } = await import("./cloudService");
        await CloudService.initialize();
        console.log("Cloud service initialized for sync");
      } catch (error) {
        console.warn("Cloud service not available for sync:", error);
      }

      SyncService.startAutoSync();
    } catch (error) {
      console.error("Error initializing sync service:", error);
    }
  }

  // Démarrer la synchronisation automatique
  private static startAutoSync(): void {
    if (SyncService.syncTimer) {
      clearInterval(SyncService.syncTimer);
    }

    SyncService.syncTimer = setInterval(() => {
      SyncService.syncAll();
    }, SyncService.SYNC_INTERVAL);
  }

  // Arrêter la synchronisation automatique
  static stopAutoSync(): void {
    if (SyncService.syncTimer) {
      clearInterval(SyncService.syncTimer);
      SyncService.syncTimer = null;
    }
  }

  // Synchroniser tous les joueurs
  static async syncAll(): Promise<{
    success: boolean;
    syncedPlayers: number;
    failedPlayers: number;
    message: string;
  }> {
    try {
      const { CloudService } = await import("./cloudService");
      
      if (!CloudService.isConnected()) {
        return {
          success: false,
          syncedPlayers: 0,
          failedPlayers: 0,
          message: "Cloud not connected"
        };
      }

      if (SyncService.syncState.syncInProgress) {
        return {
          success: false,
          syncedPlayers: 0,
          failedPlayers: 0,
          message: "Sync already in progress"
        };
      }

      SyncService.syncState.syncInProgress = true;

      const { PlayerService } = await import("./playerService");
      const localPlayers = await PlayerService.loadAllPlayers();
      const result = await CloudService.syncAllPlayers(localPlayers);

      SyncService.syncState.lastSyncTime = Date.now();
      SyncService.syncState.pendingChanges = [];
      await SyncService.saveSyncState();

      return {
        success: true,
        syncedPlayers: result.synced,
        failedPlayers: result.failed,
        message: `Sync completed: ${result.synced} synced, ${result.failed} failed, ${result.conflicts} conflicts`
      };
    } catch (error) {
      console.error("Error during sync:", error);
      return {
        success: false,
        syncedPlayers: 0,
        failedPlayers: 0,
        message: `Sync failed: ${error}`
      };
    } finally {
      SyncService.syncState.syncInProgress = false;
    }
  }

  // Enregistrer un changement joueur
  static async trackPlayerChange(
    playerId: string,
    action: "create" | "update" | "delete"
  ): Promise<void> {
    const existingIndex = SyncService.syncState.pendingChanges.findIndex(
      (c) => c.playerId === playerId
    );

    if (existingIndex >= 0) {
      SyncService.syncState.pendingChanges[existingIndex].action = action;
      SyncService.syncState.pendingChanges[existingIndex].timestamp = Date.now();
    } else {
      SyncService.syncState.pendingChanges.push({
        playerId,
        action,
        timestamp: Date.now()
      });
    }

    await SyncService.saveSyncState();

    if (action === "delete") {
      SyncService.syncOne(playerId);
    }
  }

  // Synchroniser un joueur spécifique
  static async syncOne(playerId: string, retries = 0): Promise<boolean> {
    try {
      const { CloudService } = await import("./cloudService");
      const { PlayerService } = await import("./playerService");

      if (!CloudService.isConnected()) {
        return false;
      }

      const player = await PlayerService.loadPlayer(playerId);

      if (!player) {
        await CloudService.deletePlayerFromCloud(playerId);
      } else {
        await CloudService.savePlayerToCloud(player);
      }

      SyncService.syncState.pendingChanges = SyncService.syncState.pendingChanges.filter(
        (c) => c.playerId !== playerId
      );
      await SyncService.saveSyncState();

      return true;
    } catch (error) {
      console.error(`Error syncing player ${playerId}:`, error);

      if (retries < SyncService.MAX_RETRIES) {
        await new Promise<void>((resolve) =>
          setTimeout(() => resolve(), 1000 * Math.pow(2, retries))
        );
        return SyncService.syncOne(playerId, retries + 1);
      }

      return false;
    }
  }

  // Obtenir l'état de sync
  static getSyncState(): SyncState {
    return { ...SyncService.syncState };
  }

  // Sauvegarder l'état de sync
  private static async saveSyncState(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "sync_state",
        JSON.stringify(SyncService.syncState)
      );
    } catch (error) {
      console.error("Error saving sync state:", error);
    }
  }

  // Charger l'état de sync
  private static async loadSyncState(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem("sync_state");
      if (saved) {
        SyncService.syncState = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading sync state:", error);
    }
  }

  // Forcer une synchronisation complète
  static async forceSyncNow(): Promise<void> {
    await SyncService.syncAll();
  }

  // Nettoyer les changements anciens (> 24h)
  static async cleanupOldChanges(): Promise<void> {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    SyncService.syncState.pendingChanges = SyncService.syncState.pendingChanges.filter(
      (c) => now - c.timestamp < oneDayMs
    );

    await SyncService.saveSyncState();
  }
}
