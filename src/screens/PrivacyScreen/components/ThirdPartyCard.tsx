import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';

interface ThirdPartyService {
  id: string;
  name: string;
  logo: string;
  purpose: string;
  whatTheySee: string[];
  privacyUrl: string;
  optOut?: {
    possible: boolean;
    method: string;
  };
}

const SERVICES: ThirdPartyService[] = [
  {
    id: 'firebase',
    name: 'Google Firebase',
    logo: '🔥',
    purpose: 'Backend & Analytics',
    whatTheySee: [
      '✅ Événements anonymisés (ex: "partie créée")',
      '✅ Device ID anonyme',
      '✅ Crashes et erreurs',
      '❌ PAS ton nom',
      '❌ PAS tes scores',
    ],
    privacyUrl: 'https://firebase.google.com/support/privacy',
    optOut: {
      possible: true,
      method: 'Toggle "Analytics" ci-dessus',
    },
  },
];

export const ThirdPartyCard: React.FC = () => {
  const openPrivacyPolicy = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services Tiers</Text>
        <Text style={styles.headerIcon}>🤝</Text>
      </View>
      <Text style={styles.subtitle}>
        Qui d'autre voit tes données ? Voici exactement ce qu'ils voient :
      </Text>

      {SERVICES.map(service => (
        <View key={service.id} style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceLogo}>{service.logo}</Text>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePurpose}>{service.purpose}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ce qu'ils voient :</Text>
            {service.whatTheySee.map((item, index) => (
              <View key={index} style={styles.item}>
                <Text
                  style={[
                    styles.itemText,
                    item.startsWith('❌') && styles.itemStrikethrough,
                  ]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {service.optOut && (
            <View style={styles.optOutSection}>
              <Text style={styles.optOutLabel}>Opt-out :</Text>
              <Text style={styles.optOutMethod}>{service.optOut.method}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.privacyButton}
            onPress={() => openPrivacyPolicy(service.privacyUrl)}
            activeOpacity={0.7}>
            <Text style={styles.privacyButtonText}>
              Voir leur politique de confidentialité
            </Text>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.guarantee}>
        <Text style={styles.guaranteeText}>
          🔒 Aucun de ces services ne vend tes données à des tiers
        </Text>
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
    lineHeight: 24,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  serviceLogo: {
    fontSize: 40,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  servicePurpose: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  item: {
    marginBottom: 6,
  },
  itemText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  itemStrikethrough: {
    textDecorationLine: 'line-through',
    color: '#FF6B6B',
  },
  optOutSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(74,144,226,0.05)',
    borderRadius: 8,
  },
  optOutLabel: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  optOutMethod: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  privacyButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#4A90E2',
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: '#4A90E2',
  },
  guarantee: {
    backgroundColor: 'rgba(80,200,120,0.1)',
    borderWidth: 2,
    borderColor: '#50C878',
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  guaranteeText: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
});
