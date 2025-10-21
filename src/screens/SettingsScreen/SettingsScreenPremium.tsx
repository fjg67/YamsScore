/**
 * Settings Screen Ultra-Premium
 * Version 6.0 - Transformation complète de l'expérience Settings
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store/hooks';
import { getColors } from '../../constants';
import { haptics } from '../../utils/haptics';

// Components
import HeroHeader from './components/HeroHeader';
import QuickActions from './components/QuickActions';

// Sections
import AppearanceSection from './sections/AppearanceSection';
import SoundVibrationSection from './sections/SoundVibrationSection';
import GameSection from './sections/GameSection';
import SupportSection from './sections/SupportSection';
import AboutSection from './sections/AboutSection';

const SettingsScreenPremium: React.FC = () => {
  const navigation = useNavigation();
  const theme = useAppSelector((state) => state.settings.theme);
  const userName = useAppSelector((state) => state.settings.userName);
  const userEmoji = useAppSelector((state) => state.settings.userEmoji);
  const colors = getColors(theme);

  // Mock stats - À remplacer par les vraies données
  const totalGames = 24;
  const totalWins = 18;
  const level = 5;

  const handleBack = () => {
    haptics.light();
    navigation.goBack();
  };

  const handleEditProfile = () => {
    haptics.light();
    Alert.alert(
      'Modifier le profil',
      'Fonctionnalité à venir',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  const handleAchievements = () => {
    haptics.light();
    Alert.alert(
      'Mes badges',
      'Fonctionnalité à venir',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  const handleEmojiTap = () => {
    haptics.light();
    Alert.alert(
      'Personnaliser l\'avatar',
      'Fonctionnalité à venir',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <HeroHeader
          userName={userName}
          userEmoji={userEmoji}
          totalGames={totalGames}
          totalWins={totalWins}
          level={level}
          onEditProfile={handleEditProfile}
          onEmojiTap={handleEmojiTap}
        />

        {/* Quick Actions */}
        <QuickActions
          onEditProfile={handleEditProfile}
          onAchievements={handleAchievements}
          hasNewAchievements={false}
          newAchievementsCount={0}
        />

        {/* Settings Sections */}
        <View style={styles.sectionsContainer}>
          <AppearanceSection />
          <SoundVibrationSection />
          <GameSection />
          <SupportSection />
          <AboutSection />
        </View>

        {/* Spacing at bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Back Button - Floating */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionsContainer: {
    paddingTop: 8,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SettingsScreenPremium;
