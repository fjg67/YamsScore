/**
 * Footer Premium avec Social Proof
 * Avis, stats et navigation
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PremiumFooterProps {
  rating?: number;
  userCount?: string;
  onSettingsPress: () => void;
  onHelpPress: () => void;
  onAboutPress: () => void;
  isDarkMode?: boolean;
}

export const PremiumFooter: React.FC<PremiumFooterProps> = ({
  rating = 4.9,
  userCount = '10K+',
  onSettingsPress,
  onHelpPress,
  onAboutPress,
  isDarkMode = false,
}) => {
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  const highlightColor = isDarkMode ? '#5DADE2' : '#4A90E2';

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < fullStars ? '⭐' : '☆'}
        </Text>
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Social Proof */}
      <View style={styles.socialProof}>
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>{renderStars()}</View>
          <Text style={[styles.ratingText, { color: textColor }]}>
            {rating}/5.0
          </Text>
        </View>

        <Text style={[styles.testimonial, { color: textColor }]}>
          "Meilleure app de Yams !" 🎉
        </Text>

        <Text style={[styles.userCount, { color: highlightColor }]}>
          Rejoignez {userCount} joueurs
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: textColor }]} />

      {/* Navigation Links */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={onSettingsPress}
          accessible={true}
          accessibilityLabel="Paramètres"
          accessibilityRole="button"
        >
          <View style={styles.navButton}>
            <Text style={styles.navIcon}>⚙️</Text>
            <Text style={[styles.navText, { color: textColor }]}>Paramètres</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.navDivider, { backgroundColor: textColor }]} />

        <TouchableOpacity
          onPress={onHelpPress}
          accessible={true}
          accessibilityLabel="Aide"
          accessibilityRole="button"
        >
          <View style={styles.navButton}>
            <Text style={styles.navIcon}>❓</Text>
            <Text style={[styles.navText, { color: textColor }]}>Aide</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.navDivider, { backgroundColor: textColor }]} />

        <TouchableOpacity
          onPress={onAboutPress}
          accessible={true}
          accessibilityLabel="À propos"
          accessibilityRole="button"
        >
          <View style={styles.navButton}>
            <Text style={styles.navIcon}>ℹ️</Text>
            <Text style={[styles.navText, { color: textColor }]}>À propos</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={[styles.version, { color: textColor }]}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  socialProof: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  testimonial: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  userCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    width: '60%',
    height: 1,
    opacity: 0.2,
    marginBottom: 16,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  navText: {
    fontSize: 13,
    fontWeight: '500',
  },
  navDivider: {
    width: 1,
    height: 16,
    opacity: 0.3,
  },
  version: {
    fontSize: 11,
    opacity: 0.5,
  },
});
