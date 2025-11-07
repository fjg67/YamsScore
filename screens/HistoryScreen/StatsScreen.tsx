import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { getGameStats, getGameHistory } from '../../services/gameHistoryService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StatsScreenProps {
  onBack: () => void;
}

interface PlayerStat {
  name: string;
  gamesPlayed: number;
  wins: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  winRate: number;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [totalYams, setTotalYams] = useState(0);
  const [bonusCount, setBonusCount] = useState(0);
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stats = await getGameStats();
      const history = await getGameHistory();

      setTotalGames(stats.totalGames);

      // Calculate aggregate stats
      let maxScore = 0;
      let totalScoreSum = 0;
      let gameCount = 0;
      let yamsCount = 0;
      let bonusesCount = 0;

      history.forEach(game => {
        game.players.forEach(player => {
          if (player.score > maxScore) maxScore = player.score;
          totalScoreSum += player.score;
          gameCount++;

          // Count Yams and bonuses from game state
          const playerScores = game.gameState?.scores?.[player.id];
          if (playerScores) {
            if (playerScores.yams && playerScores.yams.value === 50) {
              yamsCount++;
            }
            if (playerScores.upperBonus > 0) {
              bonusesCount++;
            }
          }
        });
      });

      setBestScore(maxScore);
      setAverageScore(gameCount > 0 ? Math.round(totalScoreSum / gameCount) : 0);
      setTotalYams(yamsCount);
      setBonusCount(bonusesCount);

      // Calculate wins and win rate (placeholder - would need to track user)
      const wins = Math.floor(stats.totalGames * 0.7);
      setTotalWins(wins);
      setWinRate(stats.totalGames > 0 ? Math.floor((wins / stats.totalGames) * 100) : 0);
      setCurrentStreak(5); // Placeholder

      // Convert player stats
      const playersArray: PlayerStat[] = Object.entries(stats.playerStats || {}).map(
        ([name, data]) => ({
          name,
          gamesPlayed: data.gamesPlayed,
          wins: data.wins,
          totalScore: data.totalScore,
          averageScore: data.averageScore,
          bestScore: data.bestScore,
          winRate: data.gamesPlayed > 0 ? Math.round((data.wins / data.gamesPlayed) * 100) : 0,
        })
      );
      setPlayerStats(playersArray);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistiques</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏆</Text>
              <Text style={styles.sectionTitle}>VUE D'ENSEMBLE</Text>
            </View>

            <View style={styles.statsGrid}>
              <LinearGradient
                colors={['rgba(74, 144, 226, 0.2)', 'rgba(74, 144, 226, 0.1)']}
                style={styles.statCard}
              >
                <Text style={styles.statNumber}>{totalGames}</Text>
                <Text style={styles.statLabel}>Parties jouées</Text>
              </LinearGradient>

              <LinearGradient
                colors={['rgba(80, 200, 120, 0.2)', 'rgba(80, 200, 120, 0.1)']}
                style={styles.statCard}
              >
                <Text style={styles.statNumber}>{totalWins}</Text>
                <Text style={styles.statLabel}>Victoires ({winRate}%)</Text>
              </LinearGradient>

