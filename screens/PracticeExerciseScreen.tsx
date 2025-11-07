/**
 * Practice Exercise Screen - Écran d'exercice pratique
 * Permet de faire les exercices d'une catégorie spécifique
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PracticeCategoryType,
  PracticeScenario,
  PracticeSession,
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

interface PracticeExerciseScreenProps {
  category: PracticeCategoryType;
  onBack: () => void;
  onComplete?: () => void;
}

export const PracticeExerciseScreen: React.FC<PracticeExerciseScreenProps> = ({
  category,
  onBack,
  onComplete,
}) => {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentScenario, setCurrentScenario] = useState<PracticeScenario | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (session && session.scenarios.length > 0) {
      const scenario = session.scenarios[session.currentScenarioIndex];
      setCurrentScenario(scenario);
      animateIn();
    }
  }, [session]);

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

  const loadSession = async () => {
    const newSession = await PracticeService.createSession(category);
    setSession(newSession);
  };

  const animateIn = () => {
    fadeAnim.setValue(0);
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleShowHint = () => {
    if (!currentScenario) return;
    if (hintIndex < currentScenario.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHint(true);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
  };

  const handleNext = async () => {
    if (!session || !currentScenario) return;

    // Marquer le scénario comme complété
    const score = userScore || 0;
    const hintsUsed = showHint ? hintIndex + 1 : 0;
    let updatedSession = await PracticeService.completeScenario(
      session,
      currentScenario.id,
      score,
      hintsUsed
    );

    // Passer au scénario suivant
    if (updatedSession.currentScenarioIndex < updatedSession.scenarios.length - 1) {
      updatedSession = await PracticeService.nextScenario(updatedSession);
      setSession(updatedSession);
      setShowHint(false);
      setHintIndex(0);
      setShowSolution(false);
      setUserScore(null);
    } else {
      // Session terminée
      await PracticeService.completeSession(updatedSession);
      if (onComplete) {
        onComplete();
      } else {
        onBack();
      }
    }
  };

  const getDiceEmoji = (value: number): string => {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[value - 1] || '⚀';
  };

  const getCategoryNameFR = (category: string): string => {
    const translations: Record<string, string> = {
      'ones': 'As (1)',
      'twos': 'Deux (2)',
      'threes': 'Trois (3)',
      'fours': 'Quatre (4)',
      'fives': 'Cinq (5)',
      'sixes': 'Six (6)',
      'threeOfKind': 'Brelan',
      'fourOfKind': 'Carré',
      'fullHouse': 'Full',
      'smallStraight': 'Petite Suite',
      'largeStraight': 'Grande Suite',
      'yams': 'Yams',
      'chance': 'Chance',
    };
    return translations[category] || category;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'facile':
        return '#4caf50';
      case 'moyen':
        return '#ff9800';
      case 'difficile':
        return '#f44336';
      case 'expert':
        return '#9c27b0';
      default:
        return '#8b92b0';
    }
  };

  if (!session || !currentScenario) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const categoryInfo = PracticeService.getCategoryInfo(category);
  const progress = ((session.currentScenarioIndex + 1) / session.scenarios.length) * 100;

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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {categoryInfo.icon} {categoryInfo.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            Exercice {session.currentScenarioIndex + 1}/{session.scenarios.length}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Scenario Card */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scenarioCard}
          >
            {/* Title & Difficulty */}
            <View style={styles.scenarioHeader}>
              <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(currentScenario.difficulty) },
                ]}
              >
                <Text style={styles.difficultyText}>{currentScenario.difficulty}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.scenarioDescription}>{currentScenario.description}</Text>

            {/* Objective */}
            <View style={styles.objectiveBox}>
              <Text style={styles.objectiveIcon}>🎯</Text>
              <Text style={styles.objectiveText}>{currentScenario.objective}</Text>
            </View>

            {/* Dice Display */}
            <View style={styles.diceSection}>
              <Text style={styles.sectionTitle}>Dés obtenus :</Text>
              <View style={styles.diceContainer}>
                {currentScenario.initialDice.map((value, index) => (
                  <View key={index} style={styles.diceBox}>
                    <Text style={styles.diceValue}>{getDiceEmoji(value)}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.rollsInfo}>
                {currentScenario.rollsRemaining} relance(s) restante(s)
              </Text>
            </View>

            {/* Available Categories */}
            {currentScenario.availableCategories && (
              <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>Catégories disponibles :</Text>
                <View style={styles.categoriesList}>
                  {currentScenario.availableCategories.map((cat, index) => (
                    <View key={index} style={styles.categoryChip}>
                      <Text style={styles.categoryChipText}>{getCategoryNameFR(cat)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Current Scores (if any) */}
            {currentScenario.currentScores && (
              <View style={styles.scoresSection}>
                <Text style={styles.sectionTitle}>Scores actuels :</Text>
                <View style={styles.scoresList}>
                  {Object.entries(currentScenario.currentScores).map(([key, value]) => (
                    <Text key={key} style={styles.scoreItem}>
                      {key}: {value} pts
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </LinearGradient>

          {/* Lucky Mascot */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.luckyContainer}
          >
            <View style={styles.luckyMascot}>
              <Text style={styles.luckyEmoji}>🍀</Text>
            </View>
            <View style={styles.luckyBubble}>
              <Text style={styles.luckyText}>
                Réfléchis bien ! Analyse les dés et choisis la meilleure stratégie ! 🎯
              </Text>
            </View>
          </LinearGradient>

          {/* Hint Section */}
          {currentScenario.hints && currentScenario.hints.length > 0 && (
            <View style={styles.hintSection}>
              {!showHint && (
                <TouchableOpacity onPress={handleShowHint} activeOpacity={0.9}>
                  <LinearGradient
                    colors={['rgba(245, 158, 11, 0.9)', 'rgba(217, 119, 6, 0.9)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hintButton}
                  >
                    <Text style={styles.hintButtonIcon}>💡</Text>
                    <Text style={styles.hintButtonText}>Voir un indice</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {showHint && (
                <LinearGradient
                  colors={['rgba(245, 158, 11, 0.9)', 'rgba(217, 119, 6, 0.9)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.hintBox}
                >
                  <View style={styles.hintHeader}>
                    <Text style={styles.hintIcon}>💡</Text>
                    <Text style={styles.hintTitle}>
                      Indice {hintIndex + 1}/{currentScenario.hints.length}
                    </Text>
                  </View>
                  <Text style={styles.hintText}>{currentScenario.hints[hintIndex]}</Text>
                  {hintIndex < currentScenario.hints.length - 1 && (
                    <TouchableOpacity
                      style={styles.moreHintButton}
                      onPress={handleShowHint}
                    >
                      <Text style={styles.moreHintText}>Indice suivant →</Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              )}
            </View>
          )}

          {/* Solution Button */}
          {!showSolution && (
            <TouchableOpacity onPress={handleShowSolution} activeOpacity={0.9}>
              <LinearGradient
                colors={['rgba(76, 175, 80, 0.9)', 'rgba(56, 142, 60, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.solutionButton}
              >
                <Text style={styles.solutionButtonText}>Voir la solution optimale</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Solution Display */}
          {showSolution && currentScenario.optimalSolution && (
            <LinearGradient
              colors={['rgba(27, 94, 32, 0.9)', 'rgba(46, 125, 50, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.solutionCard}
            >
              <View style={styles.solutionHeader}>
                <Text style={styles.solutionIcon}>✅</Text>
                <Text style={styles.solutionTitle}>Solution Optimale</Text>
              </View>

              <View style={styles.solutionContent}>
                <Text style={styles.solutionLabel}>Dés à garder :</Text>
                <View style={styles.diceContainer}>
                  {currentScenario.optimalSolution.dicesToKeep.map((value, index) => (
                    <View key={index} style={[styles.diceBox, styles.diceBoxSmall]}>
                      <Text style={styles.diceValueSmall}>{getDiceEmoji(value)}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.solutionLabel}>
                  Catégorie : {currentScenario.optimalSolution.targetCategory}
                </Text>
                <Text style={styles.solutionLabel}>
                  Score attendu : {currentScenario.optimalSolution.expectedScore} points
                </Text>

                <View style={styles.reasoningBox}>
                  <Text style={styles.reasoningIcon}>💭</Text>
                  <Text style={styles.reasoningText}>
                    {currentScenario.optimalSolution.reasoning}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!showSolution}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={
              showSolution
                ? ['rgba(76, 175, 80, 0.9)', 'rgba(56, 142, 60, 0.9)']
                : ['rgba(55, 65, 81, 0.5)', 'rgba(31, 41, 55, 0.5)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {session.currentScenarioIndex === session.scenarios.length - 1
                ? 'Terminer'
                : 'Exercice suivant'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  scenarioCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scenarioTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  objectiveBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(37, 99, 235, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  objectiveIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  objectiveText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  diceSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  diceBox: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  diceValue: {
    fontSize: 32,
  },
  diceBoxSmall: {
    width: 40,
    height: 40,
  },
  diceValueSmall: {
    fontSize: 24,
  },
  rollsInfo: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scoresSection: {
    marginBottom: 20,
  },
  scoresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scoreItem: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  luckyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  luckyMascot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffd700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  luckyEmoji: {
    fontSize: 28,
  },
  luckyBubble: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  luckyText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hintSection: {
    marginBottom: 16,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  hintButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  hintButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hintBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hintText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  moreHintButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  moreHintText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  solutionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  solutionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  solutionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  solutionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  solutionContent: {
    gap: 12,
  },
  solutionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  reasoningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  reasoningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  reasoningText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
