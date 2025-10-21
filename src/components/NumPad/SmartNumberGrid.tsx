/**
 * Grille de nombres intelligente adaptée à chaque catégorie
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { ScoreCategory } from '../../types/game.types';
import { SmartNumPadConfig } from '../../types/numpad.types';
import { premiumTheme } from '../../theme/premiumTheme';
import { useHaptic } from '../../hooks/useHaptic';
import { SoundManager } from '../../services/SoundManager';

interface SmartNumberGridProps {
  config: SmartNumPadConfig;
  onNumberPress: (value: number) => void;
  onBarrePress: () => void;
  onCustomPress: () => void;
  quickInputEnabled?: boolean;
}

const SmartNumberGrid: React.FC<SmartNumberGridProps> = ({
  config,
  onNumberPress,
  onBarrePress,
  onCustomPress,
  quickInputEnabled = true,
}) => {
  const { light } = useHaptic();

  const handlePress = (value: number, callback: () => void) => {
    light();
    SoundManager.play('tap');
    callback();
  };

  // Si valeur fixe (Full, Suites, Yams): seulement 2 boutons
  if (config.isFixedValue && config.fixedValue) {
    return (
      <View style={styles.container}>
        <View style={styles.fixedValueContainer}>
          {/* Bouton Barrer (0) */}
          <TouchableOpacity
            style={styles.crossButton}
            onPress={() => handlePress(0, onBarrePress)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.crossGradient}
            >
              <Text style={styles.crossIcon}>❌</Text>
              <Text style={styles.crossLabel}>Barrer</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Bouton Valeur fixe */}
          <TouchableOpacity
            style={styles.fixedButton}
            onPress={() => handlePress(config.fixedValue!, () => onNumberPress(config.fixedValue!))}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#50C878', '#3FA065']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fixedGradient}
            >
              <Text style={styles.fixedValue}>{config.fixedValue}</Text>
              <Text style={styles.fixedLabel}>points</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.helperText}>{config.helperText}</Text>
      </View>
    );
  }

  // Mode normal: Quick values + Custom input + Barrer
  return (
    <View style={styles.container}>
      {/* Quick Values Section - Affichés uniquement si quickInputEnabled est activé */}
      {quickInputEnabled && config.quickValues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Valeurs fréquentes</Text>
          <View style={styles.quickGrid}>
            {config.quickValues.map((value) => (
              <Animated.View
                key={value}
                entering={FadeIn.delay(value * 50)}
                layout={Layout.springify()}
              >
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => handlePress(value, () => onNumberPress(value))}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#4A90E2', '#5DADE2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickGradient}
                  >
                    <Text style={styles.quickValue}>{value}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Custom Input Button */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => handlePress(0, onCustomPress)}
          activeOpacity={0.7}
        >
          <View style={styles.customContent}>
            <Text style={styles.customIcon}>✏️</Text>
            <Text style={styles.customLabel}>Autre valeur</Text>
            <Text style={styles.customHint}>0-{config.maxValue}</Text>
          </View>
        </TouchableOpacity>

        {/* Barrer Button */}
        <TouchableOpacity
          style={styles.barreButton}
          onPress={() => handlePress(0, onBarrePress)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.barreGradient}
          >
            <Text style={styles.barreIcon}>❌</Text>
            <Text style={styles.barreLabel}>Barrer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Helper text */}
      <Text style={styles.helperText}>{config.helperText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: premiumTheme.spacing.md,
  },

  // Fixed value mode (Full, Suites, Yams)
  fixedValueContainer: {
    flexDirection: 'row',
    gap: premiumTheme.spacing.md,
    marginBottom: premiumTheme.spacing.md,
  },

  crossButton: {
    flex: 1,
    height: 80,
    borderRadius: premiumTheme.borderRadius.xl,
    overflow: 'hidden',
    ...premiumTheme.colors.shadows.medium,
  },
  crossGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossIcon: {
    fontSize: 32,
    marginBottom: premiumTheme.spacing.xs,
  },
  crossLabel: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  fixedButton: {
    flex: 1,
    height: 80,
    borderRadius: premiumTheme.borderRadius.xl,
    overflow: 'hidden',
    ...premiumTheme.colors.shadows.medium,
  },
  fixedGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: premiumTheme.typography.fontFamily.monospace,
  },
  fixedLabel: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: premiumTheme.spacing.xs,
  },

  // Quick values section
  section: {
    marginBottom: premiumTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: premiumTheme.typography.fontSize.md,
    fontWeight: '600',
    color: premiumTheme.colors.ui.textSecondary,
    marginBottom: premiumTheme.spacing.sm,
    marginLeft: premiumTheme.spacing.xs,
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: premiumTheme.spacing.sm,
  },
  quickButton: {
    width: 72,
    height: 64,
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
    ...premiumTheme.colors.shadows.soft,
  },
  quickGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: premiumTheme.typography.fontFamily.monospace,
  },

  // Action buttons
  actionsContainer: {
    flexDirection: 'row',
    gap: premiumTheme.spacing.md,
    marginBottom: premiumTheme.spacing.md,
  },

  customButton: {
    flex: 1,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: premiumTheme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(74,144,226,0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumTheme.colors.shadows.soft,
  },
  customContent: {
    alignItems: 'center',
  },
  customIcon: {
    fontSize: 24,
    marginBottom: premiumTheme.spacing.xs,
  },
  customLabel: {
    fontSize: premiumTheme.typography.fontSize.md,
    fontWeight: '600',
    color: '#4A90E2',
  },
  customHint: {
    fontSize: premiumTheme.typography.fontSize.xs,
    color: premiumTheme.colors.ui.textTertiary,
    marginTop: 2,
  },

  barreButton: {
    width: 100,
    height: 70,
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
    ...premiumTheme.colors.shadows.medium,
  },
  barreGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barreIcon: {
    fontSize: 24,
    marginBottom: premiumTheme.spacing.xs,
  },
  barreLabel: {
    fontSize: premiumTheme.typography.fontSize.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  helperText: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: premiumTheme.colors.ui.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: premiumTheme.spacing.md,
  },
});

export default SmartNumberGrid;