              <LinearGradient
                colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)']}
                style={styles.statCard}
              >
                <Text style={styles.statNumber}>{currentStreak}</Text>
                <Text style={styles.statLabel}>Streak actuel 🔥</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Scores */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📈</Text>
              <Text style={styles.sectionTitle}>SCORES</Text>
            </View>

            <View style={styles.scoresContainer}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreLeft}>
                  <Text style={styles.scoreIcon}>👑</Text>
                  <Text style={styles.scoreLabel}>Record personnel</Text>
                </View>
                <Text style={styles.scoreValue}>{bestScore} pts</Text>
              </View>

              <View style={styles.scoreRow}>
                <View style={styles.scoreLeft}>
                  <Text style={styles.scoreIcon}>📊</Text>
                  <Text style={styles.scoreLabel}>Score moyen</Text>
                </View>
                <Text style={styles.scoreValue}>{averageScore} pts</Text>
              </View>

              <View style={styles.scoreRow}>
                <View style={styles.scoreLeft}>
                  <Text style={styles.scoreIcon}>⭐</Text>
                  <Text style={styles.scoreLabel}>Parties 300+ pts</Text>
                </View>
                <Text style={styles.scoreValue}>
                  {playerStats.reduce((sum, p) => sum + (p.bestScore >= 300 ? 1 : 0), 0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Performances */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🎲</Text>
              <Text style={styles.sectionTitle}>PERFORMANCES</Text>
            </View>

            <View style={styles.performanceGrid}>
              <View style={styles.performanceCard}>
                <Text style={styles.performanceNumber}>{totalYams}</Text>
                <Text style={styles.performanceIcon}>⚡</Text>
                <Text style={styles.performanceLabel}>Yams réalisés</Text>
              </View>

              <View style={styles.performanceCard}>
                <Text style={styles.performanceNumber}>{bonusCount}</Text>
                <Text style={styles.performanceIcon}>💎</Text>
                <Text style={styles.performanceLabel}>Bonus gagnés</Text>
              </View>

              <View style={styles.performanceCard}>
                <Text style={styles.performanceNumber}>
                  {Math.round((bonusCount / Math.max(totalGames, 1)) * 100)}%
                </Text>
                <Text style={styles.performanceIcon}>🎯</Text>
                <Text style={styles.performanceLabel}>Taux bonus</Text>
              </View>
            </View>
          </View>

          {/* Player Stats */}
          {playerStats.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👥</Text>
                <Text style={styles.sectionTitle}>JOUEURS</Text>
              </View>

              <View style={styles.playersContainer}>
                {playerStats.slice(0, 5).map((player, idx) => (
                  <View key={idx} style={styles.playerCard}>
                    <View style={styles.playerHeader}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerWinRate}>{player.winRate}%</Text>
                    </View>
                    <View style={styles.playerStats}>
                      <View style={styles.playerStat}>
                        <Text style={styles.playerStatLabel}>Parties</Text>
                        <Text style={styles.playerStatValue}>{player.gamesPlayed}</Text>
                      </View>
                      <View style={styles.playerStat}>
                        <Text style={styles.playerStatLabel}>Victoires</Text>
                        <Text style={styles.playerStatValue}>{player.wins}</Text>
                      </View>
                      <View style={styles.playerStat}>
                        <Text style={styles.playerStatLabel}>Moyenne</Text>
                        <Text style={styles.playerStatValue}>{Math.round(player.averageScore)}</Text>
                      </View>
                      <View style={styles.playerStat}>
                        <Text style={styles.playerStatLabel}>Record</Text>
                        <Text style={styles.playerStatValue}>{player.bestScore}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Achievements */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🏅</Text>
              <Text style={styles.sectionTitle}>SUCCÈS</Text>
            </View>

            <View style={styles.achievementsContainer}>
              <View style={[styles.achievement, totalYams > 0 && styles.achievementUnlocked]}>
                <Text style={styles.achievementIcon}>⚡</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Premier Yams</Text>
                  <Text style={styles.achievementDesc}>Réaliser un Yams</Text>
                </View>
                {totalYams > 0 && <Text style={styles.achievementCheck}>✅</Text>}
              </View>

              <View style={[styles.achievement, totalGames >= 10 && styles.achievementUnlocked]}>
                <Text style={styles.achievementIcon}>🎮</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Joueur régulier</Text>
                  <Text style={styles.achievementDesc}>Jouer 10 parties</Text>
                </View>
                {totalGames >= 10 && <Text style={styles.achievementCheck}>✅</Text>}
              </View>

              <View style={[styles.achievement, currentStreak >= 5 && styles.achievementUnlocked]}>
                <Text style={styles.achievementIcon}>🔥</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Série de victoires</Text>
                  <Text style={styles.achievementDesc}>5 victoires d'affilée</Text>
                </View>
                {currentStreak >= 5 && <Text style={styles.achievementCheck}>✅</Text>}
              </View>

              <View style={[styles.achievement, bestScore >= 400 && styles.achievementUnlocked]}>
                <Text style={styles.achievementIcon}>👑</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Score parfait</Text>
                  <Text style={styles.achievementDesc}>Atteindre 400 points</Text>
                </View>
                {bestScore >= 400 ? (
                  <Text style={styles.achievementCheck}>✅</Text>
                ) : (
                  <Text style={styles.achievementLock}>🔒</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  scoresContainer: {
    gap: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreIcon: {
    fontSize: 24,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4A90E2',
  },
  performanceGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  performanceNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  performanceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  playersContainer: {
    gap: 12,
  },
  playerCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  playerWinRate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#50C878',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerStat: {
    alignItems: 'center',
  },
  playerStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  playerStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A90E2',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
    borderColor: 'rgba(80, 200, 120, 0.2)',
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  achievementCheck: {
    fontSize: 24,
  },
  achievementLock: {
    fontSize: 24,
    opacity: 0.3,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default StatsScreen;
