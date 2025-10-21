/**
 * Étape 6: Preview & Publication
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { haptics } from '../../../../utils/haptics';
import { categories } from '../../data/suggestions';
import type { Category } from '../../data/suggestions';

interface Props {
  category: string;
  title: string;
  description: string;
  hasImage: boolean;
  audience: string;
  frequency: number;
  importance: number;
  onEdit: (step: number) => void;
  onAcceptTermsChange: (accepted: boolean) => void;
  termsAccepted: boolean;
  isDarkMode?: boolean;
}

export const Step6Preview: React.FC<Props> = ({
  category,
  title,
  description,
  hasImage,
  audience,
  frequency,
  importance,
  onEdit,
  onAcceptTermsChange,
  termsAccepted,
  isDarkMode = false,
}) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const cardBgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const categoryData = categories.find((c: Category) => c.id === category);
  const audienceLabels: { [key: string]: string } = {
    all: 'Tout le monde',
    casual: 'Joueurs occasionnels',
    expert: 'Joueurs experts',
    creator: 'Créateurs de contenu',
  };

  const handleToggleTerms = () => {
    haptics.light();
    onAcceptTermsChange(!termsAccepted);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          👁️ Aperçu final
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          Vérifiez votre suggestion avant publication
        </Text>
      </View>

      {/* Preview Card */}
      <View style={[styles.previewCard, { backgroundColor: cardBgColor }]}>
        {/* Category Badge */}
        {categoryData && (
          <View style={styles.categoryHeader}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: isDarkMode ? '#3A3A3A' : '#F0F0F0' },
              ]}
            >
              <Text style={styles.categoryIcon}>{categoryData.icon}</Text>
              <Text style={[styles.categoryName, { color: textColor }]}>
                {categoryData.title}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                haptics.light();
                onEdit(1);
              }}
            >
              <Text style={styles.editText}>✏️ Modifier</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Title */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: subtextColor }]}>
              Titre
            </Text>
            <TouchableOpacity
              onPress={() => {
                haptics.light();
                onEdit(2);
              }}
            >
              <Text style={styles.editLink}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.previewTitle, { color: textColor }]}>
            {title || 'Sans titre'}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: subtextColor }]}>
              Description
            </Text>
            <TouchableOpacity
              onPress={() => {
                haptics.light();
                onEdit(2);
              }}
            >
              <Text style={styles.editLink}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.previewDescription, { color: textColor }]}>
            {description || 'Aucune description'}
          </Text>
        </View>

        {/* Image */}
        {hasImage && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: subtextColor }]}>
                Image
              </Text>
              <TouchableOpacity
                onPress={() => {
                  haptics.light();
                  onEdit(3);
                }}
              >
                <Text style={styles.editLink}>Modifier</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.imagePlaceholder, { borderColor }]}>
              <Text style={styles.imagePlaceholderIcon}>🖼️</Text>
              <Text style={[styles.imagePlaceholderText, { color: subtextColor }]}>
                Image ajoutée
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Impact Summary */}
      <View style={[styles.impactCard, { backgroundColor: cardBgColor }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            🎯 Évaluation d'impact
          </Text>
          <TouchableOpacity
            onPress={() => {
              haptics.light();
              onEdit(4);
            }}
          >
            <Text style={styles.editLink}>Modifier</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.impactGrid}>
          {/* Audience */}
          <View style={styles.impactItem}>
            <Text style={[styles.impactLabel, { color: subtextColor }]}>
              Audience
            </Text>
            <Text style={[styles.impactValue, { color: textColor }]}>
              {audienceLabels[audience] || 'Non défini'}
            </Text>
          </View>

          {/* Frequency */}
          <View style={styles.impactItem}>
            <Text style={[styles.impactLabel, { color: subtextColor }]}>
              Fréquence
            </Text>
            <View style={styles.dotsContainer}>
              {[1, 2, 3, 4, 5].map(value => (
                <View
                  key={value}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        frequency >= value ? '#4A90E2' : isDarkMode ? '#3A3A3A' : '#E0E0E0',
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Importance */}
          <View style={styles.impactItem}>
            <Text style={[styles.impactLabel, { color: subtextColor }]}>
              Importance
            </Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(value => (
                <Text key={value} style={styles.starSmall}>
                  {importance >= value ? '⭐' : '☆'}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Stats Estimation */}
      <View style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1A2A3A' : '#E3F2FD' }]}>
        <Text style={[styles.statsTitle, { color: isDarkMode ? '#4A90E2' : '#1976D2' }]}>
          📊 Estimation de popularité
        </Text>
        <Text style={[styles.statsText, { color: subtextColor }]}>
          Votre suggestion pourrait recevoir environ{' '}
          <Text style={[styles.statsBold, { color: textColor }]}>
            {Math.round(importance * frequency * 10)} votes
          </Text>
          {' '}dans les 30 premiers jours
        </Text>
      </View>

      {/* Terms */}
      <TouchableOpacity
        style={[styles.termsContainer, { borderColor }]}
        onPress={handleToggleTerms}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: termsAccepted ? '#4A90E2' : 'transparent',
              borderColor: termsAccepted ? '#4A90E2' : borderColor,
            },
          ]}
        >
          {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.termsText, { color: textColor }]}>
          J'accepte que ma suggestion soit publique et puisse être commentée par la communauté
        </Text>
      </TouchableOpacity>

      {/* Info Cards */}
      <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#2A3A1A' : '#E8F5E9' }]}>
        <Text style={styles.infoIcon}>✅</Text>
        <Text style={[styles.infoText, { color: isDarkMode ? '#10B981' : '#059669' }]}>
          Votre suggestion sera visible immédiatement après publication
        </Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#3A2A1A' : '#FFF3E0' }]}>
        <Text style={styles.infoIcon}>🏆</Text>
        <Text style={[styles.infoText, { color: isDarkMode ? '#FFA500' : '#F57C00' }]}>
          Vous gagnerez +50 XP pour votre première suggestion !
        </Text>
      </View>

      <View style={[styles.bottomInfo, { backgroundColor: cardBgColor, borderColor }]}>
        <Text style={[styles.bottomInfoText, { color: subtextColor }]}>
          💡 Les suggestions avec plus de 100 votes sont automatiquement étudiées par l'équipe
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    padding: 4,
  },
  editText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editLink: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  previewDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  imagePlaceholder: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
  },
  impactCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  impactGrid: {
    marginTop: 16,
    gap: 16,
  },
  impactItem: {
    gap: 8,
  },
  impactLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  impactValue: {
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  starSmall: {
    fontSize: 20,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsBold: {
    fontWeight: 'bold',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  bottomInfo: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  bottomInfoText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
