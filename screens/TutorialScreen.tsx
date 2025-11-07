import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TutorialProgress, TutorialStep, TutorialLevelData } from '../src/types/learning';
import { TutorialService } from '../services/tutorialService';
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

interface TutorialScreenProps {
  onBack: () => void;
  onComplete?: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onBack, onComplete }) => {
  const [progress, setProgress] = useState<TutorialProgress | null>(null);
  const [currentLevel, setCurrentLevel] = useState<TutorialLevelData | null>(null);
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadProgress();

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

  useEffect(() => {
    if (progress) {
      const levelData = TutorialService.getLevelData(progress.currentLevel);
      const step = levelData.steps[progress.currentStepIndex];
      setCurrentLevel(levelData);
      setCurrentStep(step);
      animateIn();
    }
  }, [progress]);

  const loadProgress = async () => {
    let prog = await TutorialService.getProgress();
    if (!prog) {
      prog = await TutorialService.initializeProgress();
    }
    setProgress(prog);
  };

  const animateIn = () => {
    animatedValue.setValue(0);
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = async () => {
    if (!progress || !currentStep || !currentLevel) {
      return;
    }

    try {
      // Navigation locale d'abord pour que ce soit instantané
      if (progress.currentStepIndex < currentLevel.steps.length - 1) {
        // Passer au step suivant dans le même niveau
        const newProgress = {
          ...progress,
          currentStepIndex: progress.currentStepIndex + 1,
          completedSteps: [...progress.completedSteps, currentStep.id],
        };
        setProgress(newProgress);
        setSelectedAnswer(null);
        setShowExplanation(false);

        // Sauvegarder immédiatement (sans attendre pour ne pas bloquer l'UI)
        TutorialService.saveProgress(newProgress).catch((e) => console.error('Save error:', e));
      } else {
        // Niveau terminé, passer au niveau suivant
        const newCompletedLevels = progress.completedLevels.includes(progress.currentLevel)
          ? progress.completedLevels
          : [...progress.completedLevels, progress.currentLevel];

        if (progress.currentLevel < 10) {
          // Passer au niveau suivant
          const newProgress = {
            ...progress,
            currentLevel: (progress.currentLevel + 1) as any,
            currentStepIndex: 0,
            completedLevels: newCompletedLevels,
            completedSteps: [...progress.completedSteps, currentStep.id],
          };
          setProgress(newProgress);
          setSelectedAnswer(null);
          setShowExplanation(false);

          // Sauvegarder immédiatement
          TutorialService.saveProgress(newProgress).catch((e) => console.error('Save error:', e));
        } else {
          // Tous les niveaux complétés
          if (onComplete) {
            onComplete();
          }
        }
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'explanation':
        return renderExplanation();
      case 'demonstration':
        return renderDemonstration();
      case 'quiz':
        return renderQuiz();
      case 'challenge':
        return renderChallenge();
      default:
        return null;
    }
  };

  const renderExplanation = () => {
    if (!currentStep) return null;

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        <Text style={styles.stepText}>{currentStep.content}</Text>

        {currentStep.explanation && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationIcon}>💡</Text>
            <Text style={styles.explanationText}>{currentStep.explanation}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDemonstration = () => {
    if (!currentStep || !currentStep.demoData) return null;

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        <Text style={styles.stepText}>{currentStep.content}</Text>

        {/* Affichage des dés */}
        <View style={styles.diceContainer}>
          {currentStep.demoData.dice.map((value, index) => (
            <View key={index} style={styles.diceBox}>
              <Text style={styles.diceValue}>{getDiceEmoji(value)}</Text>
            </View>
          ))}
        </View>

        {/* Explication de la démo */}
        <View style={styles.demoExplanation}>
          <Text style={styles.demoExplanationText}>
            {currentStep.demoData.explanation}
          </Text>
        </View>

        {currentStep.explanation && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationIcon}>💡</Text>
            <Text style={styles.explanationText}>{currentStep.explanation}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderQuiz = () => {
    if (!currentStep || !currentStep.quizData) return null;

    const { question, options, correctAnswer, explanation } = currentStep.quizData;

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        <Text style={styles.quizQuestion}>{question}</Text>

        {/* Options */}
        <View style={styles.quizOptions}>
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === correctAnswer;
            const showResult = showExplanation;

            let optionStyle = [styles.quizOption];
            if (isSelected && showResult) {
              optionStyle.push(isCorrect ? styles.quizOptionCorrect : styles.quizOptionWrong);
            } else if (isSelected) {
              optionStyle.push(styles.quizOptionSelected);
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => !showExplanation && handleQuizAnswer(index)}
                disabled={showExplanation}
              >
                <Text style={styles.quizOptionText}>{option}</Text>
                {showResult && isCorrect && <Text style={styles.quizResultIcon}>✓</Text>}
                {showResult && isSelected && !isCorrect && (
                  <Text style={styles.quizResultIcon}>✗</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explication après réponse */}
        {showExplanation && (
          <View
            style={[
              styles.quizExplanation,
              selectedAnswer === correctAnswer
                ? styles.quizExplanationCorrect
                : styles.quizExplanationWrong,
            ]}
          >
            <Text style={styles.quizExplanationText}>{explanation}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderChallenge = () => {
    if (!currentStep || !currentStep.challengeData) return null;

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{currentStep.title}</Text>
        <Text style={styles.stepText}>{currentStep.content}</Text>

        {/* Objectif */}
        <View style={styles.challengeObjective}>
          <Text style={styles.challengeObjectiveIcon}>🎯</Text>
          <Text style={styles.challengeObjectiveText}>
            {currentStep.challengeData.objective}
          </Text>
        </View>

        {/* Dés de départ */}
        <View style={styles.diceContainer}>
          {currentStep.challengeData.startDice.map((value, index) => (
            <View key={index} style={styles.diceBox}>
              <Text style={styles.diceValue}>{getDiceEmoji(value)}</Text>
            </View>
          ))}
        </View>

        {/* Indice */}
        {currentStep.challengeData.hint && (
          <View style={styles.hintBox}>
            <Text style={styles.hintIcon}>💡</Text>
            <Text style={styles.hintText}>{currentStep.challengeData.hint}</Text>
          </View>
        )}

        {/* Bouton pour lancer le challenge */}
        <TouchableOpacity style={styles.challengeButton}>
          <Text style={styles.challengeButtonText}>Commencer le défi</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getDiceEmoji = (value: number): string => {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[value - 1] || '⚀';
  };

  if (!progress || !currentLevel || !currentStep) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const completionPercent = TutorialService.getCompletionPercentage(progress);

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
        <TouchableOpacity
          onPress={async () => {
            // Sauvegarder avant de quitter
            if (progress) {
              await TutorialService.saveProgress(progress);
            }
            onBack();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {currentLevel.icon} {currentLevel.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            Niveau {currentLevel.level}/10 - Étape {progress.currentStepIndex + 1}/
            {currentLevel.steps.length}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log('🟢 TEST BUTTON CLICKED!');
            handleNext();
          }}
          style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 20 }}>▶️</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${((progress.currentStepIndex + 1) / currentLevel.steps.length) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{completionPercent}% complété</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: animatedValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Lucky Mascot */}
          {currentStep.luckyDialogue && (
            <View style={styles.luckyContainer}>
              <View style={styles.luckyMascot}>
                <Text style={styles.luckyEmoji}>🍀</Text>
              </View>
              <View style={styles.luckyBubble}>
                <Text style={styles.luckyText}>{currentStep.luckyDialogue}</Text>
              </View>
            </View>
          )}

          {/* Step Content */}
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer} pointerEvents="box-none">
        <TouchableOpacity
          style={[
            styles.nextButton,
            (currentStep.type === 'quiz' && !showExplanation) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentStep.type === 'quiz' && !showExplanation}
          activeOpacity={0.7}
          pointerEvents="auto"
        >
          <Text style={styles.nextButtonText}>
            {progress.currentStepIndex === currentLevel.steps.length - 1
              ? progress.currentLevel === 10
                ? 'Terminer'
                : 'Niveau suivant'
              : 'Continuer'}
          </Text>
        </TouchableOpacity>
      </View>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  luckyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  luckyEmoji: {
    fontSize: 28,
  },
  luckyBubble: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  luckyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  stepContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  explanationBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  explanationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  explanationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 20,
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
  demoExplanation: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  demoExplanationText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quizOptions: {
    gap: 12,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quizOptionSelected: {
    borderColor: 'rgba(37, 99, 235, 0.8)',
    backgroundColor: 'rgba(37, 99, 235, 0.4)',
  },
  quizOptionCorrect: {
    borderColor: 'rgba(76, 175, 80, 0.8)',
    backgroundColor: 'rgba(76, 175, 80, 0.4)',
  },
  quizOptionWrong: {
    borderColor: 'rgba(244, 67, 54, 0.8)',
    backgroundColor: 'rgba(244, 67, 54, 0.4)',
  },
  quizOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quizResultIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  quizExplanation: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  quizExplanationCorrect: {
    backgroundColor: '#1b5e20',
  },
  quizExplanationWrong: {
    backgroundColor: '#b71c1c',
  },
  quizExplanationText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  challengeObjective: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  challengeObjectiveIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  challengeObjectiveText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 22,
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  hintIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    fontWeight: '500',
  },
  challengeButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  challengeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 10,
    zIndex: 1000,
  },
  nextButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.8)',
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    opacity: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
