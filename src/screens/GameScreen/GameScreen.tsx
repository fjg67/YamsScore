import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Animated, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  Player,
  GameState,
  ActiveCell,
  CategoryType,
  createEmptyPlayerScores,
} from '../../types/game';
import { updateTotals } from '../../utils/scoreCalculator';
import GameHeader from './components/GameHeader';
import PremiumScoreGrid from './components/PremiumScoreGrid';
import EnhancedNumPad from './components/EnhancedNumPad';
import BottomIndicator from './components/BottomIndicator';
import ParticleSystem from '../../animations/components/ParticleSystem';
import ScreenFlash from '../../animations/components/ScreenFlash';
import AnimatedMessage from '../../animations/components/AnimatedMessage';
import CelebrationModal from '../../animations/components/CelebrationModal';
import GlowEffect from '../../animations/components/GlowEffect';
import GameEndModal from './components/GameEndModal';
import { useScoreAnimation } from '../../animations/hooks/useScoreAnimation';
import { useAIPlayer } from './hooks/useAIPlayer';
import { saveGameToHistory } from '../../../services/gameHistoryService';
import { GameProgressionIntegration } from '../../services/GameProgressionIntegration';
import { QuestTrackerService } from '../../services/QuestTrackerService';

const { width, height } = Dimensions.get('window');

