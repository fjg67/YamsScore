import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type AIDifficulty = 'easy' | 'normal' | 'hard';

interface DifficultyOption {
  value: AIDifficulty;
  emoji: string;
  title: string;
  description: string;
  color: string;
  lightColor: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    value: 'easy',
    emoji: '🌱',
    title: 'Facile',
    description: 'IA débutante, idéale pour apprendre',
    color: '#4CAF50',
    lightColor: '#E8F5E9',
  },
  {
    value: 'normal',
    emoji: '⚡',
    title: 'Normal',
    description: 'IA équilibrée pour un bon défi',
    color: '#FF9800',
    lightColor: '#FFF3E0',
  },
  {
    value: 'hard',
    emoji: '🔥',
    title: 'Difficile',
    description: 'IA experte, très stratégique',
    color: '#F44336',
    lightColor: '#FFEBEE',
  },
];

interface AIDifficultySelectorProps {
  selected?: AIDifficulty;
  onSelect: (difficulty: AIDifficulty) => void;
}

export const AIDifficultySelector: React.FC<AIDifficultySelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez la difficulté de l'IA</Text>
      <Text style={styles.subtitle}>Sélectionnez le niveau de votre adversaire</Text>

      <View style={styles.optionsContainer}>
        {DIFFICULTIES.map((option) => {
          const isSelected = selected === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.7}
              onPress={() => onSelect(option.value)}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                { borderColor: isSelected ? option.color : '#E0E0E0' },
              ]}
            >
              {/* Badge sélectionné */}
              {isSelected && (
                <View style={[styles.selectedBadge, { backgroundColor: option.color }]}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}

              {/* Emoji */}
              <View
                style={[
                  styles.emojiContainer,
                  { backgroundColor: isSelected ? option.color : option.lightColor },
                ]}
              >
                <Text style={styles.emoji}>{option.emoji}</Text>
              </View>

              {/* Titre */}
              <Text
                style={[
                  styles.optionTitle,
                  { color: isSelected ? option.color : '#333' },
                ]}
              >
                {option.title}
              </Text>

              {/* Description */}
              <Text style={styles.optionDescription}>{option.description}</Text>

              {/* Indicateur visuel */}
              <View style={styles.difficultyIndicator}>
                {[1, 2, 3].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.difficultyDot,
                      {
                        backgroundColor:
                          level <=
                          (option.value === 'easy' ? 1 : option.value === 'normal' ? 2 : 3)
                            ? option.color
                            : '#E0E0E0',
                      },
                    ]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  optionCardSelected: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 44,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  difficultyIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
