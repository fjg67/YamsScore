/**
 * Indicateur de progression pour le bonus (+35 pts)
 * Affiche une barre animée 0-63 points
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../theme/premiumTheme';

interface BonusProgressIndicatorProps {
  currentTotal: number; // 0-63+
  playerColor?: string;
  compact?: boolean;
}

const BonusProgressIndicator: React.FC<BonusProgressIndicatorProps> = ({
  currentTotal,
  playerColor = '#4A90E2',
  compact = false,
}) => {
  const progressWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const targetProgress = Math.min(currentTotal / 63, 1) * 100;
  const hasBonus = currentTotal >= 63;
  const remaining = Math.max(63 - currentTotal, 0);

  useEffect(() => {
    // Animate progress bar
    progressWidth.value = withSpring(targetProgress, {
      damping: 15,
      stiffness: 100,
    });

    // Glow when close to bonus or achieved
    if (currentTotal >= 55) {
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.3, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );
    } else {
      glowOpacity.value = 0;
    }
  }, [currentTotal]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const getStatusColor = (): string[] => {
    if (hasBonus) return ['#50C878', '#3FA065']; // Green - Unlocked
    if (currentTotal >= 55) return ['#FFD700', '#FFA500']; // Gold - Almost there
    if (currentTotal >= 35) return ['#4A90E2', '#5DADE2']; // Blue - Good progress
    return ['#94A3B8', '#64748B']; // Gray - Early stage
  };

  const getStatusText = (): string => {
    if (hasBonus) return '⭐ Bonus débloqué !';
    if (currentTotal >= 55) return `🔥 Plus que ${remaining} pts !`;
    if (currentTotal >= 35) return `Encore ${remaining} pts`;
    return `${remaining} pts restants`;
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactBar}>
          <Animated.View style={[styles.compactFill, animatedStyle]}>
            <LinearGradient
              colors={getStatusColor()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.compactText}>
          {currentTotal}/63 {hasBonus && '⭐'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>Progression Bonus</Text>
        <Text style={[styles.status, hasBonus && styles.statusSuccess]}>
          {getStatusText()}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {/* Background */}
        <View style={styles.progressBg} />

        {/* Fill */}
        <Animated.View style={[styles.progressFill, animatedStyle]}>
          <LinearGradient
            colors={getStatusColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Glow effect when close */}
          {currentTotal >= 55 && (
            <Animated.View style={[styles.glow, glowStyle]}>
              <LinearGradient
                colors={hasBonus ? ['#50C878', '#FFD700'] : ['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          )}
        </Animated.View>

        {/* Milestone markers */}
        <View style={[styles.marker, { left: '33.3%' }]} />
        <View style={[styles.marker, { left: '66.6%' }]} />

        {/* Target line at 63 */}
        <View style={styles.targetLine}>
          <View style={styles.targetDot} />
        </View>
      </View>

      {/* Score display */}
      <View style={styles.scoreRow}>
        <Text style={styles.currentScore}>{currentTotal}</Text>
        <Text style={styles.separator}>/</Text>
        <Text style={styles.targetScore}>63</Text>
        {hasBonus && <Text style={styles.bonusIcon}>⭐</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: premiumTheme.spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.xs,
  },
  label: {
    fontSize: premiumTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: premiumTheme.colors.ui.textPrimary,
  },
  status: {
    fontSize: premiumTheme.typography.fontSize.xs,
    color: premiumTheme.colors.ui.textSecondary,
  },
  statusSuccess: {
    color: '#50C878',
    fontWeight: 'bold',
  },
  progressBar: {
    position: 'relative',
    height: 16,
    marginBottom: premiumTheme.spacing.xs,
  },
  progressBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: premiumTheme.colors.ui.cardBorder,
    borderRadius: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 4,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  targetLine: {
    position: 'absolute',
    right: 0,
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: '#FFD700',
    borderRadius: 1,
  },
  targetDot: {
    position: 'absolute',
    top: -3,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currentScore: {
    fontSize: premiumTheme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: premiumTheme.colors.ui.textPrimary,
  },
  separator: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: premiumTheme.colors.ui.textSecondary,
    marginHorizontal: 4,
  },
  targetScore: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: premiumTheme.colors.ui.textSecondary,
    fontWeight: '600',
  },
  bonusIcon: {
    fontSize: premiumTheme.typography.fontSize.lg,
    marginLeft: premiumTheme.spacing.xs,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: premiumTheme.spacing.xs,
  },
  compactBar: {
    flex: 1,
    height: 6,
    backgroundColor: premiumTheme.colors.ui.cardBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  compactFill: {
    height: '100%',
    borderRadius: 3,
    minWidth: 2,
  },
  compactText: {
    fontSize: premiumTheme.typography.fontSize.xs,
    fontWeight: '600',
    color: premiumTheme.colors.ui.textSecondary,
    minWidth: 50,
  },
});

export default BonusProgressIndicator;
