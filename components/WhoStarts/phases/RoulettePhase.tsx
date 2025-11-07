import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Player {
  id: string;
  name: string;
  color: string;
}

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 110;
const AVATAR_GAP = 45;
const TOTAL_AVATAR_WIDTH = AVATAR_SIZE + AVATAR_GAP;

interface RoulettePhaseProps {
  players: Player[];
}

export const RoulettePhase: React.FC<RoulettePhaseProps> = ({ players }) => {
  const stripX = useRef(new Animated.Value(0)).current;
  const cursorY = useRef(new Animated.Value(-20)).current;
  const cursorScale = useRef(new Animated.Value(1)).current;
  const cursorGlow = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.9)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  // Create extended strip with repeated players for infinite scroll effect
  const extendedPlayers = [
    ...players,
    ...players,
    ...players,
    ...players,
    ...players,
    ...players,
    ...players,
    ...players,
  ];

  useEffect(() => {
    // Title entrance
    Animated.parallel([
      Animated.spring(titleScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle delayed entrance
    setTimeout(() => {
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Cursor glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorGlow, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cursorGlow, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cursor scale pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorScale, {
          toValue: 1.25,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cursorScale, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cursor bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorY, {
          toValue: -35,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cursorY, {
          toValue: -20,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Roulette scroll animation
    // Phase 1: Acceleration (0-800ms)
    Animated.timing(stripX, {
      toValue: -2000,
      duration: 800,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Phase 2: Max speed (800-2200ms = 1400ms)
      Animated.timing(stripX, {
        toValue: -8000,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        // Phase 3: Deceleration (2200-3000ms = 800ms)
        // Calculate final position to land on center
        const finalPosition = -((extendedPlayers.length / 2) * TOTAL_AVATAR_WIDTH) + (width / 2) - (AVATAR_SIZE / 2);

        Animated.timing(stripX, {
          toValue: finalPosition,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    });
  }, []);

  const cursorGlowOpacity = cursorGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  return (
    <View style={styles.container}>
      {/* Title with glow effect */}
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ scale: titleScale }],
        }}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.title, styles.titleGlow]}>QUI COMMENCE ?</Text>
          <Text style={styles.title}>QUI COMMENCE ?</Text>
        </View>
      </Animated.View>

      {/* Roulette Container */}
      <View style={styles.rouletteContainer}>
        {/* Cursor with enhanced glow */}
        <Animated.View
          style={[
            styles.cursor,
            {
              transform: [
                { translateY: cursorY },
                { scale: cursorScale },
              ],
            },
          ]}
        >
          {/* Glow layer */}
          <Animated.View
            style={[
              styles.cursorGlow,
              {
                opacity: cursorGlowOpacity,
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.8)', 'rgba(255, 215, 0, 0.4)', 'transparent']}
              style={styles.cursorGlowGradient}
            />
          </Animated.View>

          {/* Triangle with gradient */}
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.cursorTriangle}
          />
        </Animated.View>

        {/* Scrolling Strip */}
        <View style={styles.stripContainer}>
          <Animated.View
            style={[
              styles.strip,
              {
                transform: [{ translateX: stripX }],
              },
            ]}
          >
            {extendedPlayers.map((player, index) => (
              <View
                key={`${player.id}-${index}`}
                style={[
                  styles.avatarContainer,
                  { marginRight: index === extendedPlayers.length - 1 ? 0 : AVATAR_GAP },
                ]}
              >
                {/* Avatar with glassmorphism */}
                <View style={styles.avatarWrapper}>
                  <LinearGradient
                    colors={[player.color, adjustColor(player.color, -30)]}
                    style={styles.avatar}
                  >
                    <View style={styles.avatarGlass}>
                      <Text style={styles.avatarText}>
                        {player.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
                <View style={styles.nameContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.nameBadge}
                  >
                    <Text style={styles.playerName}>{player.name}</Text>
                  </LinearGradient>
                </View>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Fade edges with gradient */}
        <LinearGradient
          colors={['rgba(15, 12, 41, 1)', 'rgba(15, 12, 41, 0.8)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fadeLeft}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['transparent', 'rgba(15, 12, 41, 0.8)', 'rgba(15, 12, 41, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fadeRight}
          pointerEvents="none"
        />
      </View>

      {/* Subtitle */}
      <Animated.Text
        style={[
          styles.subtitle,
          { opacity: subtitleOpacity }
        ]}
      >
        ✨ Le sort en décide... ✨
      </Animated.Text>
    </View>
  );
};

// Helper function
const adjustColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  titleGlow: {
    position: 'absolute',
    color: '#FFFFFF',
    opacity: 0.6,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  rouletteContainer: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cursor: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -20,
    zIndex: 10,
  },
  cursorGlow: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursorGlowGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cursorTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftWidth: 20,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD700',
    borderLeftColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 35,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  stripContainer: {
    height: 240,
    width: '100%',
    overflow: 'hidden',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  avatarGlass: {
    width: AVATAR_SIZE - 8,
    height: AVATAR_SIZE - 8,
    borderRadius: (AVATAR_SIZE - 8) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  nameContainer: {
    alignItems: 'center',
  },
  nameBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  fadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 120,
  },
  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
  },
  subtitle: {
    marginTop: 50,
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
