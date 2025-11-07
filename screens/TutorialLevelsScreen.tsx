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
import { TutorialProgress, TutorialLevel, TutorialLevelData } from '../src/types/learning';
import { TutorialService } from '../services/tutorialService';

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

interface TutorialLevelsScreenProps {
  onBack: () => void;
  onSelectLevel: (level: TutorialLevel) => void;
}

export const TutorialLevelsScreen: React.FC<TutorialLevelsScreenProps> = ({
  onBack,
  onSelectLevel,
}) => {
  const [progress, setProgress] = useState<TutorialProgress | null>(null);
  const [levels, setLevels] = useState<TutorialLevelData[]>([]);
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadData();

    // Glow animation
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
    ).start();
  }, [glowAnim]);

  const loadData = async () => {
    let prog = await TutorialService.getProgress();
    if (!prog) {
      prog = await TutorialService.initializeProgress();
    }
    setProgress(prog);

    const allLevels = TutorialService.getAllLevels();
    setLevels(allLevels);
  };

  const isLevelCompleted = (level: TutorialLevel): boolean => {
    return progress?.completedLevels.includes(level) || false;
  };

  const isLevelUnlocked = (level: TutorialLevel): boolean => {
    if (!progress) return false;
    return TutorialService.isLevelUnlocked(level, progress);
  };

  const isLevelCurrent = (level: TutorialLevel): boolean => {
    return progress?.currentLevel === level;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'débutant':
        return '#4caf50';
      case 'intermédiaire':
        return '#ff9800';
      case 'avancé':
        return '#f44336';
      case 'expert':
        return '#9c27b0';
      default:
        return '#8b92b0';
    }
  };

  const handleLevelPress = async (level: TutorialLevel) => {
    if (!progress) return;

    const unlocked = isLevelUnlocked(level);
    if (!unlocked) return;

    // Si c'est un niveau différent du niveau actuel, sauter à ce niveau (étape 1)
    // Sinon, continuer où on était
    if (level !== progress.currentLevel) {
      await TutorialService.jumpToLevel(progress, level);
    }

    onSelectLevel(level);
  };

  const renderLevelCard = (levelData: TutorialLevelData) => {
    const completed = isLevelCompleted(levelData.level);
    const unlocked = isLevelUnlocked(levelData.level);
    const current = isLevelCurrent(levelData.level);

    // Debug pour le niveau 5
    if (levelData.level === 5) {
      console.log('Level 5 status:', { completed, current, unlocked });
      console.log('CompletedLevels:', progress?.completedLevels);
      console.log('CurrentLevel:', progress?.currentLevel);
    }

    return (
      <TouchableOpacity
        key={levelData.level}
        onPress={() => handleLevelPress(levelData.level)}
        disabled={!unlocked}
        activeOpacity={0.9}
        style={[!unlocked && styles.levelCardLocked]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
          style={[
            styles.levelCard,
            current && styles.levelCardCurrent,
            completed && styles.levelCardCompleted,
          ]}
        >
        {/* Header */}
        <View style={styles.levelCardHeader}>
          <View style={styles.levelIconContainer}>
            <Text style={styles.levelIcon}>{levelData.icon}</Text>
            {completed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓</Text>
              </View>
            )}
            {!completed && current && (
              <View style={styles.inProgressBadge}>
                <Text style={styles.inProgressBadgeText}>⏳</Text>
              </View>
            )}
            {!unlocked && (
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>🔒</Text>
              </View>
            )}
          </View>

          <View style={styles.levelInfo}>
            <View style={styles.levelTitleRow}>
              <Text style={styles.levelNumber}>Niveau {levelData.level}</Text>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(levelData.difficulty) },
                ]}
              >
                <Text style={styles.difficultyText}>{levelData.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.levelTitle}>{levelData.title}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.levelDescription, !unlocked && styles.textLocked]}>
          {levelData.description}
        </Text>

        {/* Footer */}
        <View style={styles.levelFooter}>
          <View style={styles.levelStat}>
            <Text style={styles.levelStatIcon}>📚</Text>
            <Text style={[styles.levelStatText, !unlocked && styles.textLocked]}>
              {levelData.steps.length} étapes
            </Text>
          </View>
          <View style={styles.levelStat}>
            <Text style={styles.levelStatIcon}>⏱️</Text>
            <Text style={[styles.levelStatText, !unlocked && styles.textLocked]}>
              ~{levelData.estimatedDuration} min
            </Text>
          </View>
          {current && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>En cours</Text>
            </View>
          )}
        </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const completionPercent = progress ? TutorialService.getCompletionPercentage(progress) : 0;
  const completedLevels = progress?.completedLevels.length || 0;

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 Formation Joueur</Text>
        <TouchableOpacity
          onPress={async () => {
            await TutorialService.resetProgress();
            loadData();
          }}
          style={{ width: 40, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 18 }}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Overview */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
        style={styles.progressCard}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Votre Progression</Text>
          <Text style={styles.progressPercent}>{completionPercent}%</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: `${completionPercent}%` }]} />
          </View>
        </View>

        <View style={styles.progressStats}>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>{completedLevels}/10</Text>
            <Text style={styles.progressStatLabel}>Niveaux complétés</Text>
          </View>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>{progress?.completedSteps.length || 0}</Text>
            <Text style={styles.progressStatLabel}>Étapes complétées</Text>
          </View>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>
              {Math.floor((progress?.totalTimeSpent || 0) / 60)}m
            </Text>
            <Text style={styles.progressStatLabel}>Temps total</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Levels List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.levelsContainer}>
          <Text style={styles.sectionTitle}>Parcours de Formation</Text>
          {levels.map((levelData) => renderLevelCard(levelData))}
        </View>

        {/* Tips */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
          style={styles.tipsCard}
        >
          <Text style={styles.tipsIcon}>💡</Text>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Conseil</Text>
            <Text style={styles.tipsText}>
              Suivez les niveaux dans l'ordre pour une progression optimale. Chaque niveau
              débloque le suivant !
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
    backgroundColor: '#667eea',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowGradient: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
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
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressStatLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  levelsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  levelCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  levelCardCurrent: {
    borderColor: 'rgba(74, 144, 226, 0.8)',
    borderWidth: 3,
  },
  levelCardCompleted: {
    borderColor: 'rgba(76, 175, 80, 0.8)',
    borderWidth: 3,
  },
  levelCardLocked: {
    opacity: 0.5,
  },
  levelCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  levelIconContainer: {
    position: 'relative',
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
  levelIcon: {
    fontSize: 32,
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#4caf50',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadgeText: {
    fontSize: 14,
    color: '#fff',
  },
  inProgressBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#ff9800',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inProgressBadgeText: {
    fontSize: 12,
  },
  lockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#8b92b0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedBadgeText: {
    fontSize: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelNumber: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '700',
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  levelDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  levelStatIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  levelStatText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  textLocked: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  currentBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(74, 144, 226, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tipsCard: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tipsText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
