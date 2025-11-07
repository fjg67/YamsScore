import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 68) / 3;

interface PlayerCountCardPremiumProps {
  count: number;
  selected: boolean;
  onSelect: () => void;
}

const PlayerCountCardPremium: React.FC<PlayerCountCardPremiumProps> = ({
  count,
  selected,
  onSelect,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selected) {
      // Pulse animation when selected
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Bounce entrance
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
      bounceAnim.setValue(0);
    }
  }, [selected]);

  useEffect(() => {
    // Subtle continuous rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-1deg', '1deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderPlayerIcons = () => {
    const icons = [];
    const maxDisplay = Math.min(count, 6);

    for (let i = 0; i < maxDisplay; i++) {
      icons.push(
        <View key={i} style={styles.iconDot}>
          <LinearGradient
            colors={
              selected
                ? ['#FFFFFF', 'rgba(255, 255, 255, 0.8)']
                : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)']
            }
            style={styles.iconDotGradient}
          />
        </View>
      );
    }

    return (
      <View style={styles.iconsGrid}>
        {icons}
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale: Animated.multiply(scaleAnim, pulseAnim) },
          { rotate },
        ],
      }}
    >
      {/* Glow effect for selected card */}
      {selected && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.5)', 'rgba(102, 126, 234, 0.6)', 'rgba(118, 75, 162, 0.5)']}
            style={styles.glowGradient}
          />
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={
            selected
              ? ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']
              : ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            selected && styles.cardSelected,
          ]}
        >
          {/* Player count number badge */}
          <View style={styles.countBadge}>
            <LinearGradient
              colors={
                selected
                  ? ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.25)']
                  : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']
              }
              style={styles.countBadgeGradient}
            >
              <Text style={[styles.countNumber, selected && styles.countNumberSelected]}>
                {count}
              </Text>
            </LinearGradient>
          </View>

          {/* Player icons grid */}
          <View style={styles.iconsContainer}>
            {renderPlayerIcons()}
          </View>

          {/* Label */}
          <Text style={[styles.label, selected && styles.labelSelected]}>
            {count === 1 ? 'Solo' : `${count} Joueurs`}
          </Text>

          {/* Solo vs IA badge */}
          {count === 1 && (
            <View style={styles.aiBadge}>
              <LinearGradient
                colors={
                  selected
                    ? ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']
                    : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']
                }
                style={styles.aiBadgeGradient}
              >
                <Text style={[styles.aiBadgeText, selected && styles.aiBadgeTextSelected]}>
                  vs IA 🤖
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Selected checkmark */}
          {selected && (
            <Animated.View
              style={[
                styles.checkmarkContainer,
                {
                  transform: [
                    {
                      scale: bounceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.checkmarkGradient}
              >
                <Text style={styles.checkmark}>✓</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardTouchable: {
    width: CARD_WIDTH,
  },
  glowEffect: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 28,
    zIndex: -1,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 28,
  },
  card: {
    aspectRatio: 0.85,
    borderRadius: 24,
    padding: 16,
    paddingBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardSelected: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  countBadge: {
    marginBottom: 6,
  },
  countBadgeGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  countNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  countNumberSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowRadius: 6,
  },
  iconsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    maxWidth: 70,
  },
  iconDot: {
    marginHorizontal: 2,
    marginVertical: 2,
  },
  iconDotGradient: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  labelSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowRadius: 6,
  },
  aiBadge: {
    marginTop: 4,
  },
  aiBadgeGradient: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.2,
  },
  aiBadgeTextSelected: {
    color: '#FFFFFF',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  checkmarkGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});

export default PlayerCountCardPremium;
