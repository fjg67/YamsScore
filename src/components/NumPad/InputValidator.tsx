/**
 * Validateur d'input avec feedback visuel instantané et shake animation
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { ScoreCategory } from '../../types/game.types';
import { ValidationResult } from '../../types/numpad.types';
import { premiumTheme, getScoreColor, getCategoryMaxScore } from '../../theme/premiumTheme';
import { useHaptic } from '../../hooks/useHaptic';

interface InputValidatorProps {
  value: string;
  category: ScoreCategory;
  validation: ValidationResult;
  onValidationChange?: (isValid: boolean) => void;
}

const InputValidator: React.FC<InputValidatorProps> = ({
  value,
  category,
  validation,
  onValidationChange,
}) => {
  const { error: hapticError, warning } = useHaptic();
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const numValue = value ? parseInt(value, 10) : undefined;

  // Shake animation on error
  useEffect(() => {
    if (!validation.isValid && validation.error) {
      // Trigger haptic
      hapticError();

      // Shake animation
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [validation.isValid, validation.error]);

  // Scale animation on success
  useEffect(() => {
    if (validation.isValid && numValue !== undefined && numValue > 0) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1)
      );
    }
  }, [validation.isValid, numValue]);

  useEffect(() => {
    onValidationChange?.(validation.isValid);
  }, [validation.isValid]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  // Quality color for score
  const getQualityColor = (): string => {
    if (!validation.isValid || numValue === undefined || numValue === 0) {
      return premiumTheme.colors.ui.textSecondary;
    }

    const maxScore = getCategoryMaxScore(category);
    return getScoreColor(numValue, maxScore);
  };

  // Quality text
  const getQualityText = (): string | null => {
    if (!validation.quality || numValue === undefined || numValue === 0) {
      return null;
    }

    const qualityLabels: Record<string, string> = {
      excellent: '🌟 Excellent score !',
      good: '👍 Bon score',
      average: '👌 Score correct',
      poor: '😐 Score faible',
    };

    return qualityLabels[validation.quality] || null;
  };

  // Display value with color
  const displayValue = value || '-';
  const qualityColor = getQualityColor();
  const qualityText = getQualityText();

  return (
    <View style={styles.container}>
      {/* Display value */}
      <Animated.View style={[styles.display, shakeStyle]}>
        <Text
          style={[
            styles.displayText,
            {
              color: validation.isValid ? qualityColor : premiumTheme.colors.scoreColors.zero,
            },
          ]}
        >
          {displayValue}
        </Text>

        {/* Quality indicator */}
        {validation.isValid && numValue !== undefined && numValue > 0 && (
          <View style={styles.qualityBadge}>
            <View
              style={[
                styles.qualityDot,
                { backgroundColor: qualityColor },
              ]}
            />
          </View>
        )}
      </Animated.View>

      {/* Feedback messages */}
      <View style={styles.feedbackContainer}>
        {/* Error message */}
        {!validation.isValid && validation.error && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{validation.error}</Text>
          </Animated.View>
        )}

        {/* Warning message */}
        {validation.isValid && validation.warning && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.warningContainer}>
            <Text style={styles.warningIcon}>💡</Text>
            <Text style={styles.warningText}>{validation.warning}</Text>
          </Animated.View>
        )}

        {/* Quality message */}
        {validation.isValid && qualityText && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.qualityContainer}>
            <Text style={[styles.qualityText, { color: qualityColor }]}>
              {qualityText}
            </Text>
          </Animated.View>
        )}

        {/* Empty placeholder */}
        {validation.isValid && !validation.warning && !qualityText && (
          <View style={styles.emptyPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: premiumTheme.spacing.md,
  },

  display: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: premiumTheme.borderRadius.xl,
    borderWidth: 2,
    borderColor: 'rgba(74,144,226,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...premiumTheme.colors.shadows.soft,
  },

  displayText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: premiumTheme.typography.fontFamily.monospace,
  },

  qualityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  qualityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    ...premiumTheme.colors.shadows.soft,
  },

  feedbackContainer: {
    marginTop: premiumTheme.spacing.sm,
    minHeight: 40,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderRadius: premiumTheme.borderRadius.md,
    padding: premiumTheme.spacing.sm,
  },
  errorIcon: {
    fontSize: 18,
    marginRight: premiumTheme.spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: premiumTheme.typography.fontSize.md,
    color: premiumTheme.colors.scoreColors.zero,
    fontWeight: '600',
  },

  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243,156,18,0.1)',
    borderRadius: premiumTheme.borderRadius.md,
    padding: premiumTheme.spacing.sm,
  },
  warningIcon: {
    fontSize: 18,
    marginRight: premiumTheme.spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#F39C12',
  },

  qualityContainer: {
    alignItems: 'center',
    padding: premiumTheme.spacing.sm,
  },
  qualityText: {
    fontSize: premiumTheme.typography.fontSize.md,
    fontWeight: '600',
  },

  emptyPlaceholder: {
    height: 40,
  },
});

export default InputValidator;
