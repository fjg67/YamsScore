/**
 * Provider pour gérer toutes les célébrations de l'app
 * Enveloppe le GameScreen et affiche les célébrations appropriées
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCelebrationEngine } from '../../hooks/useCelebrationEngine';
import MilestoneModal from './MilestoneModal';
import AchievementToast from './AchievementToast';

interface CelebrationProviderProps {
  children: React.ReactNode;
}

const CelebrationProvider: React.FC<CelebrationProviderProps> = ({ children }) => {
  const {
    currentMilestone,
    currentToast,
    dismissMilestone,
    dismissToast,
  } = useCelebrationEngine();

  return (
    <View style={styles.container}>
      {/* Main content */}
      {children}

      {/* Toast notifications (always on top) */}
      <AchievementToast toast={currentToast} onDismiss={dismissToast} />

      {/* Full-screen milestone modals */}
      <MilestoneModal milestone={currentMilestone} onDismiss={dismissMilestone} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CelebrationProvider;
