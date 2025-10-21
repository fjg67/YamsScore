/**
 * Écran d'affichage d'une étape du tutoriel
 * Composant générique qui s'adapte à chaque étape
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { completeStep, startStep, unlockBadge } from '../../store/slices/tutorialSlice';

import { Confetti } from './animations/Confetti';
import { FloatingParticles } from './animations/FloatingParticles';
import { HotSpot } from './components/HotSpot';
import { Tooltip } from './components/Tooltip';
import { TUTORIAL_COLORS, XP_REWARDS } from './data/constants';
import { getStepById, getNextStep, getPreviousStep } from './data/steps';
import { feedbackSuccess, feedbackProgression, feedbackAchievement } from './utils/feedback';
import { calculateStepXP } from './utils/xpCalculator';

// Import des étapes
import * as BeginnerSteps from './steps/BeginnerSteps';
import * as IntermediateSteps from './steps/IntermediateSteps';
import * as ExpertSteps from './steps/ExpertSteps';

const { width, height } = Dimensions.get('window');

export const TutorialStepScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TutorialStep'>>();
  const dispatch = useDispatch();
  const { progress, settings } = useSelector((state: RootState) => state.tutorial);

  const { stepId } = route.params;
  const step = getStepById(stepId);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [startTime] = useState(Date.now());
  const [attemptCount, setAttemptCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (step) {
      dispatch(startStep(step.id));
    }
  }, [step?.id]);

  if (!step) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Étape introuvable</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const levelColors = TUTORIAL_COLORS[step.level];
  const isCompleted = progress.completedSteps.includes(step.id);

  const handleStepComplete = () => {
    const completionTime = Math.floor((Date.now() - startTime) / 1000);
    const perfectRun = !hasError && attemptCount === 0;

    // Calculer l'XP
    const xpGained = calculateStepXP(step.xpReward, {
      firstTry: attemptCount === 0,
      perfect: perfectRun,
      speedrun: completionTime < step.estimatedDuration * 0.7,
    });

    // Compléter l'étape
    dispatch(
      completeStep({
        stepId: step.id,
        xpGained,
        perfect: perfectRun,
        time: completionTime,
      })
    );

    // Feedback
    feedbackSuccess(settings.hapticEnabled, settings.soundVolume);
    setShowConfetti(true);

    // Vérifier les badges à débloquer
    checkBadges();

    // Navigation automatique après 3s
    setTimeout(() => {
      handleNext();
    }, 3000);
  };

  const checkBadges = () => {
    // Logique de déblocage de badges selon l'étape
    if (step.id === 'beginner_01_welcome') {
      dispatch(unlockBadge('first_step'));
    }
    // TODO: Ajouter d'autres conditions de badges
  };

  const handleNext = () => {
    const nextStep = getNextStep(step.id);
    if (nextStep) {
      feedbackProgression(settings.hapticEnabled, settings.soundVolume);
      navigation.navigate('TutorialStep', { stepId: nextStep.id });
    } else {
      // Fin du tutoriel
      navigation.navigate('Tutorial');
    }
  };

  const handlePrevious = () => {
    const prevStep = getPreviousStep(step.id);
    if (prevStep) {
      feedbackProgression(settings.hapticEnabled, settings.soundVolume);
      navigation.navigate('TutorialStep', { stepId: prevStep.id });
    } else {
      navigation.goBack();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleShowHint = () => {
    setShowTooltip(true);
    setTooltipMessage('💡 Astuce : ' + getHintForStep(step.id));
  };

  const getHintForStep = (stepId: string): string => {
    // Hints personnalisés par étape
    const hints: Record<string, string> = {
      beginner_01_welcome: 'Tape sur le dé animé pour commencer !',
      beginner_02_create_game: 'Cherche le bouton "Nouvelle Partie" en haut',
      beginner_03_add_players: 'Tu peux ajouter jusqu\'à 4 joueurs',
      // TODO: Ajouter tous les hints
    };
    return hints[stepId] || 'Continue pour découvrir la suite !';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Confetti de célébration */}
      {showConfetti && (
        <Confetti
          count={80}
          colors={[levelColors.primary, '#FFD700', '#FF6B6B']}
          onComplete={() => setShowConfetti(false)}
        />
      )}

      {/* Particules d'ambiance */}
      <FloatingParticles count={15} color={levelColors.glow} />

      {/* Header avec progression */}
      <Animated.View entering={FadeIn.duration(400)}>
        <LinearGradient
          colors={[levelColors.gradient[0], levelColors.gradient[1]]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.progressInfo}>
              <Text style={styles.stepNumber}>
                Étape {step.order}/{25}
              </Text>
              <Text style={styles.levelBadge}>
                {step.level === 'beginner' && '🟢 Débutant'}
                {step.level === 'intermediate' && '🟡 Intermédiaire'}
                {step.level === 'expert' && '🔴 Expert'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleShowHint} style={styles.hintButton}>
              <Text style={styles.hintButtonText}>💡</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepSubtitle}>{step.subtitle}</Text>

          {/* Barre de progression mini */}
          <View style={styles.miniProgress}>
            <View
              style={[
                styles.miniProgressFill,
                { width: `${(step.order / 25) * 100}%` },
              ]}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Contenu de l'étape */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={SlideInRight.duration(600)}>
          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{step.description}</Text>
          </View>

          {/* Zone d'interaction spécifique à l'étape */}
          <View style={styles.interactionZone}>
            {renderStepContent(step.id, handleStepComplete)}
          </View>

          {/* Info temps estimé */}
          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>
              ⏱️ Temps estimé : {Math.floor(step.estimatedDuration / 60)} min{' '}
              {step.estimatedDuration % 60} s
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Boutons navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, styles.secondaryButton]}
          onPress={handlePrevious}
          disabled={!getPreviousStep(step.id)}
        >
          <Text style={styles.secondaryButtonText}>← Précédent</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navButton, styles.skipButton]} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Passer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.primaryButton]}
          onPress={handleStepComplete}
        >
          <LinearGradient
            colors={[levelColors.gradient[0], levelColors.gradient[1]]}
            style={styles.primaryButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.primaryButtonText}>
              {isCompleted ? 'Revoir' : 'Terminé'} →
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Tooltip */}
      <Tooltip
        message={tooltipMessage}
        type="tip"
        visible={showTooltip}
        onDismiss={() => setShowTooltip(false)}
        position="center"
      />
    </SafeAreaView>
  );
};

