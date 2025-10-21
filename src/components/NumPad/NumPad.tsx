/**
 * Clavier numérique pour saisir les scores
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateScore } from '../../store/slices/gameSlice';
import { getColors, ScoreValidationRules, CategoryLabels } from '../../constants';
import { validateScore } from '../../utils';
import { ScoreCategory } from '../../types';
import NumPadButton from './NumPadButton';

interface NumPadProps {
  visible: boolean;
  playerId: string;
  playerName: string;
  category: ScoreCategory;
  onClose: () => void;
}

const NumPad: React.FC<NumPadProps> = ({
  visible,
  playerId,
  playerName,
  category,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const vibrationEnabled = useAppSelector((state) => state.settings.vibrationEnabled);
  const colors = getColors(theme);

  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const rule = ScoreValidationRules[category];

  // Boutons de valeurs fixes (selon la catégorie)
  const getFixedValues = (): number[] => {
    if (rule.fixedValue !== undefined) {
      return [0, rule.fixedValue];
    }
    return [];
  };

  const handleNumberPress = (value: number | string) => {
    if (vibrationEnabled) {
      Vibration.vibrate(10);
    }

    setError('');

    if (value === 'clear') {
      setInputValue('');
      return;
    }

    const newValue = inputValue + value.toString();
    const numValue = parseInt(newValue, 10);

    // Vérifier que la valeur ne dépasse pas le max
    if (numValue > rule.maxValue) {
      setError(`Maximum ${rule.maxValue}`);
      return;
    }

    setInputValue(newValue);
  };

  const handleFixedValuePress = (value: number) => {
    if (vibrationEnabled) {
      Vibration.vibrate(10);
    }
    setError('');
    setInputValue(value.toString());
  };

  const handleBarrePress = () => {
    if (vibrationEnabled) {
      Vibration.vibrate(10);
    }
    setError('');
    setInputValue('0');
  };

  const handleValidate = () => {
    if (inputValue === '') {
      setError('Saisissez un score');
      return;
    }

    const numValue = parseInt(inputValue, 10);

    // Valider le score
    const validation = validateScore(category, numValue);
    if (!validation.isValid) {
      setError(validation.error || 'Score invalide');
      if (vibrationEnabled) {
        Vibration.vibrate([0, 50, 100, 50]);
      }
      return;
    }

    // Mettre à jour le score dans Redux
    dispatch(updateScore({ playerId, category, value: numValue }));

    if (vibrationEnabled) {
      Vibration.vibrate(20);
    }

    // Fermer le modal
    handleClose();
  };

  const handleClose = () => {
    setInputValue('');
    setError('');
    onClose();
  };

  const fixedValues = getFixedValues();
  const hasFixedValues = fixedValues.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {CategoryLabels[category]}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {playerName}
            </Text>
            {rule.fixedValue && (
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                0 (barré) ou {rule.fixedValue} points
              </Text>
            )}
            {!rule.fixedValue && (
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                De {rule.minValue} à {rule.maxValue}
              </Text>
            )}
          </View>

          {/* Affichage de la valeur saisie */}
          <View style={[styles.display, { borderColor: colors.border }]}>
            <Text style={[styles.displayText, { color: colors.text }]}>
              {inputValue || '-'}
            </Text>
          </View>

          {/* Message d'erreur */}
          {error ? (
            <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
          ) : (
            <View style={styles.errorPlaceholder} />
          )}

          {/* Valeurs fixes (si applicable) */}
          {hasFixedValues && (
            <View style={styles.fixedValuesContainer}>
              <Text style={[styles.fixedValuesLabel, { color: colors.textSecondary }]}>
                Valeurs rapides :
              </Text>
              <View style={styles.fixedValuesRow}>
                {fixedValues.map((val) => (
                  <NumPadButton
                    key={val}
                    value={val}
                    onPress={() => handleFixedValuePress(val)}
                    variant="fixed"
                  />
                ))}
              </View>
            </View>
          )}

          {/* Clavier numérique */}
          <View style={styles.numPad}>
            {/* Lignes de chiffres */}
            <View style={styles.row}>
              {[1, 2, 3].map((num) => (
                <NumPadButton key={num} value={num} onPress={handleNumberPress} />
              ))}
            </View>
            <View style={styles.row}>
              {[4, 5, 6].map((num) => (
                <NumPadButton key={num} value={num} onPress={handleNumberPress} />
              ))}
            </View>
            <View style={styles.row}>
              {[7, 8, 9].map((num) => (
                <NumPadButton key={num} value={num} onPress={handleNumberPress} />
              ))}
            </View>
            <View style={styles.row}>
              <NumPadButton
                value="clear"
                label="⌫"
                onPress={handleNumberPress}
                variant="clear"
              />
              <NumPadButton value={0} onPress={handleNumberPress} />
              <NumPadButton
                value={0}
                label="✕ Barré"
                onPress={handleBarrePress}
                variant="cancel"
              />
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.validateButton, { backgroundColor: colors.secondary }]}
              onPress={handleValidate}
            >
              <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                Valider
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  display: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  displayText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 20,
  },
  errorPlaceholder: {
    height: 20,
    marginBottom: 8,
  },
  fixedValuesContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  fixedValuesLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  fixedValuesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  numPad: {
    alignItems: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  cancelButton: {
    borderWidth: 2,
  },
  validateButton: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NumPad;
