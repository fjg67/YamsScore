/**
 * Timeline de Développement - Affiche le statut et la progression
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Suggestion } from '../data/suggestions';

interface Props {
  suggestion: Suggestion;
  isDarkMode?: boolean;
}

interface TimelineStep {
  label: string;
  completed: boolean;
  current: boolean;
  percentage?: number;
}

export const DevelopmentTimeline: React.FC<Props> = ({
  suggestion,
  isDarkMode = false,
}) => {
  // Générer les étapes selon le status
  const steps: TimelineStep[] = getTimelineSteps(suggestion.status);

  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>
        📅 Timeline de Développement
      </Text>

      {/* Steps */}
      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            {/* Connector Line */}
            {index > 0 && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: step.completed ? '#10B981' : '#E0E0E0',
                  },
                ]}
              />
            )}

            {/* Step Circle */}
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: step.completed
                    ? '#10B981'
                    : step.current
                    ? '#4A90E2'
                    : '#E0E0E0',
                },
              ]}
            >
              {step.completed && <Text style={styles.checkmark}>✓</Text>}
              {step.current && !step.completed && (
                <View style={styles.currentDot} />
              )}
            </View>

            {/* Step Info */}
            <View style={styles.stepInfo}>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: step.current ? textColor : subtextColor,
                    fontWeight: step.current ? '600' : '400',
                  },
                ]}
              >
                {step.label}
              </Text>
              {step.percentage !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${step.percentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={[styles.percentage, { color: subtextColor }]}>
                    {step.percentage}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Official Response */}
      {suggestion.officialResponse && (
        <View
          style={[
            styles.officialResponse,
            { backgroundColor: isDarkMode ? '#1A3A1A' : '#E8F5E9' },
          ]}
        >
          <Text style={styles.officialBadge}>👨‍💻 ÉQUIPE YAMS SCORE</Text>
          <Text style={[styles.responseText, { color: textColor }]}>
            {suggestion.officialResponse.message}
          </Text>
          {suggestion.officialResponse.planning && (
            <Text style={[styles.planning, { color: subtextColor }]}>
              📅 Planning: {suggestion.officialResponse.planning}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// Helper function pour générer les étapes
function getTimelineSteps(
  status: Suggestion['status']
): TimelineStep[] {
  const allSteps = [
    { label: 'Suggestion publiée', key: 'new' },
    { label: 'En étude', key: 'studying' },
    { label: 'Planifiée', key: 'planned' },
    { label: 'En développement', key: 'dev' },
    { label: 'Implémentée', key: 'done' },
  ];

  const statusOrder = ['new', 'studying', 'planned', 'dev', 'done'];
  const currentIndex = statusOrder.indexOf(status);

  return allSteps.map((step, index) => ({
    label: step.label,
    completed: index < currentIndex,
    current: index === currentIndex,
    percentage:
      index === currentIndex && status === 'dev' ? 67 : undefined,
  }));
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  connector: {
    position: 'absolute',
    left: 11,
    top: -20,
    width: 2,
    height: 20,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  stepInfo: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
  },
  officialResponse: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  officialBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
    letterSpacing: 1,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  planning: {
    fontSize: 13,
    fontWeight: '600',
  },
});