/**
 * Rendu du contenu spécifique à chaque étape
 */
const renderStepContent = (stepId: string, onComplete: () => void): React.ReactElement => {
  switch (stepId) {
    // Niveau Débutant (10 étapes)
    case 'beginner_01_welcome':
      return <BeginnerSteps.Step01Welcome onComplete={onComplete} />;
    case 'beginner_02_create_game':
      return <BeginnerSteps.Step02CreateGame onComplete={onComplete} />;
    case 'beginner_03_add_players':
      return <BeginnerSteps.Step03AddPlayers onComplete={onComplete} />;
    case 'beginner_04_scoresheet':
      return <BeginnerSteps.Step04Scoresheet onComplete={onComplete} />;
    case 'beginner_05_first_score':
      return <BeginnerSteps.Step05FirstScore onComplete={onComplete} />;
    case 'beginner_06_bonus':
      return <BeginnerSteps.Step06Bonus onComplete={onComplete} />;
    case 'beginner_07_brelan_carre':
      return <BeginnerSteps.Step07BrelanCarre onComplete={onComplete} />;
    case 'beginner_08_full_house':
      return <BeginnerSteps.Step08FullHouse onComplete={onComplete} />;
    case 'beginner_09_suites':
      return <BeginnerSteps.Step09Suites onComplete={onComplete} />;
    case 'beginner_10_yams':
      return <BeginnerSteps.Step10Yams onComplete={onComplete} />;

    // Niveau Intermédiaire (8 étapes)
    case 'intermediate_11_stats':
      return <IntermediateSteps.Step11Stats onComplete={onComplete} />;
    case 'intermediate_12_shortcuts':
      return <IntermediateSteps.Step12Shortcuts onComplete={onComplete} />;
    case 'intermediate_13_multiplayer':
      return <IntermediateSteps.Step13Multiplayer onComplete={onComplete} />;
    case 'intermediate_14_customization':
      return <IntermediateSteps.Step14Customization onComplete={onComplete} />;
    case 'intermediate_15_sharing':
      return <IntermediateSteps.Step15Sharing onComplete={onComplete} />;
    case 'intermediate_16_history':
      return <IntermediateSteps.Step16History onComplete={onComplete} />;
    case 'intermediate_17_mental_math':
      return <IntermediateSteps.Step17MentalMath onComplete={onComplete} />;
    case 'intermediate_18_past_analysis':
      return <IntermediateSteps.Step18Analysis onComplete={onComplete} />;

    // Niveau Expert (7 étapes)
    case 'expert_19_optimization':
      return <ExpertSteps.Step19Optimization onComplete={onComplete} />;
    case 'expert_20_speedrun':
      return <ExpertSteps.Step20Speedrun onComplete={onComplete} />;
    case 'expert_21_combos':
      return <ExpertSteps.Step21Combos onComplete={onComplete} />;
    case 'expert_22_competitive':
      return <ExpertSteps.Step22Competitive onComplete={onComplete} />;
    case 'expert_23_predictions':
      return <ExpertSteps.Step23Predictions onComplete={onComplete} />;
    case 'expert_24_tournament':
      return <ExpertSteps.Step24Tournament onComplete={onComplete} />;
    case 'expert_25_masterclass':
      return <ExpertSteps.Step25MasterClass onComplete={onComplete} />;

    default:
      return <DefaultStepContent onComplete={onComplete} />;
  }
};

// Fallback pour étapes non définies
const DefaultStepContent: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <View style={styles.stepContentContainer}>
      <Text style={styles.comingSoonText}>🚧 Contenu en construction</Text>
      <Text style={styles.comingSoonSubtext}>
        Cette étape sera bientôt interactive !
      </Text>
      <TouchableOpacity style={styles.bigActionButton} onPress={onComplete}>
        <Text style={styles.bigActionButtonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  progressInfo: {
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  levelBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  hintButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintButtonText: {
    fontSize: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  stepSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 15,
  },
  miniProgress: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  interactionZone: {
    minHeight: 300,
  },
  timeInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  navButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#E8E8E8',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    fontSize: 16,
    color: '#4ECDC4',
    textAlign: 'center',
    marginTop: 20,
  },
  // Step content styles
  stepContentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  diceAvatar: {
    fontSize: 100,
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  speechText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  bigActionButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  bigActionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  demoContainer: {
    width: '100%',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  mockScreen: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 300,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  mockHeader: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    alignItems: 'center',
  },
  mockTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  comingSoonText: {
    fontSize: 48,
    marginBottom: 10,
  },
  comingSoonSubtext: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
    textAlign: 'center',
  },
});
