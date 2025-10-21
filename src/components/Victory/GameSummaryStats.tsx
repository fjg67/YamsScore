/**
 * Résumé statistique de la partie terminée
 * Affiche les highlights et records
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../theme/premiumTheme';
import { GameSummary, PodiumPlayer } from '../../types/victory.types';

interface GameSummaryStatsProps {
  summary: GameSummary;
}

const GameSummaryStats: React.FC<GameSummaryStatsProps> = ({ summary }) => {
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Game Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Informations de Partie</Text>
        <View style={styles.statCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Durée de la partie</Text>
            <Text style={styles.statValue}>{formatDuration(summary.duration)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Nombre de tours</Text>
            <Text style={styles.statValue}>{summary.totalTurns}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Joueurs</Text>
            <Text style={styles.statValue}>{summary.players.length}</Text>
          </View>
        </View>
      </View>

      {/* Player Achievements */}
      {summary.players.map((player, index) => (
        <View key={player.player.id} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {player.player.name}
          </Text>

          {/* Achievements */}
          {player.achievements.length > 0 && (
            <View style={styles.achievementsContainer}>
              {player.achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementBadge}>
                  <LinearGradient
                    colors={['rgba(255,215,0,0.2)', 'rgba(255,165,0,0.2)']}
                    style={styles.achievementGradient}
                  >
                    <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          )}

          {/* Highlights */}
          {player.highlights.length > 0 && (
            <View style={styles.highlightsContainer}>
              {player.highlights.map((highlight, idx) => (
                <View key={idx} style={styles.highlightRow}>
                  <Text style={styles.highlightEmoji}>{highlight.emoji}</Text>
                  <Text style={styles.highlightLabel}>{highlight.label}</Text>
                  <Text style={[
                    styles.highlightValue,
                    highlight.color && { color: highlight.color }
                  ]}>
                    {highlight.value}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      {/* Game Moments */}
      {summary.gameMoments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Moments Clés</Text>
          <View style={styles.momentsContainer}>
            {summary.gameMoments.map((moment) => (
              <View key={moment.id} style={styles.momentCard}>
                <View style={styles.momentHeader}>
                  <Text style={styles.momentEmoji}>{moment.emoji}</Text>
                  <Text style={styles.momentTurn}>Tour {moment.turn}</Text>
                </View>
                <Text style={styles.momentPlayer}>{moment.playerName}</Text>
                <Text style={styles.momentDescription}>{moment.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Records */}
      {summary.records.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Records de la Partie</Text>
          <View style={styles.recordsContainer}>
            {summary.records.map((record, idx) => (
              <View key={idx} style={styles.recordCard}>
                <LinearGradient
                  colors={['rgba(74,144,226,0.1)', 'rgba(80,200,120,0.1)']}
                  style={styles.recordGradient}
                >
                  <Text style={styles.recordEmoji}>{record.emoji}</Text>
                  <Text style={styles.recordDescription}>{record.description}</Text>
                  <Text style={styles.recordPlayer}>{record.playerName}</Text>
                  <Text style={styles.recordValue}>{record.value}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: premiumTheme.borderRadius.lg,
    padding: premiumTheme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: premiumTheme.spacing.xs,
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
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: premiumTheme.spacing.sm,
    marginBottom: premiumTheme.spacing.sm,
  },
  achievementBadge: {
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  achievementGradient: {
    paddingHorizontal: premiumTheme.spacing.md,
    paddingVertical: premiumTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: premiumTheme.spacing.xs,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementTitle: {
    fontSize: premiumTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  highlightsContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: premiumTheme.borderRadius.lg,
    padding: premiumTheme.spacing.md,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: premiumTheme.spacing.xs,
    gap: premiumTheme.spacing.sm,
  },
  highlightEmoji: {
    fontSize: 20,
  },
  highlightLabel: {
    flex: 1,
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  highlightValue: {
    fontSize: premiumTheme.typography.fontSize.base,
    fontWeight: 'bold',
    color: '#50C878',
  },
  momentsContainer: {
    gap: premiumTheme.spacing.sm,
  },
  momentCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: premiumTheme.borderRadius.lg,
    padding: premiumTheme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  momentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.xs,
  },
  momentEmoji: {
    fontSize: 24,
  },
  momentTurn: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  momentPlayer: {
    fontSize: premiumTheme.typography.fontSize.base,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 4,
  },
  momentDescription: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  recordsContainer: {
    gap: premiumTheme.spacing.sm,
  },
  recordCard: {
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  recordGradient: {
    padding: premiumTheme.spacing.md,
    alignItems: 'center',
  },
  recordEmoji: {
    fontSize: 32,
    marginBottom: premiumTheme.spacing.xs,
  },
  recordDescription: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 4,
  },
  recordPlayer: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  recordValue: {
    fontSize: premiumTheme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default GameSummaryStats;
