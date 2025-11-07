import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet
} from "react-native";
import { SyncService } from "../services/syncService";
import { CloudService } from "../services/cloudService";

const formatLastSync = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins}m`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays}j`;
};

export const SyncStatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncState, setSyncState] = useState(SyncService.getSyncState());
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vérifier la connexion
    const connected = CloudService.isConnected();
    setIsConnected(connected);

    // Charger l'état
    const state = SyncService.getSyncState();
    setSyncState(state);
    if (state.lastSyncTime > 0) {
      setLastSyncTime(new Date(state.lastSyncTime));
    }

    // Interval pour mettre à jour l'état
    const interval = setInterval(() => {
      setSyncState(SyncService.getSyncState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setSyncing(true);

    // Animation rotation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ).start();

    try {
      await SyncService.forceSyncNow();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error("Error during manual sync:", error);
    } finally {
      setSyncing(false);
      spinAnim.setValue(0);
    }
  };

  const pendingCount = syncState.pendingChanges.length;
  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.container}>
      {/* Status Indicator */}
      <View style={styles.statusRow}>
        {/* Connection Status */}
        <View style={styles.statusItem}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isConnected ? "#50C878" : "#FF6B6B"
              }
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? "Connecté" : "Hors ligne"}
          </Text>
        </View>

        {/* Pending Changes */}
        {pendingCount > 0 && (
          <View style={styles.statusItem}>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingCount}>{pendingCount}</Text>
            </View>
            <Text style={styles.statusText}>En attente</Text>
          </View>
        )}

        {/* Last Sync Time */}
        {lastSyncTime && (
          <View style={styles.statusItem}>
            <Text style={styles.syncTimeText}>
              {formatLastSync(lastSyncTime)}
            </Text>
          </View>
        )}

        {/* Sync Button */}
        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleSync}
          disabled={syncing || !isConnected}
        >
          <Animated.Text
            style={[
              styles.syncIcon,
              syncing && {
                transform: [{ rotate: spinInterpolate }]
              }
            ]}
          >
            🔄
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {/* Status Message */}
      {syncState.syncInProgress && (
        <Text style={styles.syncMessage}>
          Synchronisation en cours...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    backgroundColor: "#F8F9FA"
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#2C3E50"
  },
  pendingBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF6B6B",
    alignItems: "center",
    justifyContent: "center"
  },
  pendingCount: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "white"
  },
  syncTimeText: {
    fontSize: 11,
    color: "#7F8C8D"
  },
  syncButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E1E8ED",
    marginLeft: "auto"
  },
  syncIcon: {
    fontSize: 16
  },
  syncMessage: {
    fontSize: 11,
    color: "#7F8C8D",
    marginTop: 8,
    fontStyle: "italic" as const
  }
});
