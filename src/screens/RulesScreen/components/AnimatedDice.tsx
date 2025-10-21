/**
 * Composant de dé animé pour les exemples visuels
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { DiceSizes } from '../styles/rulesTheme';

interface AnimatedDiceProps {
  value: number;
  size?: number;
  highlighted?: boolean;
  delay?: number;
  shouldRoll?: boolean;
}

const getDiceDots = (value: number): number[][] => {
  const patterns: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  };
  return patterns[value] || [];
};

export const AnimatedDice: React.FC<AnimatedDiceProps> = ({
  value,
  size = DiceSizes.medium,
  highlighted = false,
  delay = 0,
  shouldRoll = false,
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (shouldRoll) {
      // Animation de roulement
      scale.value = withSequence(
        withDelay(delay, withSpring(0.8)),
        withSpring(1.2),
        withSpring(1)
      );

      rotate.value = withSequence(
        withDelay(delay, withTiming(360, { duration: 600 })),
        withTiming(0, { duration: 0 })
      );
    }
  }, [shouldRoll, delay]);

  useEffect(() => {
    if (highlighted) {
      // Animation de mise en surbrillance
      scale.value = withSequence(
        withSpring(1.15),
        withSpring(1.1)
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [highlighted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const dots = getDiceDots(value);
  const dotSize = size * 0.15;
  const spacing = size / 3;

  return (
    <Animated.View
      style={[
        styles.dice,
        {
          width: size,
          height: size,
          borderRadius: size * 0.2,
          backgroundColor: highlighted ? '#4A90E2' : '#FFFFFF',
          borderWidth: 2,
          borderColor: highlighted ? '#4A90E2' : '#E1E8ED',
        },
        animatedStyle,
      ]}
    >
      <View style={styles.dotsContainer}>
        {dots.map((position, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: highlighted ? '#FFFFFF' : '#2C3E50',
                position: 'absolute',
                left: position[1] * spacing + spacing / 2 - dotSize / 2,
                top: position[0] * spacing + spacing / 2 - dotSize / 2,
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

interface DiceRowProps {
  dice: number[];
  highlightedIndices?: number[];
  size?: number;
  shouldRoll?: boolean;
  gap?: number;
}

export const DiceRow: React.FC<DiceRowProps> = ({
  dice,
  highlightedIndices = [],
  size = DiceSizes.medium,
  shouldRoll = false,
  gap = 8,
}) => {
  return (
    <View style={[styles.diceRow, { gap }]}>
      {dice.map((value, index) => (
        <AnimatedDice
          key={index}
          value={value}
          size={size}
          highlighted={highlightedIndices.includes(index)}
          delay={index * 100}
          shouldRoll={shouldRoll}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dice: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dotsContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  dot: {
    // Positioned absolutely by parent
  },
  diceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
