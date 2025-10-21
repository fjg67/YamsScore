/**
 * Background avec gradient animé (Mesh Gradient)
 * Effet premium avec animation douce
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

interface AnimatedBackgroundProps {
  isDarkMode?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode = false }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation de rotation lente du gradient
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de pulsation subtile
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotation, scale]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Couleurs selon le thème
  const colors = isDarkMode
    ? ['rgba(74, 144, 226, 0.15)', 'rgba(30, 30, 30, 1)', 'rgba(10, 10, 10, 1)']
    : ['rgba(74, 144, 226, 0.08)', 'rgba(80, 200, 120, 0.05)', 'rgba(255, 255, 255, 1)'];

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={colors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Gradient animé superposé */}
      <Animated.View
        style={[
          styles.animatedGradient,
          {
            transform: [
              { rotate: rotateInterpolate },
              { scale: scale },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={
            isDarkMode
              ? ['rgba(74, 144, 226, 0.2)', 'transparent', 'rgba(80, 200, 120, 0.15)']
              : ['rgba(74, 144, 226, 0.12)', 'transparent', 'rgba(80, 200, 120, 0.08)']
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Pattern subtil */}
      <View style={styles.pattern} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternDot,
              {
                left: `${(i % 5) * 20 + 10}%`,
                top: `${Math.floor(i / 5) * 20 + 10}%`,
                opacity: isDarkMode ? 0.03 : 0.02,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  animatedGradient: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 1.5,
    left: -width * 0.25,
    top: -height * 0.25,
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4A90E2',
  },
});
