/**
 * Roadmap Timeline View - Q1/Q2/Q3/Q4
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FeatureCard } from './FeatureCard';
import type { RoadmapFeature, Quarter } from '../../data/roadmap';
import { getQuarterData } from '../../data/roadmap';

interface Props {
  year: number;
  onFeaturePress: (feature: RoadmapFeature) => void;
  filterCategory?: string;
  isDarkMode?: boolean;
}

export const TimelineView: React.FC<Props> = ({
  year,
  onFeaturePress,
  filterCategory,
  isDarkMode = false,
}) => {
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const quarterBgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const dividerColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const quarterData = getQuarterData(year);

  // Apply category filter
  const filteredData = quarterData.map(q => ({
    ...q,
    features: filterCategory
      ? q.features.filter(f => f.category === filterCategory)
      : q.features,
  }));

  const getQuarterColor = (quarter: Quarter): string => {
    const colors = {
      Q1: '#3B82F6', // Blue
      Q2: '#10B981', // Green
      Q3: '#F59E0B', // Orange
      Q4: '#8B5CF6', // Purple
    };
    return colors[quarter];
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Year Header */}
      <View style={styles.yearHeader}>
        <Text style={[styles.yearText, { color: textColor }]}>
          📅 {year} Roadmap
        </Text>
      </View>

      {/* Quarters */}
      {filteredData.map((quarterInfo, index) => {
        const quarterColor = getQuarterColor(quarterInfo.quarter);
        const featureCount = quarterInfo.features.length;

        return (
          <View key={quarterInfo.quarter} style={styles.quarterSection}>
            {/* Quarter Header */}
            <View
              style={[
                styles.quarterHeader,
                { backgroundColor: quarterBgColor },
              ]}
            >
              <View style={styles.quarterTitleContainer}>
                <View
                  style={[
                    styles.quarterDot,
                    { backgroundColor: quarterColor },
                  ]}
                />
                <Text style={[styles.quarterTitle, { color: textColor }]}>
                  {quarterInfo.quarter} {quarterInfo.year}
                </Text>
                <View
                  style={[
                    styles.featureCount,
                    { backgroundColor: isDarkMode ? '#3A3A3A' : '#E0E0E0' },
                  ]}
                >
                  <Text style={[styles.featureCountText, { color: subtextColor }]}>
                    {featureCount} {featureCount === 1 ? 'feature' : 'features'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Features */}
            {featureCount > 0 ? (
              <View style={styles.featuresContainer}>
                {quarterInfo.features.map(feature => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    onPress={onFeaturePress}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyIcon, { color: subtextColor }]}>
                  📭
                </Text>
                <Text style={[styles.emptyText, { color: subtextColor }]}>
                  {filterCategory
                    ? 'No features in this category for this quarter'
                    : 'No features planned for this quarter'}
                </Text>
              </View>
            )}

            {/* Divider (not for last item) */}
            {index < filteredData.length - 1 && (
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            )}
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
    paddingBottom: 24,
  },
  yearHeader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quarterSection: {
    marginBottom: 24,
  },
  quarterHeader: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  quarterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quarterDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  quarterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  featureCount: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 12,
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
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
});
