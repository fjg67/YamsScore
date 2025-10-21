/**
 * Bouton tertiaire avec fond léger
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
} from 'react-native';

interface TertiaryButtonProps {
  title: string;
  icon?: string;
  onPress: () => void;
  badge?: string;
  testID?: string;
  disabled?: boolean;
  isDarkMode?: boolean;
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
  title,
  icon,
  onPress,
  badge,
  testID,
  disabled = false,
  isDarkMode = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = isDarkMode ? '#2A2A2A' : '#F8F9FA';
  const textColor = isDarkMode ? '#ECEFF1' : '#2C3E50';
  const badgeColor = '#7F8C8D';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }, disabled && styles.disabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={testID}
        disabled={disabled}
        accessible={true}
        accessibilityLabel={title}
        accessibilityRole="button"
      >
        <View style={styles.content}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </View>
        {badge && (
          <Text style={[styles.badge, { color: badgeColor }]}>{badge}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    fontSize: 14,
    fontWeight: '500',
  },
});
