/**
 * Carte avec effet glassmorphism réutilisable
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { premiumTheme } from '../../theme/premiumTheme';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  useBlur?: boolean;
  backgroundColor?: string;
  shadowColor?: string;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  style,
  borderColor = premiumTheme.colors.glassmorphism.borderColor,
  borderWidth = 2,
  borderRadius = premiumTheme.borderRadius.lg,
  useBlur = false,
  backgroundColor = premiumTheme.colors.glassmorphism.background,
  shadowColor,
}) => {
  const cardStyle: ViewStyle = {
    ...styles.card,
    borderColor,
    borderWidth,
    borderRadius,
    backgroundColor: useBlur ? 'transparent' : backgroundColor,
    ...style,
    ...(shadowColor ? premiumTheme.colors.shadows.glow(shadowColor) : premiumTheme.colors.shadows.soft),
  };

  if (useBlur) {
    return (
      <BlurView
        style={cardStyle}
        blurType="light"
        blurAmount={premiumTheme.colors.glassmorphism.backdropBlur}
        reducedTransparencyFallbackColor={backgroundColor}
      >
        {children}
      </BlurView>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default GlassmorphicCard;
