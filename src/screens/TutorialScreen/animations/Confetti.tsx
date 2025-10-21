/**
 * Composant Confetti avec animation premium
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface ConfettiPiece {
  id: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
  delay: number;
}

interface ConfettiProps {
  count?: number;
  colors?: string[];
  duration?: number;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({
  count = 50,
  colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFB347', '#9B59B6'],
  duration = 2500,
  onComplete,
}) => {
  const pieces = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 6,
      delay: Math.random() * 300,
    }));
  }, [count, colors]);

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map(piece => (
        <ConfettiPieceComponent key={piece.id} {...piece} duration={duration} />
      ))}
    </View>
  );
};

const ConfettiPieceComponent: React.FC<ConfettiPiece & { duration: number }> = ({
  color,
  x,
  y,
  rotation,
  size,
  delay,
  duration,
}) => {
  const translateY = useSharedValue(y);
  const translateX = useSharedValue(x);
  const rotate = useSharedValue(rotation);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animation de chute
    translateY.value = withDelay(
      delay,
      withTiming(110, {
        duration: duration - delay,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Mouvement horizontal (oscillation)
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(x + (Math.random() - 0.5) * 20, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    // Rotation continue
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(rotation + 360, {
          duration: 1500,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Fade out vers la fin
    opacity.value = withDelay(
      duration - 500,
      withTiming(0, {
        duration: 500,
        easing: Easing.ease,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
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
    zIndex: 1000,
  },
  piece: {
    position: 'absolute',
    borderRadius: 2,
  },
});
