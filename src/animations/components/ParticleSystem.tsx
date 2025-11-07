/**
 * Particle System Component
 * Système de particules pour confetti, sparkles, etc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { ParticleConfig, ConfettiConfig } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'confetti' | 'sparkle' | 'star' | 'circle' | 'dots';
  opacity: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
}

interface ParticleSystemProps {
  onAnimationComplete?: () => void;
}

// Ref globale pour accéder au système de particules
export const particleSystemRef = React.createRef<any>();

const ParticleSystem = React.forwardRef<any, ParticleSystemProps>(({ onAnimationComplete }, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticle = (
    x: number,
    y: number,
    config: Partial<ParticleConfig>
  ): Particle => {
    const angle = (Math.random() * (config.spread || 360) - (config.spread || 360) / 2) * (Math.PI / 180);
    const velocity = config.velocity || 20;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - Math.random() * 10;

    return {
      id: Math.random().toString(),
      x,
      y,
      vx,
      vy,
      color: config.colors![Math.floor(Math.random() * config.colors!.length)],
      size: config.size || 8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      type: config.type || 'circle',
      opacity: new Animated.Value(1),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    };
  };

  const emitParticles = (
    x: number,
    y: number,
    config: ParticleConfig | ConfettiConfig
  ) => {
    const newParticles: Particle[] = [];
    const particleConfig = config as ParticleConfig;

    for (let i = 0; i < config.count; i++) {
      newParticles.push(createParticle(x, y, particleConfig));
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Animer les particules
    newParticles.forEach((particle) => {
      const gravity = particleConfig.gravity || 0.5;
      const duration = config.duration || 2000;

      // Animation d'opacité
      Animated.timing(particle.opacity, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }).start();

      // Animation de position avec gravité
      Animated.timing(particle.translateX, {
        toValue: particle.vx * (duration / 1000) * 60,
        duration: duration,
        useNativeDriver: true,
      }).start();

      Animated.timing(particle.translateY, {
        toValue: particle.vy * (duration / 1000) * 60 + gravity * Math.pow(duration / 1000, 2) * 500,
        duration: duration,
        useNativeDriver: true,
      }).start();

      // Animation de rotation
      Animated.timing(particle.rotate, {
        toValue: particle.rotationSpeed * (duration / 1000) * 360,
        duration: duration,
        useNativeDriver: true,
      }).start();

      // Animation de scale (pour les étoiles)
      if (particle.type === 'star' || particle.type === 'sparkle') {
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1.5,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: (duration * 2) / 3,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

    // Nettoyer les particules après animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, config.duration || 2000);
  };

  const emitConfetti = (config: ConfettiConfig, originX: number = SCREEN_WIDTH / 2, originY: number = 100) => {
    emitParticles(originX, originY, {
      type: 'confetti',
      ...config,
    } as ParticleConfig);
  };

  // Exposer les méthodes via ref
  React.useImperativeHandle(ref || particleSystemRef, () => ({
    emit: (config: ParticleConfig, x: number, y: number) => {
      emitParticles(x, y, config);
    },
    emitConfetti: (config: ConfettiConfig, x?: number, y?: number) => {
      emitConfetti(config, x, y);
    },
  }));

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      left: particle.x,
      top: particle.y,
      opacity: particle.opacity,
      transform: [
        { translateX: particle.translateX },
        { translateY: particle.translateY },
        { scale: particle.scale },
        {
          rotate: particle.rotate.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    };

    // Render star emoji for star type
    if (particle.type === 'star') {
      return (
        <Animated.View key={particle.id} style={[styles.particle, baseStyle]}>
          <Text style={{ fontSize: particle.size * 2, color: particle.color }}>⭐</Text>
        </Animated.View>
      );
    }

    // Render sparkle emoji for sparkle type
    if (particle.type === 'sparkle') {
      return (
        <Animated.View key={particle.id} style={[styles.particle, baseStyle]}>
          <Text style={{ fontSize: particle.size * 2, color: particle.color }}>✨</Text>
        </Animated.View>
      );
    }

    // Render circle or confetti as colored boxes
    return (
      <Animated.View
        key={particle.id}
        style={[
          styles.particle,
          {
            ...baseStyle,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: particle.type === 'circle' ? particle.size / 2 : 2,
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => renderParticle(particle))}
    </View>
  );
});

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

ParticleSystem.displayName = 'ParticleSystem';

export default ParticleSystem;
