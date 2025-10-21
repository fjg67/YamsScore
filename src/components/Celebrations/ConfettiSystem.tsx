/**
 * Système de confettis animés avec react-native-reanimated
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import type { ConfettiParticle as ConfettiParticleType } from '../../types/celebration.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiSystemProps {
  active: boolean;
  count?: number;
  colors?: string[];
  duration?: number;
  onComplete?: () => void;
}

const ConfettiSystem: React.FC<ConfettiSystemProps> = ({
  active,
  count = 100,
  colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4A90E2', '#50C878'],
  duration = 3000,
  onComplete,
}) => {
  const [particles, setParticles] = useState<ConfettiParticleType[]>([]);

  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles: ConfettiParticleType[] = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: `confetti-${i}`,
          x: Math.random() * SCREEN_WIDTH,
          y: -50 - Math.random() * 100, // Start above screen
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 8 + Math.random() * 8, // 8-16px
          velocity: {
            x: (Math.random() - 0.5) * 4, // -2 to 2
            y: 2 + Math.random() * 3,      // 2 to 5 (downward)
          },
        });
      }
      setParticles(newParticles);

      // Auto-cleanup after duration
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active, count, duration]);

  if (!active || particles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          particle={particle}
          duration={duration}
        />
      ))}
    </View>
  );
};

// Individual confetti particle component
interface ConfettiParticleProps {
  particle: ConfettiParticleType;
  duration: number;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({ particle, duration }) => {
  const translateY = useSharedValue(particle.y);
  const translateX = useSharedValue(particle.x);
  const rotation = useSharedValue(particle.rotation);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Falling animation
    translateY.value = withTiming(
      SCREEN_HEIGHT + 100,
      {
        duration: duration * (0.8 + Math.random() * 0.4), // Variation in speed
        easing: Easing.out(Easing.quad),
      }
    );

    // Horizontal drift
    translateX.value = withTiming(
      particle.x + particle.velocity.x * 200,
      {
        duration: duration,
        easing: Easing.inOut(Easing.ease),
      }
    );

    // Rotation animation
    rotation.value = withRepeat(
      withTiming(
        particle.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
        {
          duration: 1000 + Math.random() * 1000,
          easing: Easing.linear,
        }
      ),
      -1, // Infinite
      false
    );

    // Fade out at the end
    opacity.value = withSequence(
      withTiming(1, { duration: duration * 0.7 }),
      withTiming(0, { duration: duration * 0.3 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: particle.color,
          width: particle.size,
          height: particle.size,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  particle: {
    position: 'absolute',
    borderRadius: 4,
  },
});

export default ConfettiSystem;
