/**
 * Liens de navigation secondaire du footer
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FooterLinksProps {
  onRulesPress: () => void;
  onSettingsPress: () => void;
  onAboutPress: () => void;
  textColor?: string;
}

export const FooterLinks: React.FC<FooterLinksProps> = ({
  onRulesPress,
  onSettingsPress,
  onAboutPress,
  textColor = '#7F8C8D',
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onRulesPress}
        accessible={true}
        accessibilityLabel="Règles du jeu"
        accessibilityRole="button"
      >
        <Text style={[styles.linkText, { color: textColor }]}>Règles du jeu</Text>
      </TouchableOpacity>

      <Text style={[styles.separator, { color: textColor }]}>•</Text>

      <TouchableOpacity
        onPress={onSettingsPress}
        accessible={true}
        accessibilityLabel="Paramètres"
        accessibilityRole="button"
      >
        <Text style={[styles.linkText, { color: textColor }]}>Paramètres</Text>
      </TouchableOpacity>

      <Text style={[styles.separator, { color: textColor }]}>•</Text>

      <TouchableOpacity
        onPress={onAboutPress}
        accessible={true}
        accessibilityLabel="À propos"
        accessibilityRole="button"
      >
        <Text style={[styles.linkText, { color: textColor }]}>À propos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '400',
  },
  separator: {
    fontSize: 14,
    marginHorizontal: 12,
  },
});
