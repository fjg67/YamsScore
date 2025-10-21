/**
 * Mockup Tool - Templates Panel
 * Pre-made templates library
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ALL_TEMPLATES } from './templates';
import type { Template } from './types';
import { haptics } from '../../../../utils/haptics';

interface Props {
  onSelectTemplate: (template: Template) => void;
  isDarkMode?: boolean;
}

export const TemplatesPanel: React.FC<Props> = ({
  onSelectTemplate,
  isDarkMode = false,
}) => {
  const bgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';

  const handleTemplatePress = (template: Template) => {
    haptics.light();
    onSelectTemplate(template);
  };

  // Group templates by category
  const categories: Array<{ id: Template['category']; name: string }> = [
    { id: 'screen', name: 'Screens' },
    { id: 'component', name: 'Components' },
    { id: 'icon', name: 'Icons' },
    { id: 'ui', name: 'UI Elements' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map(category => {
          const templates = ALL_TEMPLATES.filter(t => t.category === category.id);
          if (templates.length === 0) return null;

          return (
            <View key={category.id} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: textColor }]}>
                {category.name}
              </Text>

              <View style={styles.templatesGrid}>
                {templates.map(template => (
                  <TouchableOpacity
                    key={template.id}
                    style={[
                      styles.templateCard,
                      { backgroundColor: cardBgColor, borderColor },
                    ]}
                    onPress={() => handleTemplatePress(template)}
                  >
                    <View style={styles.templateIconContainer}>
                      <Text style={styles.templateIcon}>{template.icon}</Text>
                    </View>
                    <Text
                      style={[styles.templateName, { color: textColor }]}
                      numberOfLines={2}
                    >
                      {template.name}
                    </Text>
                    <Text style={[styles.layerCount, { color: subtextColor }]}>
                      {template.layers.length} layers
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}

        {/* Empty State if no templates */}
        {ALL_TEMPLATES.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={[styles.emptyText, { color: subtextColor }]}>
              No templates available
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  categorySection: {
    gap: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCard: {
    width: '30%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  templateIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateIcon: {
    fontSize: 32,
  },
  templateName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  layerCount: {
    fontSize: 11,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 14,
  },
});
