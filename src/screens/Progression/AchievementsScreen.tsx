import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressionService } from '../../services/ProgressionService';
import { Achievement, AchievementProgress } from '../../types/progression';
import { ACHIEVEMENTS } from '../../data/achievements';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = width;

const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateX = useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT);
      translateX.setValue(Math.random() * SCREEN_WIDTH);
      opacity.setValue(0);
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -100, duration: 8000 + Math.random() * 4000, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.15 + Math.random() * 0.15, duration: 1000, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.8 + Math.random() * 0.4, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]).start(() => animate());
    };
    animate();
  }, [delay, translateY, translateX, opacity, scale]);

  return <Animated.View style={[styles.particle, { transform: [{ translateX }, { translateY }, { scale }], opacity }]} />;
};

interface AchievementsScreenProps {
  onBack?: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onBack }) => {
  const [achievements, setAchievements] = useState<Array<{
    definition: Achievement;
    progress: AchievementProgress;
  }>>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all');
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadAchievements();
  }, []);

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 2000, useNativeDriver: true }),
      ]).start(() => pulse());
    };
    pulse();
  }, [glowAnim]);

  const loadAchievements = async () => {
    const service = ProgressionService.getInstance();
    const data = await service.getAchievementsWithProgress();
    setAchievements(data);
  };

  const filteredAchievements = achievements.filter((item) => {
    if (filter === 'completed') return item.progress.completed;
    if (filter === 'in_progress') return !item.progress.completed;
    return true;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return ['#9CA3AF', '#6B7280'];
      case 'rare': return ['#3B82F6', '#2563EB'];
      case 'epic': return ['#A855F7', '#7C3AED'];
      case 'legendary': return ['#F59E0B', '#D97706'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const completedCount = achievements.filter(a => a.progress.completed).length;
  const totalCount = achievements.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <View style={styles.fullContainer}>
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']} style={StyleSheet.absoluteFillObject} />
      <Animated.View style={[styles.glowEffect, { opacity: glowAnim }]} />
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => <FloatingParticle key={i} delay={i * 200} />)}
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.backButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.backButtonIcon}>←</Text>
              <Text style={styles.backButtonText}>Retour</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>🏅 Achievements</Text>
          <Text style={styles.headerSubtitle}>
            {completedCount} / {totalCount} débloqués ({progressPercentage.toFixed(0)}%)
          </Text>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Tous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'in_progress' && styles.filterButtonActive]}
            onPress={() => setFilter('in_progress')}
          >
            <Text style={[styles.filterText, filter === 'in_progress' && styles.filterTextActive]}>
              En cours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              Complétés
            </Text>
          </TouchableOpacity>
        </View>

        {/* Liste des achievements */}
        <View style={styles.achievementsList}>
          {filteredAchievements.map((item) => (
            <View key={item.definition.id} style={styles.achievementCard}>
              <LinearGradient
                colors={getRarityColor(item.definition.rarity)}
                style={styles.achievementGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementIcon}>{item.definition.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>
                      {item.definition.hidden && !item.progress.completed
                        ? '???'
                        : item.definition.name}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {item.definition.hidden && !item.progress.completed
                        ? 'Secret à découvrir'
                        : item.definition.description}
                    </Text>
                  </View>
                  {item.progress.completed && (
                    <Text style={styles.completedBadge}>✓</Text>
                  )}
                </View>

                {!item.progress.completed && (
                  <View style={styles.progressSection}>
                    <View style={styles.progressBarSmallBg}>
                      <View
                        style={[
                          styles.progressBarSmallFill,
                          {
                            width: `${(item.progress.current / item.definition.requirement.target) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {item.progress.current} / {item.definition.requirement.target}
                    </Text>
                  </View>
                )}

                <View style={styles.rewardSection}>
                  <Text style={styles.rewardText}>⭐ {item.definition.xpReward} XP</Text>
                  {item.definition.rewards?.coins && (
                    <Text style={styles.rewardText}>💰 {item.definition.rewards.coins}</Text>
                  )}
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#0a0e27' },
  container: { flex: 1, backgroundColor: 'transparent' },
  glowEffect: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  particle: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff' },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 0,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 6,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2d2d44',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
  },
  filterText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  achievementsList: {
    padding: 16,
    gap: 12,
  },
  achievementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  achievementGradient: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  completedBadge: {
    fontSize: 32,
    color: '#fff',
  },
  progressSection: {
    marginTop: 12,
  },
  progressBarSmallBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarSmallFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  rewardSection: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  rewardText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
