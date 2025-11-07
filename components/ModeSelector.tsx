import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform
} from "react-native";
import { GameMode } from "../types/player";

interface ModeSelectorProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  gameMode,
  onModeChange
}) => {
  const indicatorAnim = useRef(new Animated.Value(gameMode === "multiplayer" ? 0 : 1)).current;
  const multiplayerScale = useRef(new Animated.Value(gameMode === "multiplayer" ? 1.02 : 1)).current;
  const vsAIScale = useRef(new Animated.Value(gameMode === "vs_ai" ? 1.02 : 1)).current;

  useEffect(() => {
    // Animation du slide indicator
    Animated.spring(indicatorAnim, {
      toValue: gameMode === "multiplayer" ? 0 : 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true
    }).start();

    // Animation des boutons
    Animated.parallel([
      Animated.spring(multiplayerScale, {
        toValue: gameMode === "multiplayer" ? 1.02 : 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true
      }),
      Animated.spring(vsAIScale, {
        toValue: gameMode === "vs_ai" ? 1.02 : 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true
      })
    ]).start();
  }, [gameMode, indicatorAnim, multiplayerScale, vsAIScale]);

  const handleModePress = (mode: GameMode) => {
    if (mode !== gameMode) {
      // Haptic feedback serait ajouté ici
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onModeChange(mode);
    }
  };

  const indicatorTranslateX = indicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 180] // Ajuster selon la largeur réelle
  });

  return (
    <View style={styles.container}>
      <View style={styles.modeSelector}>
        {/* Indicateur animé de sélection */}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX: indicatorTranslateX }]
            }
          ]}
        />

        {/* Bouton Multijoueur */}
        <Animated.View
          style={[
            styles.modeButtonWrapper,
            { transform: [{ scale: multiplayerScale }] }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.modeButton,
              gameMode === "multiplayer" && styles.modeButtonActive
            ]}
            onPress={() => handleModePress("multiplayer")}
            activeOpacity={0.7}
          >
            <Text style={styles.modeIcon}>🎮</Text>
            <Text
              style={[
                styles.modeLabel,
                gameMode === "multiplayer" && styles.modeLabelActive
              ]}
            >
              Multijoueur
            </Text>
            <Text
              style={[
                styles.modeSubtext,
                gameMode === "multiplayer" && styles.modeSubtextActive
              ]}
            >
              2-6 joueurs
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bouton vs IA */}
        <Animated.View
          style={[
            styles.modeButtonWrapper,
            { transform: [{ scale: vsAIScale }] }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.modeButton,
              gameMode === "vs_ai" && styles.modeButtonActive
            ]}
            onPress={() => handleModePress("vs_ai")}
            activeOpacity={0.7}
          >
            <Text style={styles.modeIcon}>🤖</Text>
            <Text
              style={[
                styles.modeLabel,
                gameMode === "vs_ai" && styles.modeLabelActive
              ]}
            >
              vs IA
            </Text>
            <Text
              style={[
                styles.modeSubtext,
                gameMode === "vs_ai" && styles.modeSubtextActive
              ]}
            >
              Solo
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16
  },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 4,
    gap: 8,
    position: "relative"
  },
  indicator: {
    position: "absolute",
    width: "48%",
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    top: 4,
    left: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
      },
      android: {
        elevation: 3
      }
    })
  },
  modeButtonWrapper: {
    flex: 1
  },
  modeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1
  },
  modeButtonActive: {
    backgroundColor: "transparent"
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7F8C8D",
    marginBottom: 4
  },
  modeLabelActive: {
    color: "#2C3E50"
  },
  modeSubtext: {
    fontSize: 12,
    color: "#95A5A6"
  },
  modeSubtextActive: {
    color: "#7F8C8D"
  }
});
