/**
 * Étape 4: Impact & Priorité
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { haptics } from '../../../../utils/haptics';

interface Props {
  audience: string;
  frequency: number;
  importance: number;
  onChangeAudience: (value: string) => void;
  onChangeFrequency: (value: number) => void;
  onChangeImportance: (value: number) => void;
  isDarkMode?: boolean;
}

export const Step4Impact: React.FC<Props> = ({
  audience,
  frequency,
  importance,
  onChangeAudience,
  onChangeFrequency,
  onChangeImportance,
  isDarkMode = false,
}) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';

  const audiences = [
    { id: 'all', label: 'Tout le monde', icon: '👥' },
    { id: 'casual', label: 'Joueurs occasionnels', icon: '🎮' },
    { id: 'expert', label: 'Joueurs experts', icon: '🏆' },
    { id: 'creator', label: 'Créateurs de contenu', icon: '🎬' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          🎯 Estimez l'impact
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          Aidez-nous à prioriser votre suggestion
        </Text>
      </View>

      {/* Audience */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Pour qui est-ce utile ?
        </Text>
        <View style={styles.options}>
          {audiences.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.option,
                {
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F8F8',
                  borderColor: audience === item.id ? '#4A90E2' : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => {
                haptics.light();
                onChangeAudience(item.id);
              }}
            >
              <Text style={styles.optionIcon}>{item.icon}</Text>
              <Text style={[styles.optionLabel, { color: textColor }]}>
                {item.label}
              </Text>
              {audience === item.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Frequency */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Fréquence d'utilisation ?
        </Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, { color: subtextColor }]}>Rare</Text>
            <Text style={[styles.sliderLabel, { color: subtextColor }]}>Quotidien</Text>
          </View>
          <View style={styles.slider}>
            {[1, 2, 3, 4, 5].map(value => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.sliderDot,
                  {
                    backgroundColor:
                      frequency >= value ? '#4A90E2' : isDarkMode ? '#3A3A3A' : '#E0E0E0',
                  },
                ]}
                onPress={() => {
                  haptics.light();
                  onChangeFrequency(value);
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Importance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Importance pour vous ?
        </Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map(value => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                haptics.light();
                onChangeImportance(value);
              }}
            >
              <Text style={styles.star}>
                {importance >= value ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 20,
    color: '#4A90E2',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 14,
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 40,
  },
});
