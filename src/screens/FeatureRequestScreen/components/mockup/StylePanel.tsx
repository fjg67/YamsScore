/**
 * Mockup Tool - Style Panel
 * Color picker, stroke width, opacity controls
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PRESET_COLORS, STROKE_WIDTHS } from './types';
import { haptics } from '../../../../utils/haptics';

interface Props {
  currentColor: string;
  currentStrokeWidth: number;
  currentOpacity: number;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onOpacityChange: (opacity: number) => void;
  isDarkMode?: boolean;
}

export const StylePanel: React.FC<Props> = ({
  currentColor,
  currentStrokeWidth,
  currentOpacity,
  onColorChange,
  onStrokeWidthChange,
  onOpacityChange,
  isDarkMode = false,
}) => {
  const bgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const handleColorPress = (color: string) => {
    haptics.light();
    onColorChange(color);
  };

  const handleStrokeWidthPress = (width: number) => {
    haptics.light();
    onStrokeWidthChange(width);
  };

  const handleOpacityPress = (opacity: number) => {
    haptics.light();
    onOpacityChange(opacity);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderBottomColor: borderColor }]}>
      {/* Color Picker */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>
          Color
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorsRow}
        >
          {PRESET_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                {
                  backgroundColor: color,
                  borderColor: currentColor === color ? '#4A90E2' : borderColor,
                  borderWidth: currentColor === color ? 3 : 1,
                },
              ]}
              onPress={() => handleColorPress(color)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Stroke Width */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>
          Stroke Width
        </Text>
        <View style={styles.strokeRow}>
          {STROKE_WIDTHS.map(width => (
            <TouchableOpacity
              key={width}
              style={[
                styles.strokeButton,
                {
                  borderColor: currentStrokeWidth === width ? '#4A90E2' : borderColor,
                  backgroundColor: currentStrokeWidth === width
                    ? isDarkMode
                      ? '#3A3A3A'
                      : '#F0F0F0'
                    : 'transparent',
                },
              ]}
              onPress={() => handleStrokeWidthPress(width)}
            >
              <View
                style={[
                  styles.strokePreview,
                  {
                    width,
                    height: width,
                    backgroundColor: textColor,
                    borderRadius: width / 2,
                  },
                ]}
              />
              <Text style={[styles.strokeLabel, { color: subtextColor }]}>
                {width}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Opacity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>
          Opacity
        </Text>
        <View style={styles.opacityRow}>
          {[100, 75, 50, 25].map(percent => {
            const opacity = percent / 100;
            return (
              <TouchableOpacity
                key={percent}
                style={[
                  styles.opacityButton,
                  {
                    borderColor: currentOpacity === opacity ? '#4A90E2' : borderColor,
                    backgroundColor: currentOpacity === opacity
                      ? isDarkMode
                        ? '#3A3A3A'
                        : '#F0F0F0'
                      : 'transparent',
                  },
                ]}
                onPress={() => handleOpacityPress(opacity)}
              >
                <View
                  style={[
                    styles.opacityPreview,
                    {
                      backgroundColor: currentColor,
                      opacity,
                    },
                  ]}
                />
                <Text style={[styles.opacityLabel, { color: subtextColor }]}>
                  {percent}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  strokeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  strokeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    gap: 4,
  },
  strokePreview: {
    // Dynamic styles applied inline
  },
  strokeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  opacityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  opacityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    gap: 4,
  },
  opacityPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  opacityLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
