import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../../../types';

interface PlayerCardPremiumProps {
  player: Player;
  index: number;
  onNameChange: (id: string, name: string) => void;
  onColorPress: (id: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

const PlayerCardPremium: React.FC<PlayerCardPremiumProps> = ({
  player,
  index,
  onNameChange,
  onColorPress,
  onDelete,
  canDelete,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous subtle rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const isValid = player.name.length >= 2 && player.name.length <= 15;
  const isEmpty = player.name.length === 0;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-0.5deg', '0.5deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
            { rotate },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Glow effect */}
      {isValid && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
              backgroundColor: player.color,
            }
          ]}
        />
      )}

      <LinearGradient
        colors={
          isFocused
            ? ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.25)']
            : isValid
            ? ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']
            : ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          isFocused && styles.cardFocused,
          isValid && !isFocused && styles.cardValid,
        ]}
      >
        {/* Avatar */}
        <TouchableOpacity
          onPress={() => onColorPress(player.id)}
          activeOpacity={0.8}
          style={styles.avatarContainer}
        >
          <LinearGradient
            colors={[player.color, adjustColor(player.color, -20)]}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarEmoji}>
              {player.isAI ? '🤖' : getEmojiForColor(player.colorName)}
            </Text>
          </LinearGradient>
          {isValid && (
            <View style={styles.validBadge}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.validBadgeGradient}
              >
                <Text style={styles.validCheck}>✓</Text>
              </LinearGradient>
            </View>
          )}
        </TouchableOpacity>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={player.name}
              onChangeText={(text) => onNameChange(player.id, text)}
              placeholder={player.isAI ? 'IA' : 'Votre nom'}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              maxLength={15}
              autoCapitalize="words"
              returnKeyType="done"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {player.name.length > 0 && (
              <Text style={styles.charCount}>
                {player.name.length}/15
              </Text>
            )}
          </View>

          {/* Color name badge */}
          {player.name.length > 0 && (
            <TouchableOpacity
              onPress={() => onColorPress(player.id)}
              activeOpacity={0.7}
              style={styles.colorBadge}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                style={styles.colorBadgeGradient}
              >
                <View style={[styles.colorDot, { backgroundColor: player.color }]} />
                <Text style={styles.colorName}>{player.colorName}</Text>
                <Text style={styles.colorArrow}>›</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Delete Button */}
        {canDelete && (
          <TouchableOpacity
            onPress={() => onDelete(player.id)}
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(239, 68, 68, 0.3)', 'rgba(220, 38, 38, 0.2)']}
              style={styles.deleteGradient}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Validation message */}
      {!isEmpty && !isValid && (
        <View style={styles.errorContainer}>
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.2)', 'rgba(220, 38, 38, 0.15)']}
            style={styles.errorBadge}
          >
            <Text style={styles.errorText}>
              {player.name.length < 2 ? '⚠️ Minimum 2 caractères' : '⚠️ Maximum 15 caractères'}
            </Text>
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );
};

// Helper functions
const adjustColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const getEmojiForColor = (colorName: string): string => {
  const emojiMap: Record<string, string> = {
    'Bleu Océan': '🌊',
    'Vert Émeraude': '🍀',
    'Rouge Corail': '🔥',
    'Jaune Soleil': '☀️',
    'Orange': '🧡',
    'Violet': '💜',
    'Rose': '🌸',
    'Turquoise': '🏝️',
    'Indigo': '🌌',
    'Vert Citron': '🍋',
    'Ambre': '🟡',
    'Cyan': '💎',
  };
  return emojiMap[colorName] || '👤';
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  glowEffect: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 26,
    zIndex: -1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardFocused: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  cardValid: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  avatarEmoji: {
    fontSize: 32,
  },
  validBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  validBadgeGradient: {
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
  validCheck: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  inputSection: {
    flex: 1,
    marginRight: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    padding: 0,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 4,
      },
    }),
  },
  charCount: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 10,
  },
  colorBadge: {
    alignSelf: 'flex-start',
  },
  colorBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  colorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  colorArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 6,
  },
  deleteButton: {
    marginLeft: 8,
  },
  deleteGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  deleteIcon: {
    fontSize: 22,
  },
  errorContainer: {
    marginTop: 8,
    marginLeft: 4,
  },
  errorBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default PlayerCardPremium;
