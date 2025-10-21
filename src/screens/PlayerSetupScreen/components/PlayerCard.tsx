/**
 * PlayerCard Premium - Card 3D avec personnalité
 * Affiche l'avatar, input de nom, et actions
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import PlayerAvatar from './PlayerAvatar';
import { PlayerColorConfig } from '../utils/playerColors';

interface PlayerCardProps {
  playerIndex: number;
  name: string;
  emoji: string;
  color: PlayerColorConfig;
  onNameChange: (name: string) => void;
  onAvatarPress: () => void;
  onRemove: () => void;
  canRemove: boolean;
  autoFocus?: boolean;
  isDuplicate?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  playerIndex,
  name,
  emoji,
  color,
  onNameChange,
  onAvatarPress,
  onRemove,
  canRemove,
  autoFocus = false,
  isDuplicate = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const shakeValue = useSharedValue(0);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (isDuplicate) {
      // Animation de shake si nom dupliqué
      shakeValue.value = withSequence(
        withSpring(-10, { damping: 2, stiffness: 300 }),
        withSpring(10, { damping: 2, stiffness: 300 }),
        withSpring(-10, { damping: 2, stiffness: 300 }),
        withSpring(0, { damping: 2, stiffness: 300 })
      );
      ReactNativeHapticFeedback.trigger('notificationWarning');
    }
  }, [isDuplicate]);

  const animatedShakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeValue.value }],
    };
  });

  const handleRemove = () => {
    Alert.alert(
      'Retirer le joueur',
      `Retirer ${name || `Joueur ${playerIndex + 1}`} de la partie ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            ReactNativeHapticFeedback.trigger('impactMedium');
            onRemove();
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(playerIndex * 100)
        .duration(400)
        .springify()
        .damping(15)}
      exiting={FadeOutLeft.duration(400)}
      style={[animatedShakeStyle]}
    >
      <View
        style={[
          styles.card,
          isDuplicate && styles.cardError,
          { borderColor: isDuplicate ? '#FF6B6B' : 'rgba(74, 144, 226, 0.15)' },
        ]}
      >
        {/* Avatar */}
        <PlayerAvatar
          emoji={emoji}
          color={color}
          playerNumber={playerIndex + 1}
          size={64}
          onPress={onAvatarPress}
        />

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={`Joueur ${playerIndex + 1}`}
            placeholderTextColor="#AAAAAA"
            value={name}
            onChangeText={onNameChange}
            maxLength={15}
            autoCapitalize="words"
            autoCorrect={false}
          />
          {isDuplicate && (
            <Text style={styles.errorText}>Ce nom existe déjà</Text>
          )}
        </View>

        {/* Delete Button */}
        {canRemove && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardError: {
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.25,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  input: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    padding: 0,
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 13,
    color: '#FF6B6B',
    marginTop: 6,
    fontWeight: '500',
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  deleteIcon: {
    fontSize: 22,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});

export default PlayerCard;
