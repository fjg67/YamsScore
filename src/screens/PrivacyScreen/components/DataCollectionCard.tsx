import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';

interface DataItem {
  name: string;
  icon: string;
  what: string;
  why: string;
  stored: string;
  deletable?: boolean;
  examples?: string[];
  retention?: string;
}

interface DataCategory {
  id: string;
  type: 'essential' | 'analytics' | 'never';
  title: string;
  badge: string;
  badgeColor: string;
  background: string;
  borderColor: string;
  icon: string;
  iconBackground: string;
  items: DataItem[];
  toggleable?: boolean;
  locked?: boolean;
  tooltip?: string;
  impact?: string;
}

const DATA_CATEGORIES: DataCategory[] = [
  {
    id: 'essential',
    type: 'essential',
    title: 'Données Essentielles',
    badge: 'Nécessaire',
    badgeColor: '#50C878',
    background: 'rgba(80,200,120,0.05)',
    borderColor: 'rgba(80,200,120,0.3)',
    icon: '✅',
    iconBackground: '#50C878',
    locked: true,
    tooltip: 'Requis pour le fonctionnement de l\'app',
    items: [
      {
        name: 'Historique des parties',
        icon: '🎲',
        what: 'Scores, dates, nombre de joueurs',
        why: 'Pour afficher ton historique et tes stats',
        stored: 'Sur ton appareil uniquement',
        deletable: true,
      },
      {
        name: 'Préférences',
        icon: '⚙️',
        what: 'Thème, son, vibrations',
        why: 'Pour personnaliser ton expérience',
        stored: 'Local (AsyncStorage)',
        deletable: true,
      },
    ],
  },
  {
    id: 'analytics',
    type: 'analytics',
    title: 'Analytics (Optionnel)',
    badge: 'Tu choisis',
    badgeColor: '#4A90E2',
    background: 'rgba(74,144,226,0.05)',
    borderColor: 'rgba(74,144,226,0.3)',
    icon: '📊',
    iconBackground: '#4A90E2',
    toggleable: true,
    impact: 'L\'app fonctionnera normalement, mais on ne pourra pas améliorer ton expérience',
    items: [
      {
        name: 'Événements d\'usage',
        icon: '👆',
        what: 'Boutons cliqués, écrans visités',
        why: 'Pour améliorer l\'app et corriger les bugs',
        stored: 'Anonymisé (Firebase Analytics)',
        examples: [
          '✅ "Bouton Nouvelle Partie cliqué"',
          '✅ "Écran Règles ouvert"',
          '❌ PAS ton nom ou email',
          '❌ PAS tes scores exacts',
        ],
      },
      {
        name: 'Rapports de crash',
        icon: '🐛',
        what: 'Logs techniques si l\'app plante',
        why: 'Pour identifier et corriger les bugs',
        stored: 'Crashlytics',
        retention: '90 jours',
      },
    ],
  },
  {
    id: 'never',
    type: 'never',
    title: 'Ce Qu\'On Ne Collecte JAMAIS',
    badge: 'Garanti',
    badgeColor: '#FF6B6B',
    background: 'rgba(255,107,107,0.05)',
    borderColor: 'rgba(255,107,107,0.3)',
    icon: '🚫',
    iconBackground: '#FF6B6B',
    items: [
      {name: 'Adresse email', icon: '📧', what: '', why: '', stored: ''},
      {name: 'Numéro de téléphone', icon: '📱', what: '', why: '', stored: ''},
      {name: 'Localisation GPS', icon: '📍', what: '', why: '', stored: ''},
      {name: 'Photos ou caméra', icon: '📷', what: '', why: '', stored: ''},
      {name: 'Micro ou audio', icon: '🎤', what: '', why: '', stored: ''},
      {name: 'Contacts', icon: '📇', what: '', why: '', stored: ''},
      {name: 'Infos bancaires', icon: '💳', what: '', why: '', stored: ''},
    ],
  },
];

