/**
 * Selector Setting Component (Segmented Control Style)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { haptics } from '../../../utils/haptics';

export interface SelectorOption<T = string> {
  id: T;
  label: string;
  icon?: string;
}

interface SelectorSettingProps<T = string> {
  icon: string;
  title: string;
  description?: string;
  options: SelectorOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  disabled?: boolean;
}

function SelectorSetting<T extends string = string>({
  icon,
  title,
  description,
  options,
  value,
  onValueChange,
  disabled = false,
}: SelectorSettingProps<T>) {
  const handleSelect = (optionId: T) => {
    if (!disabled && optionId !== value) {
      haptics.light();
      onValueChange(optionId);
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>

      <View style={styles.segmentedControl}>
        {options.map((option, index) => {
          const isSelected = option.id === value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          return (
            <TouchableOpacity
              key={String(option.id)}
              onPress={() => handleSelect(option.id)}
              style={[
                styles.segment,
                isSelected && styles.segmentActive,
                isFirst && styles.segmentFirst,
                isLast && styles.segmentLast,
              ]}
              activeOpacity={0.7}
              disabled={disabled}
            >
              {option.icon && (
                <Text style={styles.segmentIcon}>{option.icon}</Text>
              )}
              <Text
                style={[
                  styles.segmentLabel,
                  isSelected && styles.segmentLabelActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  disabled: {
    opacity: 0.5,
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
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 2,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  segmentFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  segmentLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentIcon: {
    fontSize: 14,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  segmentLabelActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
});

export default SelectorSetting;
