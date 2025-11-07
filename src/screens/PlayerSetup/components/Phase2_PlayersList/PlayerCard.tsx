import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../../../types';

interface PlayerCardProps {
  player: Player;
  index: number;
  onNameChange: (id: string, name: string) => void;
  onColorPress: (id: string) => void;
  onDelete?: (id: string) => void;
  canDelete: boolean;
  autoFocus?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  index,
  onNameChange,
  onColorPress,
  onDelete,
  canDelete,
  autoFocus = false,
}) => {
  const [localName, setLocalName] = useState(player.name);
  const [isValid, setIsValid] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Animation d'entrée avec bounce
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 50,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: player.name ? 1 : 0.7,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        friction: 6,
        tension: 50,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Focus automatique si demandé
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, index * 100 + 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    // Validation
    const isNameValid = localName.length >= 2 && localName.length <= 15;
    setIsValid(isNameValid);

    // Update opacity
    Animated.timing(opacityAnim, {
      toValue: localName ? 1 : 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localName]);

  const handleNameChange = (text: string) => {
    if (text.length <= 15) {
      setLocalName(text);
      onNameChange(player.id, text);
    }
  };

  const getValidationMessage = () => {
    if (!localName) return '';
    if (localName.length < 2) return 'Trop court';
    if (localName.length > 15) return 'Trop long';
    return '';
  };

  const validationMessage = getValidationMessage();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <LinearGradient
        colors={
          player.name
            ? ['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']
            : ['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.7)']
        }
        style={[
          styles.cardGradient,
          player.name && styles.cardGradientWithBorder,
          player.name && { borderColor: player.color },
        ]}
      >
        <View style={styles.card}>
          {/* Avatar Premium with Gradient - À gauche */}
          <TouchableOpacity
            onPress={() => onColorPress(player.id)}
            activeOpacity={0.8}
            style={styles.avatarContainer}
          >
            <LinearGradient
              colors={[player.color, adjustColorBrightness(player.color, -20)]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {player.name ? player.name[0].toUpperCase() : '👤'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Container droite avec input et actions */}
          <View style={styles.rightContainer}>
            {/* Name Input - Aligné à gauche */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Votre nom"
                placeholderTextColor="#A0AEC0"
                value={localName}
                onChangeText={handleNameChange}
                maxLength={15}
                autoCapitalize="words"
                selectionColor={player.color}
                textAlign="left"
                textAlignVertical="center"
              />
              {validationMessage ? (
                <Text style={styles.validationError}>⚠️ {validationMessage}</Text>
              ) : null}
            </View>

            {/* Actions en bas à gauche */}
            <View style={styles.actionsRow}>
              {isValid && (
                <View style={styles.successBadge}>
                  <Text style={styles.successText}>✓ Validé</Text>
                </View>
              )}
              {canDelete && onDelete && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(player.id)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 107, 107, 0.15)', 'rgba(244, 67, 54, 0.15)']}
                    style={styles.deleteGradient}
                  >
                    <Text style={styles.deleteText}>🗑️ Supprimer</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Fonction utilitaire pour ajuster la luminosité
const adjustColorBrightness = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  // eslint-disable-next-line no-bitwise
  const R = (num >> 16) + amt;
  // eslint-disable-next-line no-bitwise
  const G = ((num >> 8) & 0x00ff) + amt;
  // eslint-disable-next-line no-bitwise
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 0,
    marginTop: 6,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 2,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradientWithBorder: {
    borderWidth: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 16,
    minHeight: 88,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  input: {
    fontSize: 20,
    color: '#1A202C',
    fontWeight: '700',
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
    letterSpacing: 0.3,
    textAlign: 'left',
    width: '100%',
    includeFontPadding: false,
    lineHeight: 24,
  },
  validationError: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'left',
  },
  validationSuccess: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  successBadge: {
    backgroundColor: 'rgba(200, 230, 201, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  successText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#50C878',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  checkText: {
    fontSize: 26,
    color: '#2E7D32',
    fontWeight: '900',
  },
  deleteButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  deleteGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  deleteText: {
    fontSize: 13,
    color: '#F44336',
    fontWeight: '700',
  },
});

export default PlayerCard;
