import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export const LuckyThrowPhase: React.FC = () => {
  const luckyScale = useRef(new Animated.Value(1.2)).current;
  const luckyRotate = useRef(new Animated.Value(0)).current;
  const luckyY = useRef(new Animated.Value(0)).current;
  const particleOpacity = useRef(new Animated.Value(0)).current;
  const particleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Charge animation (0-300ms)
    Animated.sequence([
      Animated.parallel([
        Animated.timing(luckyScale, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(luckyRotate, {
          toValue: -20,
          duration: 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Release (300-500ms)
      Animated.parallel([
        Animated.timing(luckyScale, {
          toValue: 1.3,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(luckyRotate, {
          toValue: 15,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(luckyY, {
          toValue: -30,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        // Particles burst
        Animated.sequence([
          Animated.parallel([
            Animated.timing(particleOpacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(particleScale, {
              toValue: 1,
              duration: 100,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particleOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(particleScale, {
              toValue: 2,
              duration: 300,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
      // Return
      Animated.timing(luckyY, {
        toValue: 0,
        duration: 100,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Lucky */}
      <Animated.View
        style={[
          styles.luckyContainer,
          {
            transform: [
              { scale: luckyScale },
              { rotate: luckyRotate.interpolate({
                inputRange: [-20, 15],
                outputRange: ['-20deg', '15deg'],
              }) },
              { translateY: luckyY },
            ],
          },
        ]}
      >
        <Text style={styles.luckyEmoji}>🎲</Text>
      </Animated.View>

      {/* Magic Particles */}
      <Animated.View
        style={[
          styles.particlesContainer,
          {
            opacity: particleOpacity,
            transform: [{ scale: particleScale }],
          },
        ]}
      >
        <View style={styles.particleRow}>
          <Text style={[styles.particle, { color: '#FFD700' }]}>✨</Text>
          <Text style={[styles.particle, { color: '#4A90E2' }]}>✨</Text>
          <Text style={[styles.particle, { color: '#FF6B6B' }]}>✨</Text>
        </View>
        <View style={styles.particleRow}>
          <Text style={[styles.particle, { color: '#9B59B6' }]}>✨</Text>
          <Text style={[styles.particle, { color: '#FFD700' }]}>✨</Text>
        </View>
      </Animated.View>

      <Text style={styles.text}>Lucky lance le dé...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  luckyContainer: {
    marginBottom: 40,
  },
  luckyEmoji: {
    fontSize: 100,
  },
  particlesContainer: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  particleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 10,
  },
  particle: {
    fontSize: 30,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
});
