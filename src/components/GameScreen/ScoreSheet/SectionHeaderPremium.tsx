/**
 * Header de section premium avec gradient et icône
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../../theme/premiumTheme';

interface SectionHeaderPremiumProps {
  title: string;
  icon: string;
  description: string;
  gradient: [string, string];
}

const SectionHeaderPremium: React.FC<SectionHeaderPremiumProps> = ({
  title,
  icon,
  description,
  gradient,
}) => {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Icon */}
        <Text style={styles.icon}>{icon}</Text>

        {/* Text container */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: premiumTheme.sizes.sectionHeader.height,
    borderRadius: premiumTheme.borderRadius.lg,
    marginHorizontal: premiumTheme.spacing.md,
    marginVertical: premiumTheme.spacing.sm,
    ...premiumTheme.colors.shadows.medium,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: premiumTheme.spacing.md,
  },
  icon: {
    fontSize: 24,
    marginRight: premiumTheme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: premiumTheme.typography.fontSize.base,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});

export default SectionHeaderPremium;
