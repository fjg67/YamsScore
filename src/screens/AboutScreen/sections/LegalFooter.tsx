import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { haptics } from '../../../utils/haptics';

const LegalFooter = () => {
  const navigation = useNavigation();

  const handleLinkPress = (linkId: string, url: string) => {
    haptics.light();

    if (linkId === 'privacy') {
      // Navigate to in-app privacy policy screen
      navigation.navigate('PrivacyPolicy' as never);
    } else {
      // Open external URL for other links
      // Linking.openURL(url);
    }
  };

  const links = [
    {
      id: 'privacy',
      icon: '🔒',
      text: 'Politique de confidentialité',
      url: 'https://yamsscore.app/privacy',
    },
    {
      id: 'terms',
      icon: '📄',
      text: 'Conditions d\'utilisation',
      url: 'https://yamsscore.app/terms',
    },
    {
      id: 'licenses',
      icon: '⚖️',
      text: 'Licences open source',
      url: 'https://yamsscore.app/licenses',
    },
    {
      id: 'contact',
      icon: '✉️',
      text: 'Nous contacter',
      url: 'mailto:contact@yamsscore.app',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.linksContainer}>
        {links.map((link) => (
          <TouchableOpacity
            key={link.id}
            style={styles.linkItem}
            activeOpacity={0.7}
            onPress={() => handleLinkPress(link.id, link.url)}
          >
            <Text style={styles.linkIcon}>{link.icon}</Text>
            <Text style={styles.linkText}>{link.text}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.creditsContainer}>
        <Text style={styles.credits}>Fait avec ❤️ en France 🇫🇷</Text>
        <Text style={styles.version}>Version 1.0.0 • Build 2025.10.20</Text>
        <Text style={styles.copyright}>
          © 2025 Yams Score. Tous droits réservés.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  linksContainer: {
    gap: 12,
    marginBottom: 32,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  linkIcon: {
    fontSize: 20,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  arrow: {
    fontSize: 24,
    color: '#CCCCCC',
  },
  creditsContainer: {
    alignItems: 'center',
    gap: 8,
  },
  credits: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  version: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  copyright: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LegalFooter;
