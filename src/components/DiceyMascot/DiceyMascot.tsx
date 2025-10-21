/**
 * Mascotte Dicey - Le dé vivant
 * Animation SVG avec personnalité + Haptics
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Easing } from 'react-native';
import { haptics } from '../../utils/haptics';
import { useShakeDetection } from '../../hooks/useShakeDetection';

interface DiceyMascotProps {
  size?: number;
  onTap?: () => void;
  onShake?: () => void;
}

export const DiceyMascot: React.FC<DiceyMascotProps> = ({ size = 140, onTap, onShake }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const [isBlinking, setIsBlinking] = useState(false);
  const [_isDizzy, setIsDizzy] = useState(false);

  // Détection de shake
  useShakeDetection({
    onShake: () => {
      handleShake();
    },
  });

  useEffect(() => {
    // Animation idle - bounce continu
    const idleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ])
    );

    // Animation de rotation subtile
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Animation de glow pulsant
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    idleAnimation.start();
    rotateAnimation.start();
    glowAnimation.start();

    // Clignement des yeux périodique
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000);

    return () => {
      idleAnimation.stop();
      rotateAnimation.stop();
      glowAnimation.stop();
      clearInterval(blinkInterval);
    };
  }, [bounceAnim, rotateAnim, glowAnim]);

  const handlePress = () => {
    // Haptic feedback
    haptics.medium();

    // Animation de spin excitée
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 2,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });

    onTap?.();
  };

  const handleShake = () => {
    // Haptic fort pour shake
    haptics.heavy();

    setIsDizzy(true);

    // Animation de wobble (dizzy)
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDizzy(false);
    });

    onShake?.();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '5deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel="Dicey la mascotte"
      accessibilityHint="Tapez pour voir Dicey tourner"
    >
      <View style={{ width: size, height: size }}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              width: size,
              height: size,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        {/* Dicey body */}
        <Animated.View
          style={[
            styles.container,
            {
              width: size,
              height: size,
              transform: [
                { translateY: bounceAnim },
                { rotate: rotate },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Dé principal avec glassmorphism */}
          <View style={[styles.dice, { width: size, height: size, borderRadius: size * 0.2 }]}>
            {/* Face avec gradient */}
            <View style={styles.diceFace}>
              {/* Points du dé (5) */}
              <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.dotTopLeft]} />
                <View style={[styles.dot, styles.dotTopRight]} />
                <View style={[styles.dot, styles.dotCenter]} />
                <View style={[styles.dot, styles.dotBottomLeft]} />
                <View style={[styles.dot, styles.dotBottomRight]} />
              </View>

              {/* Yeux */}
              <View style={styles.eyes}>
                <View style={[styles.eye, isBlinking && styles.eyeClosed]}>
                  <View style={styles.pupil} />
                </View>
                <View style={[styles.eye, isBlinking && styles.eyeClosed]}>
                  <View style={styles.pupil} />
                </View>
              </View>

              {/* Sourire */}
              <View style={styles.smile} />
            </View>
          </View>

          {/* Ombre */}
          <View style={styles.shadow} />
        </Animated.View>

        {/* Particules décoratives */}
        <View style={styles.particles}>
          <View style={[styles.particle, styles.particle1]} />
          <View style={[styles.particle, styles.particle2]} />
          <View style={[styles.particle, styles.particle3]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  dice: {
    backgroundColor: 'rgba(74, 144, 226, 0.25)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  diceFace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    opacity: 0.2,
  },
  dot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  dotTopLeft: {
    top: '10%',
    left: '10%',
  },
  dotTopRight: {
    top: '10%',
    right: '10%',
  },
  dotCenter: {
    top: '45%',
    left: '43%',
  },
  dotBottomLeft: {
    bottom: '10%',
    left: '10%',
  },
  dotBottomRight: {
    bottom: '10%',
    right: '10%',
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 10,
  },
  eye: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  eyeClosed: {
    height: 3,
    borderRadius: 1.5,
  },
  pupil: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C3E50',
  },
  smile: {
    width: 40,
    height: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 3,
    borderTopWidth: 0,
    borderColor: '#FFFFFF',
    marginTop: 5,
  },
  shadow: {
    position: 'absolute',
    bottom: -20,
    width: '80%',
    height: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#50C878',
    opacity: 0.6,
  },
  particle1: {
    top: '10%',
    right: '5%',
  },
  particle2: {
    top: '30%',
    left: '8%',
  },
  particle3: {
    bottom: '20%',
    right: '15%',
  },
});
