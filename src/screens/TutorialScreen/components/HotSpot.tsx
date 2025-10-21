/**
 * HotSpot intelligent pour guider l'utilisateur
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface HotSpotProps {
  x: number; // Position en % de l'écran
  y: number;
  label: string;
  size?: number;
  onPress?: () => void;
  pulseSpeed?: number; // en ms
  autoFocusDelay?: number; // Délai avant shake si inactif (ms)
  color?: string;
  glowColor?: string;
}

export const HotSpot: React.FC<HotSpotProps> = ({
  x,
  y,
  label,
  size = 80,
  onPress,
  pulseSpeed = 1000,
  autoFocusDelay = 5000,
  color = '#4ECDC4',
  glowColor = 'rgba(78, 205, 196, 0.4)',
}) => {
  const scale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.6);
  const shakeX = useSharedValue(0);
  const arrowY = useSharedValue(0);

  useEffect(() => {
    // Animation du ring pulsant
    ringScale.value = withRepeat(
      withTiming(1.3, {
        duration: pulseSpeed,
        easing: Easing.ease,
      }),
      -1,
      false
    );

    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: pulseSpeed / 2 }),
        withTiming(0.6, { duration: pulseSpeed / 2 })
      ),
      -1,
      true
    );

    // Animation de la flèche (bounce)
    arrowY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500, easing: Easing.ease }),
        withTiming(0, { duration: 500, easing: Easing.ease })
      ),
      -1,
      true
    );

    // Auto-focus shake après délai d'inactivité
    if (autoFocusDelay > 0) {
      const timer = setTimeout(() => {
        shakeX.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 50 }),
            withTiming(5, { duration: 50 }),
            withTiming(-5, { duration: 50 }),
            withTiming(5, { duration: 50 }),
            withTiming(0, { duration: 50 })
          ),
          -1,
          false
        );
      }, autoFocusDelay);

      return () => clearTimeout(timer);
    }
  }, [pulseSpeed, autoFocusDelay]);

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const centerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arrowY.value }],
  }));

  const handlePress = () => {
    // Animation au tap
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    if (onPress) {
      onPress();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
        },
      ]}
    >
      {/* Ring pulsant */}
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: color,
            shadowColor: glowColor,
          },
          ringAnimatedStyle,
        ]}
      />

      {/* Centre cliquable */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.centerContainer}
      >
        <Animated.View style={centerAnimatedStyle}>
          <LinearGradient
            colors={[color, color + 'CC']}
            style={styles.center}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.tapText}>TAP</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>

      {/* Label et flèche */}
      <View style={styles.labelContainer}>
        <Animated.View style={arrowAnimatedStyle}>
          <Text style={styles.arrow}>↓</Text>
        </Animated.View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  ring: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  centerContainer: {
    width: '60%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tapText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelContainer: {
    position: 'absolute',
    top: '110%',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#333',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
