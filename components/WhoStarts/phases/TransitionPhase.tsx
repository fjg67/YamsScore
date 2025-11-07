import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface Player {
  id: string;
  name: string;
  color: string;
}

interface TransitionPhaseProps {
  winner: Player;
}

export const TransitionPhase: React.FC<TransitionPhaseProps> = ({ winner }) => {
  const [currentNumber, setCurrentNumber] = useState<number | 'DICE' | null>(3);

  const numberScale = useRef(new Animated.Value(0)).current;
  const numberOpacity = useRef(new Animated.Value(0)).current;
  const goScale = useRef(new Animated.Value(0)).current;
  const goOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    runCountdown();
  }, []);

  const runCountdown = async () => {
    // Show 3
    await showNumber(3);
    await delay(500);

    // Show 2
    await showNumber(2);
    await delay(500);

    // Show 1
    await showNumber(1);
    await delay(500);

    // Show GO!
    await showGo();
  };

  const showNumber = (num: number): Promise<void> => {
    return new Promise((resolve) => {
      setCurrentNumber(num);

      // Reset values
      numberScale.setValue(0);
      numberOpacity.setValue(0);

      // Animate in
      Animated.parallel([
        Animated.sequence([
          Animated.timing(numberScale, {
            toValue: 2.0,
            duration: 200,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(numberScale, {
            toValue: 1.8,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(numberOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(numberScale, {
            toValue: 3.0,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(numberOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      }, 300);
    });
  };

  const showGo = (): Promise<void> => {
    return new Promise((resolve) => {
      setCurrentNumber('DICE');

      // Animate "Les dés tournent"
      Animated.parallel([
        Animated.sequence([
          Animated.timing(goScale, {
            toValue: 1.5,
            duration: 400,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(goScale, {
            toValue: 1.3,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(goOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.delay(600),
          Animated.timing(goOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => resolve());
    });
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  return (
    <View style={styles.container}>
      {/* Numbers 3, 2, 1 */}
      {typeof currentNumber === 'number' && (
        <Animated.View
          style={[
            styles.numberContainer,
            {
              opacity: numberOpacity,
              transform: [{ scale: numberScale }],
            },
          ]}
        >
          <Text style={styles.numberText}>{currentNumber}</Text>
        </Animated.View>
      )}

      {/* Les dés tournent */}
      {currentNumber === 'DICE' && (
        <Animated.View
          style={[
            styles.goContainer,
            {
              opacity: goOpacity,
              transform: [{ scale: goScale }],
            },
          ]}
        >
          <Text style={styles.diceEmoji}>🎲</Text>
          <Text style={styles.goText}>Les dés tournent</Text>
        </Animated.View>
      )}

      {/* Winner reminder at bottom */}
      <View style={styles.winnerReminder}>
        <View style={[styles.smallAvatar, { backgroundColor: winner.color }]}>
          <Text style={styles.smallAvatarText}>
            {winner.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.winnerText}>{winner.name} commence</Text>
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
    backgroundColor: 'transparent',
  },
  numberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 120,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 40,
  },
  goContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  goText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 40,
  },
  winnerReminder: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  smallAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  winnerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
