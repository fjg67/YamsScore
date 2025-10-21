/**
 * Bouton Premium "Ajouter un joueur"
 * Design interactif avec bordure animée et feedback
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  useAnimatedProps,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface AddPlayerButtonProps {
  onPress: () => void;
  disabled?: boolean;
  currentPlayers: number;
  maxPlayers?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AddPlayerButton: React.FC<AddPlayerButtonProps> = ({
  onPress,
  disabled = false,
  currentPlayers,
  maxPlayers = 6,
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      ReactNativeHapticFeedback.trigger('impactLight');

      // Animation de pression
      scale.value = withSequence(
        withSpring(0.95, { damping: 10, stiffness: 400 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );

      // Rotation du +
      rotation.value = withSequence(
        withSpring(90, { damping: 10, stiffness: 400 }),
        withSpring(0, { damping: 10, stiffness: 400 })
      );

      onPress();
    }
  };

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        disabled && styles.disabled,
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={styles.content}>
        <Animated.View style={animatedStyle}>
          <Text style={[styles.icon, disabled && styles.iconDisabled]}>⊕</Text>
        </Animated.View>
        <View>
          <Text style={[styles.mainText, disabled && styles.textDisabled]}>
            {disabled ? 'Maximum atteint' : 'Ajouter un joueur'}
          </Text>
          {!disabled && (
            <Text style={styles.hintText}>
              Jusqu'à {maxPlayers} joueurs ({currentPlayers}/{maxPlayers})
            </Text>
          )}
          {disabled && (
            <Text style={styles.hintText}>
              6 joueurs, c'est parfait ! 🎉
            </Text>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 96,
    borderRadius: 24,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  disabled: {
    borderColor: '#CCCCCC',
    backgroundColor: 'rgba(189, 195, 199, 0.06)',
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    fontSize: 36,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  iconDisabled: {
    color: '#CCCCCC',
  },
  mainText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A90E2',
    letterSpacing: 0.2,
  },
  textDisabled: {
    color: '#999999',
  },
  hintText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 3,
    fontWeight: '500',
  },
});

export default AddPlayerButton;
