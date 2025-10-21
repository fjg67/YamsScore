/**
 * Quick Access Bar - Navigation par onglets sticky
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
  RulesShadows,
  ZIndex,
} from '../styles/rulesTheme';

export type TabId = 'basics' | 'categories' | 'scoring' | 'tips';

interface Tab {
  id: TabId;
  icon: string;
  label: string;
  color: string;
}

interface QuickAccessBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onSearchPress?: () => void;
}

const tabs: Tab[] = [
  { id: 'basics', icon: '📖', label: 'Base', color: '#4A90E2' },
  { id: 'categories', icon: '🎯', label: 'Catégories', color: '#50C878' },
  { id: 'scoring', icon: '💯', label: 'Score', color: '#F39C12' },
  { id: 'tips', icon: '💡', label: 'Astuces', color: '#9B59B6' },
];

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({
  activeTab,
  onTabChange,
  onSearchPress,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(400)}
      style={styles.container}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onPress={() => onTabChange(tab.id)}
          />
        ))}
      </View>

      {onSearchPress && (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        isActive && { backgroundColor: `${tab.color}15` },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.tabIcon}>{tab.icon}</Text>
      <Text
        style={[
          styles.tabLabel,
          isActive && { color: tab.color, fontWeight: RulesTypography.weights.semibold },
        ]}
      >
        {tab.label}
      </Text>
      {isActive && (
        <View style={[styles.indicator, { backgroundColor: tab.color }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: RulesColors.ui.surface,
    borderTopLeftRadius: RulesBorderRadius.lg,
    borderTopRightRadius: RulesBorderRadius.lg,
    marginTop: -16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RulesSpacing.sm,
    paddingVertical: RulesSpacing.xs,
    ...RulesShadows.md,
    zIndex: ZIndex.sticky,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: RulesSpacing.xxs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: RulesSpacing.sm,
    paddingHorizontal: RulesSpacing.xs,
    borderRadius: RulesBorderRadius.md,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: RulesSpacing.xxs,
  },
  tabLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: RulesBorderRadius.xs,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: RulesBorderRadius.md,
    backgroundColor: RulesColors.ui.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: RulesSpacing.xs,
  },
  searchIcon: {
    fontSize: 20,
  },
});
