/**
 * Roadmap Kanban View - Ideas/Planned/Dev/Done
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FeatureCard } from './FeatureCard';
import type { RoadmapFeature } from '../../data/roadmap';
import { getKanbanColumns } from '../../data/roadmap';

interface Props {
  onFeaturePress: (feature: RoadmapFeature) => void;
  filterCategory?: string;
  isDarkMode?: boolean;
}

export const KanbanView: React.FC<Props> = ({
  onFeaturePress,
  filterCategory,
  isDarkMode = false,
}) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const columnBgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';

  const columns = getKanbanColumns();

  // Apply category filter
  const filteredColumns = columns.map(col => ({
    ...col,
    features: filterCategory
      ? col.features.filter(f => f.category === filterCategory)
      : col.features,
  }));

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.content}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={false}
      decelerationRate="fast"
      snapToInterval={320}
    >
      {filteredColumns.map(column => {
        const featureCount = column.features.length;

        return (
          <View key={column.id} style={styles.column}>
            {/* Column Header */}
            <View style={[styles.columnHeader, { backgroundColor: columnBgColor }]}>
              <View style={styles.columnTitleContainer}>
                <Text style={styles.columnIcon}>{column.icon}</Text>
                <Text style={[styles.columnTitle, { color: textColor }]}>
                  {column.title}
                </Text>
              </View>
              <View
                style={[
                  styles.columnCount,
                  { backgroundColor: column.color },
                ]}
              >
                <Text style={styles.columnCountText}>{featureCount}</Text>
              </View>
            </View>

            {/* Column Content */}
            <ScrollView
              style={styles.columnScroll}
              contentContainerStyle={styles.columnContent}
              showsVerticalScrollIndicator={false}
            >
              {featureCount > 0 ? (
                column.features.map(feature => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onPress={onFeaturePress}
                    compact
                    isDarkMode={isDarkMode}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyIcon, { color: subtextColor }]}>
                    📭
                  </Text>
                  <Text style={[styles.emptyText, { color: subtextColor }]}>
                    {filterCategory
                      ? 'No features in this category'
                      : 'No features in this column'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  column: {
    width: 300,
    marginRight: 16,
  },
  columnHeader: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  columnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  columnIcon: {
    fontSize: 20,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  columnCount: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  columnCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  columnScroll: {
    flex: 1,
  },
  columnContent: {
    paddingBottom: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
