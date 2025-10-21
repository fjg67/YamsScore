/**
 * Confetti Explosion - Explosion de confettis
 * Pour célébrer les actions importantes
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';

interface Confetti {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
}

interface ConfettiExplosionProps {
  count?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  duration?: number;
  spread?: number;
  onComplete?: () => void;
}

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  count = 30,
  origin = { x: Dimensions.get('window').width / 2, y: Dimensions.get('window').height / 2 },
  colors = ['#FF6B6B', '#4A90E2', '#50C878', '#FFD700', '#9B59B6', '#FF8C00'],
  duration = 2000,
  spread = 200,
  onComplete,
}) => {
  const confettiRef = useRef<Confetti[]>([]);

  useEffect(() => {
    // Créer les confettis
    confettiRef.current = Array.from({ length: count }, (_, i) => {
      return {
        id: i,
        x: new Animated.Value(origin.x),
        y: new Animated.Value(origin.y),
        rotation: new Animated.Value(0),
        opacity: new Animated.Value(1),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      };
    });

    // Animer tous les confettis
    const animations = confettiRef.current.map((confetti, index) => {
      const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.5;
      const velocity = Math.random() * spread + spread / 2;
      const targetX = origin.x + Math.cos(angle) * velocity;
      const targetY = origin.y + Math.sin(angle) * velocity + 100; // Gravité

      return Animated.parallel([
        Animated.timing(confetti.x, {
          toValue: targetX,
          duration: duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(confetti.y, {
          toValue: targetY,
          duration: duration,
          easing: Easing.in(Easing.quad), // Gravité
          useNativeDriver: true,
        }),
        Animated.timing(confetti.rotation, {
          toValue: Math.random() * 720 - 360, // Rotation aléatoire
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(confetti.opacity, {
          toValue: 0,
          duration: duration,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });

    return () => {
      confettiRef.current.forEach(confetti => {
        confetti.x.stopAnimation();
        confetti.y.stopAnimation();
        confetti.rotation.stopAnimation();
        confetti.opacity.stopAnimation();
      });
    };
  }, [count, origin, colors, duration, spread, onComplete]);

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiRef.current.map((confetti) => (
        <Animated.View
          key={confetti.id}
          style={[
            styles.confetti,
            {
              width: confetti.size,
              height: confetti.size * 1.5,
              backgroundColor: confetti.color,
              transform: [
                { translateX: confetti.x },
                { translateY: confetti.y },
                { rotate: confetti.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
              opacity: confetti.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});
