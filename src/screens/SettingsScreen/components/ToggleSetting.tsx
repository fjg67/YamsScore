/**
 * Toggle Setting Component
 */

import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { haptics } from '../../../utils/haptics';

interface ToggleSettingProps {
  icon: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  color?: string;
  disabled?: boolean;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  color = '#4A90E2',
  disabled = false,
}) => {
  const handleToggle = (newValue: boolean) => {
    if (!disabled) {
      haptics.light();
      onValueChange(newValue);
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.leftContent}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={handleToggle}
        trackColor={{ false: '#E8E8E8', true: color }}
        thumbColor="#FFFFFF"
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  disabled: {
    opacity: 0.5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
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
});

export default ToggleSetting;
