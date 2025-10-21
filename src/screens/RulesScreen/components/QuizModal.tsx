/**
 * Quiz Modal - Quiz interactif gamifié avec badges
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { DiceRow } from './AnimatedDice';
import {
  quizQuestions,
  QuizQuestion,
  getBadgeForScore,
  getScorePercentage,
  getScoreMessage,
} from '../data/quizQuestions';
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
  RulesShadows,
  DiceSizes,
} from '../styles/rulesTheme';

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ visible, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | boolean | null>(null);
  const [selectedDice, setSelectedDice] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswer = (answer: string | number | boolean) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    // Vérifier si la réponse est correcte
    if (currentQuestion.type === 'multiple-choice') {
      const option = currentQuestion.options?.find(opt => opt.value === answer);
      if (option?.correct) {
        setScore(score + 1);
      }
    } else if (currentQuestion.type === 'true-false') {
      if (answer === currentQuestion.answer) {
        setScore(score + 1);
      }
    }
  };

  const handleDiceSelect = (index: number) => {
    if (answered) return;

    const diceValue = currentQuestion.dice![index];
    const newSelected = selectedDice.includes(index)
      ? selectedDice.filter(i => i !== index)
      : [...selectedDice, index];

    setSelectedDice(newSelected);
  };

  const handleSubmitDice = () => {
    if (answered) return;

    setAnswered(true);

    // Vérifier si la sélection est correcte
    const selectedValues = selectedDice.map(i => currentQuestion.dice![i]).sort();
    const correctValues = currentQuestion.correctAnswer!.sort();

    if (JSON.stringify(selectedValues) === JSON.stringify(correctValues)) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setSelectedDice([]);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setSelectedDice([]);
    setShowResults(false);
  };

  const handleClose = () => {
    handleRestart();
    onClose();
  };

  const isCorrectAnswer = () => {
    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
      const option = currentQuestion.options?.find(opt => opt.value === selectedAnswer);
      return option?.correct || selectedAnswer === currentQuestion.answer;
    } else {
      const selectedValues = selectedDice.map(i => currentQuestion.dice![i]).sort();
      const correctValues = currentQuestion.correctAnswer!.sort();
      return JSON.stringify(selectedValues) === JSON.stringify(correctValues);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {!showResults ? (
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Quiz des Règles</Text>
              <Text style={styles.scoreText}>{score}/{quizQuestions.length}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1}/{quizQuestions.length}
              </Text>
            </View>

            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Question Card */}
              <Animated.View
                key={currentQuestionIndex}
                entering={SlideInRight.duration(300)}
                exiting={SlideOutLeft.duration(300)}
                style={styles.questionCard}
              >
                <Text style={styles.questionText}>{currentQuestion.question}</Text>

                {/* Dice Visual */}
                {currentQuestion.dice && (
                  <View style={styles.diceContainer}>
                    <DiceRow
                      dice={currentQuestion.dice}
                      size={DiceSizes.large}
                      gap={12}
                    />
                  </View>
                )}

                {/* Answer Options */}
                {currentQuestion.type === 'multiple-choice' && (
                  <View style={styles.optionsContainer}>
                    {currentQuestion.options?.map((option, index) => (
                      <AnswerButton
                        key={index}
                        label={option.value.toString()}
                        selected={selectedAnswer === option.value}
                        correct={answered && option.correct}
                        incorrect={answered && selectedAnswer === option.value && !option.correct}
                        onPress={() => handleAnswer(option.value)}
                        disabled={answered}
                      />
                    ))}
                  </View>
                )}

                {/* True/False */}
                {currentQuestion.type === 'true-false' && (
                  <View style={styles.optionsContainer}>
                    <AnswerButton
                      label="Vrai ✓"
                      selected={selectedAnswer === true}
                      correct={answered && currentQuestion.answer === true}
                      incorrect={answered && selectedAnswer === true && currentQuestion.answer === false}
                      onPress={() => handleAnswer(true)}
                      disabled={answered}
                    />
                    <AnswerButton
                      label="Faux ✗"
                      selected={selectedAnswer === false}
                      correct={answered && currentQuestion.answer === false}
                      incorrect={answered && selectedAnswer === false && currentQuestion.answer === true}
                      onPress={() => handleAnswer(false)}
                      disabled={answered}
                    />
                  </View>
                )}

                {/* Interactive Dice */}
                {currentQuestion.type === 'interactive-dice' && (
                  <View style={styles.interactiveDiceContainer}>
                    <Text style={styles.instructionText}>
                      Tape sur les dés pour les sélectionner
                    </Text>
                    <View style={styles.diceRow}>
                      {currentQuestion.dice?.map((value, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleDiceSelect(index)}
                          disabled={answered}
                          style={[
                            styles.interactiveDice,
                            selectedDice.includes(index) && styles.selectedDice,
                          ]}
                        >
                          <Text style={styles.diceValue}>{value}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {!answered && selectedDice.length > 0 && (
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmitDice}
                      >
                        <Text style={styles.submitButtonText}>Valider</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Explanation */}
                {answered && (
                  <Animated.View
                    entering={FadeIn.delay(200).duration(400)}
                    style={[
                      styles.explanationCard,
                      isCorrectAnswer() ? styles.correctCard : styles.incorrectCard,
                    ]}
                  >
                    <Text style={styles.resultIcon}>
                      {isCorrectAnswer() ? '✓' : '✗'}
                    </Text>
                    <Text style={styles.resultText}>
                      {isCorrectAnswer() ? 'Bravo !' : 'Pas tout à fait...'}
                    </Text>
                    <Text style={styles.explanationText}>
                      {currentQuestion.explanation}
                    </Text>
                  </Animated.View>
                )}
              </Animated.View>

              {/* Next Button */}
              {answered && (
                <Animated.View entering={FadeIn.delay(400).duration(400)}>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentQuestionIndex < quizQuestions.length - 1
                        ? 'Question Suivante →'
                        : 'Voir les Résultats →'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </ScrollView>
          </>
        ) : (
          <ResultsScreen
            score={score}
            total={quizQuestions.length}
            onRestart={handleRestart}
            onClose={handleClose}
          />
        )}
      </LinearGradient>
    </Modal>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface AnswerButtonProps {
  label: string;
  selected: boolean;
  correct: boolean;
  incorrect: boolean;
  onPress: () => void;
  disabled: boolean;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({
  label,
  selected,
  correct,
  incorrect,
  onPress,
  disabled,
}) => {
  const getBackgroundColor = () => {
    if (correct) return RulesColors.semantic.success;
    if (incorrect) return RulesColors.semantic.error;
    if (selected) return RulesColors.sections.upper.background;
    return RulesColors.ui.background;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.answerButton,
        { backgroundColor: getBackgroundColor(), opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={styles.answerButtonText}>{label}</Text>
      {(correct || incorrect) && (
        <Text style={styles.answerIcon}>{correct ? '✓' : '✗'}</Text>
      )}
    </Pressable>
  );
};

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  onClose: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  total,
  onRestart,
  onClose,
}) => {
  const percentage = getScorePercentage(score);
  const badge = getBadgeForScore(score);
  const message = getScoreMessage(percentage);

  return (
    <View style={styles.resultsContainer}>
      <Animated.View entering={ZoomIn.duration(600)} style={styles.resultsCard}>
        <Text style={styles.resultsTitle}>Quiz Terminé !</Text>

        {/* Score Circle */}
        <View style={styles.scoreCircle}>
          <Text style={styles.scorePercentage}>{percentage}%</Text>
          <Text style={styles.scoreDetails}>
            {score} / {total} correct{score > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Badge */}
        {badge && (
          <Animated.View
            entering={ZoomIn.delay(400).duration(600)}
            style={styles.badgeContainer}
          >
            <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
            <Text style={styles.badgeName}>{badge.name}</Text>
            <Text style={styles.badgeDescription}>{badge.description}</Text>
          </Animated.View>
        )}

        {/* Message */}
        <Text style={styles.messageText}>{message}</Text>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
            <Text style={styles.restartButtonText}>🔄 Recommencer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeResultsButton} onPress={onClose}>
            <Text style={styles.closeResultsButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RulesSpacing.lg,
    paddingTop: 60,
    paddingBottom: RulesSpacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: RulesColors.text.white,
    fontWeight: RulesTypography.weights.bold,
  },
  headerTitle: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.white,
  },
  scoreText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.white,
  },
  progressContainer: {
    paddingHorizontal: RulesSpacing.lg,
    marginBottom: RulesSpacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RulesBorderRadius.xs,
    overflow: 'hidden',
    marginBottom: RulesSpacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: RulesColors.text.white,
    borderRadius: RulesBorderRadius.xs,
  },
  progressText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: RulesSpacing.lg,
  },
  questionCard: {
    backgroundColor: RulesColors.ui.surface,
    borderRadius: RulesBorderRadius.xl,
    padding: RulesSpacing.xl,
    ...RulesShadows.lg,
  },
  questionText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
    textAlign: 'center',
    marginBottom: RulesSpacing.lg,
  },
  diceContainer: {
    alignItems: 'center',
    marginBottom: RulesSpacing.lg,
  },
  optionsContainer: {
    gap: RulesSpacing.md,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: RulesSpacing.lg,
    borderRadius: RulesBorderRadius.md,
    borderWidth: 2,
    borderColor: RulesColors.ui.border,
  },
  answerButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.primary,
    flex: 1,
  },
  answerIcon: {
    fontSize: 24,
    color: RulesColors.text.primary,
  },
  interactiveDiceContainer: {
    gap: RulesSpacing.md,
  },
  instructionText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.secondary,
    textAlign: 'center',
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: RulesSpacing.sm,
  },
  interactiveDice: {
    width: 60,
    height: 60,
    borderRadius: RulesBorderRadius.md,
    backgroundColor: RulesColors.ui.background,
    borderWidth: 3,
    borderColor: RulesColors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDice: {
    borderColor: RulesColors.sections.lower.primary,
    backgroundColor: RulesColors.sections.lower.background,
  },
  diceValue: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h2,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
  },
  submitButton: {
    backgroundColor: RulesColors.sections.lower.primary,
    padding: RulesSpacing.md,
    borderRadius: RulesBorderRadius.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.white,
  },
  explanationCard: {
    marginTop: RulesSpacing.lg,
    padding: RulesSpacing.lg,
    borderRadius: RulesBorderRadius.md,
    alignItems: 'center',
  },
  correctCard: {
    backgroundColor: 'rgba(80, 200, 120, 0.15)',
    borderWidth: 2,
    borderColor: RulesColors.semantic.success,
  },
  incorrectCard: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    borderWidth: 2,
    borderColor: RulesColors.semantic.error,
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: RulesSpacing.sm,
  },
  resultText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xs,
  },
  explanationText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    textAlign: 'center',
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.bodySmall,
  },
  nextButton: {
    backgroundColor: RulesColors.text.white,
    padding: RulesSpacing.lg,
    borderRadius: RulesBorderRadius.md,
    alignItems: 'center',
    marginTop: RulesSpacing.lg,
    ...RulesShadows.md,
  },
  nextButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.bold,
    color: '#667eea',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: RulesSpacing.lg,
  },
  resultsCard: {
    backgroundColor: RulesColors.ui.surface,
    borderRadius: RulesBorderRadius.xxl,
    padding: RulesSpacing.xxxl,
    alignItems: 'center',
    ...RulesShadows.xl,
    width: '100%',
  },
  resultsTitle: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h1,
    fontWeight: RulesTypography.weights.black,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xl,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: RulesColors.sections.lower.background,
    borderWidth: 8,
    borderColor: RulesColors.sections.lower.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: RulesSpacing.xl,
  },
  scorePercentage: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: 48,
    fontWeight: RulesTypography.weights.black,
    color: RulesColors.sections.lower.primary,
  },
  scoreDetails: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.secondary,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: RulesSpacing.lg,
  },
  badgeEmoji: {
    fontSize: 64,
    marginBottom: RulesSpacing.sm,
  },
  badgeName: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xxs,
  },
  badgeDescription: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
  },
  messageText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.secondary,
    textAlign: 'center',
    marginBottom: RulesSpacing.xl,
  },
  actionButtons: {
    width: '100%',
    gap: RulesSpacing.md,
  },
  restartButton: {
    backgroundColor: RulesColors.sections.lower.primary,
    padding: RulesSpacing.lg,
    borderRadius: RulesBorderRadius.md,
    alignItems: 'center',
  },
  restartButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.white,
  },
  closeResultsButton: {
    backgroundColor: RulesColors.ui.background,
    padding: RulesSpacing.lg,
    borderRadius: RulesBorderRadius.md,
    alignItems: 'center',
  },
  closeResultsButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.secondary,
  },
});
