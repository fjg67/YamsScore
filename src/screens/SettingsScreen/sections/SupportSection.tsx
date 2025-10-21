/**
 * Support & Help Section
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SettingCard from '../components/SettingCard';
import {haptics} from '../../../utils/haptics';

interface SupportItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const SupportItem: React.FC<SupportItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => {
  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const SupportSection: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleHelpCenter = () => {
    navigation.navigate('Help');
  };

  const handleRules = () => {
    Alert.alert('Règles du Yams', 'Fonctionnalité à venir');
  };

  const handleTutorial = () => {
    navigation.navigate('Tutorial');
  };

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleContact = async () => {
    try {
      const url = 'mailto:support@yams-score.app?subject=Support%20Yams%20Score';
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Email non disponible',
          'Impossible d\'ouvrir l\'application mail. Contacte-nous à : support@yams-score.app',
          [{text: 'OK', style: 'default'}]
        );
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible d\'ouvrir l\'application mail. Contacte-nous à : support@yams-score.app',
        [{text: 'OK', style: 'default'}]
      );
    }
  };

  const handleReportBug = () => {
    Alert.alert('Signaler un bug', 'Fonctionnalité à venir');
  };

  const handleFeatureRequest = () => {
    navigation.navigate('FeatureRequest');
  };

  return (
    <SettingCard title="Support & Aide 💬">
      <SupportItem
        icon="❓"
        title="Centre d'aide"
        subtitle="FAQ et guides"
        onPress={handleHelpCenter}
      />

      <SupportItem
        icon="📖"
        title="Règles du Yams"
        subtitle="Rappel des règles complètes"
        onPress={handleRules}
      />

      <SupportItem
        icon="🎓"
        title="Revoir le tutoriel"
        subtitle="Guide pas à pas"
        onPress={handleTutorial}
      />

      <SupportItem
        icon="🤝"
        title="Conditions d'utilisation"
        subtitle="Règles justes et claires"
        onPress={handleTermsOfService}
      />

      <SupportItem
        icon="🔒"
        title="Politique de confidentialité"
        subtitle="Protection de tes données"
        onPress={handlePrivacyPolicy}
      />

      <SupportItem
        icon="✉️"
        title="Nous contacter"
        subtitle="support@yams-score.app"
        onPress={handleContact}
      />

      <SupportItem
        icon="🐛"
        title="Signaler un bug"
        subtitle="Aide-nous à améliorer l'app"
        onPress={handleReportBug}
      />

      <SupportItem
        icon="💡"
        title="Suggérer une fonctionnalité"
        subtitle="Partage tes idées"
        onPress={handleFeatureRequest}
      />
    </SettingCard>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  subtitle: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: '#CCCCCC',
  },
});

export default SupportSection;
