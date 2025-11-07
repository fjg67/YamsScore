/**
 * ScreenFlash Component
 * Effet de flash sur tout l'écran pour les moments épiques
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { FlashConfig } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ScreenFlashProps {
  config?: FlashConfig | null;
  onComplete?: () => void;
}

// Ref globale pour déclencher le flash depuis n'importe où
export const screenFlashRef = React.createRef<any>();

const ScreenFlash = React.forwardRef<any, ScreenFlashProps>(
  ({ config: externalConfig, onComplete }, ref) => {
    const [flashConfig, setFlashConfig] = React.useState<FlashConfig | null>(
      externalConfig || null
    );
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const triggerFlash = (config: FlashConfig) => {
      setFlashConfig(config);
    };

    useEffect(() => {
      if (flashConfig) {
        playFlash(flashConfig);
      }
    }, [flashConfig]);

    const playFlash = (config: FlashConfig) => {
      const { opacity, duration, repeat = 1 } = config;

      const flashSequence = () => {
        return Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: opacity,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]);
      };

      const animations = [];
      for (let i = 0; i < repeat; i++) {
        animations.push(flashSequence());
      }

      Animated.sequence(animations).start(() => {
        setFlashConfig(null);
        if (onComplete) {
          onComplete();
        }
      });
    };

    // Exposer la méthode via ref
    React.useImperativeHandle(ref || screenFlashRef, () => ({
      flash: (config: FlashConfig) => {
        triggerFlash(config);
      },
    }));

    if (!flashConfig) return null;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: flashConfig.color,
            opacity: opacityAnim,
          },
        ]}
        pointerEvents="none"
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 9998,
  },
});

ScreenFlash.displayName = 'ScreenFlash';

export default ScreenFlash;
