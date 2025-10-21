/**
 * Roadmap Screen - Public Interactive Roadmap
 * Timeline & Kanban views with filters
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { haptics } from '../../utils/haptics';
import { BackButton } from './components/BackButton';
import { TimelineView } from './components/roadmap/TimelineView';
import { KanbanView } from './components/roadmap/KanbanView';
import type { RoadmapFeature } from './data/roadmap';
import { getRoadmapStats } from './data/roadmap';
import { categories } from './data/suggestions';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Roadmap'>;
}

type ViewMode = 'timeline' | 'kanban';

export const RoadmapScreen: React.FC<Props> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filterCategory, setFilterCategory] = useState<string | undefined>();
  const [selectedYear] = useState(2026);

  const bgColor = isDarkMode ? '#0A0A0A' : '#F5F5F5';
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  const stats = getRoadmapStats();

  const handleFeaturePress = (feature: RoadmapFeature) => {
    haptics.light();
    Alert.alert(
      feature.title,
      `${feature.description}\n\nStatus: ${feature.status}\nProgress: ${feature.progress}%\nTeam: ${feature.team.join(', ') || 'Not assigned'}`,
      [{ text: 'OK' }]
    );
  };

  const handleViewToggle = (mode: ViewMode) => {
    if (mode !== viewMode) {
      haptics.light();
      setViewMode(mode);
    }
  };

  const handleCategoryFilter = (categoryId?: string) => {
    haptics.light();
    setFilterCategory(filterCategory === categoryId ? undefined : categoryId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <BackButton
          onPress={() => navigation.goBack()}
          isDarkMode={isDarkMode}
        />
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Roadmap
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats Bar */}
      <View style={[styles.statsBar, { backgroundColor: cardBgColor }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContent}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              {stats.done}
            </Text>
            <Text style={[styles.statLabel, { color: subtextColor }]}>
              Done
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: borderColor }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
              {stats.inDev}
            </Text>
            <Text style={[styles.statLabel, { color: subtextColor }]}>
              In Dev
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: borderColor }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#3B82F6' }]}>
              {stats.planned}
            </Text>
            <Text style={[styles.statLabel, { color: subtextColor }]}>
              Planned
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: borderColor }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#9CA3AF' }]}>
              {stats.ideas}
            </Text>
            <Text style={[styles.statLabel, { color: subtextColor }]}>
              Ideas
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: borderColor }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: textColor }]}>
              {stats.completionRate}%
            </Text>
            <Text style={[styles.statLabel, { color: subtextColor }]}>
              Complete
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* View Toggle */}
      <View style={[styles.toggleContainer, { backgroundColor: cardBgColor, borderBottomColor: borderColor }]}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'timeline' && [
                styles.toggleButtonActive,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E8F5FF' },
              ],
            ]}
            onPress={() => handleViewToggle('timeline')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                {
                  color: viewMode === 'timeline' ? '#4A90E2' : subtextColor,
                },
              ]}
            >
              📅 Timeline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'kanban' && [
                styles.toggleButtonActive,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E8F5FF' },
              ],
            ]}
            onPress={() => handleViewToggle('kanban')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                {
                  color: viewMode === 'kanban' ? '#4A90E2' : subtextColor,
                },
              ]}
            >
              📊 Kanban
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filters */}
      <View style={[styles.filtersContainer, { backgroundColor: cardBgColor }]}>
        <Text style={[styles.filtersLabel, { color: subtextColor }]}>
          Filter by category:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              !filterCategory && [
                styles.filterChipActive,
                { backgroundColor: '#4A90E2' },
              ],
              filterCategory && { borderColor },
            ]}
            onPress={() => handleCategoryFilter(undefined)}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color: !filterCategory ? '#FFFFFF' : subtextColor,
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                filterCategory === cat.id && [
                  styles.filterChipActive,
                  { backgroundColor: '#4A90E2' },
                ],
                filterCategory !== cat.id && { borderColor },
              ]}
              onPress={() => handleCategoryFilter(cat.id)}
            >
              <Text style={styles.filterChipIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: filterCategory === cat.id ? '#FFFFFF' : subtextColor,
                  },
                ]}
              >
                {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'timeline' ? (
          <TimelineView
            year={selectedYear}
            onFeaturePress={handleFeaturePress}
            filterCategory={filterCategory}
            isDarkMode={isDarkMode}
          />
        ) : (
          <KanbanView
            onFeaturePress={handleFeaturePress}
            filterCategory={filterCategory}
            isDarkMode={isDarkMode}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsBar: {
    paddingVertical: 12,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    alignSelf: 'center',
  },
  toggleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonActive: {
    // Styles applied inline
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  filtersLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipActive: {
    borderWidth: 0,
  },
  filterChipIcon: {
    fontSize: 14,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
