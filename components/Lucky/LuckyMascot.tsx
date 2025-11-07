/**
 * LuckyMascot - Composant React Native principal
 * Intègre le renderer 2D avec animations et interactions
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Animated as RNAnimated,
  TouchableOpacity,
  PanResponder,
  Easing,
} from 'react-native';
import { LuckyProps, LuckyExpression, LuckyAnimation } from './LuckyTypes';
import { LuckyExpressions } from './LuckyExpressions';
import { LuckyAnimations } from './LuckyAnimations';
import { LuckyRenderer } from './LuckyRenderer';

export const LuckyMascot: React.FC<LuckyProps> = ({
  initialExpression = 'neutral',
  initialAnimation = 'idle',
  size = 120,
  position = { x: 0, y: 0, placement: 'center' },
  context,
  interactions,
  onExpressionChange,
  onAnimationComplete,
}) => {
  const [currentExpression, setCurrentExpression] = useState<LuckyExpression>(initialExpression || 'neutral');
  const [currentAnimation, setCurrentAnimation] = useState<LuckyAnimation>(initialAnimation || 'idle');
  const [isAnimating, setIsAnimating] = useState(false);

  // Animations React Native pour positionnement et transformations
  const translateX = useRef(new RNAnimated.Value(position.x)).current;
  const translateY = useRef(new RNAnimated.Value(position.y)).current;
  const scale = useRef(new RNAnimated.Value(1)).current;
  const opacity = useRef(new RNAnimated.Value(0)).current; // Start invisible
  const rotateY = useRef(new RNAnimated.Value(0)).current;
  const rotateZ = useRef(new RNAnimated.Value(0)).current;

  // États d'animation
  const animationStateRef = useRef({
    currentTime: 0,
    sequence: null as any,
    startTime: 0,
  });

  // ========== JOUER UNE ANIMATION ==========
  const playAnimation = useCallback((animation: LuckyAnimation) => {
    const sequence = LuckyAnimations.getAnimation(animation);

    animationStateRef.current = {
      currentTime: 0,
      sequence,
      startTime: Date.now(),
    };

    setCurrentAnimation(animation);
    setIsAnimating(true);

    // Créer les animations React Native selon les keyframes
    const animations: RNAnimated.CompositeAnimation[] = [];

    // Animation de position
    if (sequence.keyframes.some(kf => kf.position)) {
      const positionValues = sequence.keyframes.map(kf => ({
        time: kf.time,
        y: kf.position?.y || 0,
      }));

      animations.push(
        RNAnimated.timing(translateY, {
          toValue: positionValues[positionValues.length - 1].y * size,
          duration: sequence.duration,
          easing: getEasingFunction(sequence.easing),
          useNativeDriver: true,
        })
      );
    }

    // Animation de scale
    if (sequence.keyframes.some(kf => kf.scale !== undefined)) {
      const scaleValues = sequence.keyframes.map(kf => kf.scale || 1);

      animations.push(
        RNAnimated.timing(scale, {
          toValue: scaleValues[scaleValues.length - 1],
          duration: sequence.duration,
          easing: getEasingFunction(sequence.easing),
          useNativeDriver: true,
        })
      );
    }

    // Animation de rotation
    if (sequence.keyframes.some(kf => kf.rotation)) {
      const rotationValues = sequence.keyframes.map(kf => kf.rotation?.y || 0);

      animations.push(
        RNAnimated.timing(rotateY, {
          toValue: rotationValues[rotationValues.length - 1],
          duration: sequence.duration,
          easing: getEasingFunction(sequence.easing),
          useNativeDriver: true,
        })
      );
    }

    // Animation d'opacité
    if (sequence.keyframes.some(kf => kf.opacity !== undefined)) {
      const opacityValues = sequence.keyframes.map(kf => kf.opacity ?? 1);

      animations.push(
        RNAnimated.timing(opacity, {
          toValue: opacityValues[opacityValues.length - 1],
          duration: sequence.duration,
          easing: getEasingFunction(sequence.easing),
          useNativeDriver: true,
        })
      );
    }

    // Lancer toutes les animations en parallèle
    const compositeAnimation = RNAnimated.parallel(animations);

    if (sequence.loop) {
      RNAnimated.loop(compositeAnimation).start();
    } else {
      compositeAnimation.start(() => {
        setIsAnimating(false);
        onAnimationComplete?.(currentAnimation);

        // Revenir à l'idle après 500ms
        setTimeout(() => {
          if (!sequence.loop) {
            playAnimation('idle');
          }
        }, 500);
      });
    }
  }, [size, translateY, scale, rotateY, opacity, currentAnimation, onAnimationComplete]);

  // Helper pour convertir les easing functions
  const getEasingFunction = (easingName: string): ((value: number) => number) => {
    switch (easingName) {
      case 'easeIn':
        return Easing.quad; // Quadratic easing
      case 'easeOut':
        return Easing.quad;
      case 'easeInOut':
        return Easing.quad;
      case 'easeOutElastic':
        // Elastic custom function
        return (t: number) => {
          const p = 0.3;
          return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
        };
      case 'easeOutBounce':
        return Easing.bounce;
      case 'linear':
      default:
        return Easing.linear;
    }
  };

  // ========== CHANGER L'EXPRESSION ==========
  const changeExpression = useCallback((expression: LuckyExpression) => {
    setCurrentExpression(expression);
    onExpressionChange?.(expression);
  }, [onExpressionChange]);

  // ========== ANIMATION D'ENTRÉE ==========
  useEffect(() => {
    // Jouer l'animation d'entrée
    playAnimation(initialAnimation || 'enter_pop');

    // Fade in
    RNAnimated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== RÉACTIONS AU CONTEXTE ==========
  useEffect(() => {
    if (!context || !context.gameState) return;

    const { lastAction, scoreValue } = context.gameState;

    if (lastAction === 'score' && scoreValue !== undefined) {
      // Réagir au score
      const expression = LuckyExpressions.getExpressionForScore(scoreValue);
      const animation = LuckyAnimations.getAnimationForScore(scoreValue);

      changeExpression(expression);
      playAnimation(animation);
    }

    if (lastAction === 'yams') {
      changeExpression('epic_victory');
      playAnimation('celebrate_epic');
    }
  }, [context?.gameState, changeExpression, playAnimation]);

  // ========== VARIATIONS IDLE ==========
  useEffect(() => {
    if (currentAnimation !== 'idle' || isAnimating) return;

    // Changer de variation idle aléatoirement
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const variation = LuckyAnimations.getRandomIdleVariation();
        playAnimation(variation);
      }
    }, 15000); // Toutes les 15s

    return () => clearInterval(interval);
  }, [currentAnimation, isAnimating, playAnimation]);

  // ========== INTERACTIONS ==========
  const handleTap = () => {
    playAnimation('bounce_quick');
    interactions?.onTap?.();
  };

  const handleLongPress = () => {
    playAnimation('puff_chest');
    interactions?.onLongPress?.();
  };

  const handleDoubleTap = useRef<NodeJS.Timeout | null>(null);
  const handlePress = () => {
    if (handleDoubleTap.current) {
      // Double tap détecté
      clearTimeout(handleDoubleTap.current);
      handleDoubleTap.current = null;
      playAnimation('spin_jump');
      interactions?.onDoubleTap?.();
    } else {
      // Premier tap
      handleDoubleTap.current = setTimeout(() => {
        handleDoubleTap.current = null;
        handleTap();
      }, 300);
    }
  };

  // Pan Responder pour les swipes
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const threshold = 50;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
          if (dx > 0) {
            playAnimation('wave');
            interactions?.onSwipeRight?.();
          } else {
            playAnimation('wave');
            interactions?.onSwipeLeft?.();
          }
        } else if (Math.abs(dy) > threshold) {
          if (dy > 0) {
            // Swipe down
            interactions?.onSwipeDown?.();
          } else {
            playAnimation('jump');
            interactions?.onSwipeUp?.();
          }
        }
      },
    })
  ).current;

  // ========== RENDU ==========
  const containerStyle = {
    ...styles.container,
    width: size,
    height: size,
    transform: [
      { translateX },
      { translateY },
      { scale },
      { rotateY: rotateY.interpolate({
        inputRange: [0, Math.PI * 2],
        outputRange: ['0deg', '360deg'],
      }) },
      { rotateZ: rotateZ.interpolate({
        inputRange: [0, Math.PI * 2],
        outputRange: ['0deg', '360deg'],
      }) },
    ] as any,
    opacity,
  };

  return (
    <RNAnimated.View style={containerStyle}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onLongPress={handleLongPress}
        {...panResponder.panHandlers}
        style={styles.touchable}
      >
        <LuckyRenderer expression={currentExpression} size={size} />
      </TouchableOpacity>
    </RNAnimated.View>
  );
};

// Ref forwarding
export const LuckyMascotRef = React.forwardRef<
  {
    playAnimation: (animation: LuckyAnimation) => void;
    changeExpression: (expression: LuckyExpression) => void;
    celebrate: (scoreValue: number) => void;
  },
  LuckyProps
>((props, _ref) => {
  // TODO: Implémenter ref forwarding si nécessaire
  return <LuckyMascot {...props} />;
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LuckyMascot;
