import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { SavedGame } from '../../../services/gameHistoryService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GameDetailsModalProps {
  visible: boolean;
  game: SavedGame;
  onClose: () => void;
  onReplay: () => void;
}

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  visible,
  game,
  onClose,
  onReplay,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const timeStr = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isToday) return `Aujourd'hui à ${timeStr}`;

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const winner = game.players.find(p => p.id === game.winner.id);
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  const averageScore = Math.round(
    game.players.reduce((sum, p) => sum + p.score, 0) / game.players.length
  );

  // Extract score details if available
  const getScoreDetails = (playerId: string) => {
    const playerScores = game.gameState?.scores?.[playerId];
    if (!playerScores) return null;

    const highlights = [];

    // Check for Yams
    if (playerScores.yams && playerScores.yams.value === 50) {
      highlights.push({ icon: '⚡', text: 'Yams: 50 pts' });
    }

    // Check for bonus
    if (playerScores.upperBonus > 0) {
      highlights.push({ icon: '🎯', text: `Bonus: ${playerScores.upperBonus} pts` });
    }

    // Check for large straight
    if (playerScores.largeStraight && playerScores.largeStraight.value === 40) {
      highlights.push({ icon: '💎', text: 'Grande suite: 40 pts' });
    }

    // Check for small straight
    if (playerScores.smallStraight && playerScores.smallStraight.value === 30) {
      highlights.push({ icon: '🌟', text: 'Petite suite: 30 pts' });
    }

    // Check for full house
    if (playerScores.fullHouse && playerScores.fullHouse.value === 25) {
      highlights.push({ icon: '🏠', text: 'Full: 25 pts' });
    }

    return highlights;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>←</Text>
              <Text style={styles.closeText}>Fermer</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Détails</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Game Info */}
            <View style={styles.section}>
              <Text style={styles.gameName}>{game.gameName}</Text>
              <Text style={styles.timestamp}>{formatDate(game.completedAt)}</Text>
            </View>

            {/* Winner Section */}
            {winner && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>👑</Text>
                  <Text style={styles.sectionTitle}>VAINQUEUR</Text>
                </View>

                <LinearGradient
                  colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.08)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.winnerCard}
                >
                  <View style={styles.winnerHeader}>
                    <View style={styles.winnerLeft}>
                      <View
                        style={[
                          styles.winnerColorDot,
                          { backgroundColor: winner.color || '#FFD700' },
                        ]}
                      />
                      <Text style={styles.winnerName}>{winner.name}</Text>
                    </View>
                    <Text style={styles.winnerScore}>{winner.score} pts</Text>
                  </View>

                  {/* Winner Highlights */}
                  {getScoreDetails(winner.id) && (
                    <View style={styles.highlightsList}>
                      {getScoreDetails(winner.id)!.map((highlight, idx) => (
                        <View key={idx} style={styles.highlightItem}>
                          <Text style={styles.highlightIcon}>{highlight.icon}</Text>
                          <Text style={styles.highlightText}>{highlight.text}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </LinearGradient>
              </View>
            )}

            {/* All Scores */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📊</Text>
                <Text style={styles.sectionTitle}>TOUS LES SCORES</Text>
              </View>

              <View style={styles.scoresContainer}>
                {sortedPlayers.map((player, idx) => (
                  <View key={player.id} style={styles.scoreRow}>
                    <View style={styles.scoreLeft}>
                      <Text style={styles.rank}>{idx + 1}️⃣</Text>
                      <View
                        style={[
                          styles.playerColorDot,
                          { backgroundColor: player.color || '#4A90E2' },
                        ]}
                      />
                      <Text style={styles.scorePlayerName}>{player.name}</Text>
                      {player.isAI && <Text style={styles.aiLabel}>🤖</Text>}
                    </View>
                    <Text style={styles.scoreValue}>{player.score} pts</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Statistics */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📈</Text>
                <Text style={styles.sectionTitle}>STATISTIQUES</Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>
                    <Text style={styles.statIcon}>⏱️</Text>  Durée:
                  </Text>
                  <Text style={styles.statValue}>{game.duration} min</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>
                    <Text style={styles.statIcon}>🎯</Text>  Tours:
                  </Text>
                  <Text style={styles.statValue}>{game.totalTurns}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>
                    <Text style={styles.statIcon}>💯</Text>  Score moyen:
                  </Text>
                  <Text style={styles.statValue}>{averageScore} pts</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>
                    <Text style={styles.statIcon}>👥</Text>  Joueurs:
                  </Text>
                  <Text style={styles.statValue}>{game.players.length}</Text>
                </View>
              </View>
            </View>

            {/* Moments Forts */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🎬</Text>
                <Text style={styles.sectionTitle}>MOMENTS FORTS</Text>
              </View>

              <View style={styles.highlightsContainer}>
                {sortedPlayers.map(player => {
                  const highlights = getScoreDetails(player.id);
                  if (!highlights || highlights.length === 0) return null;

                  return (
                    <View key={player.id} style={styles.playerHighlights}>
                      <Text style={styles.playerHighlightName}>
                        • {player.name}:{' '}
                      </Text>
                      <View style={styles.playerHighlightItems}>
                        {highlights.map((h, idx) => (
                          <Text key={idx} style={styles.playerHighlightText}>
                            {h.text} {h.icon}
                          </Text>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity onPress={onReplay} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionIcon}>🔄</Text>
                  <Text style={styles.actionButtonText}>REJOUER CETTE PARTIE</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
                <Text style={styles.secondaryIcon}>📤</Text>
                <Text style={styles.secondaryButtonText}>PARTAGER</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  gameName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  winnerCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  winnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  winnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  winnerColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  winnerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFD700',
  },
  winnerScore: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
  },
  highlightsList: {
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightIcon: {
    fontSize: 16,
  },
  highlightText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scoresContainer: {
    gap: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rank: {
    fontSize: 18,
  },
  playerColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scorePlayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiLabel: {
    fontSize: 14,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  highlightsContainer: {
    gap: 12,
  },
  playerHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  playerHighlightName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playerHighlightItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerHighlightText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryIcon: {
    fontSize: 20,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default GameDetailsModal;
