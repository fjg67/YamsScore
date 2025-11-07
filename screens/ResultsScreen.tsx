import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView
} from "react-native";
import { Player } from "../types/player";
import { PlayerService } from "../services/playerService";
import { XP_REWARDS, getXPForLevel } from "../constants/playerConstants";

interface ResultsScreenProps {
  players: Player[];
  scores: Record<string, number>;
  onRestart: () => void;
  onHome: () => void;
}

interface RankedPlayer {
  player: Player;
  score: number;
  position: number;
  xpGained: number;
  leveledUp: boolean;
  newLevel?: number;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  players,
  scores,
  onRestart,
  onHome
}) => {
  const [rankedPlayers, setRankedPlayers] = useState<RankedPlayer[]>([]);
  const [showingLevelUp, setShowingLevelUp] = useState<string | null>(null);
  
  const levelUpScale = useRef(new Animated.Value(0)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Calculer les rangs et XP
    const ranked = players
      .map((player, idx) => {
        const score = scores[player.id] || 0;
        const position = idx + 1;
        
        // Calculer XP
        let xpGained = XP_REWARDS.playGame;
        if (position === 1) {
          xpGained += XP_REWARDS.winGame;
        }

        // Bonus si IA et victoire
        if (player.type.startsWith("ai") && position === 1) {
          if (player.aiConfig?.difficulty === "easy") {
            xpGained += XP_REWARDS.beatAIEasy;
          } else if (player.aiConfig?.difficulty === "normal") {
            xpGained += XP_REWARDS.beatAINormal;
          } else if (player.aiConfig?.difficulty === "hard") {
            xpGained += XP_REWARDS.beatAIHard;
          }
        }

        // Ajouter XP et vérifier level up
        const { player: updatedPlayer, leveledUp } = PlayerService.addXP(
          player,
          xpGained
        );

        return {
          player: updatedPlayer,
          score,
          position,
          xpGained,
          leveledUp,
          newLevel: leveledUp ? updatedPlayer.level : undefined
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((r, idx) => ({ ...r, position: idx + 1 }));

    setRankedPlayers(ranked);

    // Sauvegarder les joueurs mis à jour
    ranked.forEach((r) => {
      if (!r.player.type.startsWith("ai")) {
        PlayerService.savePlayer(r.player);
      }
    });
  }, [players, scores]);

  const triggerLevelUpAnimation = (playerId: string) => {
    setShowingLevelUp(playerId);

    // Animation badge level up
    Animated.sequence([
      Animated.spring(levelUpScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.spring(levelUpScale, {
        toValue: 0,
        tension: 50,
        friction: 5,
        useNativeDriver: true
      })
    ]).start();

    // Animation confetti
    Animated.sequence([
      Animated.timing(confettiOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.delay(2500),
      Animated.timing(confettiOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      })
    ]).start();

    setTimeout(() => setShowingLevelUp(null), 3000);
  };

  useEffect(() => {
    // Déclencher level up animations
    rankedPlayers.forEach((r) => {
      if (r.leveledUp) {
        setTimeout(() => {
          triggerLevelUpAnimation(r.player.id);
        }, r.position * 500);
      }
    });
  }, [rankedPlayers]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Résultats 🏆</Text>
      </View>

      {/* Results List */}
      <ScrollView
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
      >
        {rankedPlayers.map((ranked, idx) => (
          <View key={ranked.player.id} style={styles.resultItem}>
            {/* Position Badge */}
            <View
              style={[
                styles.positionBadge,
                {
                  backgroundColor:
                    ranked.position === 1
                      ? "#FFD700"
                      : ranked.position === 2
                      ? "#C0C0C0"
                      : ranked.position === 3
                      ? "#CD7F32"
                      : "#E1E8ED"
                }
              ]}
            >
              <Text style={styles.positionText}>#{ranked.position}</Text>
            </View>

            {/* Player Info */}
            <View
              style={[
                styles.playerCard,
                { backgroundColor: `${ranked.player.color}10` }
              ]}
            >
              <View style={styles.playerHeader}>
                <View
                  style={[
                    styles.playerAvatar,
                    { backgroundColor: ranked.player.color }
                  ]}
                >
                  <Text style={styles.playerEmoji}>
                    {ranked.player.avatar.emoji ||
                      ranked.player.avatar.initial}
                  </Text>
                </View>
                <View style={styles.playerDetails}>
                  <Text style={styles.playerName}>{ranked.player.name}</Text>
                  <Text style={styles.playerLevel}>
                    Level {ranked.player.level}
                  </Text>
                </View>
              </View>

              {/* Score and XP */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Score</Text>
                  <Text style={styles.statValue}>{ranked.score}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>XP Gagné</Text>
                  <Text style={[styles.statValue, { color: "#50C878" }]}>
                    +{ranked.xpGained}
                  </Text>
                </View>
              </View>

              {/* XP Bar */}
              <View style={styles.xpBarSection}>
                <View style={styles.xpBar}>
                  <View
                    style={[
                      styles.xpBarFill,
                      {
                        width: `${(ranked.player.xp / getXPForLevel(ranked.player.level + 1)) * 100}%`,
                        backgroundColor: ranked.player.color
                      }
                    ]}
                  />
                </View>
                <Text style={styles.xpText}>
                  {ranked.player.xp} / {getXPForLevel(ranked.player.level + 1)} XP
                </Text>
              </View>

              {/* Level Up Indicator */}
              {ranked.leveledUp && showingLevelUp === ranked.player.id && (
                <Animated.View
                  style={[
                    styles.levelUpBadge,
                    { transform: [{ scale: levelUpScale }] }
                  ]}
                >
                  <Text style={styles.levelUpText}>
                    ⬆️ NIVEAU {ranked.newLevel}! 🎉
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartButtonLabel}>🔄 NOUVELLE PARTIE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={onHome}>
          <Text style={styles.homeButtonLabel}>🏠 ACCUEIL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED"
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50"
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  resultItem: {
    marginBottom: 16
  },
  positionBadge: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  positionText: {
    fontSize: 18,
    fontWeight: "800",
    color: "white"
  },
  playerCard: {
    borderRadius: 16,
    padding: 16,
    marginLeft: 20
  },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16
  },
  playerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  playerEmoji: {
    fontSize: 28
  },
  playerDetails: {
    flex: 1
  },
  playerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50"
  },
  playerLevel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)"
  },
  stat: {
    flex: 1,
    alignItems: "center"
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7F8C8D",
    textTransform: "uppercase",
    marginBottom: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2C3E50"
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E1E8ED"
  },
  xpBarSection: {
    marginTop: 12
  },
  xpBar: {
    height: 6,
    backgroundColor: "#E1E8ED",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4
  },
  xpBarFill: {
    height: "100%",
    borderRadius: 3
  },
  xpText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7F8C8D",
    textAlign: "right"
  },
  levelUpBadge: {
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700"
  },
  levelUpText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#E6A500"
  },
  actions: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  restartButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center"
  },
  restartButtonLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "white"
  },
  homeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    borderWidth: 2,
    borderColor: "#4A90E2",
    alignItems: "center"
  },
  homeButtonLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4A90E2"
  }
});
