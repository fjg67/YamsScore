/**
 * Écran Historique Ultra-Premium avec Stats & Achievements
 * Version 4.0 - Addiction-Ready
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setGames, setLoading } from '../store/slices/historySlice';
import { loadAllGames } from '../utils/storage';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { EmptyState } from './HistoryScreen/components/EmptyState';
import { calculatePlayerStatistics, generateInsight } from './HistoryScreen/utils/statsCalculator';
import { ACHIEVEMENTS } from './HistoryScreen/data/achievements';

const { width } = Dimensions.get('window');

const HistoryScreenPremium: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const games = useAppSelector((state) => state.history.games);
  const isLoading = useAppSelector((state) => state.history.isLoading);
  const [refreshing, setRefreshing] = useState(false);

  // Calculer les statistiques
  const stats = useMemo(() => {
    return calculatePlayerStatistics(games, 'user');
  }, [games]);

  // Calculer les achievements
  const achievements = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: achievement.condition(stats),
      unlockedAt: achievement.condition(stats) ? new Date() : undefined,
    }));
  }, [stats]);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const totalAchievements = achievements.length;

  // Générer un insight motivant
  const insight = useMemo(() => generateInsight(stats), [stats]);

  useEffect(() => {
    loadGamesData();
  }, []);

  const loadGamesData = async () => {
    try {
      dispatch(setLoading(true));
      const allGames = await loadAllGames();
      const completedGames = allGames.filter((g) => g.status === 'completed');
      dispatch(setGames(completedGames));
    } catch (error) {
      console.error('Erreur chargement parties:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGamesData();
    setRefreshing(false);
  };

  const handleStartGame = () => {
    navigation.navigate('PlayerSetup' as never);
  };

  // Empty state
  if (stats.totalGames === 0 && !isLoading) {
    return <EmptyState onStartGame={handleStartGame} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4A90E2', '#5E3AEE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Historique</Text>
            <Text style={styles.headerSubtitle}>Ton parcours gaming 🏆</Text>
          </View>
          <TouchableOpacity
            style={styles.statsButton}
            onPress={() => navigation.navigate('Stats' as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.statsButtonText}>📊</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A90E2" />
        }
      >
        {/* Hero Stats Cards */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsCardsContainer}
            snapToInterval={152}
            decelerationRate="fast"
          >
            <StatCard
              emoji="🎲"
              value={stats.totalGames}
              label="Parties"
              gradient={['#4A90E2', '#357ABD']}
              delay={0}
            />
            <StatCard
              emoji="🏆"
              value={stats.totalWins}
              label="Victoires"
              badge={`${Math.round(stats.winRate)}%`}
              gradient={['#50C878', '#3FA065']}
              delay={100}
            />
            <StatCard
              emoji="⭐"
              value={stats.bestScore}
              label="Record"
              gradient={['#FFD700', '#FFA500']}
              delay={200}
            />
            <StatCard
              emoji="🔥"
              value={stats.currentStreak}
              label="Jours"
              subtext="Série actuelle"
              gradient={['#FF6B6B', '#FF8E53']}
              delay={300}
            />
            <StatCard
              emoji="📊"
              value={Math.round(stats.averageScore)}
              label="Moyenne"
              gradient={['#9B59B6', '#8E44AD']}
              delay={400}
            />
          </ScrollView>
        </View>

        {/* Insight Card */}
        {insight && (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
            <View style={styles.insightCard}>
              <Text style={styles.insightEmoji}>💡</Text>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          </Animated.View>
        )}

        {/* Achievements Section */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tes Achievements 🏅</Text>
            <Text style={styles.sectionSubtitle}>
              {unlockedAchievements.length}/{totalAchievements}
            </Text>
          </View>

          <View style={styles.achievementsGrid}>
            {achievements.slice(0, 8).map((achievement, index) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                delay={index * 50}
              />
            ))}
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques Rapides 📈</Text>

          <View style={styles.quickStatsContainer}>
            <QuickStatRow
              label="Taux de victoire"
              value={`${Math.round(stats.winRate)}%`}
              color="#50C878"
            />
            <QuickStatRow
              label="Yams réalisés"
              value={stats.totalYams.toString()}
              emoji="👑"
              color="#9B59B6"
            />
            <QuickStatRow
              label="Full réalisés"
              value={stats.totalFullHouse.toString()}
              emoji="🏠"
              color="#FF9800"
            />
            <QuickStatRow
              label="Grandes suites"
              value={stats.totalLargeStraight.toString()}
              emoji="🎢"
              color="#2196F3"
            />
            <QuickStatRow
              label="Parties parfaites"
              value={stats.perfectGames.toString()}
              emoji="💎"
              color="#1ABC9C"
            />
            <QuickStatRow
              label="Plus longue série"
              value={`${stats.maxStreak} jours`}
              emoji="🔥"
              color="#FF6B6B"
            />
          </View>
        </Animated.View>

        {/* Win Rate Breakdown */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>Répartition 📊</Text>

          <View style={styles.winRateContainer}>
            <View style={styles.winRateBar}>
              <View
                style={[
                  styles.winRateSegment,
                  {
                    width: `${stats.winRate}%`,
                    backgroundColor: '#50C878',
                  },
                ]}
              />
              <View
                style={[
                  styles.winRateSegment,
                  {
                    width: `${((stats.totalLosses / stats.totalGames) * 100) || 0}%`,
                    backgroundColor: '#FF6B6B',
                  },
                ]}
              />
            </View>

            <View style={styles.winRateLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#50C878' }]} />
                <Text style={styles.legendText}>
                  Victoires ({stats.totalWins})
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={styles.legendText}>
                  Défaites ({stats.totalLosses})
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Spacer pour le bas */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleStartGame}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#50C878', '#3FA065']}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>🎲</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Composant StatCard
interface StatCardProps {
  emoji: string;
  value: number;
  label: string;
  gradient: [string, string];
  badge?: string;
  subtext?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  emoji,
  value,
  label,
  gradient,
  badge,
  subtext,
  delay = 0,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()}>
    <LinearGradient colors={gradient} style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtext && <Text style={styles.statSubtext}>{subtext}</Text>}
      {badge && (
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeText}>{badge}</Text>
        </View>
      )}
    </LinearGradient>
  </Animated.View>
);

