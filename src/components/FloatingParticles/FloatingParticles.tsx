/**
 * Floating Particles - Particules flottantes décoratives
 * Effet ambiant subtil
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  speed?: number;
  maxSize?: number;
  minSize?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 15,
  colors = ['#4A90E2', '#50C878', '#FFD700', '#FF6B6B', '#9B59B6'],
  speed = 3000,
  maxSize = 8,
  minSize = 3,
}) => {
  const particlesRef = useRef<Particle[]>([]);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Créer les particules
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * (maxSize - minSize) + minSize,
    }));

    // Animer chaque particule
    particlesRef.current.forEach((particle) => {
      const animateParticle = () => {
        const randomX = Math.random() * width;
        const randomY = Math.random() * height;
        const randomOpacity = Math.random() * 0.5 + 0.2;
        const randomScale = Math.random() * 0.5 + 0.5;
        const duration = speed + Math.random() * 2000;

        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: randomX,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: randomY,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: randomOpacity,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.3 + 0.1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: randomScale,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: Math.random() * 0.5 + 0.5,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          // Recommencer l'animation en boucle
          animateParticle();
        });
      };

      // Démarrer avec un délai aléatoire pour éviter la synchronisation
      setTimeout(() => {
        animateParticle();
      }, Math.random() * 1000);
    });

    return () => {
      // Nettoyer les animations
      particlesRef.current.forEach(particle => {
        particle.x.stopAnimation();
        particle.y.stopAnimation();
        particle.opacity.stopAnimation();
        particle.scale.stopAnimation();
      });
    };
  }, [count, width, height, colors, speed, maxSize, minSize]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particlesRef.current.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
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
  particle: {
    position: 'absolute',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
});
