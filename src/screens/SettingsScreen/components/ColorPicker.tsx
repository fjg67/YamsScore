/**
 * Color Picker Component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { haptics } from '../../../utils/haptics';
import type { AccentColor } from '../../../store/slices/settingsSlice';

interface ColorOption {
  id: AccentColor;
  name: string;
  hex: string;
  premium?: boolean;
}

const COLOR_OPTIONS: ColorOption[] = [
  { id: 'blue', name: 'Bleu', hex: '#4A90E2' },
  { id: 'green', name: 'Vert', hex: '#50C878' },
  { id: 'purple', name: 'Violet', hex: '#9B59B6' },
  { id: 'red', name: 'Rouge', hex: '#E74C3C' },
  { id: 'orange', name: 'Orange', hex: '#F39C12' },
  { id: 'pink', name: 'Rose', hex: '#E91E63' },
  { id: 'cyan', name: 'Cyan', hex: '#00BCD4' },
  { id: 'gold', name: 'Or', hex: '#FFD700', premium: true },
];

interface ColorPickerProps {
  icon: string;
  title: string;
  description?: string;
  value: AccentColor;
  onValueChange: (color: AccentColor) => void;
  userLevel?: number;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  userLevel = 1,
}) => {
  const handleColorSelect = (color: ColorOption) => {
    if (color.premium && userLevel < 5) {
      haptics.error();
      // TODO: Show premium unlock modal
      return;
    }

    if (color.id !== value) {
      haptics.light();
      onValueChange(color.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>

      <View style={styles.colorGrid}>
        {COLOR_OPTIONS.map((color) => {
          const isSelected = color.id === value;
          const isLocked = color.premium && userLevel < 5;

          return (
            <TouchableOpacity
              key={color.id}
              onPress={() => handleColorSelect(color)}
              style={[
                styles.colorButton,
                isSelected && {
                  borderColor: color.hex,
                  borderWidth: 3,
                  transform: [{ scale: 1.1 }],
                },
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: color.hex },
                ]}
              >
                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
                {isSelected && !isLocked && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  description: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 18,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ColorPicker;
