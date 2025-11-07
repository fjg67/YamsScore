import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet
} from "react-native";
import { Player } from "../types/player";

interface PlayerCardProps {
  player: Player;
  onEdit?: () => void;
  onRemove?: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onEdit,
  onRemove,
  onPress,
  onLongPress
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [floatAnim]);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8]
  });

  const onPressHandle = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        tension: 100,
        friction: 5,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        tension: 100,
        friction: 7,
        useNativeDriver: true
      })
    ]).start();
    onPress?.();
  };

  const winRate = player.stats.gamesPlayed > 0
    ? Math.round((player.stats.gamesWon / player.stats.gamesPlayed) * 100)
    : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPressHandle}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <View style={[styles.card, { backgroundColor: player.color + "10" }]}>
        <Animated.View
          style={[
            styles.avatarSection,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: floatTranslateY }
              ]
            }
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: player.color }
            ]}
          >
            <Text style={styles.avatarEmoji}>
              {player.avatar.emoji || player.avatar.initial}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.nameSection}>
          <Text style={styles.playerName}>{player.name}</Text>
          {player.nickname && (
            <Text style={styles.nickname}>"{player.nickname}"</Text>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.levelBadge}>⭐ Niveau {player.level}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>🏆 {player.stats.gamesWon} victoires</Text>
            <Text style={styles.statDot}>•</Text>
            <Text style={styles.statText}>{winRate}%</Text>
          </View>
        </View>

        {player.title && (
          <Text style={styles.title}>{player.title}</Text>
        )}

        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
          )}
          {onRemove && (
            <TouchableOpacity onPress={onRemove} style={styles.actionButton}>
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 20
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 12
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  avatarEmoji: {
    fontSize: 42,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8
  },
  nameSection: {
    alignItems: "center",
    marginBottom: 12
  },
  playerName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    letterSpacing: 0.5
  },
  nickname: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#7F8C8D",
    marginTop: 4
  },
  statsSection: {
    alignItems: "center",
    marginBottom: 12
  },
  levelBadge: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E6A500",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderRadius: 12
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5D6D7E"
  },
  statDot: {
    fontSize: 14,
    color: "#BDC3C7"
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A90E2",
    textAlign: "center",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  actionIcon: {
    fontSize: 18
  }
});
