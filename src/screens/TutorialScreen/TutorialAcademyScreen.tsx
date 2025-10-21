/**
 * Écran principal du tutoriel - Académie Yams Score
 * Landing page avec progression et sélection de mode
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { resetProgress } from '../../store/slices/tutorialSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';

import { FloatingParticles } from './animations/FloatingParticles';
import { XPBar } from './components/XPBar';
import { BadgeCard } from './components/BadgeCard';
import { TUTORIAL_COLORS } from './data/constants';
import { getStepsByLevel } from './data/steps';
import { TUTORIAL_BADGES, getUnlockedBadges } from './data/badges';
import { getLevelInfo } from './utils/xpCalculator';
import { feedbackSuccess, feedbackProgression } from './utils/feedback';

const { width, height } = Dimensions.get('window');

export const TutorialAcademyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const { progress, settings } = useSelector((state: RootState) => state.tutorial);

  const [selectedMode, setSelectedMode] = useState(progress.preferredMode);

  // Calculer la progression par niveau
  const beginnerSteps = getStepsByLevel('beginner');
  const intermediateSteps = getStepsByLevel('intermediate');
  const expertSteps = getStepsByLevel('expert');

  const beginnerCompleted = beginnerSteps.filter(s =>
    progress.completedSteps.includes(s.id)
  ).length;
  const intermediateCompleted = intermediateSteps.filter(s =>
    progress.completedSteps.includes(s.id)
  ).length;
  const expertCompleted = expertSteps.filter(s =>
    progress.completedSteps.includes(s.id)
  ).length;

  const beginnerProgress = (beginnerCompleted / beginnerSteps.length) * 100;
  const intermediateProgress =
    (intermediateCompleted / intermediateSteps.length) * 100;
  const expertProgress = (expertCompleted / expertSteps.length) * 100;

  // Infos de niveau
  const levelInfo = getLevelInfo(progress.totalXP);

  // Badges débloqués
  const unlockedBadges = getUnlockedBadges(progress.unlockedBadges);
  const recentBadges = unlockedBadges.slice(-6);

  const handleStartLevel = (level: 'beginner' | 'intermediate' | 'expert') => {
    feedbackSuccess(settings.hapticEnabled, settings.soundVolume);

    // Trouver la première étape du niveau
    const levelSteps = getStepsByLevel(level);
    const firstIncompleteStep = levelSteps.find(
      s => !progress.completedSteps.includes(s.id)
    );
    const stepToStart = firstIncompleteStep || levelSteps[0];

    if (stepToStart) {
      navigation.navigate('TutorialStep', { stepId: stepToStart.id });
    }
  };

  const handleContinue = () => {
    feedbackProgression(settings.hapticEnabled, settings.soundVolume);

    if (progress.currentStepId) {
      navigation.navigate('TutorialStep', { stepId: progress.currentStepId });
    } else {
      // Si pas d'étape en cours, démarrer la première
      handleStartLevel('beginner');
    }
  };

  const handleRestart = () => {
    Alert.alert(
      'Recommencer le tutoriel ?',
      'Toute ta progression sera réinitialisée. Tu pourras débloquer à nouveau tous les badges !',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Recommencer',
          style: 'destructive',
          onPress: () => {
            dispatch(resetProgress());
            feedbackSuccess(settings.hapticEnabled, settings.soundVolume);
            handleStartLevel('beginner');
          },
        },
      ]
    );
  };

  const handleFreeMode = () => {
    Alert.alert(
      'Mode Libre',
      'Explore toutes les étapes sans contrainte ni chronomètre. Parfait pour revoir une section spécifique !',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'C\'est parti !', onPress: () => handleStartLevel('beginner') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Particules flottantes en arrière-plan */}
      <FloatingParticles count={30} color="rgba(255, 215, 0, 0.15)" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.academyIcon}>🎓</Text>
            <Text style={styles.title}>ACADÉMIE YAMS SCORE</Text>
            <Text style={styles.subtitle}>Devenez un maître du score</Text>
          </LinearGradient>
        </Animated.View>

        {/* Animation dés (placeholder pour animation 3D future) */}
        <Animated.View entering={ZoomIn.delay(200).duration(800)} style={styles.diceAnimation}>
          <Text style={styles.diceEmoji}>🎲</Text>
        </Animated.View>

        {/* Progression XP */}
        <Animated.View entering={FadeIn.delay(400).duration(600)} style={styles.section}>
          <XPBar
            currentXP={progress.totalXP}
            levelXP={levelInfo.totalXP - levelInfo.remaining}
            nextLevelXP={levelInfo.nextLevelXP}
            level={levelInfo.level}
            levelName={levelInfo.name}
          />
        </Animated.View>

        {/* Niveaux */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Parcours d'Apprentissage</Text>

          {/* Niveau Débutant */}
          <TouchableOpacity
            onPress={() => handleStartLevel('beginner')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[...TUTORIAL_COLORS.beginner.gradient]}
              style={styles.levelCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.levelHeader}>
                <Text style={styles.levelIcon}>🟢</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelName}>Débutant</Text>
                  <Text style={styles.levelSteps}>
                    {beginnerCompleted}/{beginnerSteps.length} étapes
                  </Text>
                </View>
                <Text style={styles.levelProgress}>{Math.round(beginnerProgress)}%</Text>
              </View>
              <View style={styles.progressBarSmall}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${beginnerProgress}%` },
                  ]}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Niveau Intermédiaire */}
          <TouchableOpacity
            onPress={() => handleStartLevel('intermediate')}
            activeOpacity={0.9}
            disabled={beginnerProgress < 100}
          >
            <LinearGradient
              colors={
                beginnerProgress < 100
                  ? ['#D0D0D0', '#B0B0B0']
                  : [...TUTORIAL_COLORS.intermediate.gradient]
              }
              style={[styles.levelCard, beginnerProgress < 100 && styles.levelLocked]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.levelHeader}>
                <Text style={styles.levelIcon}>
                  {beginnerProgress < 100 ? '🔒' : '🟡'}
                </Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelName}>Intermédiaire</Text>
                  <Text style={styles.levelSteps}>
                    {intermediateCompleted}/{intermediateSteps.length} étapes
                  </Text>
                </View>
                <Text style={styles.levelProgress}>
                  {Math.round(intermediateProgress)}%
                </Text>
              </View>
              <View style={styles.progressBarSmall}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${intermediateProgress}%` },
                  ]}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Niveau Expert */}
          <TouchableOpacity
            onPress={() => handleStartLevel('expert')}
            activeOpacity={0.9}
            disabled={intermediateProgress < 100}
          >
            <LinearGradient
              colors={
                intermediateProgress < 100
                  ? ['#D0D0D0', '#B0B0B0']
                  : [...TUTORIAL_COLORS.expert.gradient]
              }
              style={[
                styles.levelCard,
                intermediateProgress < 100 && styles.levelLocked,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.levelHeader}>
                <Text style={styles.levelIcon}>
                  {intermediateProgress < 100 ? '🔒' : '🔴'}
                </Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelName}>Expert</Text>
                  <Text style={styles.levelSteps}>
                    {expertCompleted}/{expertSteps.length} étapes
                  </Text>
                </View>
                <Text style={styles.levelProgress}>{Math.round(expertProgress)}%</Text>
              </View>
              <View style={styles.progressBarSmall}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${expertProgress}%` },
                  ]}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Actions principales */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.section}
        >
          {progress.currentStepId && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#4ECDC4', '#44A08D']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.primaryButtonText}>
                  ▶️  Continuer où vous étiez
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRestart}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              🔄  Recommencer depuis le début
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleFreeMode}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>🎮  Mode libre - Explorer</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Badges récents */}
        {recentBadges.length > 0 && (
          <Animated.View
            entering={FadeIn.delay(1000).duration(600)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Badges Récents</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesContainer}
            >
              {recentBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} size="medium" />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Motivation */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(600)}
          style={styles.motivationCard}
        >
          <Text style={styles.motivationIcon}>🎁</Text>
          <Text style={styles.motivationText}>
            Débloquez 36 badges en complétant le tutoriel !
          </Text>
          <Text style={styles.motivationSubtext}>
            {progress.unlockedBadges.length}/36 débloqués
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  academyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  diceAnimation: {
    alignItems: 'center',
    marginVertical: 20,
  },
  diceEmoji: {
    fontSize: 80,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  levelCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  levelLocked: {
    opacity: 0.6,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  levelSteps: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  levelProgress: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  progressBarSmall: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  primaryButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  badgesContainer: {
    paddingRight: 20,
  },
  motivationCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  motivationIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  motivationSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 5,
  },
});
