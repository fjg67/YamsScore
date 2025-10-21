/**
 * Tooltip de règles pour chaque catégorie
 * Affiche les règles, exemples et astuces
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { premiumTheme } from '../../theme/premiumTheme';
import { RuleTooltipData } from '../../types/tutorial.types';
import { useHaptic } from '../../hooks/useHaptic';

interface RuleTooltipProps {
  visible: boolean;
  data: RuleTooltipData | null;
  onClose: () => void;
}

const RuleTooltip: React.FC<RuleTooltipProps> = ({ visible, data, onClose }) => {
  const { light } = useHaptic();

  if (!data) return null;

  const handleClose = () => {
    light();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Background blur */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.8)"
        />
      </TouchableOpacity>

      {/* Tooltip card */}
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
          style={styles.card}
        >
          <LinearGradient
            colors={[...premiumTheme.colors.gradients.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{data.title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📖 Description</Text>
                <Text style={styles.description}>{data.description}</Text>
              </View>

              {/* Scoring */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Calcul</Text>
                <Text style={styles.scoring}>{data.scoring}</Text>
                <Text style={styles.maxScore}>
                  Maximum: {data.maxScore} points
                </Text>
              </View>

              {/* Examples */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💡 Exemples</Text>
                {data.examples.map((example, index) => (
                  <View key={index} style={styles.exampleRow}>
                    <Text style={styles.exampleText}>{example}</Text>
                  </View>
                ))}
              </View>

              {/* Tips */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>⚡ Astuces</Text>
                {data.tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Footer button */}
            <TouchableOpacity
              style={styles.footerButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#50C878', '#3FA065']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.footerButtonGradient}
              >
                <Text style={styles.footerButtonText}>Compris !</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  card: {
    maxHeight: '80%',
    borderTopLeftRadius: premiumTheme.borderRadius.xl,
    borderTopRightRadius: premiumTheme.borderRadius.xl,
    overflow: 'hidden',
    ...premiumTheme.colors.shadows.heavy,
  },
  cardGradient: {
    padding: premiumTheme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: premiumTheme.spacing.md,
  },
  title: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    maxHeight: 400,
  },
  section: {
    marginBottom: premiumTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: premiumTheme.spacing.sm,
  },
  description: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.9,
  },
  scoring: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: premiumTheme.spacing.xs,
  },
  maxScore: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#50C878',
    fontWeight: '600',
  },
  exampleRow: {
    paddingVertical: premiumTheme.spacing.xs,
    paddingHorizontal: premiumTheme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: premiumTheme.borderRadius.md,
    marginBottom: premiumTheme.spacing.xs,
  },
  exampleText: {
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    fontFamily: premiumTheme.typography.fontFamily.monospace,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: premiumTheme.spacing.xs,
  },
  bullet: {
    color: '#50C878',
    fontSize: premiumTheme.typography.fontSize.lg,
    marginRight: premiumTheme.spacing.sm,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: premiumTheme.typography.fontSize.base,
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.9,
  },
  footerButton: {
    marginTop: premiumTheme.spacing.md,
    borderRadius: premiumTheme.borderRadius.lg,
    overflow: 'hidden',
  },
  footerButtonGradient: {
    paddingVertical: premiumTheme.spacing.md,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
});

export default RuleTooltip;
