/**
 * Overlay de tutoriel interactif
 * Guide le joueur à travers les fonctionnalités de l'app
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../theme/premiumTheme';
import { TutorialStepConfig } from '../../types/tutorial.types';
import { useHaptic } from '../../hooks/useHaptic';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TutorialOverlayProps {
  visible: boolean;
  currentStep: TutorialStepConfig;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  visible,
  currentStep,
  stepNumber,
  totalSteps,
  onNext,
  onSkip,
}) => {
  const { light } = useHaptic();
  const scale = useSharedValue(0);
  const illustrationScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Card entrance animation
      scale.value = withSequence(
        withSpring(1.05, { damping: 10 }),
        withSpring(1, { damping: 12 })
      );

      // Illustration pop
      illustrationScale.value = withSequence(
        withTiming(0, { duration: 200 }),
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    } else {
      scale.value = 0;
      illustrationScale.value = 0;
    }
  }, [visible, currentStep.id]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const illustrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: illustrationScale.value }],
  }));

  const handleNext = () => {
    light();
    onNext();
  };

  const handleSkip = () => {
    light();
    onSkip();
  };

  const getPositionStyle = () => {
    switch (currentStep.position) {
      case 'top':
        return { justifyContent: 'flex-start' as const, paddingTop: 100 };
      case 'bottom':
        return { justifyContent: 'flex-end' as const, paddingBottom: 100 };
      case 'center':
      default:
        return { justifyContent: 'center' as const };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={[styles.overlay, getPositionStyle()]}>
        {/* Background blur */}
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.92)', 'rgba(0,0,0,0.85)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Tutorial Card */}
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={[styles.card, cardAnimatedStyle]}
        >
          <LinearGradient
            colors={[...premiumTheme.colors.gradients.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(stepNumber / totalSteps) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {stepNumber} / {totalSteps}
              </Text>
            </View>

            {/* Illustration */}
            {currentStep.illustration && (
              <Animated.Text
                style={[styles.illustration, illustrationAnimatedStyle]}
              >
                {currentStep.illustration}
              </Animated.Text>
            )}

            {/* Title */}
            <Text style={styles.title}>{currentStep.title}</Text>

            {/* Message */}
            <Text style={styles.message}>{currentStep.message}</Text>

            {/* Actions */}
            <View style={styles.actions}>
              {/* Skip button */}
              {currentStep.skipButton && (
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipButtonText}>Passer</Text>
                </TouchableOpacity>
              )}

              {/* Next/Action button */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  !currentStep.skipButton && styles.actionButtonFull,
                ]}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#50C878', '#3FA065']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonText}>
                    {currentStep.actionButton}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: premiumTheme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    borderRadius: premiumTheme.borderRadius.xl,
    overflow: 'hidden',
    ...premiumTheme.colors.shadows.heavy,
  },
  cardGradient: {
    padding: premiumTheme.spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: premiumTheme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: premiumTheme.typography.fontSize.sm,
    fontWeight: '600',
    opacity: 0.8,
  },
  illustration: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: premiumTheme.spacing.md,
  },
  title: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: premiumTheme.spacing.md,
  },
  message: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: premiumTheme.spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: premiumTheme.spacing.md,
  },
  skipButton: {
    flex: 1,
    paddingVertical: premiumTheme.spacing.md,
    paddingHorizontal: premiumTheme.spacing.lg,
    borderRadius: premiumTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: '600',
    opacity: 0.8,
  },
  actionButton: {
    flex: 1,
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  actionButtonFull: {
    flex: 1,
  },
  actionButtonGradient: {
    paddingVertical: premiumTheme.spacing.md,
    paddingHorizontal: premiumTheme.spacing.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
});

export default TutorialOverlay;
