import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {haptics} from '../../../utils/haptics';

interface Right {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  timeframe: string;
}

export const RightsCard: React.FC = () => {
  const handleExport = () => {
    haptics.light();
    // Action gérée par PrivacyControls
    console.log('Export data');
  };

  const handleEdit = () => {
    haptics.light();
    // Navigate to profile
    console.log('Edit profile');
  };

  const handleDelete = () => {
    haptics.light();
    // Action gérée par PrivacyControls
    console.log('Delete data');
  };

  const handleDownload = () => {
    haptics.light();
    // Export JSON
    console.log('Download JSON');
  };

  const handleManagePreferences = () => {
    haptics.light();
    // Scroll to controls
    console.log('Manage preferences');
  };

  const handleContact = () => {
    haptics.light();
    Linking.openURL('mailto:privacy@yams-score.app');
  };

  const rights: Right[] = [
    {
      icon: '👁️',
      title: 'Droit d\'Accès',
      description: 'Voir toutes les données qu\'on a sur toi',
      buttonText: 'Exporter',
      buttonAction: handleExport,
      timeframe: 'Instantané',
    },
    {
      icon: '✏️',
      title: 'Droit de Rectification',
      description: 'Corriger des données incorrectes',
      buttonText: 'Modifier',
      buttonAction: handleEdit,
      timeframe: 'Instantané',
    },
    {
      icon: '🗑️',
      title: 'Droit à l\'Effacement',
      description: 'Supprimer toutes tes données',
      buttonText: 'Supprimer',
      buttonAction: handleDelete,
      timeframe: 'Immédiat (48h backup)',
    },
    {
      icon: '📦',
      title: 'Droit à la Portabilité',
      description: 'Récupérer tes données en JSON',
      buttonText: 'Télécharger',
      buttonAction: handleDownload,
      timeframe: 'Instantané',
    },
    {
      icon: '🚫',
      title: 'Droit d\'Opposition',
      description: 'Refuser le traitement de certaines données',
      buttonText: 'Gérer',
      buttonAction: handleManagePreferences,
      timeframe: 'Instantané',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tes Droits (RGPD)</Text>
        <Text style={styles.headerIcon}>⚖️</Text>
      </View>
      <Text style={styles.subtitle}>Ce que tu peux faire</Text>

      <View style={styles.rightsContainer}>
        {rights.map((right, index) => (
          <View key={index} style={styles.rightCard}>
            <View style={styles.rightHeader}>
              <Text style={styles.rightIcon}>{right.icon}</Text>
              <View style={styles.rightContent}>
                <Text style={styles.rightTitle}>{right.title}</Text>
                <Text style={styles.rightDescription}>
                  {right.description}
                </Text>
                <View style={styles.timeframeContainer}>
                  <Text style={styles.timeframeIcon}>⏱️</Text>
                  <Text style={styles.timeframeText}>{right.timeframe}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={right.buttonAction}
              activeOpacity={0.7}>
              <Text style={styles.actionButtonText}>{right.buttonText}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>Besoin d'aide avec tes droits ?</Text>
        <Text style={styles.contactEmail}>privacy@yams-score.app</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContact}
          activeOpacity={0.7}>
          <Text style={styles.contactButtonText}>Nous Contacter</Text>
        </TouchableOpacity>
        <Text style={styles.responseTime}>⚡ Réponse sous 72h</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerIcon: {
    fontSize: 28,
  },
  subtitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  rightsContainer: {
    gap: 12,
  },
  rightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  rightIcon: {
    fontSize: 32,
  },
  rightContent: {
    flex: 1,
  },
  rightTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  rightDescription: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeframeIcon: {
    fontSize: 12,
  },
  timeframeText: {
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    color: '#50C878',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactCard: {
    backgroundColor: 'rgba(74,144,226,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(74,144,226,0.3)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  contactTitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactEmail: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 12,
  },
  contactButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  responseTime: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#50C878',
    fontWeight: '600',
  },
});
