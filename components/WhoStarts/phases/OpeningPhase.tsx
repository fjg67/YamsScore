import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface Player {
  id: string;
  name: string;
  color: string;
}

interface OpeningPhaseProps {
  players: Player[];
}

export const OpeningPhase: React.FC<OpeningPhaseProps> = ({ players }) => {
  // Animations
  const curtainLeftX = useRef(new Animated.Value(-50)).current;
  const curtainRightX = useRef(new Animated.Value(50)).current;
  const luckyScale = useRef(new Animated.Value(0)).current;
  const luckyRotate = useRef(new Animated.Value(0)).current;
  const luckyOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const avatarsScale = useRef(players.map(() => new Animated.Value(0))).current;
  const avatarsOpacity = useRef(players.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Curtain opening (200ms delay, 800ms duration)
    Animated.parallel([
      Animated.timing(curtainLeftX, {
        toValue: -100,
        duration: 800,
        delay: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(curtainRightX, {
        toValue: 100,
        duration: 800,
        delay: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Lucky apparition (400ms delay, 800ms duration)
    Animated.parallel([
      Animated.timing(luckyScale, {
        toValue: 1.2,
        duration: 800,
        delay: 400,
        easing: Easing.out(Easing.elastic(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(luckyRotate, {
        toValue: 360,
        duration: 800,
        delay: 400,
        easing: Easing.out(Easing.elastic(1)),
        useNativeDriver: true,
      }),
      Animated.timing(luckyOpacity, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Title fade in (800ms delay, 600ms duration)
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        delay: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 600,
        delay: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Player avatars staggered (1000ms delay, 100ms stagger)
    players.forEach((_, index) => {
      Animated.parallel([
        Animated.timing(avatarsScale[index], {
          toValue: 1,
          duration: 400,
          delay: 1000 + index * 100,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(avatarsOpacity[index], {
          toValue: 1,
          duration: 400,
          delay: 1000 + index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const rotateInterpolate = luckyRotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Curtains */}
      <Animated.View
        style={[
          styles.curtainLeft,
          {
            transform: [{ translateX: curtainLeftX.interpolate({
              inputRange: [-100, -50],
              outputRange: ['-100%', '-50%'],
            }) }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.curtainRight,
          {
            transform: [{ translateX: curtainRightX.interpolate({
              inputRange: [50, 100],
              outputRange: ['50%', '100%'],
            }) }],
          },
        ]}
      />

      {/* Lucky Mascot */}
      <Animated.View
        style={[
          styles.luckyContainer,
          {
            opacity: luckyOpacity,
            transform: [
              { scale: luckyScale },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        <Text style={styles.luckyEmoji}>🎉</Text>
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
          },
        ]}
      >
        <Text style={styles.title}>QUI COMMENCE ?</Text>
      </Animated.View>

      {/* Player Avatars */}
      <View style={styles.playersRow}>
        {players.map((player, index) => (
          <Animated.View
            key={player.id}
            style={[
              styles.playerAvatar,
              {
                backgroundColor: player.color,
                opacity: avatarsOpacity[index],
                transform: [{ scale: avatarsScale[index] }],
              },
            ]}
          >
            <Text style={styles.playerAvatarText}>
              {player.name.charAt(0).toUpperCase()}
            </Text>
          </Animated.View>
        ))}
      </View>
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
  curtainLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#1a1a2e',
    zIndex: 20,
  },
  curtainRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#1a1a2e',
    zIndex: 20,
  },
  luckyContainer: {
    marginBottom: 40,
  },
  luckyEmoji: {
    fontSize: 80,
  },
  titleContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  playersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  playerAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
