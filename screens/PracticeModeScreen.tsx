import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PracticeCategoryType,
  PracticeProgress,
  PracticeScenario,
} from '../src/types/learning';
import { PracticeService } from '../services/practiceService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Floating particles component
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

interface PracticeModeScreenProps {
  onBack: () => void;
  onSelectCategory: (category: PracticeCategoryType) => void;
}

export const PracticeModeScreen: React.FC<PracticeModeScreenProps> = ({
  onBack,
  onSelectCategory,
}) => {
  const [progress, setProgress] = useState<PracticeProgress | null>(null);
  const [categories, setCategories] = useState<PracticeCategoryType[]>([]);
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const pulse = () => {
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
      ]).start(() => pulse());
    };
    pulse();
  }, [glowAnim]);

  const loadData = async () => {
    let prog = await PracticeService.getProgress();
    if (!prog) {
      prog = await PracticeService.initializeProgress();
    }
    setProgress(prog);

    const allCategories = PracticeService.getAllCategories();
    setCategories(allCategories);
  };

  const handleCategoryPress = (category: PracticeCategoryType) => {
    onSelectCategory(category);
  };

  const getDifficultyColor = (scenarios: PracticeScenario[]): string => {
    const avgDifficulty = scenarios.reduce((sum, s) => {
      const diffMap: any = { facile: 1, moyen: 2, difficile: 3, expert: 4 };
      return sum + (diffMap[s.difficulty] || 1);
    }, 0) / scenarios.length;

    if (avgDifficulty <= 1.5) return '#4caf50';
    if (avgDifficulty <= 2.5) return '#ff9800';
    if (avgDifficulty <= 3.5) return '#f44336';
    return '#9c27b0';
  };

  const renderCategoryCard = (category: PracticeCategoryType) => {
    const info = PracticeService.getCategoryInfo(category);
    const scenarios = PracticeService.getScenariosByCategory(category);
    const difficultyColor = getDifficultyColor(scenarios);

    return (
      <TouchableOpacity
        key={category}
        onPress={() => handleCategoryPress(category)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryCard}
        >
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryIconText}>{info.icon}</Text>
          </View>

          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{info.name}</Text>
            <Text style={styles.categoryDescription}>{info.description}</Text>

            <View style={styles.categoryFooter}>
              <View style={styles.categoryStat}>
                <Text style={styles.categoryStatIcon}>📝</Text>
                <Text style={styles.categoryStatText}>{scenarios.length} exercices</Text>
              </View>
              <View style={[styles.categoryDifficulty, { backgroundColor: difficultyColor }]}>
                <Text style={styles.categoryDifficultyText}>
                  {scenarios.length > 0 ? scenarios[0].difficulty : 'moyen'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.categoryArrow}>
            <Text style={styles.categoryArrowText}>→</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowAnim,
          },
        ]}
      />

      {/* Floating Particles */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 200} />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏋️ Mode Pratique</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Card */}
      {progress && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <Text style={styles.progressTitle}>Vos Statistiques</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{progress.totalScenariosCompleted}</Text>
              <Text style={styles.progressStatLabel}>Exercices complétés</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>
                {Math.round(progress.averageScore)}%
              </Text>
              <Text style={styles.progressStatLabel}>Score moyen</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>
                {Math.floor(progress.totalPracticeTime / 60)}m
              </Text>
              <Text style={styles.progressStatLabel}>Temps total</Text>
            </View>
          </View>
        </LinearGradient>
      )}

      {/* Categories List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Choisissez votre entraînement</Text>
          {categories.map((category) => renderCategoryCard(category))}
        </View>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipCard}
        >
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Conseil d'entraînement</Text>
            <Text style={styles.tipText}>
              Pratiquez régulièrement pour améliorer vos compétences. Chaque exercice vous aide
              à maîtriser une situation spécifique du jeu !
            </Text>
          </View>
        </LinearGradient>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButton: {
    width: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressStatLabel: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryIconText: {
    fontSize: 32,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 8,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryStatIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryStatText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryDifficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryArrow: {
    marginLeft: 12,
  },
  categoryArrowText: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tipCard: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tipText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
