import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView
} from "react-native";
import { AI_OPPONENTS } from "../constants/playerConstants";

interface AISelectorProps {
  onSelect: (difficulty: "easy" | "normal" | "hard") => void;
  selectedDifficulty?: "easy" | "normal" | "hard";
  unlockedDifficulties: string[];
}

export const AISelector: React.FC<AISelectorProps> = ({
  onSelect,
  selectedDifficulty,
  unlockedDifficulties
}) => {
  const [selected, setSelected] = useState(selectedDifficulty || "easy");
  const scaleRefs = useRef({
    easy: new Animated.Value(1),
    normal: new Animated.Value(1),
    hard: new Animated.Value(1)
  });

  const onSelectAI = (difficulty: "easy" | "normal" | "hard") => {
    // Haptic feedback
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animation pulse
    Animated.sequence([
      Animated.spring(scaleRefs.current[difficulty], {
        toValue: 1.05,
        tension: 100,
        friction: 5,
        useNativeDriver: true
      }),
      Animated.spring(scaleRefs.current[difficulty], {
        toValue: 1.02,
        tension: 80,
        friction: 7,
        useNativeDriver: true
      })
    ]).start();

    setSelected(difficulty);
    onSelect(difficulty);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Choisis ton adversaire</Text>

      {AI_OPPONENTS.map((ai) => {
        const isLocked = !unlockedDifficulties.includes(ai.difficulty);
        const isSelected = selected === ai.difficulty;

        return (
          <Animated.View
            key={ai.difficulty}
            style={[
              styles.cardWrapper,
              {
                transform: [
                  { scale: scaleRefs.current[ai.difficulty as "easy" | "normal" | "hard"] }
                ]
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => !isLocked && onSelectAI(ai.difficulty as any)}
              disabled={isLocked}
              activeOpacity={0.8}
              style={[
                styles.card,
                {
                  borderColor: isSelected ? ai.color : "transparent",
                  opacity: isLocked ? 0.6 : 1
                }
              ]}
            >
              {/* Difficulty Badge */}
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: ai.color }
                ]}
              >
                <Text style={styles.difficultyText}>
                  {ai.difficulty.toUpperCase()}
                </Text>
              </View>

              {/* Avatar */}
              <View
                style={[
                  styles.aiAvatar,
                  { backgroundColor: ai.color }
                ]}
              >
                <Text style={styles.aiAvatarEmoji}>{ai.avatar}</Text>
              </View>

              {/* Name */}
              <Text style={styles.aiName}>{ai.name}</Text>
              <Text style={styles.aiDescription}>{ai.description}</Text>

              {/* Personality */}
              <Text style={styles.aiPersonality}>{ai.personality}</Text>

              {/* Stars */}
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Text
                    key={i}
                    style={styles.star}
                  >
                    {i < ai.stars ? "⭐" : "☆"}
                  </Text>
                ))}
              </View>

              {/* Win Rate */}
              <View style={styles.winRateSection}>
                <Text style={styles.winRateLabel}>Taux victoire</Text>
                <View style={styles.winRateBar}>
                  <View
                    style={[
                      styles.winRateFill,
                      {
                        width: `${ai.winRate}%`,
                        backgroundColor: ai.color
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.winRateText, { color: ai.color }]}>
                  ~{ai.winRate}%
                </Text>
              </View>

              {/* Lock Overlay */}
              {isLocked && (
                <View style={styles.lockOverlay}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <Text style={styles.unlockCondition}>
                    {ai.unlockCondition}
                  </Text>
                </View>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <View
                  style={[
                    styles.selectionIndicator,
                    { borderBottomColor: ai.color }
                  ]}
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 20,
    marginHorizontal: 20
  },
  cardWrapper: {
    marginHorizontal: 20,
    marginBottom: 12
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4
  },
  difficultyBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "800",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  aiAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  aiAvatarEmoji: {
    fontSize: 36
  },
  aiName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 4
  },
  aiDescription: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 8
  },
  aiPersonality: {
    fontSize: 12,
    color: "#5D6D7E",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 18
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginBottom: 12
  },
  star: {
    fontSize: 16
  },
  winRateSection: {
    marginTop: 12
  },
  winRateLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7F8C8D",
    textTransform: "uppercase",
    marginBottom: 6
  },
  winRateBar: {
    height: 8,
    backgroundColor: "#E1E8ED",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6
  },
  winRateFill: {
    height: "100%",
    borderRadius: 4
  },
  winRateText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right"
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  unlockCondition: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 20
  },
  selectionIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  }
});
