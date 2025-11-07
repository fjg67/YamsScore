/**
 * Learning Center Screen - Écran principal du système d'apprentissage
 * Regroupe : Tutoriels, Mode Pratique, Bibliothèque Stratégies, Replays
 */

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
import { TutorialService } from '../services/tutorialService';
import { PracticeService } from '../services/practiceService';
import { StrategyLibraryService } from '../services/strategyLibraryService';
import { ReplayAnalysisService } from '../services/replayAnalysisService';
import { LuckyMascot } from '../components/Lucky/LuckyMascot';

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

interface LearningCenterScreenProps {
  onBack: () => void;
  onNavigateToTutorials: () => void;
  onNavigateToPractice: () => void;
  onNavigateToStrategies: () => void;
  onNavigateToReplays: () => void;
}

export const LearningCenterScreen: React.FC<LearningCenterScreenProps> = ({
  onBack,
  onNavigateToTutorials,
  onNavigateToPractice,
  onNavigateToStrategies,
  onNavigateToReplays,
}) => {
  const [stats, setStats] = useState({
    tutorialCompletion: 0,
    practiceExercises: 0,
    strategiesRead: 0,
    replaysAnalyzed: 0,
  });

  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadStats();

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

  const loadStats = async () => {
    // Charger les stats de chaque section
    const tutorialProgress = await TutorialService.getProgress();
    const practiceProgress = await PracticeService.getProgress();
    const strategyStats = await StrategyLibraryService.getStats();
    const replayStats = await ReplayAnalysisService.getGlobalStats();

    setStats({
      tutorialCompletion: tutorialProgress
        ? TutorialService.getCompletionPercentage(tutorialProgress)
        : 0,
      practiceExercises: practiceProgress?.totalScenariosCompleted || 0,
      strategiesRead: strategyStats.readTips,
      replaysAnalyzed: replayStats.totalGames,
    });
  };

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
        <Text style={styles.headerTitle}>🎓 Centre d'Apprentissage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
          style={styles.welcomeCard}
        >
          <View style={styles.mascotWrapper}>
            <LuckyMascot mood="happy" size={80} />
          </View>
          <Text style={styles.welcomeTitle}>Bienvenue, champion !</Text>
          <Text style={styles.welcomeText}>
            Améliore tes compétences avec nos outils d'apprentissage interactifs. Tutoriels,
            exercices pratiques, stratégies d'experts et analyse de tes parties !
          </Text>
        </LinearGradient>

        {/* Main Features */}
        <View style={styles.featuresContainer}>
          {/* Tutoriel Interactif */}
          <TouchableOpacity onPress={onNavigateToTutorials} activeOpacity={0.9}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
              style={styles.featureCard}
            >
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>📚</Text>
              </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Tutoriel Interactif</Text>
              <Text style={styles.featureDescription}>
                10 niveaux progressifs avec quiz et explications
              </Text>
              <View style={styles.featureProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${stats.tutorialCompletion}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{stats.tutorialCompletion}%</Text>
              </View>
            </View>
            <Text style={styles.featureArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Mode Pratique */}
          <TouchableOpacity onPress={onNavigateToPractice} activeOpacity={0.9}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
              style={styles.featureCard}
            >
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🏋️</Text>
              </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Mode Pratique</Text>
              <Text style={styles.featureDescription}>
                Exercices ciblés par catégorie et scénarios
              </Text>
              <View style={styles.featureStat}>
                <Text style={styles.featureStatIcon}>✓</Text>
                <Text style={styles.featureStatText}>
                  {stats.practiceExercises} exercices complétés
                </Text>
              </View>
            </View>
            <Text style={styles.featureArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Bibliothèque Stratégies */}
          <TouchableOpacity onPress={onNavigateToStrategies} activeOpacity={0.9}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
              style={styles.featureCard}
            >
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>📖</Text>
              </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Bibliothèque Stratégies</Text>
              <Text style={styles.featureDescription}>
                Astuces d'experts et guides stratégiques
              </Text>
              <View style={styles.featureStat}>
                <Text style={styles.featureStatIcon}>📝</Text>
                <Text style={styles.featureStatText}>
                  {stats.strategiesRead} stratégies lues
                </Text>
              </View>
            </View>
            <Text style={styles.featureArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Replay & Analyse */}
          <TouchableOpacity onPress={onNavigateToReplays} activeOpacity={0.9}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
              style={styles.featureCard}
            >
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🎬</Text>
              </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Replay & Analyse</Text>
              <Text style={styles.featureDescription}>
                Analyse tes parties avec commentaires IA
              </Text>
              <View style={styles.featureStat}>
                <Text style={styles.featureStatIcon}>🎮</Text>
                <Text style={styles.featureStatText}>
                  {stats.replaysAnalyzed} parties analysées
                </Text>
              </View>
            </View>
            <Text style={styles.featureArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 Conseils Rapides</Text>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.tipCard}
          >
            <Text style={styles.tipNumber}>1</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Commence par le tutoriel</Text>
              <Text style={styles.tipText}>
                Les 10 niveaux te donneront toutes les bases pour devenir un expert
              </Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.tipCard}
          >
            <Text style={styles.tipNumber}>2</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Pratique régulièrement</Text>
              <Text style={styles.tipText}>
                Le mode pratique renforce tes compétences dans des situations spécifiques
              </Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.tipCard}
          >
            <Text style={styles.tipNumber}>3</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Analyse tes parties</Text>
              <Text style={styles.tipText}>
                Apprends de tes erreurs en revoyant tes parties avec l'analyse IA
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Lucky's Message */}
        <View style={styles.luckyMessage}>
          <View style={styles.luckyAvatar}>
            <Text style={styles.luckyEmoji}>🍀</Text>
          </View>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
            style={styles.luckyBubble}
          >
            <Text style={styles.luckyText}>
              "Hey champion ! Je serai là pour te guider tout au long de ton apprentissage.
              Ensemble, on va faire de toi un maître du Yams ! 🎯"
            </Text>
            <Text style={styles.luckySignature}>- Lucky, ta mascotte</Text>
          </LinearGradient>
        </View>

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
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  mascotWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuresContainer: {
    padding: 16,
    paddingTop: 0,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featureIcon: {
    fontSize: 32,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featureDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
    minWidth: 35,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureStatIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  featureStatText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '900',
  },
  tipsSection: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tipCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tipNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#4caf50',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  luckyMessage: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 8,
  },
  luckyAvatar: {
    width: 50,
    height: 50,
    backgroundColor: '#ffd700',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  luckyEmoji: {
    fontSize: 28,
  },
  luckyBubble: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  luckyText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  luckySignature: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
