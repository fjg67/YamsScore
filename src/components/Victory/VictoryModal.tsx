/**
 * Modal de victoire full-screen avec confettis continus
 * Affiche le vainqueur, le podium et les stats
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../theme/premiumTheme';
import { GameSummary } from '../../types/victory.types';
import { useHaptic } from '../../hooks/useHaptic';
import { VICTORY_MESSAGES } from '../../constants/achievements';
import ConfettiSystem from '../Celebrations/ConfettiSystem';
import PodiumAnimation from './PodiumAnimation';
import GameSummaryStats from './GameSummaryStats';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VictoryModalProps {
  visible: boolean;
  summary: GameSummary;
  onNewGame: () => void;
  onShareResults: () => void;
  onClose: () => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({
  visible,
  summary,
  onNewGame,
  onShareResults,
  onClose,
}) => {
  const { success } = useHaptic();
  const [showStats, setShowStats] = useState(false);

  // Animation values
  const titleScale = useSharedValue(0);
  const crownRotation = useSharedValue(-30);

  useEffect(() => {
    if (visible) {
      // Title entrance
      titleScale.value = withDelay(400, withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 12 })
      ));

      // Crown wiggle
      crownRotation.value = withSequence(
        withDelay(600, withSpring(-15, { damping: 8 })),
        withSpring(15, { damping: 8 }),
        withSpring(-10, { damping: 10 }),
        withSpring(0, { damping: 12 })
      );
    }
  }, [visible]);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const crownStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${crownRotation.value}deg` }],
  }));

  const handleNewGame = () => {
    success();
    onNewGame();
  };

  const handleShare = () => {
    success();
    onShareResults();
  };

  const handleClose = () => {
    success();
    onClose();
  };

  const toggleStats = () => {
    success();
    setShowStats(!showStats);
  };

  const victoryMessage = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];

  return (
    <Modal
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Background */}
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460', '#1a1a2e']}
          style={StyleSheet.absoluteFill}
        />

        {/* Continuous confetti */}
        <ConfettiSystem
          active={visible}
          count={200}
          colors={['#FFD700', '#FFA500', '#FF6B6B', '#4A90E2', '#50C878', '#FFFFFF']}
          duration={10000}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.header}>
            <Animated.Text style={[styles.crown, crownStyle]}>👑</Animated.Text>
            <Animated.Text style={[styles.title, titleStyle]}>
              {victoryMessage}
            </Animated.Text>
            <Text style={styles.winnerName}>{summary.winner.player.name}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score Final</Text>
              <Text style={styles.scoreValue}>{summary.winner.score}</Text>
              <Text style={styles.scoreLabel}>points</Text>
            </View>
          </Animated.View>

          {/* Podium or Stats */}
          {!showStats ? (
            <Animated.View entering={SlideInDown.delay(800).springify()} style={styles.podiumContainer}>
              <PodiumAnimation players={summary.players.slice(0, 3)} />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(300)} style={styles.statsContainer}>
              <GameSummaryStats summary={summary} />
            </Animated.View>
          )}

          {/* Actions */}
          <Animated.View entering={SlideInDown.delay(1200).springify()} style={styles.actions}>
            {/* Stats toggle */}
            <TouchableOpacity
              style={styles.statsButton}
              onPress={toggleStats}
              activeOpacity={0.7}
            >
              <Text style={styles.statsButtonText}>
                {showStats ? '🏆 Podium' : '📊 Statistiques'}
              </Text>
            </TouchableOpacity>

            {/* Share button */}
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#4A90E2', '#5DADE2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shareGradient}
              >
                <Text style={styles.shareButtonText}>📤 Partager</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* New game button */}
            <TouchableOpacity
              style={styles.newGameButton}
              onPress={handleNewGame}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#50C878', '#3FA065']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.newGameGradient}
              >
                <Text style={styles.newGameButtonText}>🎲 Nouvelle Partie</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: premiumTheme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.xl,
  },
  crown: {
    fontSize: 64,
    marginBottom: premiumTheme.spacing.sm,
  },
  title: {
    fontSize: premiumTheme.typography.fontSize.display,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: premiumTheme.spacing.sm,
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  winnerName: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: premiumTheme.spacing.md,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  podiumContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statsContainer: {
    flex: 1,
    marginBottom: premiumTheme.spacing.lg,
  },
  actions: {
    gap: premiumTheme.spacing.md,
    paddingBottom: premiumTheme.spacing.xl,
  },
  statsButton: {
    paddingVertical: premiumTheme.spacing.md,
    borderRadius: premiumTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  statsButtonText: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareButton: {
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  shareGradient: {
    paddingVertical: premiumTheme.spacing.md,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newGameButton: {
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  newGameGradient: {
    paddingVertical: premiumTheme.spacing.md,
    alignItems: 'center',
  },
  newGameButtonText: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    paddingVertical: premiumTheme.spacing.sm,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.6,
  },
});

export default VictoryModal;
