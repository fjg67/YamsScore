/**
 * Barre de progression XP animée
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  useAnimatedProps,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect } from 'react-native-svg';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface XPBarProps {
  currentXP: number;
  levelXP: number; // XP du niveau actuel
  nextLevelXP: number; // XP nécessaire pour next level
  level: number;
  levelName: string;
  color?: string[];
  height?: number;
  showLabels?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  levelXP,
  nextLevelXP,
  level,
  levelName,
  color = ['#4ECDC4', '#44A08D'],
  height = 40,
  showLabels = true,
}) => {
  const progress = useSharedValue(0);
  const shimmerX = useSharedValue(-200);

  // Calculer le pourcentage de progression dans le niveau actuel
  const xpInCurrentLevel = currentXP - levelXP;
  const xpNeededForLevel = nextLevelXP - levelXP;
  const progressPercentage =
    xpNeededForLevel > 0 ? (xpInCurrentLevel / xpNeededForLevel) * 100 : 100;

  useEffect(() => {
    // Animation de la barre
    progress.value = withSpring(progressPercentage, {
      damping: 15,
      stiffness: 80,
    });

    // Shimmer effect (left to right)
    shimmerX.value = withTiming(400, {
      duration: 2000,
      easing: Easing.linear,
    });
  }, [progressPercentage]);

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const xpRemaining = nextLevelXP - currentXP;

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.header}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Niveau {level}</Text>
            <Text style={styles.levelName}>{levelName}</Text>
          </View>
          <Text style={styles.xpText}>
            {xpInCurrentLevel.toLocaleString()} / {xpNeededForLevel.toLocaleString()} XP
          </Text>
        </View>
      )}

      <View style={[styles.barContainer, { height }]}>
        {/* Background */}
        <View style={styles.barBackground} />

        {/* Progress bar */}
        <Animated.View style={[styles.barProgress, barAnimatedStyle]}>
          <LinearGradient
            colors={[color[0], color[1]]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />

          {/* Shimmer effect */}
          <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </Animated.View>

        {/* Percentage text */}
        {showLabels && (
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>{Math.round(progressPercentage)}%</Text>
          </View>
        )}
      </View>

      {showLabels && xpRemaining > 0 && (
        <Text style={styles.remainingText}>
          Encore <Text style={styles.remainingValue}>{xpRemaining} XP</Text> pour le
          prochain niveau
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  levelName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginTop: 2,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  barContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  barBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8E8E8',
  },
  barProgress: {
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: 200,
  },
  percentageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  remainingText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  remainingValue: {
    fontWeight: '700',
    color: '#4ECDC4',
  },
});