// Composant AchievementBadge
interface AchievementBadgeProps {
  achievement: any;
  delay?: number;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, delay = 0 }) => {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <LinearGradient
        colors={achievement.unlocked ? achievement.gradient : ['#E8E8E8', '#CCCCCC']}
        style={[
          styles.achievementBadge,
          !achievement.unlocked && styles.achievementLocked,
        ]}
      >
        <Text
          style={[
            styles.achievementEmoji,
            !achievement.unlocked && styles.achievementEmojiLocked,
          ]}
        >
          {achievement.unlocked ? achievement.emoji : '🔒'}
        </Text>
      </LinearGradient>
      <Text style={styles.achievementTitle} numberOfLines={1}>
        {achievement.unlocked ? achievement.emoji : '?'}
      </Text>
    </Animated.View>
  );
};

// Composant QuickStatRow
interface QuickStatRowProps {
  label: string;
  value: string;
  emoji?: string;
  color?: string;
}

const QuickStatRow: React.FC<QuickStatRowProps> = ({ label, value, emoji, color = '#4A90E2' }) => (
  <View style={styles.quickStatRow}>
    {emoji && <Text style={styles.quickStatEmoji}>{emoji}</Text>}
    <Text style={styles.quickStatLabel}>{label}</Text>
    <Text style={[styles.quickStatValue, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  statsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  statsButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'System',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    fontFamily: 'System',
  },
  statsCardsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: 140,
    height: 140,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statEmoji: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    fontFamily: 'System',
  },
  statSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'System',
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  statBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  insightCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightEmoji: {
    fontSize: 24,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    fontFamily: 'System',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  achievementBadge: {
    width: (width - 32 - 36) / 4,
    height: (width - 32 - 36) / 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementEmojiLocked: {
    opacity: 0.3,
  },
  achievementTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    width: (width - 32 - 36) / 4,
  },
  quickStatsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  quickStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickStatEmoji: {
    fontSize: 20,
  },
  quickStatLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  winRateContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  winRateBar: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  winRateSegment: {
    height: '100%',
  },
  winRateLegend: {
    flexDirection: 'row',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
  },
});

export default HistoryScreenPremium;
