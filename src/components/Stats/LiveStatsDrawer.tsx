/**
 * Drawer de statistiques en temps réel
 * Affiche stats détaillées, classement, progression
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { premiumTheme } from '../../theme/premiumTheme';
import { useGameStats } from '../../hooks/useGameStats';
import { useHaptic } from '../../hooks/useHaptic';
import { CategoryLabels } from '../../constants';

interface LiveStatsDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const LiveStatsDrawer: React.FC<LiveStatsDrawerProps> = ({ visible, onClose }) => {
  const { light } = useHaptic();
  const gameStats = useGameStats();

  const handleClose = () => {
    light();
    onClose();
  };

  if (!gameStats) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Background blur */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.8)"
        />
      </TouchableOpacity>

      {/* Drawer */}
      <Animated.View
        entering={SlideInRight.duration(300).springify()}
        exiting={SlideOutRight.duration(200)}
        style={styles.drawer}
      >
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.drawerGradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>📊 Statistiques Live</Text>
              <Text style={styles.subtitle}>
                Tour {gameStats.currentTurn} / {gameStats.totalTurns}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Leader Info */}
            {gameStats.leader && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>👑 Leader Actuel</Text>
                <View style={styles.leaderCard}>
                  <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.leaderGradient}
                  >
                    <Text style={styles.leaderName}>
                      {gameStats.leader.playerName}
                    </Text>
                    <Text style={styles.leaderScore}>
                      {gameStats.leader.currentTotal} pts
                    </Text>
                    {gameStats.isCloseGame && (
                      <Text style={styles.leaderNote}>
                        🔥 Partie serrée ! (+{gameStats.scoreDifference} pts)
                      </Text>
                    )}
                  </LinearGradient>
                </View>
              </View>
            )}

            {/* Player Stats */}
            {gameStats.playerStats.map((player, index) => (
              <View key={player.playerId} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {player.playerName}
                </Text>

                {/* Overall Progress */}
                <View style={styles.statCard}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Score Total</Text>
                    <Text style={styles.statValue}>{player.currentTotal} pts</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Progression</Text>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${player.completionRate}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{player.completionRate}%</Text>
                    </View>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Cases Remplies</Text>
                    <Text style={styles.statValue}>
                      {player.categoriesFilled} / 13
                    </Text>
                  </View>
                </View>

                {/* Section Scores */}
                <View style={styles.statCard}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Section Supérieure</Text>
                    <Text style={styles.statValue}>
                      {player.upperSectionTotal} pts
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Progression Bonus</Text>
                    <View style={styles.bonusProgressContainer}>
                      <View style={styles.bonusProgressBar}>
                        <View
                          style={[
                            styles.bonusProgressFill,
                            {
                              width: `${(player.bonusProgress / 63) * 100}%`,
                              backgroundColor: player.hasBonus ? '#50C878' : '#4A90E2',
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.bonusText}>
                        {player.bonusProgress} / 63
                        {player.hasBonus && ' ⭐'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Section Inférieure</Text>
                    <Text style={styles.statValue}>
                      {player.lowerSectionTotal} pts
                    </Text>
                  </View>
                </View>

                {/* Performance */}
                <View style={styles.statCard}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Moyenne/Catégorie</Text>
                    <Text style={styles.statValue}>{player.averageScore} pts</Text>
                  </View>
                  {player.bestScore && (
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>🌟 Meilleur Coup</Text>
                      <Text style={styles.statHighlight}>
                        {CategoryLabels[player.bestScore.category]}: {player.bestScore.value} pts
                      </Text>
                    </View>
                  )}
                  {player.worstScore && player.worstScore.value > 0 && (
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>📉 Coup Faible</Text>
                      <Text style={styles.statWarning}>
                        {CategoryLabels[player.worstScore.category]}: {player.worstScore.value} pts
                      </Text>
                    </View>
                  )}
                </View>

                {/* Achievements */}
                {(player.perfectScores.length > 0 || player.crossedCategories.length > 0) && (
                  <View style={styles.statCard}>
                    {player.perfectScores.length > 0 && (
                      <View style={styles.achievementRow}>
                        <Text style={styles.achievementLabel}>💎 Scores Parfaits</Text>
                        <Text style={styles.achievementCount}>
                          {player.perfectScores.length}
                        </Text>
                      </View>
                    )}
                    {player.crossedCategories.length > 0 && (
                      <View style={styles.achievementRow}>
                        <Text style={styles.achievementLabel}>❌ Cases Barrées</Text>
                        <Text style={styles.achievementCount}>
                          {player.crossedCategories.length}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}

            {/* Predictions */}
            {gameStats.projectedWinner && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔮 Prédiction</Text>
                <View style={styles.predictionCard}>
                  <Text style={styles.predictionText}>
                    Si la tendance continue...
                  </Text>
                  <Text style={styles.predictionWinner}>
                    {gameStats.playerStats.find(
                      (p) => p.playerId === gameStats.projectedWinner
                    )?.playerName}{' '}
                    devrait gagner
                  </Text>
                  <Text style={styles.predictionScore}>
                    Score projeté: ~{gameStats.projectedFinalScore} pts
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 400,
    ...premiumTheme.colors.shadows.heavy,
  },
  drawerGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: premiumTheme.spacing.lg,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: premiumTheme.spacing.lg,
  },
  section: {
    marginBottom: premiumTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: premiumTheme.spacing.sm,
  },
  leaderCard: {
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  leaderGradient: {
    padding: premiumTheme.spacing.md,
    alignItems: 'center',
  },
  leaderName: {
    fontSize: premiumTheme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  leaderScore: {
    fontSize: premiumTheme.typography.fontSize.display,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  leaderNote: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: premiumTheme.borderRadius.lg,
    padding: premiumTheme.spacing.md,
    marginBottom: premiumTheme.spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.sm,
  },
  statLabel: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  statValue: {
    fontSize: premiumTheme.typography.fontSize.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statHighlight: {
    fontSize: premiumTheme.typography.fontSize.base,
    fontWeight: '600',
    color: '#50C878',
  },
  statWarning: {
    fontSize: premiumTheme.typography.fontSize.base,
    fontWeight: '600',
    color: '#F39C12',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: premiumTheme.spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: premiumTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: premiumTheme.spacing.sm,
    minWidth: 40,
  },
  bonusProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: premiumTheme.spacing.md,
  },
  bonusProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bonusProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  bonusText: {
    fontSize: premiumTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: premiumTheme.spacing.sm,
    minWidth: 60,
  },
  achievementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.xs,
  },
  achievementLabel: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  achievementCount: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  predictionCard: {
    backgroundColor: 'rgba(138,43,226,0.2)',
    borderRadius: premiumTheme.borderRadius.lg,
    padding: premiumTheme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(138,43,226,0.4)',
  },
  predictionText: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  predictionWinner: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  predictionScore: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});

export default LiveStatsDrawer;
