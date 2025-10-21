/**
 * Roadmap Feature Card
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { RoadmapFeature } from '../../data/roadmap';
import { PRIORITY_COLORS, STATUS_LABELS } from '../../data/roadmap';
import { haptics } from '../../../../utils/haptics';

interface Props {
  feature: RoadmapFeature;
  onPress: (feature: RoadmapFeature) => void;
  compact?: boolean;
  isDarkMode?: boolean;
}

export const FeatureCard: React.FC<Props> = ({
  feature,
  onPress,
  compact = false,
  isDarkMode = false,
}) => {
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';
  const progressBgColor = isDarkMode ? '#2A2A2A' : '#F0F0F0';

  const priorityColor = PRIORITY_COLORS[feature.priority];
  const statusLabel = STATUS_LABELS[feature.status];

  const handlePress = () => {
    haptics.light();
    onPress(feature);
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: cardBgColor, borderColor }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.compactHeader}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          <Text style={[styles.compactTitle, { color: textColor }]} numberOfLines={1}>
            {feature.title}
          </Text>
        </View>
        {feature.progress > 0 && (
          <View style={[styles.compactProgress, { backgroundColor: progressBgColor }]}>
            <View style={[styles.compactProgressFill, { width: `${feature.progress}%` }]}>
              <LinearGradient
                colors={['#4A90E2', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.compactProgressGradient}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBgColor }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Priority Badge */}
      <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
        <Text style={styles.priorityText}>
          {feature.priority.toUpperCase()}
        </Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          {feature.title}
        </Text>
        {feature.votes !== undefined && (
          <View style={styles.votesContainer}>
            <Text style={styles.votesIcon}>👍</Text>
            <Text style={[styles.votesText, { color: subtextColor }]}>
              {feature.votes}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: subtextColor }]} numberOfLines={2}>
        {feature.description}
      </Text>

      {/* Progress Bar */}
      {feature.progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: subtextColor }]}>
              Progress
            </Text>
            <Text style={[styles.progressPercent, { color: textColor }]}>
              {feature.progress}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: progressBgColor }]}>
            <View style={[styles.progressFill, { width: `${feature.progress}%` }]}>
              <LinearGradient
                colors={['#4A90E2', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </View>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        {/* Status */}
        <View style={[styles.statusBadge, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F8F8' }]}>
          <Text style={[styles.statusText, { color: textColor }]}>
            {statusLabel}
          </Text>
        </View>

        {/* Team */}
        {feature.team.length > 0 && (
          <View style={styles.team}>
            {feature.team.slice(0, 3).map((member, index) => (
              <Text key={index} style={[styles.teamMember, { color: subtextColor }]}>
                {member}
              </Text>
            ))}
            {feature.team.length > 3 && (
              <Text style={[styles.teamMore, { color: subtextColor }]}>
                +{feature.team.length - 3}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Tags */}
      {feature.tags.length > 0 && (
        <View style={styles.tags}>
          {feature.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F0F0F0' }]}
            >
              <Text style={[styles.tagText, { color: subtextColor }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Estimated Completion */}
      {feature.estimatedCompletion && (
        <View style={styles.eta}>
          <Text style={[styles.etaIcon, { color: subtextColor }]}>⏱️</Text>
          <Text style={[styles.etaText, { color: subtextColor }]}>
            ETA: {feature.estimatedCompletion}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 60,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  votesIcon: {
    fontSize: 14,
  },
  votesText: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  team: {
    flexDirection: 'row',
    gap: 6,
  },
  teamMember: {
    fontSize: 12,
  },
  teamMore: {
    fontSize: 12,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
  },
  eta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  etaIcon: {
    fontSize: 14,
  },
  etaText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Compact styles
  compactCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  compactProgress: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
  },
  compactProgressGradient: {
    flex: 1,
  },
});
