/**
 * About Section Premium
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Share,
} from 'react-native';
import SettingCard from '../components/SettingCard';
import { haptics } from '../../../utils/haptics';
import { handleLogoTap, handleVersionTap } from '../utils/easterEggs';

const APP_VERSION = '1.0.0';
const APP_STORE_URL = 'https://apps.apple.com/app/yams-score/id123456789';

interface InfoItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    color: string;
  };
  onPress?: () => void;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      haptics.light();
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badge.color }]}>
          <Text style={styles.badgeText}>{badge.text}</Text>
        </View>
      )}
      {onPress && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
};

const AboutSection: React.FC = () => {
  const handleRateApp = () => {
    Linking.openURL(APP_STORE_URL);
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Découvre Yams Score, la meilleure app pour jouer au Yams ! 🎲 ' +
          APP_STORE_URL,
        title: 'Yams Score',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleWhatsNew = () => {
    Alert.alert(
      'Nouveautés v1.0.0',
      '• Écran de paramètres premium\n' +
        '• Personnalisation du thème\n' +
        '• Nouvelles animations\n' +
        '• Améliorations de performance'
    );
  };

  const handleRoadmap = () => {
    Alert.alert(
      'Roadmap',
      'À venir :\n' +
        '• Mode multijoueur en ligne\n' +
        '• Statistiques avancées\n' +
        '• Système d\'achievements\n' +
        '• Thèmes personnalisés'
    );
  };

  

 
  const handleLicenses = () => {
    Alert.alert('Licences open source', 'Fonctionnalité à venir');
  };

  return (
    <SettingCard>
      {/* Header avec Logo et Version */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={handleLogoTap}
          activeOpacity={0.8}
        >
          <Text style={styles.logoEmoji}>🎲</Text>
        </TouchableOpacity>
        <Text style={styles.appName}>Yams Score</Text>
        <TouchableOpacity onPress={handleVersionTap} activeOpacity={0.8}>
          <Text style={styles.version}>Version {APP_VERSION}</Text>
        </TouchableOpacity>
        <Text style={styles.tagline}>
          Feuille de marque digitale pour le jeu de Yams
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statValue}>10K+</Text>
          <Text style={styles.statLabel}>Joueurs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>Note</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🎲</Text>
          <Text style={styles.statValue}>50K+</Text>
          <Text style={styles.statLabel}>Parties</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Rate App - Prominent */}
      <TouchableOpacity
        style={styles.rateButton}
        onPress={handleRateApp}
        activeOpacity={0.8}
      >
        <Text style={styles.rateEmoji}>⭐⭐⭐⭐⭐</Text>
        <Text style={styles.rateText}>Note l'app sur l'App Store</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Other Info Items */}
      <InfoItem
        icon="📤"
        title="Partager l'app"
        subtitle="Invite tes amis à jouer"
        onPress={handleShareApp}
      />

      <InfoItem
        icon="🆕"
        title="Nouveautés"
        subtitle="Voir les dernières mises à jour"
        onPress={handleWhatsNew}
      />

      <InfoItem
        icon="🗺️"
        title="Roadmap"
        subtitle="Fonctionnalités à venir"
        onPress={handleRoadmap}
      />

     



      <InfoItem
        icon="⚖️"
        title="Licences open source"
        onPress={handleLicenses}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.credits}>
          Fait avec ❤️ par l'équipe Yams Score
        </Text>
      </View>
    </SettingCard>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 16,
  },
  version: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  rateButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  rateEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  arrow: {
    fontSize: 24,
    color: '#CCCCCC',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  credits: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
  },
});

export default AboutSection;