// Floating particles component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(height);
      translateX.setValue(Math.random() * width);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.15 + Math.random() * 0.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8 + Math.random() * 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [delay, translateY, translateX, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

interface GameScreenProps {
  players: Player[];
  onGameEnd?: (gameState: GameState) => void;
  onBack?: () => void;
  onNavigateToHistory?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ players, onGameEnd, onBack, onNavigateToHistory }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize game state
    const initialScores: Record<string, any> = {};
    players.forEach((player) => {
      initialScores[player.id] = createEmptyPlayerScores();
    });

    return {
      gameId: Date.now().toString(),
      gameName: 'SESSION PREMIUM',
      players,
      scores: initialScores,
      currentTurn: 1,
      totalTurns: 13,
      currentPlayerIndex: 0,
      isGameComplete: false,
      startedAt: Date.now(),
    };
  });

  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [isNumPadVisible, setIsNumPadVisible] = useState(false);
  const [gameEndModalVisible, setGameEndModalVisible] = useState(false);
  const [gameEndData, setGameEndData] = useState<{
    winnerName: string;
    winnerScore: number;
    completedQuests: any[];
    levelUp: boolean;
    newLevel?: number;
    totalXP: number;
  } | null>(null);

  // Animation refs
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  // Animate background on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [backgroundOpacity, glowAnim]);

  // Hook d'animations
  const { playScoreAnimation, celebrationModal, closeCelebrationModal } = useScoreAnimation();

  // Hook IA - Pour gérer automatiquement les tours de l'IA
  const currentPlayer = players[gameState.currentPlayerIndex];
  const { isAIThinking, aiMessage, thinkingOpacity, messageScale } = useAIPlayer(
    currentPlayer,
    gameState,
    (category: CategoryType, score: number, isCrossed: boolean) => {
      // Callback quand l'IA joue son coup
      handleAIMove(category, score, isCrossed);
    }
  );

  const handleAIMove = async (category: CategoryType, score: number, isCrossed: boolean) => {
    const playerId = currentPlayer.id;
    const oldScores = gameState.scores[playerId];
    let isBonusEarned = false;

    // Update score
    setGameState((prevState) => {
      const newScores = { ...prevState.scores };
      const playerScores = { ...newScores[playerId] };

      // Set score entry
      playerScores[category] = {
        value: score,
        isCrossed,
        turn: prevState.currentTurn,
      };

      // Recalculate totals
      const updatedScores = updateTotals(playerScores);
      newScores[playerId] = updatedScores;

      // Check si bonus vient d'être gagné
      if (oldScores.upperBonus === 0 && updatedScores.upperBonus === 35) {
        isBonusEarned = true;
      }

      // Move to next player
      let nextPlayerIndex = prevState.currentPlayerIndex + 1;
      let nextTurn = prevState.currentTurn;

      if (nextPlayerIndex >= players.length) {
        nextPlayerIndex = 0;
        nextTurn += 1;
      }

      return {
        ...prevState,
        scores: newScores,
        currentPlayerIndex: nextPlayerIndex,
        currentTurn: nextTurn,
      };
    });

    // JOUER L'ANIMATION ! 🎉
    await playScoreAnimation({
      category,
      score,
      playerColor: currentPlayer?.color || '#FF5722',
      context: {
        isBonusEarned,
        isFirstScore: gameState.currentTurn === 1,
        isLastTurn: gameState.currentTurn === 13,
        isCrossed, // Ajouter le contexte pour animation barré
      },
    });
  };

  // Check if game is complete
  useEffect(() => {
    const allPlayersComplete = players.every((player) => {
      const playerScores = gameState.scores[player.id];
      const allCategories: CategoryType[] = [
        'ones',
        'twos',
        'threes',
        'fours',
        'fives',
        'sixes',
        'threeOfKind',
        'fourOfKind',
        'fullHouse',
        'smallStraight',
        'largeStraight',
        'yams',
        'chance',
      ];

      return allCategories.every(
        (cat) => playerScores[cat]?.value !== null
      );
    });

    if (allPlayersComplete && !gameState.isGameComplete) {
      handleGameComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.scores, gameState.isGameComplete]);

  const handleCellPress = (playerId: string, category: CategoryType) => {
    const activePlayer = players[gameState.currentPlayerIndex];

    // Check if it's this player's turn
    if (playerId !== activePlayer.id) {
      Alert.alert(
        'Pas ton tour !',
        `C'est au tour de ${activePlayer.name}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if cell is already filled
    const entry = gameState.scores[playerId][category];
    if (entry?.value !== null) {
      Alert.alert(
        'Déjà rempli',
        'Cette ligne est déjà remplie',
        [{ text: 'OK' }]
      );
      return;
    }

    // Open numpad
    setActiveCell({ playerId, category });
    setIsNumPadVisible(true);
  };

  const handleScoreSubmit = async (value: number, isCrossed: boolean) => {
    if (!activeCell) return;

    const { playerId, category } = activeCell;
    const cellPlayer = players.find((p) => p.id === playerId);

    // Déterminer si bonus gagné
    const oldScores = gameState.scores[playerId];
    let isBonusEarned = false;

    // Update score
    setGameState((prevState) => {
      const newScores = { ...prevState.scores };
      const playerScores = { ...newScores[playerId] };

      // Set score entry
      playerScores[category] = {
        value,
        isCrossed,
        turn: prevState.currentTurn,
      };

      // Recalculate totals
      const updatedScores = updateTotals(playerScores);
      newScores[playerId] = updatedScores;

      // Check si bonus vient d'être gagné
      if (oldScores.upperBonus === 0 && updatedScores.upperBonus === 35) {
        isBonusEarned = true;
      }

      // Move to next player
      let nextPlayerIndex = prevState.currentPlayerIndex + 1;
      let nextTurn = prevState.currentTurn;

      if (nextPlayerIndex >= players.length) {
        nextPlayerIndex = 0;
        nextTurn += 1;
      }

      return {
        ...prevState,
        scores: newScores,
        currentPlayerIndex: nextPlayerIndex,
        currentTurn: nextTurn,
      };
    });

    // Close numpad
    setIsNumPadVisible(false);
    setActiveCell(null);

    // JOUER L'ANIMATION ! 🎉
    await playScoreAnimation({
      category,
      score: value,
      playerColor: cellPlayer?.color || '#4A90E2',
      context: {
        isBonusEarned,
        isFirstScore: gameState.currentTurn === 1,
        isLastTurn: gameState.currentTurn === 13,
        isCrossed, // Ajouter le contexte pour animation barré
      },
    });
  };

  const handleNumPadCancel = () => {
    setIsNumPadVisible(false);
    setActiveCell(null);
  };

  const handleGameComplete = async () => {
    const completedGameState = {
      ...gameState,
      isGameComplete: true,
      completedAt: Date.now(),
    };

    setGameState(completedGameState);

    // Find winner
    const winner = players.reduce((prev, current) => {
      const prevScore = completedGameState.scores[prev.id]?.grandTotal || 0;
      const currentScore = completedGameState.scores[current.id]?.grandTotal || 0;
      return currentScore > prevScore ? current : prev;
    });

    // Sauvegarder la partie dans l'historique
    try {
      await saveGameToHistory(completedGameState);
      console.log('✅ Partie sauvegardée dans l\'historique');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
    }

    // 🎮 SYSTÈME DE PROGRESSION - Calculer XP et achievements
    try {
      // Trouver le joueur humain (non-IA)
      const humanPlayer = players.find((p) => !p.isAI);
      if (humanPlayer) {
        const humanScore = completedGameState.scores[humanPlayer.id];
        const wonGame = winner.id === humanPlayer.id;
        const finalScore = humanScore?.grandTotal || 0;

        // Compter les Yams
        const yamsCount = humanScore?.yams?.value ? 1 : 0;

        // Vérifier partie parfaite
        const isPerfectGame = finalScore === 375;

        // Bonus obtenu ?
        const bonusAchieved = (humanScore?.upperBonus || 0) === 35;

        // Si victoire contre IA, récupérer difficulté
        const aiOpponent = players.find((p) => p.isAI);
        const aiDifficulty = aiOpponent?.aiDifficulty as 'easy' | 'normal' | 'hard' | undefined;

        // Intégrer progression
        const progressionResult = await GameProgressionIntegration.onGameEnd({
          won: wonGame,
          score: finalScore,
          isAI: !!aiOpponent,
          aiDifficulty,
          isPerfectGame,
          yamsCount,
          bonusAchieved,
        });

        // Tracker les quêtes
        const questResult = await QuestTrackerService.trackGameEnd({
          playerScore: finalScore,
          isWinner: wonGame,
          hasYams: yamsCount,
          hadAI: !!aiOpponent,
          defeatedAI: wonGame && !!aiOpponent,
        });

        // Calculer le total XP des quêtes
        const totalQuestXP = questResult.completedQuests.reduce((sum, q) => sum + q.rewards.xp, 0);

        // Préparer les données pour le modal
        setGameEndData({
          winnerName: winner.name,
          winnerScore: completedGameState.scores[winner.id]?.grandTotal || 0,
          completedQuests: questResult.completedQuests,
          levelUp: progressionResult.levelUp || false,
          newLevel: progressionResult.newLevel,
          totalXP: totalQuestXP + (progressionResult.xpGained || 0),
        });

        // Afficher le modal après un petit délai
        setTimeout(() => {
          setGameEndModalVisible(true);
        }, 300);

        console.log('✅ Progression mise à jour:', progressionResult);
        console.log('🎯 Quêtes complétées:', questResult.completedQuests);
      } else {
        // Pas de joueur humain, afficher le résultat simple
        setGameEndData({
          winnerName: winner.name,
          winnerScore: completedGameState.scores[winner.id]?.grandTotal || 0,
          completedQuests: [],
          levelUp: false,
          totalXP: 0,
        });

        setTimeout(() => {
          setGameEndModalVisible(true);
        }, 300);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la progression:', error);

      // En cas d'erreur, afficher quand même le modal avec les infos de base
      setGameEndData({
        winnerName: winner.name,
        winnerScore: completedGameState.scores[winner.id]?.grandTotal || 0,
        completedQuests: [],
        levelUp: false,
        totalXP: 0,
      });

      setTimeout(() => {
        setGameEndModalVisible(true);
      }, 300);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.fullScreen}>
      {/* Animated Background with Gradient */}
      <Animated.View
        style={[
          styles.background,
          {
            opacity: backgroundOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowContainer,
            { opacity: glowAnim }
          ]}
        >
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.3)', 'transparent', 'rgba(118, 75, 162, 0.3)']}
            style={styles.glowGradient}
          />
        </Animated.View>

        {/* Floating Particles */}
        <View style={styles.particlesContainer}>
          {[...Array(20)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 300} />
          ))}
        </View>
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <GameHeader
          gameName={gameState.gameName}
          currentTurn={gameState.currentTurn}
          totalTurns={gameState.totalTurns}
          onBack={handleBack}
        />
      </SafeAreaView>
      <View style={styles.container}>

        {/* IA Thinking Indicator */}
        {isAIThinking && (
          <Animated.View style={[styles.aiThinkingContainer, { opacity: thinkingOpacity }]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.25)']}
              style={styles.aiThinkingBox}
            >
              <Text style={styles.aiThinkingEmoji}>🤖</Text>
              <Text style={styles.aiThinkingText}>L'IA réfléchit...</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* IA Message Bubble */}
        {aiMessage && (
          <Animated.View
            style={[
              styles.aiMessageContainer,
              { transform: [{ scale: messageScale }] },
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.25)']}
              style={styles.aiMessageBubble}
            >
              <Text style={styles.aiMessageText}>{aiMessage}</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Premium Score Grid */}
        <PremiumScoreGrid
          players={players}
          scores={gameState.scores}
          currentPlayerIndex={gameState.currentPlayerIndex}
          activeCell={activeCell}
          onCellPress={handleCellPress}
        />

        {/* Bottom Indicator */}
        <BottomIndicator
          currentPlayer={currentPlayer}
          currentTurn={gameState.currentTurn}
          totalTurns={gameState.totalTurns}
        />

        {/* Enhanced NumPad Modal */}
        <EnhancedNumPad
          visible={isNumPadVisible}
          player={activeCell ? players.find((p) => p.id === activeCell.playerId) || null : null}
          category={activeCell?.category || null}
          onSubmit={handleScoreSubmit}
          onCancel={handleNumPadCancel}
        />

        {/* Particle System Global */}
        <ParticleSystem />

        {/* Screen Flash Effect */}
        <ScreenFlash />

        {/* Animated Message Popup */}
        <AnimatedMessage />

        {/* Glow Effect */}
        <GlowEffect />

        {/* Celebration Modal */}
        {celebrationModal && (
          <CelebrationModal
            visible={celebrationModal.visible}
            config={celebrationModal.config}
            onClose={closeCelebrationModal}
          />
        )}

        {/* Game End Modal */}
        {gameEndData && (
          <GameEndModal
            visible={gameEndModalVisible}
            winnerName={gameEndData.winnerName}
            winnerScore={gameEndData.winnerScore}
            completedQuests={gameEndData.completedQuests}
            levelUp={gameEndData.levelUp}
            newLevel={gameEndData.newLevel}
            totalXP={gameEndData.totalXP}
            onViewHistory={() => {
              setGameEndModalVisible(false);
              // Navigation vers l'historique
              if (onNavigateToHistory) {
                onNavigateToHistory();
              }
            }}
            onClose={() => {
              setGameEndModalVisible(false);
              if (onBack) {
                onBack();
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  glowGradient: {
    flex: 1,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  aiThinkingContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  aiThinkingBox: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  aiThinkingEmoji: {
    fontSize: 24,
  },
  aiThinkingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  aiMessageContainer: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  aiMessageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  aiMessageText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default GameScreen;
