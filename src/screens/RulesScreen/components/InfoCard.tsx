/**
 * Info Card - Carte d'information générique premium
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
  RulesShadows,
} from '../styles/rulesTheme';

interface InfoCardProps {
  title: string;
  icon?: string;
  children: ReactNode;
  gradient?: string[];
  delay?: number;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  children,
  gradient,
  delay = 0,
}) => {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(400)}
      style={styles.container}
    >
      {gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          <View style={styles.header}>
            {icon && <Text style={styles.iconWhite}>{icon}</Text>}
            <Text style={styles.titleWhite}>{title}</Text>
          </View>
          {children}
        </LinearGradient>
      ) : (
        <View style={styles.card}>
          <View style={styles.header}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={styles.title}>{title}</Text>
          </View>
          {children}
        </View>
      )}
    </Animated.View>
  );
};

interface InfoGridProps {
  items: Array<{
    icon: string;
    label: string;
    value: string;
    color: string;
  }>;
}

export const InfoGrid: React.FC<InfoGridProps> = ({ items }) => {
  return (
    <View style={styles.grid}>
      {items.map((item, index) => (
        <View key={index} style={styles.gridItem}>
          <Text style={styles.gridIcon}>{item.icon}</Text>
          <Text style={styles.gridValue}>{item.value}</Text>
          <Text style={styles.gridLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

interface TimelineStepProps {
  number: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  number,
  icon,
  title,
  description,
  color,
}) => {
  return (
    <View style={styles.timelineStep}>
      <View style={[styles.stepNumber, { backgroundColor: color }]}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepIcon}>{icon}</Text>
          <Text style={styles.stepTitle}>{title}</Text>
        </View>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: RulesSpacing.md,
  },
  card: {
    backgroundColor: RulesColors.ui.card,
    borderRadius: RulesBorderRadius.lg,
    padding: RulesSpacing.lg,
    borderWidth: 1,
    borderColor: RulesColors.ui.border,
    ...RulesShadows.md,
  },
  gradientCard: {
    borderRadius: RulesBorderRadius.lg,
    padding: RulesSpacing.lg,
    ...RulesShadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.sm,
    marginBottom: RulesSpacing.md,
  },
  icon: {
    fontSize: 28,
  },
  iconWhite: {
    fontSize: 28,
  },
  title: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
  },
  titleWhite: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RulesSpacing.md,
  },
  gridItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
  },
  gridIcon: {
    fontSize: 32,
    marginBottom: RulesSpacing.xs,
  },
  gridValue: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xxs,
  },
  gridLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: RulesSpacing.md,
    marginBottom: RulesSpacing.lg,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.white,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.xs,
    marginBottom: RulesSpacing.xxs,
  },
  stepIcon: {
    fontSize: 20,
  },
  stepTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
  },
  stepDescription: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.bodySmall,
  },
});
