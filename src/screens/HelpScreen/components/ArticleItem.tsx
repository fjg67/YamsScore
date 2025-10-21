/**
 * Article Item - Liste d'articles
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { haptics, HapticType } from '../../../utils/haptics';

interface ArticleItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  views?: string;
  readTime?: string;
  helpfulRate?: string;
  popular?: boolean;
  tags?: string[];
  onPress: () => void;
  isDarkMode?: boolean;
}

export const ArticleItem: React.FC<ArticleItemProps> = ({
  icon,
  title,
  subtitle,
  views,
  readTime,
  helpfulRate,
  popular,
  tags,
  onPress,
  isDarkMode = false,
}) => {
  const handlePress = () => {
    haptics.trigger(HapticType.LIGHT);
    onPress();
  };

  const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtitleColor = isDarkMode ? 'rgba(255,255,255,0.7)' : '#666666';
  const metaColor = isDarkMode ? 'rgba(255,255,255,0.5)' : '#999999';

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
            {title}
          </Text>

          {/* Subtitle */}
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: subtitleColor }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}

          {/* Meta info */}
          {(views || readTime || helpfulRate) && (
            <View style={styles.meta}>
              {views && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>👁️</Text>
                  <Text style={[styles.metaText, { color: metaColor }]}>
                    {views}
                  </Text>
                </View>
              )}
              {readTime && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⏱️</Text>
                  <Text style={[styles.metaText, { color: metaColor }]}>
                    {readTime}
                  </Text>
                </View>
              )}
              {helpfulRate && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>👍</Text>
                  <Text style={[styles.metaText, { color: metaColor }]}>
                    {helpfulRate}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <View style={styles.tags}>
              {popular && (
                <View style={[styles.tag, styles.popularTag]}>
                  <Text style={styles.tagIcon}>🔥</Text>
                  <Text style={styles.popularText}>Populaire</Text>
                </View>
              )}
              {tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Arrow */}
        <View style={styles.arrow}>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A90E2',
  },
  popularTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    gap: 4,
  },
  tagIcon: {
    fontSize: 10,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  arrow: {
    marginLeft: 8,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#4A90E2',
  },
});
