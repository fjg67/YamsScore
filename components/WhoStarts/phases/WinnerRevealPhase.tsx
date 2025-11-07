import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface Player {
  id: string;
  name: string;
  color: string;
}

interface WinnerRevealPhaseProps {
  winner: Player;
}

export const WinnerRevealPhase: React.FC<WinnerRevealPhaseProps> = ({ winner }) => {
  const spotlightOpacity = useRef(new Animated.Value(0)).current;
  const spotlightScale = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;
  const avatarRotate = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameScale = useRef(new Animated.Value(0)).current;
  const nameY = useRef(new Animated.Value(50)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  // Confetti particles
  const confettiAnimations = useRef(
    Array.from({ length: 50 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  // Stars orbiting
  const starAnimations = useRef(
    Array.from({ length: 8 }, () => ({
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Spotlight
    Animated.parallel([
      Animated.timing(spotlightOpacity, {
        toValue: 0.9,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(spotlightScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Avatar mega scale + rotation
    Animated.parallel([
      Animated.sequence([
        Animated.timing(avatarScale, {
          toValue: 3.0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(avatarScale, {
          toValue: 2.5,
          duration: 300,
          easing: Easing.out(Easing.elastic(1)),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(avatarRotate, {
        toValue: 360,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Winner name
    Animated.parallel([
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(nameScale, {
          toValue: 1.2,
          duration: 400,
          delay: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(nameScale, {
          toValue: 1.0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(nameY, {
        toValue: 0,
        duration: 600,
        delay: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Flash effect (2 flashes)
    Animated.sequence([
      Animated.timing(flashOpacity, {
        toValue: 0.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(flashOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(flashOpacity, {
        toValue: 0.4,
        duration: 150,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.timing(flashOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti explosion
    confettiAnimations.forEach((anim, index) => {
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const velocity = 100 + Math.random() * 200;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity - 100; // Bias upward

      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 100,
          delay: index * 5,
          useNativeDriver: true,
        }),
        Animated.timing(anim.x, {
          toValue: targetX,
          duration: 2000,
          delay: index * 5,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim.y, {
          toValue: targetY + 500, // Fall down
          duration: 2000,
          delay: index * 5,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: 360 * (2 + Math.random() * 2),
          duration: 2000,
          delay: index * 5,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out
      Animated.timing(anim.opacity, {
        toValue: 0,
        duration: 500,
        delay: 1500 + index * 5,
        useNativeDriver: true,
      }).start();
    });

    // Orbiting stars
    starAnimations.forEach((anim, index) => {
      // Scale in
      Animated.timing(anim.scale, {
        toValue: 1,
        duration: 400,
        delay: 200 + index * 50,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();

      // Continuous rotation
      Animated.loop(
        Animated.timing(anim.rotate, {
          toValue: 360,
          duration: 2000,
          delay: 200 + index * 50,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  const confettiColors = ['#FFD700', '#4A90E2', '#FF6B6B', '#9B59B6', '#FFFFFF'];

  return (
    <View style={styles.container}>
      {/* Flash effect */}
      <Animated.View
        style={[
          styles.flash,
          { opacity: flashOpacity },
        ]}
      />

      {/* Spotlight */}
      <Animated.View
        style={[
          styles.spotlight,
          {
            opacity: spotlightOpacity,
            transform: [{ scale: spotlightScale }],
          },
        ]}
      />

      {/* Confetti */}
      {confettiAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: confettiColors[index % confettiColors.length],
              opacity: anim.opacity,
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Winner Avatar */}
      <Animated.View
        style={[
          styles.avatarContainer,
          {
            transform: [
              { scale: avatarScale },
              {
                rotate: avatarRotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: winner.color }]}>
          <Text style={styles.avatarText}>
            {winner.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Orbiting stars */}
        {starAnimations.map((anim, index) => {
          const angle = (index * 360) / starAnimations.length;
          const radius = 80;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <Animated.View
              key={index}
              style={[
                styles.star,
                {
                  transform: [
                    { translateX: x },
                    { translateY: y },
                    { scale: anim.scale },
                    {
                      rotate: anim.rotate.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.starText}>⭐</Text>
            </Animated.View>
          );
        })}
      </Animated.View>

      {/* Winner Name */}
      <Animated.View
        style={[
          styles.nameContainer,
          {
            opacity: nameOpacity,
            transform: [{ scale: nameScale }, { translateY: nameY }],
          },
        ]}
      >
        <Text style={[styles.winnerName, { color: winner.color }]}>
          {winner.name}
        </Text>
        <Text style={styles.subtitle}>commence !</Text>
      </Animated.View>

      {/* Crown */}
      <Text style={styles.crown}>👑</Text>
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
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  spotlight: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 100,
    elevation: 20,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  avatarContainer: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 60,
    elevation: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  star: {
    position: 'absolute',
  },
  starText: {
    fontSize: 20,
  },
  nameContainer: {
    alignItems: 'center',
  },
  winnerName: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: 1,
  },
  crown: {
    position: 'absolute',
    top: '30%',
    fontSize: 50,
  },
});
