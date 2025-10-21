/**
 * Particules flottantes animées pour l'ambiance
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 20,
  color = 'rgba(255, 215, 0, 0.3)',
  minSize = 2,
  maxSize = 6,
}) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: 3000 + Math.random() * 4000,
      delay: Math.random() * 2000,
      opacity: 0.2 + Math.random() * 0.4,
    }));
  }, [count, minSize, maxSize]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map(particle => (
        <ParticleComponent key={particle.id} {...particle} color={color} />
      ))}
    </View>
  );
};

const ParticleComponent: React.FC<Particle & { color: string }> = ({
  x,
  y,
  size,
  duration,
  delay,
  opacity: baseOpacity,
  color,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(baseOpacity);

  useEffect(() => {
    // Mouvement vertical (monte et descend)
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-20, {
          duration: duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    // Mouvement horizontal (gauche et droite)
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(10, {
          duration: duration * 0.7,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    // Pulsation de la taille
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.3, {
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    // Pulsation de l'opacité
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(baseOpacity * 0.5, {
          duration: duration * 0.6,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          width: size,
          height: size,
          left: `${x}%`,
          top: `${y}%`,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
  },
});
