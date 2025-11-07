import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Player, PlayerType } from "../types/player";
import { AIEngine, GameState } from "../ai/AIEngine";

interface GameScreenProps {
  players: Player[];
  onGameEnd: (results: GameResult[]) => void;
}

interface GameResult {
  playerId: string;
  playerName: string;
  finalScore: number;
  position: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  players,
  onGameEnd
}) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameScores, setGameScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [diceValues, setDiceValues] = useState<number[]>([]);
  
  const thinkingOpacity = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const aiEngine = useRef<AIEngine | null>(null);

  const currentPlayer = players[currentPlayerIndex];
  const isAIPlayer = [PlayerType.AI_EASY, PlayerType.AI_NORMAL, PlayerType.AI_HARD].includes(
    currentPlayer.type
  );

  useEffect(() => {
    // Initialiser AIEngine si joueur IA
    if (isAIPlayer && currentPlayer.aiConfig) {
      aiEngine.current = new AIEngine(currentPlayer.aiConfig.difficulty);
    }
  }, [currentPlayerIndex, isAIPlayer, currentPlayer]);

  const handlePlayerAction = async (categorySelected: string) => {
    if (isAIPlayer) return;

    // Calculer le score
    const score = calculateScore(categorySelected, diceValues);
    updateScore(currentPlayer.id, score);
    
    // Passer au joueur suivant
    nextPlayer();
  };

  const handleAITurn = useCallback(async () => {
    if (!isAIPlayer || !aiEngine.current) return;

    setAiThinking(true);

    // Simuler temps de réflexion
    const thinkingTime = aiEngine.current.getThinkingTime();

    // Animation thinking
    Animated.timing(thinkingOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();

    await new Promise<void>((resolve) => setTimeout(() => resolve(), thinkingTime));

    // Récupérer le meilleur catégorie
    const availableCategories = ["ones", "twos", "threes", "fours", "fives", "sixes"];
    const gameState: GameState = {
      currentScore: gameScores[currentPlayer.id] || 0,
      usedCategories: availableCategories,
      upperTotal: 0,
      diceValues,
      turnsRemaining: 13
    };

    const selectedCategory = aiEngine.current.chooseCategory(
      availableCategories,
      diceValues,
      gameState
    );

    // Message IA
    const message = aiEngine.current.getMessage("good");
    setAiMessage(message);

    Animated.timing(messageOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();

    // Calculer score
    const score = calculateScore(selectedCategory, diceValues);
    updateScore(currentPlayer.id, score);

    // Attendre avant de passer au suivant
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));

    // Masquer message et thinking
    Animated.parallel([
      Animated.timing(messageOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(thinkingOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();

    setAiThinking(false);
    nextPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAIPlayer, currentPlayer.id, gameScores, diceValues, messageOpacity, thinkingOpacity]);

  const updateScore = (playerId: string, points: number) => {
    setGameScores((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + points
    }));
  };

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);

    if (nextIndex === 0) {
      // Tour complet effectué
      // Vérifier si jeu terminé
      checkGameEnd();
    }
  };

  const checkGameEnd = () => {
    // Jeu terminé après 13 tours
    const results: GameResult[] = players
      .map((p) => ({
        playerId: p.id,
        playerName: p.name,
        finalScore: gameScores[p.id] || 0,
        position: 0
      }))
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((r, idx) => ({ ...r, position: idx + 1 }));

    onGameEnd(results);
  };

  const calculateScore = (category: string, dice: number[]): number => {
    // Implémentation simplifiée
    return dice.reduce((a, b) => a + b, 0);
  };

  useEffect(() => {
    // Lancer le tour IA automatiquement
    if (isAIPlayer) {
      const timer = setTimeout(() => {
        handleAITurn();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex, isAIPlayer, handleAITurn]);

  return (
    <View style={styles.container}>
      {/* Current Player */}
      <View style={styles.currentPlayerSection}>
        <View
          style={[
            styles.playerAvatar,
            { backgroundColor: currentPlayer.color }
          ]}
        >
          <Text style={styles.playerAvatarEmoji}>
            {currentPlayer.avatar.emoji || currentPlayer.avatar.initial}
          </Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{currentPlayer.name}</Text>
          <Text style={styles.playerScore}>
            Score: {gameScores[currentPlayer.id] || 0}
          </Text>
        </View>
      </View>

      {/* AI Thinking Indicator */}
      {aiThinking && (
        <Animated.View style={[styles.thinkingBox, { opacity: thinkingOpacity }]}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.thinkingText}>
            {aiEngine.current?.getMessage("thinking")}
          </Text>
        </Animated.View>
      )}

      {/* AI Message Bubble */}
      {aiMessage && (
        <Animated.View style={[styles.messageBubble, { opacity: messageOpacity }]}>
          <Text style={styles.messageText}>{aiMessage}</Text>
        </Animated.View>
      )}

      {/* Scores Board */}
      <ScrollView style={styles.scoresBoard} showsVerticalScrollIndicator={false}>
        {players.map((player, idx) => (
          <View
            key={player.id}
            style={[
              styles.scoreRow,
              idx === currentPlayerIndex && styles.scoreRowActive
            ]}
          >
            <View
              style={[
                styles.scoreRowAvatar,
                { backgroundColor: player.color }
              ]}
            >
              <Text style={styles.scoreRowEmoji}>
                {player.avatar.emoji || player.avatar.initial}
              </Text>
            </View>
            <Text style={styles.scoreRowName}>{player.name}</Text>
            <Text style={styles.scoreRowScore}>
              {gameScores[player.id] || 0} pts
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Dice Display */}
      <View style={styles.diceSection}>
        <Text style={styles.diceTitle}>Les dés</Text>
        <View style={styles.diceContainer}>
          {diceValues.map((value, idx) => (
            <View key={idx} style={styles.die}>
              <Text style={styles.dieValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      {!isAIPlayer && (
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.rollButton}
            onPress={() => {
              const newDice = [...Array(5)].map(() => Math.floor(Math.random() * 6) + 1);
              setDiceValues(newDice);
            }}
          >
            <Text style={styles.rollButtonLabel}>🎲 Relancer les dés</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scoreButton}
            onPress={() => handlePlayerAction("ones")}
          >
            <Text style={styles.scoreButtonLabel}>Valider la catégorie</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20
  },
  currentPlayerSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
    gap: 12
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  playerAvatarEmoji: {
    fontSize: 32
  },
  playerInfo: {
    flex: 1
  },
  playerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50"
  },
  playerScore: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F8C8D",
    marginTop: 4
  },
  thinkingBox: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    marginVertical: 12
  },
  thinkingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 12
  },
  messageBubble: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center"
  },
  scoresBoard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginVertical: 16,
    maxHeight: 150
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 12,
    marginBottom: 4
  },
  scoreRowActive: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#4A90E2"
  },
  scoreRowAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  scoreRowEmoji: {
    fontSize: 18
  },
  scoreRowName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3E50"
  },
  scoreRowScore: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A90E2"
  },
  diceSection: {
    marginVertical: 16
  },
  diceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7F8C8D",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12
  },
  diceContainer: {
    flexDirection: "row",
    gap: 8
  },
  die: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E1E8ED"
  },
  dieValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50"
  },
  actionsSection: {
    gap: 12,
    marginVertical: 16
  },
  rollButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#50C878",
    alignItems: "center"
  },
  rollButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "white"
  },
  scoreButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center"
  },
  scoreButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "white"
  }
});
