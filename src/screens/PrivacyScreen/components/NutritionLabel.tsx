import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface LabelSection {
  category: string;
  icon: string;
  items: Array<{
    type: string;
    examples?: string;
    purpose?: string;
    optional?: boolean;
    emphasis?: boolean;
  }>;
}

const LABEL_SECTIONS: LabelSection[] = [
  {
    category: 'Données Utilisées Pour Te Suivre',
    icon: '🎯',
    items: [
      {
        type: 'AUCUNE',
        emphasis: true,
      },
    ],
  },
  {
    category: 'Données Liées à Toi',
    icon: '👤',
    items: [
      {
        type: 'Contenu Utilisateur',
        examples: 'Scores de parties, préférences',
        purpose: 'Fonctionnalités App',
        optional: false,
      },
    ],
  },
  {
    category: 'Données Non Liées à Toi',
    icon: '📊',
    items: [
      {
        type: 'Diagnostics',
        examples: 'Rapports de crash, performance',
        purpose: 'Amélioration App',
        optional: true,
      },
    ],
  },
];

export const NutritionLabel: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Nutrition Label</Text>
        <Text style={styles.headerIcon}>🏷️</Text>
      </View>
      <Text style={styles.subtitle}>Style Apple App Store</Text>

      <View style={styles.label}>
        {LABEL_SECTIONS.map((section, index) => (
          <View key={index}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>{section.category}</Text>
            </View>

            {section.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={[
                  styles.item,
                  item.emphasis && styles.emphasisItem,
                ]}>
                <View style={styles.itemHeader}>
                  <Text
                    style={[
                      styles.itemType,
                      item.emphasis && styles.emphasisText,
                    ]}>
                    {item.type}
                  </Text>
                  {item.optional !== undefined && (
                    <View
                      style={[
                        styles.optionalBadge,
                        !item.optional && styles.requiredBadge,
                      ]}>
                      <Text
                        style={[
                          styles.badgeText,
                          !item.optional && styles.requiredBadgeText,
                        ]}>
                        {item.optional ? 'Optionnel' : 'Requis'}
                      </Text>
                    </View>
                  )}
                </View>

                {item.examples && (
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Exemples :</Text>
                    <Text style={styles.detailValue}>{item.examples}</Text>
                  </View>
                )}

                {item.purpose && (
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Utilisation :</Text>
                    <Text style={styles.detailValue}>{item.purpose}</Text>
                  </View>
                )}
              </View>
            ))}

            {index < LABEL_SECTIONS.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✅ Certifié conforme aux standards Apple Privacy
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
  },
  label: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  item: {
    padding: 16,
  },
  emphasisItem: {
    backgroundColor: 'rgba(80,200,120,0.05)',
    borderLeftWidth: 4,
    borderLeftColor: '#50C878',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemType: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  emphasisText: {
    color: '#50C878',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionalBadge: {
    backgroundColor: 'rgba(243,156,18,0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  requiredBadge: {
    backgroundColor: 'rgba(74,144,226,0.1)',
  },
  badgeText: {
    fontFamily: 'SF Pro Text',
    fontSize: 11,
    fontWeight: '600',
    color: '#F39C12',
  },
  requiredBadgeText: {
    color: '#4A90E2',
  },
  detail: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detailLabel: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#999999',
    marginRight: 6,
  },
  detailValue: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  footer: {
    backgroundColor: 'rgba(80,200,120,0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  footerText: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#50C878',
    textAlign: 'center',
    fontWeight: '600',
  },
});
