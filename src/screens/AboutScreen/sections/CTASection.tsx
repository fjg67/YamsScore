import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import { haptics } from '../../../utils/haptics';

const CTASection = () => {
  const handleRate = async () => {
    haptics.medium();
    // Open App Store review page
    const appStoreUrl = 'https://apps.apple.com/app/id1234567890?action=write-review';
    // await Linking.openURL(appStoreUrl);
  };

  const handleShare = async () => {
    haptics.light();
    try {
      await Share.open({
        message: 'Découvre Yams Score, la meilleure app pour jouer au Yams ! 🎲',
        url: 'https://yamsscore.app',
      });
    } catch (error) {
      // User cancelled share
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={handleRate}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.ctaCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.emoji}>⭐</Text>
          <Text style={styles.title}>Tu adores l'app ?</Text>
          <Text style={styles.description}>
            Laisse 5 étoiles sur l'App Store !
          </Text>
          <View style={styles.rateButton}>
            <Text style={styles.rateButtonText}>⭐ Noter l'app ⭐</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.9} onPress={handleShare}>
        <LinearGradient
          colors={['#4A90E2', '#5DADE2']}
          style={styles.ctaCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.emoji}>📤</Text>
          <Text style={styles.title}>Partage avec tes amis</Text>
          <Text style={styles.description}>
            Plus on est, plus c'est fun !
          </Text>
          <View style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Partager l'app</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  ctaCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rateButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  rateButtonText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  shareButtonText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default CTASection;
