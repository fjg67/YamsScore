/**
 * GlowEffect Component
 * Effet de lueur/glow autour d'un élément
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { GlowConfig } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GlowEffectProps {
  config?: GlowConfig | null;
  x?: number;
  y?: number;
  onComplete?: () => void;
}

// Ref globale pour déclencher le glow depuis n'importe où
export const glowEffectRef = React.createRef<any>();

const GlowEffect = React.forwardRef<any, GlowEffectProps>(
  ({ config: externalConfig, x: externalX, y: externalY, onComplete }, ref) => {
    const [glowConfig, setGlowConfig] = React.useState<GlowConfig | null>(
      externalConfig || null
    );
    const [position, setPosition] = React.useState({
      x: externalX || SCREEN_WIDTH / 2,
      y: externalY || SCREEN_HEIGHT / 2,
    });

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;

    const triggerGlow = (config: GlowConfig, x?: number, y?: number) => {
      setGlowConfig(config);
      setPosition({
        x: x || SCREEN_WIDTH / 2,
        y: y || SCREEN_HEIGHT / 2,
      });
    };

    useEffect(() => {
      if (glowConfig) {
        playGlow(glowConfig);
      }
    }, [glowConfig]);

    const playGlow = (config: GlowConfig) => {
      const { intensity, duration, pulse } = config;

      // Reset animations
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.5);

      if (pulse) {
        // Pulse effect: grow and shrink repeatedly
        const pulseAnimation = Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(opacityAnim, {
                toValue: intensity,
                duration: duration / 4,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: duration / 4,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(opacityAnim, {
                toValue: intensity * 0.6,
                duration: duration / 4,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: duration / 4,
                useNativeDriver: true,
              }),
            ]),
          ])
        );

        pulseAnimation.start();

        // Stop after duration
        setTimeout(() => {
          pulseAnimation.stop();
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setGlowConfig(null);
            if (onComplete) onComplete();
          });
        }, duration);
      } else {
        // Simple fade in and out
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: intensity,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          setGlowConfig(null);
          if (onComplete) onComplete();
        });
      }
    };

    // Exposer la méthode via ref
    React.useImperativeHandle(ref || glowEffectRef, () => ({
      glow: (config: GlowConfig, x?: number, y?: number) => {
        triggerGlow(config, x, y);
      },
    }));

    if (!glowConfig) return null;

    return (
      <Animated.View
        style={[
          styles.glow,
          {
            left: position.x - glowConfig.radius,
            top: position.y - glowConfig.radius,
            width: glowConfig.radius * 2,
            height: glowConfig.radius * 2,
            borderRadius: glowConfig.radius,
            backgroundColor: glowConfig.color,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
            shadowColor: glowConfig.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: glowConfig.radius / 2,
          },
        ]}
        pointerEvents="none"
      />
    );
  }
);

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    zIndex: 9996,
  },
});

GlowEffect.displayName = 'GlowEffect';

export default GlowEffect;
