/**
 * Illustration animée de dés
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface DiceIllustrationProps {
  animated?: boolean;
}

interface DiceProps {
  value: string;
  rotation: Animated.Value;
  scale: Animated.Value;
  color: string;
  delay: number;
}

const Dice: React.FC<DiceProps> = ({ value, rotation, scale, color }) => {
  return (
    <Animated.View
      style={[
        styles.dice,
        {
          backgroundColor: color,
          transform: [
            { rotate: rotation.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            })},
            { scale },
          ],
        },
      ]}
    >
      <Animated.Text style={styles.diceText}>{value}</Animated.Text>
    </Animated.View>
  );
};

export const DiceIllustration: React.FC<DiceIllustrationProps> = ({ animated = true }) => {
  const rotation1 = useRef(new Animated.Value(0)).current;
  const rotation2 = useRef(new Animated.Value(0)).current;
  const rotation3 = useRef(new Animated.Value(0)).current;

  const scale1 = useRef(new Animated.Value(0.9)).current;
  const scale2 = useRef(new Animated.Value(0.9)).current;
  const scale3 = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (animated) {
      // Animation de rotation continue
      const createRotationAnimation = (rotationValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(rotationValue, {
              toValue: 360,
              duration: 3000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.delay(1000),
          ])
        );
      };

      // Animation de scale (pulsation légère)
      const createScaleAnimation = (scaleValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(scaleValue, {
              toValue: 1.1,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
              toValue: 0.9,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Démarrer toutes les animations avec des délais différents
      Animated.parallel([
        createRotationAnimation(rotation1, 0),
        createRotationAnimation(rotation2, 300),
        createRotationAnimation(rotation3, 600),
        createScaleAnimation(scale1, 0),
        createScaleAnimation(scale2, 200),
        createScaleAnimation(scale3, 400),
      ]).start();
    }
  }, [animated, rotation1, rotation2, rotation3, scale1, scale2, scale3]);

  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        <Dice
          value="⚄"
          rotation={rotation1}
          scale={scale1}
          color="#4A90E2"
          delay={0}
        />
        <Dice
          value="⚂"
          rotation={rotation2}
          scale={scale2}
          color="#5DADE2"
          delay={300}
        />
        <Dice
          value="⚅"
          rotation={rotation3}
          scale={scale3}
          color="#AED6F1"
          delay={600}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  dice: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  diceText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
});