interface CategoryCardProps {
  category: DataCategory;
  onToggle?: (enabled: boolean) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({category, onToggle}) => {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    onToggle?.(value);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: category.background,
          borderColor: category.borderColor,
        },
      ]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: category.iconBackground},
            ]}>
            <Text style={styles.cardHeaderIcon}>{category.icon}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.cardTitle}>{category.title}</Text>
            <View style={[styles.badge, {borderColor: category.badgeColor}]}>
              <Text style={[styles.badgeText, {color: category.badgeColor}]}>
                {category.badge}
              </Text>
            </View>
          </View>
        </View>
        {category.toggleable && (
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{false: '#D1D1D6', true: category.badgeColor}}
            thumbColor="#FFFFFF"
          />
        )}
        {category.locked && (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedText}>🔒</Text>
          </View>
        )}
      </View>

      {/* Items */}
      {category.type === 'never' ? (
        <View style={styles.neverItemsContainer}>
          {category.items.map((item, index) => (
            <View key={index} style={styles.neverItem}>
              <Text style={styles.neverIcon}>{item.icon}</Text>
              <Text style={styles.neverText}>{item.name}</Text>
            </View>
          ))}
          <View style={styles.emphasis}>
            <Text style={styles.emphasisText}>
              👆 Aucune de ces données n'est jamais demandée ou stockée
            </Text>
          </View>
        </View>
      ) : (
        <>
          {category.items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => setExpanded(!expanded)}
              activeOpacity={0.7}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                {expanded && (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    layout={Layout}
                    style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quoi :</Text>
                      <Text style={styles.detailValue}>{item.what}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Pourquoi :</Text>
                      <Text style={styles.detailValue}>{item.why}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Stocké :</Text>
                      <Text style={styles.detailValue}>{item.stored}</Text>
                    </View>
                    {item.examples && (
                      <View style={styles.examplesContainer}>
                        <Text style={styles.detailLabel}>Exemples :</Text>
                        {item.examples.map((example, idx) => (
                          <Text key={idx} style={styles.exampleText}>
                            {example}
                          </Text>
                        ))}
                      </View>
                    )}
                  </Animated.View>
                )}
              </View>
              <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Impact message for toggleable items */}
      {category.toggleable && !enabled && category.impact && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.impactMessage}>
          <Text style={styles.impactIcon}>ℹ️</Text>
          <Text style={styles.impactText}>{category.impact}</Text>
        </Animated.View>
      )}
    </View>
  );
};

export const DataCollectionCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ce Qu'On Collecte (et Pourquoi)</Text>
        <Text style={styles.headerIcon}>📊</Text>
      </View>
      <Text style={styles.intro}>
        Chaque donnée a un but précis. Voici la liste complète :
      </Text>

      <View style={styles.categoriesContainer}>
        {DATA_CATEGORIES.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onToggle={enabled => {
              console.log(`${category.title}: ${enabled}`);
            }}
          />
        ))}
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
    flex: 1,
  },
  headerIcon: {
    fontSize: 28,
  },
  intro: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 24,
  },
  categoriesContainer: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderIcon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'SF Pro Display',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    fontWeight: '600',
  },
  lockedBadge: {
    padding: 8,
  },
  lockedText: {
    fontSize: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  itemIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  itemDetails: {
    marginTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    minWidth: 80,
  },
  detailValue: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  examplesContainer: {
    marginTop: 4,
  },
  exampleText: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#666666',
    marginLeft: 88,
    marginTop: 2,
  },
  chevron: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  neverItemsContainer: {
    gap: 12,
  },
  neverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.6,
  },
  neverIcon: {
    fontSize: 20,
  },
  neverText: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    color: '#FF6B6B',
    textDecorationLine: 'line-through',
  },
  emphasis: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  emphasisText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    lineHeight: 20,
  },
  impactMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(102,102,102,0.1)',
    borderRadius: 8,
  },
  impactIcon: {
    fontSize: 16,
  },
  impactText: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#666666',
    flex: 1,
    lineHeight: 18,
  },
});
