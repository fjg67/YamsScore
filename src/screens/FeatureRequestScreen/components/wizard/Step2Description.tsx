/**
 * Étape 2: Description avec Assistance IA (Mock)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { haptics } from '../../../../utils/haptics';

interface Props {
  title: string;
  description: string;
  onChangeTitle: (text: string) => void;
  onChangeDescription: (text: string) => void;
  isDarkMode?: boolean;
}

export const Step2Description: React.FC<Props> = ({
  title,
  description,
  onChangeTitle,
  onChangeDescription,
  isDarkMode = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const inputBgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  // Mock AI suggestions
  const aiSuggestions = [
    '💡 "Ajouter un mode sombre avec transitions fluides"',
    '💡 "Permettre de personnaliser les couleurs de l\'interface"',
    '💡 "Intégrer un système de thèmes prédéfinis"',
    '💡 "Créer un éditeur de thème visuel"',
  ];

  const handleAISuggest = () => {
    haptics.light();
    setShowSuggestions(!showSuggestions);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    haptics.light();
    const cleaned = suggestion.replace(/💡 "|"/g, '');
    onChangeTitle(cleaned);
    setShowSuggestions(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          ✏️ Décrivez votre idée
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          Soyez clair et précis pour maximiser les votes
        </Text>
      </View>

      {/* Title */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: textColor }]}>
          Titre de la suggestion *
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: inputBgColor,
              color: textColor,
              borderColor: borderColor,
            },
          ]}
          value={title}
          onChangeText={onChangeTitle}
          placeholder="Ex: Mode sombre avec animations fluides"
          placeholderTextColor={subtextColor}
          maxLength={100}
        />
        <Text style={[styles.charCount, { color: subtextColor }]}>
          {title.length}/100
        </Text>
      </View>

      {/* AI Suggestions */}
      <TouchableOpacity
        style={[styles.aiButton, { borderColor: borderColor }]}
        onPress={handleAISuggest}
      >
        <Text style={styles.aiIcon}>✨</Text>
        <Text style={[styles.aiText, { color: textColor }]}>
          {showSuggestions ? 'Masquer les suggestions IA' : 'Suggestions IA'}
        </Text>
      </TouchableOpacity>

      {showSuggestions && (
        <View style={[styles.suggestionsContainer, { backgroundColor: inputBgColor }]}>
          <Text style={[styles.suggestionsTitle, { color: textColor }]}>
            💡 Idées suggérées par l'IA
          </Text>
          {aiSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.suggestionItem, { borderColor: borderColor }]}
              onPress={() => handleSelectSuggestion(suggestion)}
            >
              <Text style={[styles.suggestionText, { color: textColor }]}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Description */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: textColor }]}>
          Description détaillée *
        </Text>
        <TextInput
          style={[
            styles.textarea,
            {
              backgroundColor: inputBgColor,
              color: textColor,
              borderColor: borderColor,
            },
          ]}
          value={description}
          onChangeText={onChangeDescription}
          placeholder="Décrivez votre idée en détail : pourquoi est-elle utile ? Comment devrait-elle fonctionner ?"
          placeholderTextColor={subtextColor}
          multiline
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={[styles.charCount, { color: subtextColor }]}>
          {description.length}/500
        </Text>
      </View>

      {/* Tips */}
      <View style={[styles.tips, { backgroundColor: inputBgColor }]}>
        <Text style={[styles.tipsTitle, { color: textColor }]}>
          💡 Conseils pour une bonne suggestion
        </Text>
        <Text style={[styles.tipItem, { color: subtextColor }]}>
          • Soyez spécifique et concret
        </Text>
        <Text style={[styles.tipItem, { color: subtextColor }]}>
          • Expliquez le problème que ça résout
        </Text>
        <Text style={[styles.tipItem, { color: subtextColor }]}>
          • Donnez des exemples concrets
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
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 150,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  aiIcon: {
    fontSize: 20,
  },
  aiText: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
  tips: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
});
