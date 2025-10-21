/**
 * Bottom Sheet premium pour saisie de score intelligente
 * Combine tous les composants : Helper, Validator, SmartGrid
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { SlideInDown, SlideOutDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { ScoreCategory } from '../../types/game.types';
import { ValidationResult } from '../../types/numpad.types';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateScore } from '../../store/slices/gameSlice';
import { validateScore } from '../../utils';
import { premiumTheme } from '../../theme/premiumTheme';
import { CategoryLabels } from '../../constants';
import { getCategoryEmoji } from '../../constants/emojis';
import { useSmartNumPad } from '../../hooks/useSmartNumPad';
import { useHaptic } from '../../hooks/useHaptic';
import { SoundManager } from '../../services/SoundManager';

// Components
import CategoryHelper from './CategoryHelper';
import InputValidator from './InputValidator';
import SmartNumberGrid from './SmartNumberGrid';

interface NumPadBottomSheetProps {
  visible: boolean;
  playerId: string;
  playerName: string;
  playerColor: string;
  category: ScoreCategory;
  onClose: () => void;
}

const NumPadBottomSheet: React.FC<NumPadBottomSheetProps> = ({
  visible,
  playerId,
  playerName,
  playerColor,
  category,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { success, error: hapticError } = useHaptic();

  // Récupérer les paramètres depuis Redux
  const confirmActionsEnabled = useAppSelector((state) => state.settings.confirmActionsEnabled);
  const quickInputEnabled = useAppSelector((state) => state.settings.quickInputEnabled);
  const showHintsEnabled = useAppSelector((state) => state.settings.showHintsEnabled);
  const tutorialModeEnabled = useAppSelector((state) => state.settings.tutorialModeEnabled);

  const [inputValue, setInputValue] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });

  const config = useSmartNumPad(category);
  const categoryLabel = CategoryLabels[category];
  const categoryEmoji = getCategoryEmoji(category);

  // Reset on open
  useEffect(() => {
    if (visible) {
      setInputValue('');
      setIsCustomMode(false);
      setValidation({ isValid: true });
    }
  }, [visible]);

  // Validate in real-time
  useEffect(() => {
    if (inputValue === '') {
      setValidation({ isValid: true });
      return;
    }

    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue)) {
      setValidation({
        isValid: false,
        error: 'Valeur invalide',
      });
      return;
    }

    const result = validateScore(category, numValue);

    // Add quality assessment
    if (result.isValid && numValue > 0) {
      const maxScore = config.maxValue;
      const percentage = (numValue / maxScore) * 100;

      let quality: 'excellent' | 'good' | 'average' | 'poor';
      if (percentage > 80) quality = 'excellent';
      else if (percentage > 50) quality = 'good';
      else if (percentage > 20) quality = 'average';
      else quality = 'poor';

      setValidation({
        ...result,
        quality,
      });
    } else {
      setValidation(result);
    }
  }, [inputValue, category, config.maxValue]);

  const handleNumberPress = (value: number) => {
    setInputValue(value.toString());
    setIsCustomMode(false);
  };

  const handleBarrePress = () => {
    setInputValue('0');
    setIsCustomMode(false);
  };

  const handleCustomPress = () => {
    setInputValue('');
    setIsCustomMode(true);
  };

  const handleValidate = () => {
    if (inputValue === '') {
      setValidation({
        isValid: false,
        error: 'Veuillez saisir un score',
      });
      return;
    }

    if (!validation.isValid) {
      hapticError();
      return;
    }

    const numValue = parseInt(inputValue, 10);

    // Si la confirmation est activée et que c'est un barré (0)
    if (confirmActionsEnabled && numValue === 0) {
      const { Alert } = require('react-native');
      Alert.alert(
        'Confirmer le barré',
        `Êtes-vous sûr de vouloir barrer "${categoryLabel}" pour ${playerName} ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
            onPress: () => {
              hapticError();
            },
          },
          {
            text: 'Confirmer',
            style: 'destructive',
            onPress: () => {
              // Dispatch to Redux
              dispatch(updateScore({ playerId, category, value: numValue }));

              // Success feedback
              success();
              SoundManager.play('score_entry');

              // Close
              handleClose();
            },
          },
        ]
      );
    } else {
      // Dispatch to Redux
      dispatch(updateScore({ playerId, category, value: numValue }));

      // Success feedback
      success();
      SoundManager.play('score_entry');

      // Close
      handleClose();
    }
  };

  const handleClose = () => {
    setInputValue('');
    setIsCustomMode(false);
    setValidation({ isValid: true });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Backdrop with blur */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(0,0,0,0.7)"
          />
        </TouchableOpacity>

        {/* Bottom Sheet */}
        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
          style={styles.sheet}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerEmoji}>{categoryEmoji}</Text>
              <View>
                <Text style={styles.headerTitle}>{categoryLabel}</Text>
                <View style={styles.playerInfo}>
                  <View style={[styles.playerDot, { backgroundColor: playerColor }]} />
                  <Text style={styles.playerName}>{playerName}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable content */}
          <View style={styles.content}>
            {/* Category Helper */}
            <CategoryHelper category={category} tutorialMode={tutorialModeEnabled} />

            {/* Input Validator Display */}
            <InputValidator
              value={inputValue}
              category={category}
              validation={validation}
            />

            {/* Custom Input Mode */}
            {isCustomMode ? (
              <Animated.View entering={FadeIn.duration(200)} style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  value={inputValue}
                  onChangeText={setInputValue}
                  keyboardType="number-pad"
                  placeholder={`0 - ${config.maxValue}`}
                  placeholderTextColor={premiumTheme.colors.ui.textTertiary}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleValidate}
                />
                <TouchableOpacity
                  style={styles.customBackButton}
                  onPress={() => setIsCustomMode(false)}
                >
                  <Text style={styles.customBackText}>← Retour</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              /* Smart Number Grid */
              <SmartNumberGrid
                config={config}
                onNumberPress={handleNumberPress}
                onBarrePress={handleBarrePress}
                onCustomPress={handleCustomPress}
                quickInputEnabled={quickInputEnabled}
              />
            )}

            {/* Examples - Affichés uniquement si showHintsEnabled est activé */}
            {showHintsEnabled && config.examples.length > 0 && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>💡 Exemples :</Text>
                {config.examples.map((example, index) => (
                  <Text key={index} style={styles.exampleText}>
                    {example}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.footerButton, styles.cancelButton]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.validateButton,
                !validation.isValid && styles.validateButtonDisabled,
              ]}
              onPress={handleValidate}
              disabled={!validation.isValid || inputValue === ''}
              activeOpacity={0.7}
            >
              <Text style={styles.validateButtonText}>
                Valider {inputValue !== '' ? `(${inputValue})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  sheet: {
    backgroundColor: premiumTheme.colors.ui.background,
    borderTopLeftRadius: premiumTheme.borderRadius.xxl,
    borderTopRightRadius: premiumTheme.borderRadius.xxl,
    maxHeight: '85%',
    ...premiumTheme.colors.shadows.heavy,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: premiumTheme.spacing.sm,
    marginBottom: premiumTheme.spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: premiumTheme.spacing.lg,
    paddingBottom: premiumTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  headerEmoji: {
    fontSize: 32,
    marginRight: premiumTheme.spacing.md,
  },

  headerTitle: {
    fontSize: premiumTheme.typography.fontSize.display,
    fontWeight: 'bold',
    color: premiumTheme.colors.ui.textPrimary,
  },

  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: premiumTheme.spacing.xs,
  },

  playerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: premiumTheme.spacing.xs,
  },

  playerName: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: premiumTheme.colors.ui.textSecondary,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    fontSize: 20,
    color: premiumTheme.colors.ui.textSecondary,
  },

  content: {
    paddingHorizontal: premiumTheme.spacing.lg,
    paddingVertical: premiumTheme.spacing.md,
    maxHeight: '70%',
  },

  customInputContainer: {
    gap: premiumTheme.spacing.md,
  },

  customInput: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: premiumTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: '#4A90E2',
    paddingHorizontal: premiumTheme.spacing.lg,
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: premiumTheme.typography.fontFamily.monospace,
    textAlign: 'center',
    color: premiumTheme.colors.ui.textPrimary,
  },

  customBackButton: {
    alignSelf: 'flex-start',
    paddingVertical: premiumTheme.spacing.sm,
    paddingHorizontal: premiumTheme.spacing.md,
  },

  customBackText: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: '#4A90E2',
    fontWeight: '600',
  },

  examplesContainer: {
    marginTop: premiumTheme.spacing.md,
    padding: premiumTheme.spacing.md,
    backgroundColor: 'rgba(74,144,226,0.05)',
    borderRadius: premiumTheme.borderRadius.md,
  },

  examplesTitle: {
    fontSize: premiumTheme.typography.fontSize.sm,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: premiumTheme.spacing.xs,
  },

  exampleText: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: premiumTheme.colors.ui.textSecondary,
    lineHeight: 20,
  },

  footer: {
    flexDirection: 'row',
    gap: premiumTheme.spacing.md,
    paddingHorizontal: premiumTheme.spacing.lg,
    paddingVertical: premiumTheme.spacing.lg,
    paddingBottom: premiumTheme.spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },

  footerButton: {
    flex: 1,
    height: 56,
    borderRadius: premiumTheme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },

  cancelButtonText: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: '600',
    color: premiumTheme.colors.ui.textPrimary,
  },

  validateButton: {
    backgroundColor: '#50C878',
    ...premiumTheme.colors.shadows.medium,
  },

  validateButtonDisabled: {
    backgroundColor: premiumTheme.colors.ui.disabled,
    opacity: 0.5,
  },

  validateButtonText: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default NumPadBottomSheet;
