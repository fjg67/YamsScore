/**
 * Écran Statistiques Ultra-Premium - Advanced Analytics Dashboard
 * Version 5.0 - Pro-Level Analytics
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  SlideInLeft,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  filterGamesByPeriod,
  calculatePeriodStats,
  calculateTrend,
  calculateCategoryStats,
  analyzeByDayOfWeek,
  analyzeByTimeOfDay,
  identifyStrengthsWeaknesses,
} from './StatsScreen/utils/statsAnalyzer';
import { TimePeriod } from './StatsScreen/types';

const { width } = Dimensions.get('window');

const StatsScreen: React.FC = () => {
  const navigation = useNavigation();
  const games = useAppSelector((state) => state.history.games);

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');

  // Filtrer les parties selon la période
  const filteredGames = useMemo(() => {
    return filterGamesByPeriod(games, selectedPeriod);
  }, [games, selectedPeriod]);

  // Calculer les stats de la période actuelle
  const currentStats = useMemo(() => {
    return calculatePeriodStats(filteredGames);
  }, [filteredGames]);

  // Calculer les stats par catégorie
  const categoryStats = useMemo(() => {
    return calculateCategoryStats(filteredGames);
  }, [filteredGames]);

  // Analyser par jour de la semaine
  const dayOfWeekData = useMemo(() => {
    return analyzeByDayOfWeek(filteredGames);
  }, [filteredGames]);

  // Analyser par tranche horaire
  const timeOfDayData = useMemo(() => {
    return analyzeByTimeOfDay(filteredGames);
  }, [filteredGames]);

  // Identifier forces et faiblesses
  const { strengths, weaknesses } = useMemo(() => {
    return identifyStrengthsWeaknesses(categoryStats);
  }, [categoryStats]);

  const periods: Array<{ id: TimePeriod; label: string; icon: string }> = [
    { id: '7d', label: '7J', icon: '📅' },
    { id: '30d', label: '30J', icon: '📊' },
    { id: '90d', label: '3M', icon: '📈' },
    { id: 'ytd', label: '2025', icon: '🗓️' },
    { id: 'all', label: 'Total', icon: '♾️' },
  ];

  // Animation de shimmer pour le header
  const shimmerTranslate = useSharedValue(-width);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withSequence(
        withTiming(width, { duration: 2000, easing: Easing.linear }),
        withTiming(-width, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Ultra-Premium */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Shimmer effect overlay */}
          <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Particles decoratives */}
          <View style={styles.particlesContainer}>
            <Animated.View
              entering={FadeIn.delay(300).duration(1000)}
              style={[styles.particle, { top: 20, left: 30 }]}
            >
              <Text style={styles.particleText}>📊</Text>
            </Animated.View>
            <Animated.View
              entering={FadeIn.delay(500).duration(1000)}
              style={[styles.particle, { top: 40, right: 50 }]}
            >
              <Text style={styles.particleText}>📈</Text>
            </Animated.View>
            <Animated.View
              entering={FadeIn.delay(700).duration(1000)}
              style={[styles.particle, { top: 70, left: width * 0.6 }]}
            >
              <Text style={styles.particleText}>⭐</Text>
            </Animated.View>
          </View>

          {/* Contenu du header */}
          <Animated.View entering={SlideInLeft.duration(600).springify()}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <View style={styles.backButtonInner}>
                <View style={styles.backIconCircle}>
                  <Text style={styles.backButtonIcon}>←</Text>
                </View>
                <Text style={styles.backButtonText}>Retour</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(200).duration(800).springify()}
            style={styles.headerContent}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Statistiques</Text>
              <View style={styles.titleUnderline} />
            </View>
            <View style={styles.subtitleContainer}>
              <View style={styles.statsIcon}>
                <Text style={styles.statsIconText}>📊</Text>
              </View>
              <Text style={styles.headerSubtitle}>Analytics Dashboard Premium</Text>
            </View>

            {/* Stats rapides dans le header */}
            <Animated.View
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.quickStatsHeader}
            >
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{currentStats.games}</Text>
                <Text style={styles.quickStatLabel}>Parties</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{Math.round(currentStats.winRate)}%</Text>
                <Text style={styles.quickStatLabel}>Victoires</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{currentStats.bestScore}</Text>
                <Text style={styles.quickStatLabel}>Record</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Glass morphism effect sur le bas */}
          <View style={styles.headerBottomGlass} />
        </LinearGradient>
      </View>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodScrollContent}
        >
          {periods.map((period, index) => (
            <TouchableOpacity
              key={period.id}
              onPress={() => setSelectedPeriod(period.id)}
              activeOpacity={0.7}
            >
              <Animated.View
                entering={FadeInDown.delay(index * 50).springify()}
                style={[
                  styles.periodPill,
                  selectedPeriod === period.id && styles.periodPillActive,
                ]}
              >
                {selectedPeriod === period.id && (
                  <LinearGradient
                    colors={['#4A90E2', '#5DADE2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Text
                  style={[
                    styles.periodPillText,
                    selectedPeriod === period.id && styles.periodPillTextActive,
                  ]}
                >
                  {period.icon} {period.label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Key Metrics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vue d'ensemble 📊</Text>

          <View style={styles.metricsGrid}>
            <MetricCard
              icon="🎲"
              value={currentStats.games}
              label="Parties"
              gradient={['#4A90E2', '#357ABD']}
              delay={0}
            />
            <MetricCard
              icon="🏆"
              value={`${Math.round(currentStats.winRate)}%`}
              label="Victoires"
              gradient={['#50C878', '#3FA065']}
              delay={100}
            />
            <MetricCard
              icon="📊"
              value={currentStats.avgScore}
              label="Moyenne"
              gradient={['#9B59B6', '#8E44AD']}
              delay={200}
            />
            <MetricCard
              icon="⭐"
              value={currentStats.bestScore}
              label="Record"
              gradient={['#FFD700', '#FFA500']}
              delay={300}
            />
          </View>
        </View>

        {/* Category Performance */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Performance par Catégorie 🎯</Text>

          <View style={styles.categoryContainer}>
            {categoryStats.map((category, index) => (
              <CategoryRow key={category.name} category={category} delay={index * 50} />
            ))}
          </View>
        </Animated.View>

        {/* Day of Week Analysis */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Performance par Jour 📅</Text>

          <View style={styles.heatMapContainer}>
            {dayOfWeekData.map((data, index) => (
              <HeatMapBar
                key={data.label}
                data={data}
                maxValue={Math.max(...dayOfWeekData.map((d) => d.value))}
                delay={index * 50}
              />
            ))}
          </View>
        </Animated.View>

        {/* Time of Day Analysis */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Performance par Période 🕐</Text>

          <View style={styles.timeOfDayContainer}>
            {timeOfDayData.map((data, index) => (
              <TimeOfDayCard key={data.label} data={data} delay={index * 100} />
            ))}
          </View>
        </Animated.View>

        {/* Strengths & Weaknesses */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.section}>
          <Text style={styles.sectionTitle}>Forces & Faiblesses 💪</Text>

          <View style={styles.strengthsWeaknessesContainer}>
            <View style={styles.strengthsCard}>
              <View style={styles.swHeader}>
                <Text style={styles.swHeaderIcon}>💪</Text>
                <Text style={styles.swHeaderText}>Points Forts</Text>
              </View>
              {strengths.map((category) => (
                <StrengthWeaknessRow
                  key={category.name}
                  category={category}
                  type="strength"
                />
              ))}
            </View>

            <View style={styles.weaknessesCard}>
              <View style={styles.swHeader}>
                <Text style={styles.swHeaderIcon}>📚</Text>
                <Text style={styles.swHeaderText}>À Améliorer</Text>
              </View>
              {weaknesses.map((category) => (
                <StrengthWeaknessRow
                  key={category.name}
                  category={category}
                  type="weakness"
                />
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// Composant MetricCard
interface MetricCardProps {
  icon: string;
  value: number | string;
  label: string;
  gradient: [string, string];
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, value, label, gradient, delay = 0 }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.metricCard}>
    <LinearGradient colors={gradient} style={styles.metricGradient}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </LinearGradient>
  </Animated.View>
);

// Composant CategoryRow
interface CategoryRowProps {
  category: any;
  delay?: number;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, delay = 0 }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.categoryRow}>
    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
    <View style={styles.categoryInfo}>
      <Text style={styles.categoryName}>{category.name}</Text>
      <View style={styles.categoryBar}>
        <View
          style={[
            styles.categoryBarFill,
            { width: `${category.successRate}%`, backgroundColor: getColorForRate(category.successRate) },
          ]}
        />
      </View>
    </View>
    <Text style={styles.categoryRate}>{category.successRate}%</Text>
  </Animated.View>
);

// Composant HeatMapBar
interface HeatMapBarProps {
  data: any;
  maxValue: number;
  delay?: number;
}

const HeatMapBar: React.FC<HeatMapBarProps> = ({ data, maxValue, delay = 0 }) => {
  const percentage = maxValue > 0 ? (data.value / maxValue) * 100 : 0;

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.heatMapRow}>
      <Text style={styles.heatMapLabel}>{data.label}</Text>
      <View style={styles.heatMapBar}>
        <LinearGradient
          colors={['#4A90E2', '#5DADE2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.heatMapBarFill, { width: `${percentage}%` }]}
        />
      </View>
      <Text style={styles.heatMapValue}>{data.value}</Text>
    </Animated.View>
  );
};

// Composant TimeOfDayCard
interface TimeOfDayCardProps {
  data: any;
  delay?: number;
}

const TimeOfDayCard: React.FC<TimeOfDayCardProps> = ({ data, delay = 0 }) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.timeCard}>
    <Text style={styles.timeCardValue}>{data.value || 'N/A'}</Text>
    <Text style={styles.timeCardLabel}>{data.label}</Text>
    <Text style={styles.timeCardCount}>{data.count} parties</Text>
  </Animated.View>
);

// Composant StrengthWeaknessRow
interface StrengthWeaknessRowProps {
  category: any;
  type: 'strength' | 'weakness';
}

const StrengthWeaknessRow: React.FC<StrengthWeaknessRowProps> = ({ category, type }) => (
  <View style={styles.swRow}>
    <Text style={styles.swEmoji}>{category.emoji}</Text>
    <View style={styles.swInfo}>
      <Text style={styles.swName}>{category.name}</Text>
      <Text style={styles.swRate}>{category.successRate}% de réussite</Text>
    </View>
    <View
      style={[
        styles.swBadge,
        { backgroundColor: type === 'strength' ? '#50C878' : '#FF6B6B' },
      ]}
    >
      <Text style={styles.swBadgeText}>
        {type === 'strength' ? 'Expert' : 'À travailler'}
      </Text>
    </View>
  </View>
);

// Helper function
const getColorForRate = (rate: number): string => {
  if (rate >= 70) return '#50C878';
  if (rate >= 50) return '#4A90E2';
  if (rate >= 30) return '#F39C12';
  return '#FF6B6B';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: '100%',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    opacity: 0.3,
  },
  particleText: {
    fontSize: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 18,
  },
  backIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#667eea',
    fontWeight: '800',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerContent: {
    gap: 16,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    marginTop: 8,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsIconText: {
    fontSize: 16,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  quickStatsHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quickStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerBottomGlass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  periodSelector: {
    height: 72,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  periodScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    height: 72,
  },
  periodPill: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 16,
  },
  periodPillActive: {
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  periodPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  periodPillTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  metricGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  metricIcon: {
    fontSize: 28,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  categoryContainer: {
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
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  categoryBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryRate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A90E2',
    width: 50,
    textAlign: 'right',
  },
  heatMapContainer: {
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
  heatMapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heatMapLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    width: 40,
  },
  heatMapBar: {
    flex: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  heatMapBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  heatMapValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A90E2',
    width: 50,
    textAlign: 'right',
  },
  timeOfDayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  timeCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  timeCardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 4,
  },
  timeCardLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  timeCardCount: {
    fontSize: 12,
    color: '#999999',
  },
  strengthsWeaknessesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  strengthsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  weaknessesCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  swHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  swHeaderIcon: {
    fontSize: 20,
  },
  swHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  swRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  swEmoji: {
    fontSize: 20,
  },
  swInfo: {
    flex: 1,
  },
  swName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  swRate: {
    fontSize: 11,
    color: '#666666',
  },
  swBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  swBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default StatsScreen;
