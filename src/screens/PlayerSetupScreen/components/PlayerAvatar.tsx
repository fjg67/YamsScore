/**
 * Composant Avatar Premium pour les joueurs
 * Affiche un emoji avec gradient de couleur et badge de numéro
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { PlayerColorConfig } from '../utils/playerColors';

interface PlayerAvatarProps {
  emoji: string;
  color: PlayerColorConfig;
  playerNumber: number;
  size?: number;
  onPress?: () => void;
  showBadge?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  emoji,
  color,
  playerNumber,
  size = 64,
  onPress,
  showBadge = true,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    // Animation de pression
    scale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    onPress?.();
  };

  const emojiSize = size * 0.58; // 58% du container - emoji plus grand
  const badgeSize = size * 0.38; // 38% du container - badge plus grand

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} disabled={!onPress}>
        <LinearGradient
          colors={color.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.avatarContainer,
            {
              width: size,
              height: size,
              borderRadius: size * 0.28, // Border arrondi légèrement augmenté
            },
          ]}
        >
          <Text style={[styles.emoji, { fontSize: emojiSize }]}>{emoji}</Text>
        </LinearGradient>

        {showBadge && (
          <View
            style={[
              styles.badge,
              {
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize / 2,
                bottom: -badgeSize * 0.12,
                right: -badgeSize * 0.12,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { fontSize: badgeSize * 0.46, lineHeight: badgeSize * 0.52 },
              ]}
            >
              {playerNumber}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  emoji: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default PlayerAvatar;
